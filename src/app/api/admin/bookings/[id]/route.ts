import { NextResponse } from "next/server";
import { getCurrentStaff } from "@/services/auth.service";
import { updateBookingStatus } from "@/repositories/booking.repository";
import { BookingStatus } from "@prisma/client";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const staff = await getCurrentStaff().catch(() => null);
  if (!staff) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const status = body?.status as BookingStatus | undefined;

  if (!status || !Object.values(BookingStatus).includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const booking = await updateBookingStatus(id, status);
  return NextResponse.json({ booking });
}