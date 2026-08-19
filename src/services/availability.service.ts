import { db } from "@/lib/db";
import { nightsBetween } from "@/lib/utils";
import type { RoomWithRelations } from "@/repositories/room.repository";

export type AvailabilityQuery = {
  checkIn: Date;
  checkOut: Date;
  adults: number;
  children: number;
  rooms: number;
};

const ACTIVE_STATUSES = ["CONFIRMED", "CHECKED_IN", "PROCESSING"];

export function isRoomAvailable(
  room: RoomWithRelations,
  query: AvailabilityQuery,
): { available: boolean; reason?: string } {
  const nights = nightsBetween(query.checkIn, query.checkOut);

  if (query.adults + query.children > room.maxGuests) {
    return { available: false, reason: `Fits up to ${room.maxGuests} guests` };
  }

  if (!room.active) return { available: false, reason: "Unavailable" };

  if (room.rate?.minStay && nights < room.rate.minStay) {
    return { available: false, reason: `Minimum stay of ${room.rate.minStay} nights` };
  }

  if (room.rate?.maxStay && nights > room.rate.maxStay) {
    return { available: false, reason: `Maximum stay of ${room.rate.maxStay} nights` };
  }

  return { available: true };
}

export async function findAvailableRooms(query: AvailabilityQuery) {
  const rooms = await db.room.findMany({
    where: { active: true },
    include: {
      amenities: { include: { amenity: true } },
      rate: true,
      reviews: { where: { approved: true } },
    },
  });

  // Collect blocked dates from rates and any confirmed overlapping bookings.
  const blockedDates = await db.closedDate.findMany({
    where: {
      rate: {
        room: { active: true },
      },
      date: { gte: query.checkIn, lt: query.checkOut },
    },
    select: { rate: { select: { roomId: true } }, date: true },
  });

  const blockedByRoom = new Map<string, Set<string>>();
  for (const b of blockedDates) {
    const set = blockedByRoom.get(b.rate.roomId) ?? new Set<string>();
    set.add(b.date.toISOString().slice(0, 10));
    blockedByRoom.set(b.rate.roomId, set);
  }

  const overlapping = await db.booking.findMany({
    where: {
      status: { in: ACTIVE_STATUSES as never[] },
      checkIn: { lt: query.checkOut },
      checkOut: { gt: query.checkIn },
    },
    select: { items: { select: { roomId: true, quantity: true } } },
  });

  // Count confirmed rooms per roomId for the overlap window.
  const reservedCount = new Map<string, number>();
  for (const b of overlapping) {
    for (const item of b.items) {
      reservedCount.set(item.roomId, (reservedCount.get(item.roomId) ?? 0) + item.quantity);
    }
  }

  const inventory = new Map<string, number>();
  const available: RoomWithRelations[] = [];

  for (const room of rooms) {
    const capacity = isRoomAvailable(room, query);
    if (!capacity.available) continue;

    const blocked = blockedByRoom.get(room.id);
    if (blocked) {
      // If any night in the range is closed, room is unavailable for the whole stay.
      const closed = Array.from(blocked).some((d) => {
        const date = new Date(d);
        return date >= query.checkIn && date < query.checkOut;
      });
      if (closed) continue;
    }

    available.push(room);
    inventory.set(room.id, (reservedCount.get(room.id) ?? 0) + 1);
  }

  return { rooms: available, inventory, reservedCount };
}

export async function computeRoomPrice(room: RoomWithRelations, nights: number) {
  const base = room.rate?.basePrice ?? room.pricePerNight;
  const currency = room.rate?.currency ?? room.currency;

  // Simple demo pricing: flat base rate. Seasonal/weekend adjustments can be
  // layered here later; the server always owns the final figure.
  const total = Number(base) * nights;

  return { perNight: Number(base), total, currency };
}