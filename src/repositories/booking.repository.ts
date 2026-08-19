import { db } from "@/lib/db";
import { Prisma, BookingStatus } from "@prisma/client";

const bookingInclude = {
  items: { include: { room: true } },
  payments: true,
  user: { select: { id: true, name: true, email: true } },
} satisfies Prisma.BookingInclude;

export type BookingWithRelations = Prisma.BookingGetPayload<{ include: typeof bookingInclude }>;

export async function getBookingByRef(ref: string) {
  return db.booking.findUnique({
    where: { bookingRef: ref },
    include: bookingInclude,
  });
}

export async function getBookingById(id: string) {
  return db.booking.findUnique({
    where: { id },
    include: bookingInclude,
  });
}

export async function listBookingsForUser(userId: string) {
  return db.booking.findMany({
    where: { userId },
    include: bookingInclude,
    orderBy: { createdAt: "desc" },
  });
}

export async function listBookings(params: {
  status?: BookingStatus;
  search?: string;
  page?: number;
  pageSize?: number;
}) {
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 20;

  const where: Prisma.BookingWhereInput = {};
  if (params.status) where.status = params.status;
  if (params.search) {
    where.OR = [
      { bookingRef: { contains: params.search, mode: "insensitive" } },
      { guestName: { contains: params.search, mode: "insensitive" } },
      { guestEmail: { contains: params.search, mode: "insensitive" } },
    ];
  }

  const [total, bookings] = await Promise.all([
    db.booking.count({ where }),
    db.booking.findMany({
      where,
      include: bookingInclude,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  return { total, page, pageSize, bookings };
}

export async function updateBookingStatus(id: string, status: BookingStatus) {
  return db.booking.update({ where: { id }, data: { status } });
}

export async function countBookingsByStatus() {
  const statuses = await db.booking.groupBy({
    by: ["status"],
    _count: { _all: true },
  });
  return statuses;
}