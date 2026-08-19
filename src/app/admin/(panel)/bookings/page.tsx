import Link from "next/link";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { BookingStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const status = typeof sp.status === "string" ? sp.status : undefined;
  const search = typeof sp.search === "string" ? sp.search : undefined;

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { bookingRef: { contains: search, mode: "insensitive" } },
      { guestName: { contains: search, mode: "insensitive" } },
      { guestEmail: { contains: search, mode: "insensitive" } },
    ];
  }

  const bookings = await db.booking.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { items: { include: { room: true } } },
  });

  return (
    <div>
      <h1 className="font-display text-4xl">Bookings</h1>
      <p className="mt-2 text-sm text-muted">Review and manage reservations.</p>

      <form className="mt-8 flex flex-wrap items-center gap-4" method="get">
        <input name="search" defaultValue={search} placeholder="Search guest or reference…" className="field-input max-w-xs !bg-white" />
        <select name="status" defaultValue={status ?? ""} className="field-input max-w-44 !bg-white">
          <option value="">All statuses</option>
          {Object.values(BookingStatus).map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <button type="submit" className="btn-lux btn-lux-line !px-5 !py-2.5">
          Filter
        </button>
      </form>

      <div className="mt-8 grid gap-3">
        {bookings.length === 0 && (
          <p className="border border-line bg-white p-8 text-muted">No bookings match.</p>
        )}
        {bookings.map((booking) => (
          <Link
            key={booking.id}
            href={`/admin/bookings/${booking.id}`}
            className="flex flex-wrap items-center justify-between gap-4 border border-line bg-white p-5 transition hover:border-bronze"
          >
            <div>
              <p className="font-medium">{booking.bookingRef}</p>
              <p className="text-sm text-muted">
                {booking.guestName} · {booking.items[0]?.room.name ?? "—"}
              </p>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-sm text-muted">
                {new Date(booking.checkIn).toLocaleDateString()} → {new Date(booking.checkOut).toLocaleDateString()}
              </span>
              <span className="text-xs uppercase tracking-widest text-muted">{booking.status}</span>
              <span className="font-display text-xl">{formatPrice(Number(booking.total), booking.currency)}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}