import type { Metadata } from "next";
import { Container, Eyebrow } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Experiences",
  description: "Experiences at Luxury Pyramids View Hotel.",
};

export default function ExperiencesPage() {
  const items = [
    { title: "Dawn at the Plateau", text: "A guided early walk before the crowds reach the monuments." },
    { title: "The Sphinx by Evening", text: "Sound and light, with a private terrace view." },
    { title: "Felucca on the Nile", text: "A slow sail at golden hour with refreshments on board." },
    { title: "Cairo Old Town", text: "A curated day through Islamic Cairo with a historian." },
  ];

  return (
    <>
      <section className="pt-32 pb-16 md:pt-40">
        <Container>
          <Eyebrow>Beyond the Lobby</Eyebrow>
          <h1 className="font-display text-5xl md:text-6xl">Experiences</h1>
          <p className="mt-5 max-w-xl text-muted">
            Curated encounters around the plateau and the city. Demo content.
          </p>
        </Container>
      </section>
      <section className="pb-28">
        <Container>
          <div className="grid gap-px overflow-hidden border border-line bg-line md:grid-cols-2">
            {items.map((item) => (
              <div key={item.title} className="bg-sand p-10">
                <h2 className="font-display text-3xl">{item.title}</h2>
                <p className="mt-3 text-muted">{item.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}