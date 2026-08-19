import type { Metadata } from "next";
import { Container, Eyebrow } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Spa & Wellness",
  description: "Spa and wellness at Luxury Pyramids View Hotel.",
};

export default function SpaPage() {
  const treatments = [
    { name: "The Plateau Massage", time: "60 min", note: "Deep-tissue, guided by your day." },
    { name: "Nile Lotus Ritual", time: "90 min", note: "Traditional Egyptian rhythm and oils." },
    { name: "Desert Recovery", time: "120 min", note: "Salt, steam and quiet restoration." },
  ];

  return (
    <>
      <section className="pt-32 pb-16 md:pt-40">
        <Container>
          <Eyebrow>Wellness</Eyebrow>
          <h1 className="font-display text-5xl md:text-6xl">Spa & Wellness</h1>
          <p className="mt-5 max-w-xl text-muted">
            Treatments rooted in Egyptian tradition, in a space designed for quiet. Demo content.
          </p>
        </Container>
      </section>
      <section className="pb-28">
        <Container>
          <div className="grid gap-6 md:grid-cols-3">
            {treatments.map((t) => (
              <div key={t.name} className="border border-line bg-white p-8">
                <p className="eyebrow mb-3">{t.time}</p>
                <h2 className="font-display text-2xl">{t.name}</h2>
                <p className="mt-3 text-sm text-muted">{t.note}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}