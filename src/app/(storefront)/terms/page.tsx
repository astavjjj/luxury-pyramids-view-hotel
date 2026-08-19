import type { Metadata } from "next";
import { Container } from "@/components/ui/section";

export const metadata: Metadata = { title: "Terms" };

export default function TermsPage() {
  return (
    <section className="pt-32 pb-28 md:pt-40">
      <Container className="max-w-3xl">
        <h1 className="font-display text-4xl md:text-5xl">Terms of service</h1>
        <p className="mt-6 text-muted">
          This is a demonstration website. The hotel will provide final terms before production
          launch.
        </p>
      </Container>
    </section>
  );
}