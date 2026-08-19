import Link from "next/link";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [totalRooms, activeRooms, totalBookings, recentBookings, statusCounts] =
    await Promise.all([
      db.room.count(),
      db.room.count({ where: { active: true } }),
      db.booking.count(),
      db.booking.findMany({ orderBy: { createdAt: "desc" }, take: 5, include: { items: { include: { room: true } } } }),
      db.booking.groupBy({ by: ["status"], _count: { _all: true } }),
    ]);

  const revenue = await db.booking.aggregate({
    _sum: { total: true },
    where: { status: { in: ["CONFIRMED", "CHECKED_IN", "CHECKED_OUT"] } },
  });

  return (
    <div>
      <h1 className="font-display text-4xl">Dashboard</h1>
      <p className="mt-2 text-sm text-muted">Demo data — production configuration by the hotel.</p>

      <div className="mt-10 grid gap-4 md:grid-cols-4">
        {[
          { label: "Revenue", value: formatPrice(Number(revenue._sum.total ?? 0)) },
          { label: "Reservations", value: String(totalBookings) },
          { label: "Rooms", value: `${activeRooms} / ${totalRooms}` },
          { label: "Open bookings", value: String(statusCounts.filter((s) => ["PENDING", "PAYMENT_PENDING", "PROCESSING"].includes(s.status)).reduce((a, s) => a + s._count._all, 0)) },
        ].map((item) => (
          <div key={item.label} className="border border-line bg-white p-6">
            <p className="text-[0.68rem] uppercase tracking-[0.25em] text-muted">{item.label}</p>
            <p className="mt-2 font-display text-3xl">{item.value}</p>
          </div>
        ))}
      </div>

      <h2 className="font-display text-2xl mt-14 mb-6">Recent reservations</h2>
      <div className="grid gap-3">
        {recentBookings.length === 0 && (
          <p className="border border-line bg-white p-8 text-muted">No reservations yet.</p>
        )}
        {recentBookings.map((booking) => (
          <Link
            key={booking.id}
            href={`/admin/bookings/${booking.id}`}
            className="flex flex-wrap items-center justify-between gap-4 border border-line bg-white p-5 transition hover:border-bronze"
          >
            <div>
              <p className="font-medium">{booking.bookingRef}</p>
              <p className="text-sm text-muted">
                {booking.guestName} · {new Date(booking.checkIn).toLocaleDateString()} →{" "}
                {new Date(booking.checkOut).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-xs uppercase tracking-widest text-muted">{booking.status}</span>
              <span className="font-display text-xl">
                {formatPrice(Number(booking.total), booking.currency)}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}