import type { Metadata } from "next";
import { listRooms } from "@/repositories/room.repository";
import { Container, Eyebrow } from "@/components/ui/section";
import { RoomCard } from "@/components/storefront/room-card";

export const metadata: Metadata = {
  title: "Suites",
  description: "Suites at Luxury Pyramids View Hotel with panoramic views of the Pyramids of Giza.",
};

export const revalidate = 60;

export default async function SuitesPage() {
  const rooms = await listRooms();
  const suites = rooms.filter((r) => r.name.toLowerCase().includes("suite"));

  return (
    <>
      <section className="pt-32 pb-16 md:pt-40">
        <Container>
          <Eyebrow>Signature Residences</Eyebrow>
          <h1 className="font-display text-5xl md:text-6xl">Suites</h1>
          <p className="mt-5 max-w-xl text-muted">
            Our suites expand the stay into separate living space — lounges, studies and bath
            rooms designed at scale.
          </p>
        </Container>
      </section>

      <section className="pb-28">
        <Container>
          <div className="grid gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
            {suites.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}