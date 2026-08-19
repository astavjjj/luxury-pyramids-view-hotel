import type { Metadata } from "next";
import { listRooms } from "@/repositories/room.repository";
import { Container, Eyebrow } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Gallery of Luxury Pyramids View Hotel.",
};

export const revalidate = 60;

export default async function GalleryPage() {
  const rooms = await listRooms();
  const images = [
    "/media/demo/hero-pyramids.svg",
    "/media/demo/dining.svg",
    "/media/demo/spa.svg",
    ...rooms.map((r) => r.image ?? "/media/demo/deluxe.svg"),
  ];

  return (
    <>
      <section className="pt-32 pb-16 md:pt-40">
        <Container>
          <Eyebrow>Gallery</Eyebrow>
          <h1 className="font-display text-5xl md:text-6xl">Gallery</h1>
        </Container>
      </section>
      <section className="pb-28">
        <Container>
          <div className="columns-1 gap-4 md:columns-2 lg:columns-3 [&>img]:mb-4">
            {images.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`Hotel gallery image (demo asset)`}
                className="image-soft w-full object-cover"
                loading="lazy"
              />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}