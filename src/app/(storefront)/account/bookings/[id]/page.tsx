import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/services/auth.service";
import { getBookingById } from "@/repositories/booking.repository";
import { Container, Eyebrow } from "@/components/ui/section";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = { title: "Reservation" };

export default async function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser().catch(() => null);
  if (!user) redirect("/auth/login");

  const { id } = await params;
  const booking = await getBookingById(id);
  if (!booking || booking.userId !== user.id) notFound();

  const item = booking.items[0];

  return (
    <>
      <section className="pt-32 pb-16 md:pt-40">
        <Container>
          <Link href="/account" className="text-sm text-muted underline underline-offset-4">
            ← Back to my reservations
          </Link>
          <Eyebrow className="mt-8">Reservation</Eyebrow>
          <h1 className="font-display text-5xl">{booking.bookingRef}</h1>
          <p className="mt-3 text-muted">{booking.status}</p>
        </Container>
      </section>

      <section className="pb-28">
        <Container>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="border border-line bg-white p-8">
              <h2 className="font-display text-2xl mb-6">Stay</h2>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted">Check-in</dt>
                  <dd>{new Date(booking.checkIn).toLocaleDateString()}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Check-out</dt>
                  <dd>{new Date(booking.checkOut).toLocaleDateString()}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Nights</dt>
                  <dd>{booking.nights}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Guests</dt>
                  <dd>
                    {booking.adults} adults · {booking.children} children
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Room</dt>
                  <dd>{item?.room.name ?? "—"}</dd>
                </div>
              </dl>
            </div>

            <div className="border border-line bg-white p-8">
              <h2 className="font-display text-2xl mb-6">Total</h2>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted">Subtotal</dt>
                  <dd>{formatPrice(Number(booking.subtotal), booking.currency)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Taxes</dt>
                  <dd>{formatPrice(Number(booking.taxes), booking.currency)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Fees</dt>
                  <dd>{formatPrice(Number(booking.fees), booking.currency)}</dd>
                </div>
                <div className="flex justify-between border-t border-line pt-3 text-base font-medium">
                  <dt>Total</dt>
                  <dd>{formatPrice(Number(booking.total), booking.currency)}</dd>
                </div>
              </dl>
              {booking.specialRequests && (
                <p className="mt-6 text-sm text-muted">Note: {booking.specialRequests}</p>
              )}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}