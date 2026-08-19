import type { Metadata } from "next";
import { Container } from "@/components/ui/section";

export const metadata: Metadata = { title: "Cancellation policy" };

export default function CancellationPolicyPage() {
  return (
    <section className="pt-32 pb-28 md:pt-40">
      <Container className="max-w-3xl">
        <h1 className="font-display text-4xl md:text-5xl">Cancellation policy</h1>
        <p className="mt-6 text-muted">
          This is a demonstration website. The hotel will provide the final cancellation and refund
          policy before production launch.
        </p>
      </Container>
    </section>
  );
}