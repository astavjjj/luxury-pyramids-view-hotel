import { db } from "@/lib/db";
import { bookingSchema, firstError } from "@/lib/validation";
import { nightsBetween, generateBookingRef } from "@/lib/utils";
import { getRoomsByIds } from "@/repositories/room.repository";
import { getCustomerSession } from "@/lib/auth/session";
import { BookingStatus, PaymentStatus, Currency, PaymentMethod } from "@prisma/client";
import { findAvailableRooms } from "@/services/availability.service";

const TAX_RATE = 0.14; // demo: 14% VAT
const FEES_PER_NIGHT = 5; // demo: resort fee

export type CreateBookingInput = {
  checkIn: string;
  checkOut: string;
  roomIds: string[];
  adults: number;
  children: number;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  guestAddress?: string;
  specialRequests?: string;
};

export async function createBooking(raw: unknown) {
  const parsed = bookingSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false as const, error: firstError(parsed.error) };
  }
  const input = parsed.data as CreateBookingInput;

  const checkIn = new Date(input.checkIn);
  const checkOut = new Date(input.checkOut);

  if (checkOut.getTime() <= checkIn.getTime()) {
    return { ok: false as const, error: "Check-out must be after check-in" };
  }

  const rooms = await getRoomsByIds(input.roomIds);
  if (rooms.length === 0) {
    return { ok: false as const, error: "No valid rooms selected" };
  }

  // Server-side availability verification — never trust the client.
  const availability = await findAvailableRooms({
    checkIn,
    checkOut,
    adults: input.adults,
    children: input.children,
    rooms: input.roomIds.length,
  });

  const availabilityIds = new Set(availability.rooms.map((r) => r.id));
  const missing = input.roomIds.filter((id) => !availabilityIds.has(id));
  if (missing.length > 0) {
    return { ok: false as const, error: "One or more selected rooms are no longer available" };
  }

  const nights = nightsBetween(checkIn, checkOut);

  let subtotal = 0;
  const items = rooms.map((room) => {
    const price = Number(room.rate?.basePrice ?? room.pricePerNight);
    subtotal += price * nights;
    return {
      roomId: room.id,
      pricePerNight: price,
      currency: room.rate?.currency ?? room.currency,
      quantity: 1,
    };
  });

  const taxes = Math.round(subtotal * TAX_RATE * 100) / 100;
  const fees = FEES_PER_NIGHT * nights * input.roomIds.length;
  const total = Math.round((subtotal + taxes + fees) * 100) / 100;

  const session = await getCustomerSession();
  const userId = session?.userId ?? null;

  const bookingRef = generateBookingRef();

  const booking = await db.$transaction(async (tx) => {
    const created = await tx.booking.create({
      data: {
        bookingRef,
        userId,
        guestName: input.guestName,
        guestEmail: input.guestEmail,
        guestPhone: input.guestPhone,
        guestAddress: input.guestAddress,
        specialRequests: input.specialRequests,
        checkIn,
        checkOut,
        nights,
        adults: input.adults,
        children: input.children,
        status: BookingStatus.PAYMENT_PENDING,
        currency: Currency.USD,
        subtotal,
        taxes,
        fees,
        discounts: 0,
        total,
        amountDue: total,
        items: { create: items },
        payments: {
          create: {
            provider: process.env.PAYMENT_PROVIDER ?? "manual",
            method: PaymentMethod.CARD,
            amount: total,
            currency: Currency.USD,
            status: PaymentStatus.PENDING,
          },
        },
      },
    });
    return created;
  });

  return { ok: true as const, bookingRef, id: booking.id };
}

export async function confirmBookingForDemo(id: string) {
  // Demo helper: mark an unpaid booking as confirmed so the flow can be tested.
  // In production the confirmation path runs only after server-verified payment.
  return db.booking.update({
    where: { id },
    data: { status: BookingStatus.CONFIRMED },
  });
}