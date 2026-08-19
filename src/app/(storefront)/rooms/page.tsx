import type { Metadata } from "next";
import { listRooms } from "@/repositories/room.repository";
import { Container, Eyebrow } from "@/components/ui/section";
import { RoomCard } from "@/components/storefront/room-card";
import { withFallback } from "@/lib/data";

export const metadata: Metadata = {
  title: "Rooms",
  description:
    "Rooms at Luxury Pyramids View Hotel — considered spaces on the Giza Plateau with views of the Pyramids.",
};

export const dynamic = "force-dynamic";

export default async function RoomsPage() {
  const rooms = await withFallback(() => listRooms(), []);

  return (
    <>
      <section className="pt-32 pb-16 md:pt-40">
        <Container>
          <Eyebrow>Giza · Egypt</Eyebrow>
          <h1 className="font-display text-5xl md:text-6xl">Rooms</h1>
          <p className="mt-5 max-w-xl text-muted">
            Considered, quiet spaces. Each room is designed for calm after days spent among the
            monuments of the plateau.
          </p>
        </Container>
      </section>

      <section className="pb-28">
        <Container>
          <div className="grid gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
            {rooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}