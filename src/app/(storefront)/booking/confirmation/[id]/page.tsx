import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getBookingById } from "@/repositories/booking.repository";
import { Container, Eyebrow } from "@/components/ui/section";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Reservation confirmed",
};

export default async function ConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const booking = await getBookingById(id);
  if (!booking) notFound();

  const firstItem = booking.items[0];

  return (
    <>
      <section className="pt-32 pb-20 md:pt-40">
        <Container>
          <div className="border border-line bg-white p-8 md:p-14">
            <Eyebrow>Reservation</Eyebrow>
            <h1 className="font-display text-4xl md:text-5xl">
              {booking.status === "CONFIRMED" ? "Reservation confirmed" : "Reservation received"}
            </h1>
            <p className="mt-4 text-muted">
              Reference <span className="font-medium text-ink">{booking.bookingRef}</span> ·{" "}
              {new Date(booking.createdAt).toLocaleString()}
            </p>

            <div className="mt-10 grid gap-px overflow-hidden border border-line bg-line md:grid-cols-3">
              <div className="bg-sand p-6">
                <p className="text-[0.65rem] uppercase tracking-[0.25em] text-muted">Guest</p>
                <p className="mt-2 font-medium">{booking.guestName}</p>
                <p className="text-sm text-muted">{booking.guestEmail}</p>
              </div>
              <div className="bg-sand p-6">
                <p className="text-[0.65rem] uppercase tracking-[0.25em] text-muted">Stay</p>
                <p className="mt-2 font-medium">
                  {new Date(booking.checkIn).toLocaleDateString()} →{" "}
                  {new Date(booking.checkOut).toLocaleDateString()}
                </p>
                <p className="text-sm text-muted">{booking.nights} nights</p>
              </div>
              <div className="bg-sand p-6">
                <p className="text-[0.65rem] uppercase tracking-[0.25em] text-muted">Room</p>
                <p className="mt-2 font-medium">{firstItem?.room.name ?? "—"}</p>
                <p className="text-sm text-muted">
                  {booking.adults} adults · {booking.children} children
                </p>
              </div>
            </div>

            <dl className="mt-8 max-w-sm space-y-2 text-sm">
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

            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/account" className="btn-lux btn-lux-solid">
                View my reservations
              </Link>
              <Link href="/" className="btn-lux btn-lux-line">
                Back to home
              </Link>
            </div>

            <p className="mt-8 text-xs text-muted">
              Demo flow — no payment was processed. In production, payment is verified
              server-side via the configured gateway before a booking is confirmed.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}