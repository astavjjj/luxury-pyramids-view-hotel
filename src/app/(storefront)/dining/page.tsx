import type { Metadata } from "next";
import { Container, Eyebrow } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Dining",
  description: "Restaurants and dining at Luxury Pyramids View Hotel.",
};

export default function DiningPage() {
  return (
    <>
      <section className="pt-32 pb-16 md:pt-40">
        <Container>
          <Eyebrow>Restaurants</Eyebrow>
          <h1 className="font-display text-5xl md:text-6xl">Dining</h1>
          <p className="mt-5 max-w-xl text-muted">
            Culinary experiences rooted in Egyptian hospitality. Demo content.
          </p>
        </Container>
      </section>
      <section className="pb-28">
        <Container>
          <div className="grid gap-10 md:grid-cols-2">
            <article className="border border-line bg-white p-8">
              <p className="eyebrow mb-3">Breakfast · Lunch · Dinner</p>
              <h2 className="font-display text-3xl">The Horizon</h2>
              <p className="mt-4 text-muted">
                All-day dining with a terrace facing the plateau. Egyptian staples beside
                international plates.
              </p>
            </article>
            <article className="border border-line bg-white p-8">
              <p className="eyebrow mb-3">Dinner</p>
              <h2 className="font-display text-3xl">Al-Karm</h2>
              <p className="mt-4 text-muted">
                A candle-lit room with a tasting menu drawn from the Delta and the Nile.
              </p>
            </article>
          </div>
        </Container>
      </section>
    </>
  );
}