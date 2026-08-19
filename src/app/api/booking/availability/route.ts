import { NextResponse } from "next/server";
import { availabilitySchema } from "@/lib/validation";
import { findAvailableRooms, computeRoomPrice } from "@/services/availability.service";
import { nightsBetween } from "@/lib/utils";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const raw = {
    checkIn: searchParams.get("checkIn") ?? "",
    checkOut: searchParams.get("checkOut") ?? "",
    adults: searchParams.get("adults") ?? "2",
    children: searchParams.get("children") ?? "0",
    rooms: searchParams.get("rooms") ?? "1",
  };

  const parsed = availabilitySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid search parameters" }, { status: 400 });
  }

  const { checkIn, checkOut, adults, children, rooms } = parsed.data;
  const nights = nightsBetween(new Date(checkIn), new Date(checkOut));

  const result = await findAvailableRooms({
    checkIn: new Date(checkIn),
    checkOut: new Date(checkOut),
    adults,
    children,
    rooms,
  });

  const roomsWithPrice = await Promise.all(
    result.rooms.map(async (room) => {
      const price = await computeRoomPrice(room, nights);
      return {
        id: room.id,
        slug: room.slug,
        name: room.name,
        nameAr: room.nameAr,
        description: room.description,
        sizeSqm: room.sizeSqm,
        maxGuests: room.maxGuests,
        bedType: room.bedType,
        view: room.view,
        image: room.image,
        amenities: room.amenities.map((a) => ({ name: a.amenity.name, nameAr: a.amenity.nameAr })),
        perNight: price.perNight,
        total: price.total,
        currency: price.currency,
      };
    }),
  );

  return NextResponse.json({ nights, rooms: roomsWithPrice });
}