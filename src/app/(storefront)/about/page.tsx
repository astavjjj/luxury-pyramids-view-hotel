import type { Metadata } from "next";
import { Container, Eyebrow } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "About",
  description: "About Luxury Pyramids View Hotel on the Giza Plateau.",
};

export default function AboutPage() {
  return (
    <>
      <section className="pt-32 pb-16 md:pt-40">
        <Container>
          <Eyebrow>Our Story</Eyebrow>
          <h1 className="font-display text-5xl md:text-6xl">A residence on the plateau</h1>
        </Container>
      </section>
      <section className="pb-28">
        <Container>
          <div className="grid gap-12 md:grid-cols-2">
            <p className="text-lg leading-relaxed text-muted">
              Luxury Pyramids View Hotel sits on the edge of the Giza Plateau, facing the last
              surviving wonder of the ancient world. The property is conceived as a quiet
              residence — considered architecture, calm interiors, and service measured in
              understatement.
            </p>
            <p className="text-lg leading-relaxed text-muted">
              Our rooms and suites frame the Pyramids from first light to dusk. Dining draws on
              Egyptian hospitality, and the spa finds its rhythm in traditional treatments. This
              is a demonstration website; the final editorial content will be provided by the
              hotel.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}