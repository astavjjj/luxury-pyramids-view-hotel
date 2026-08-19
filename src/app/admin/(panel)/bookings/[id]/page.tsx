import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { BookingStatusControl } from "@/components/admin/booking-status";

export const dynamic = "force-dynamic";

export default async function AdminBookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const booking = await db.booking.findUnique({
    where: { id },
    include: { items: { include: { room: true } }, payments: true, user: true },
  });
  if (!booking) notFound();

  const item = booking.items[0];

  return (
    <div className="max-w-4xl">
      <Link href="/admin/bookings" className="text-sm text-muted underline underline-offset-4">
        ← Bookings
      </Link>
      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl">{booking.bookingRef}</h1>
          <p className="mt-2 text-sm text-muted">
            Created {new Date(booking.createdAt).toLocaleString()}
          </p>
        </div>
        <span className="border border-bronze px-3 py-1 text-xs uppercase tracking-widest text-bronze">
          {booking.status}
        </span>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="border border-line bg-white p-6">
          <h2 className="font-display text-xl mb-4">Guest</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-muted">Name</dt><dd>{booking.guestName}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Email</dt><dd>{booking.guestEmail}</dd></div>
            {booking.guestPhone && <div className="flex justify-between"><dt className="text-muted">Phone</dt><dd>{booking.guestPhone}</dd></div>}
            {booking.guestAddress && <div className="flex justify-between"><dt className="text-muted">Address</dt><dd>{booking.guestAddress}</dd></div>}
            {booking.user && <div className="flex justify-between"><dt className="text-muted">Account</dt><dd>{booking.user.email}</dd></div>}
          </dl>
        </div>

        <div className="border border-line bg-white p-6">
          <h2 className="font-display text-xl mb-4">Stay</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-muted">Room</dt><dd>{item?.room.name ?? "—"}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Check-in</dt><dd>{new Date(booking.checkIn).toLocaleDateString()}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Check-out</dt><dd>{new Date(booking.checkOut).toLocaleDateString()}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Nights</dt><dd>{booking.nights}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Guests</dt><dd>{booking.adults} adults · {booking.children} children</dd></div>
          </dl>
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="border border-line bg-white p-6">
          <h2 className="font-display text-xl mb-4">Amount</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd>{formatPrice(Number(booking.subtotal), booking.currency)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Taxes</dt><dd>{formatPrice(Number(booking.taxes), booking.currency)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Fees</dt><dd>{formatPrice(Number(booking.fees), booking.currency)}</dd></div>
            <div className="flex justify-between border-t border-line pt-3 font-medium"><dt>Total</dt><dd>{formatPrice(Number(booking.total), booking.currency)}</dd></div>
          </dl>
          {booking.specialRequests && (
            <p className="mt-4 text-sm text-muted">Note: {booking.specialRequests}</p>
          )}
        </div>

        <div className="border border-line bg-white p-6">
          <h2 className="font-display text-xl mb-4">Payments</h2>
          {booking.payments.length === 0 && <p className="text-sm text-muted">No payments recorded.</p>}
          <div className="space-y-3">
            {booking.payments.map((p) => (
              <div key={p.id} className="flex justify-between text-sm">
                <span className="text-muted">{p.provider} · {p.status}</span>
                <span>{formatPrice(Number(p.amount), p.currency)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 border border-line bg-white p-6">
        <BookingStatusControl id={booking.id} current={booking.status} />
      </div>
    </div>
  );
}