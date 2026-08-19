import { NextResponse } from "next/server";
import { getCurrentStaff } from "@/services/auth.service";
import { listBookings } from "@/repositories/booking.repository";
import { BookingStatus } from "@prisma/client";

export async function GET(request: Request) {
  const staff = await getCurrentStaff().catch(() => null);
  if (!staff) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const statusParam = searchParams.get("status");
  const search = searchParams.get("search") ?? undefined;
  const page = Number(searchParams.get("page") ?? 1);

  const status = statusParam && Object.values(BookingStatus).includes(statusParam as BookingStatus)
    ? (statusParam as BookingStatus)
    : undefined;

  const result = await listBookings({ status, search, page, pageSize: 20 });
  return NextResponse.json(result);
}