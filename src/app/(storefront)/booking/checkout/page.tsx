import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getRoomBySlug } from "@/repositories/room.repository";
import { Container, Eyebrow } from "@/components/ui/section";
import { CheckoutForm } from "@/components/booking/checkout-form";
import { nightsBetween } from "@/lib/utils";
import { findAvailableRooms } from "@/services/availability.service";

export const metadata: Metadata = {
  title: "Checkout",
};

const TAX_RATE = 0.14;
const FEES_PER_NIGHT = 5;

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const checkIn = sp.checkIn as string;
  const checkOut = sp.checkOut as string;
  const adults = Number(sp.adults ?? 2);
  const children = Number(sp.children ?? 0);
  const roomSlug = sp.roomId as string;

  if (!checkIn || !checkOut || !roomSlug) redirect("/booking");
  if (isNaN(Date.parse(checkIn)) || isNaN(Date.parse(checkOut))) redirect("/booking");

  const room = await getRoomBySlug(roomSlug);
  if (!room) notFound();

  // Server-side availability verification at checkout time.
  const availability = await findAvailableRooms({
    checkIn: new Date(checkIn),
    checkOut: new Date(checkOut),
    adults,
    children,
    rooms: 1,
  });
  const ok = availability.rooms.some((r) => r.id === room.id);
  if (!ok) {
    return (
      <section className="pt-40 pb-28">
        <Container>
          <div className="border border-line bg-white p-12 text-center">
            <h1 className="font-display text-4xl">No longer available</h1>
            <p className="mt-4 text-muted">
              This room is not available for the selected dates. Please choose different dates.
            </p>
            <a href="/booking" className="btn-lux btn-lux-line mt-8 inline-flex">
              Search again
            </a>
          </div>
        </Container>
      </section>
    );
  }

  const nights = nightsBetween(new Date(checkIn), new Date(checkOut));
  const perNight = Number(room.rate?.basePrice ?? room.pricePerNight);
  const currency = room.rate?.currency ?? room.currency;
  const subtotal = perNight * nights;
  const taxes = Math.round(subtotal * TAX_RATE * 100) / 100;
  const fees = FEES_PER_NIGHT * nights;
  const total = Math.round((subtotal + taxes + fees) * 100) / 100;

  return (
    <>
      <section className="pt-32 pb-16 md:pt-40">
        <Container>
          <Eyebrow>Reservation</Eyebrow>
          <h1 className="font-display text-5xl md:text-6xl">Your details</h1>
        </Container>
      </section>

      <section className="pb-28">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
            <div>
              <CheckoutForm
                checkIn={checkIn}
                checkOut={checkOut}
                adults={adults}
                childCount={children}
                roomId={room.id}
                roomName={room.name}
                perNight={perNight}
                nights={nights}
                currency={currency}
                subtotal={subtotal}
                taxes={taxes}
                fees={fees}
                total={total}
              />
            </div>
            <aside className="h-fit lg:sticky lg:top-28">
              <img
                src={room.image ?? "/media/demo/deluxe.svg"}
                alt={room.name}
                className="image-soft aspect-[4/3] w-full object-cover"
              />
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}