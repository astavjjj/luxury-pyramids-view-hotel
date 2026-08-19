import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getRoomBySlug } from "@/repositories/room.repository";
import { Container, Eyebrow } from "@/components/ui/section";
import { AvailabilitySearch } from "@/components/booking/availability-search";
import { formatPrice } from "@/lib/utils";
import { withFallback } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const room = await withFallback(() => getRoomBySlug(slug), null);
  if (!room) return { title: "Room" };
  return {
    title: room.name,
    description: room.description,
  };
}

export default async function RoomPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const room = await withFallback(() => getRoomBySlug(slug), null);
  if (!room) notFound();

  const avgRating =
    room.reviews.length > 0
      ? (room.reviews.reduce((sum, r) => sum + r.rating, 0) / room.reviews.length).toFixed(1)
      : null;

  return (
    <>
      <section className="pt-32 pb-12 md:pt-40">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <Eyebrow>
                {room.view ?? "Giza"} · {room.maxGuests} guests
              </Eyebrow>
              <h1 className="font-display text-5xl md:text-6xl">{room.name}</h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">{room.description}</p>
              <p className="mt-8 text-sm">
                <span className="text-muted">from</span>{" "}
                <span className="font-display text-3xl">
                  {formatPrice(Number(room.pricePerNight), room.currency)}
                </span>{" "}
                <span className="text-muted">/ night</span>
              </p>
              {avgRating && (
                <p className="mt-3 text-sm text-muted">Guest rating {avgRating} / 5</p>
              )}
            </div>
            <div>
              <img
                src={room.image ?? "/media/demo/deluxe.svg"}
                alt={room.name}
                className="image-soft aspect-[4/3] w-full object-cover"
              />
            </div>
          </div>
        </Container>
      </section>

      <section className="pb-16">
        <Container>
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <h2 className="font-display text-3xl mb-6">Details</h2>
              <div className="grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-3">
                <div className="bg-sand p-6">
                  <p className="text-[0.65rem] uppercase tracking-[0.25em] text-muted">Size</p>
                  <p className="mt-2 font-display text-2xl">{room.sizeSqm} m²</p>
                </div>
                <div className="bg-sand p-6">
                  <p className="text-[0.65rem] uppercase tracking-[0.25em] text-muted">Bed</p>
                  <p className="mt-2 font-display text-2xl capitalize">{room.bedType.toLowerCase()}</p>
                </div>
                <div className="bg-sand p-6">
                  <p className="text-[0.65rem] uppercase tracking-[0.25em] text-muted">Guests</p>
                  <p className="mt-2 font-display text-2xl">{room.maxGuests}</p>
                </div>
              </div>

              <h2 className="font-display text-3xl mt-12 mb-6">Amenities</h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {room.amenities.map(({ amenity }) => (
                  <li key={amenity.id} className="flex items-center gap-3 border-b border-line pb-3">
                    <span className="h-1.5 w-1.5 rounded-full bg-bronze" />
                    {amenity.name}
                  </li>
                ))}
              </ul>
            </div>

            <aside className="lg:sticky lg:top-28 h-fit border border-line bg-white p-6">
              <h2 className="font-display text-2xl mb-6">Check availability</h2>
              <AvailabilitySearch roomSlug={room.slug} compact />
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}