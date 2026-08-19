import type { Metadata } from "next";
import { db } from "@/lib/db";
import { Container, Eyebrow } from "@/components/ui/section";
import { withFallback } from "@/lib/data";

export const metadata: Metadata = {
  title: "Offers",
  description: "Seasonal offers and packages at Luxury Pyramids View Hotel.",
};

export const dynamic = "force-dynamic";

export default async function OffersPage() {
  const offers = await withFallback(
    () => db.offer.findMany({ where: { active: true }, orderBy: { createdAt: "desc" } }),
    [],
  );

  return (
    <>
      <section className="pt-32 pb-16 md:pt-40">
        <Container>
          <Eyebrow>Seasonal</Eyebrow>
          <h1 className="font-display text-5xl md:text-6xl">Offers</h1>
          <p className="mt-5 max-w-xl text-muted">
            Packages and seasonal rates. Demo content — final offers provided by the hotel.
          </p>
        </Container>
      </section>

      <section className="pb-28">
        <Container>
          <div className="grid gap-8 md:grid-cols-2">
            {offers.map((offer) => (
              <article key={offer.id} className="border border-line bg-white p-8">
                <p className="eyebrow mb-3 capitalize">{offer.type.toLowerCase()}</p>
                <h2 className="font-display text-3xl">{offer.title}</h2>
                <p className="mt-3 text-muted">{offer.description}</p>
                {offer.discountPct && (
                  <p className="mt-5 inline-block border border-bronze px-3 py-1 text-xs uppercase tracking-widest text-bronze">
                    {Number(offer.discountPct)}% off
                  </p>
                )}
              </article>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}