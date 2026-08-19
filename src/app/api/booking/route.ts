import { NextResponse } from "next/server";
import { createBooking } from "@/services/booking.service";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const result = await createBooking(body);

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ bookingRef: result.bookingRef, id: result.id });
}