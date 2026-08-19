import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/services/auth.service";
import { listBookingsForUser } from "@/repositories/booking.repository";
import { Container, Eyebrow } from "@/components/ui/section";
import { SignOutButton } from "@/components/account/sign-out-button";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = { title: "My account" };

export default async function AccountPage() {
  const user = await getCurrentUser().catch(() => null);
  if (!user) redirect("/auth/login");

  const bookings = await listBookingsForUser(user.id);

  return (
    <>
      <section className="pt-32 pb-16 md:pt-40">
        <Container>
          <Eyebrow>Account</Eyebrow>
          <h1 className="font-display text-5xl md:text-6xl">{user.name}</h1>
          <p className="mt-3 text-muted">{user.email}</p>
          <div className="mt-8">
            <SignOutButton />
          </div>
        </Container>
      </section>

      <section className="pb-28">
        <Container>
          <h2 className="font-display text-3xl mb-8">My reservations</h2>

          {bookings.length === 0 ? (
            <div className="border border-line bg-white p-12 text-center">
              <p className="text-muted">You have no reservations yet.</p>
              <Link href="/booking" className="btn-lux btn-lux-solid mt-6 inline-flex">
                Reserve a stay
              </Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {bookings.map((booking) => (
                <Link
                  key={booking.id}
                  href={`/account/bookings/${booking.id}`}
                  className="flex flex-wrap items-center justify-between gap-4 border border-line bg-white p-6 transition hover:border-bronze"
                >
                  <div>
                    <p className="font-display text-xl">{booking.bookingRef}</p>
                    <p className="mt-1 text-sm text-muted">
                      {new Date(booking.checkIn).toLocaleDateString()} →{" "}
                      {new Date(booking.checkOut).toLocaleDateString()} · {booking.nights} nights
                    </p>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-sm uppercase tracking-widest text-muted">
                      {booking.status}
                    </span>
                    <span className="font-display text-2xl">
                      {formatPrice(Number(booking.total), booking.currency)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}