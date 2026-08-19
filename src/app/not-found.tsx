import Link from "next/link";
import { Container } from "@/components/ui/section";

export default function NotFound() {
  return (
    <section className="flex min-h-screen items-center justify-center bg-sand px-6">
      <Container className="text-center">
        <p className="eyebrow mb-4">404</p>
        <h1 className="font-display text-5xl md:text-6xl">Not found</h1>
        <p className="mt-4 text-muted">This page does not exist.</p>
        <div className="mt-10 flex justify-center">
          <Link href="/" className="btn-lux btn-lux-solid">
            Back to home
          </Link>
        </div>
      </Container>
    </section>
  );
}