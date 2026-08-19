import type { Metadata } from "next";
import { Container, Eyebrow } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Location",
  description: "Location of Luxury Pyramids View Hotel in Giza, Egypt.",
};

export default function LocationPage() {
  return (
    <>
      <section className="pt-32 pb-16 md:pt-40">
        <Container>
          <Eyebrow>Giza · Egypt</Eyebrow>
          <h1 className="font-display text-5xl md:text-6xl">Location</h1>
          <p className="mt-5 max-w-xl text-muted">
            On the Giza Plateau, minutes from the Great Pyramids, the Sphinx and Cairo&apos;s
            international airport.
          </p>
        </Container>
      </section>
      <section className="pb-28">
        <Container>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { title: "Pyramids of Giza", note: "Direct view from rooms" },
              { title: "The Great Sphinx", note: "15 minutes on foot" },
              { title: "Cairo Airport (CAI)", note: "~40 minutes by car" },
            ].map((item) => (
              <div key={item.title} className="border border-line bg-white p-8">
                <h2 className="font-display text-2xl">{item.title}</h2>
                <p className="mt-2 text-sm text-muted">{item.note}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}