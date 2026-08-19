import type { Metadata } from "next";
import { Container, Eyebrow } from "@/components/ui/section";
import { BookingSearch } from "@/components/booking/booking-search";

export const metadata: Metadata = {
  title: "Reserve",
  description: "Check availability and reserve your stay at Luxury Pyramids View Hotel.",
};

export default function BookingPage() {
  return (
    <>
      <section className="pt-32 pb-20 md:pt-40">
        <Container>
          <Eyebrow>Reservations</Eyebrow>
          <h1 className="font-display text-5xl md:text-6xl">Reserve a Stay</h1>
          <p className="mt-5 max-w-xl text-muted">
            Availability is verified in real time. Select your dates to see what is free.
          </p>
        </Container>
      </section>

      <section className="pb-28">
        <Container>
          <BookingSearch />
        </Container>
      </section>
    </>
  );
}