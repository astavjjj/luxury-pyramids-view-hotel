import type { Metadata } from "next";
import { Container, Eyebrow } from "@/components/ui/section";
import { getSiteSettings } from "@/services/content.service";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Luxury Pyramids View Hotel.",
};

export const revalidate = 60;

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <section className="pt-32 pb-16 md:pt-40">
        <Container>
          <Eyebrow>Contact</Eyebrow>
          <h1 className="font-display text-5xl md:text-6xl">Contact us</h1>
        </Container>
      </section>
      <section className="pb-28">
        <Container>
          <div className="grid gap-10 md:grid-cols-2">
            <div className="space-y-6">
              <div>
                <p className="text-[0.68rem] uppercase tracking-[0.25em] text-muted">Address</p>
                <p className="mt-2 text-lg">{settings.address ?? "Giza, Egypt"}</p>
              </div>
              <div>
                <p className="text-[0.68rem] uppercase tracking-[0.25em] text-muted">Phone</p>
                <p className="mt-2 text-lg">{settings.phone ?? "—"}</p>
              </div>
              <div>
                <p className="text-[0.68rem] uppercase tracking-[0.25em] text-muted">Email</p>
                <p className="mt-2 text-lg">{settings.email ?? "—"}</p>
              </div>
              <p className="text-sm text-muted">Demo contact details — provided by the hotel.</p>
            </div>
            <form
              action="/api/contact"
              method="POST"
              className="grid gap-5 border border-line bg-white p-8"
            >
              <label className="block">
                <span className="mb-2 block text-[0.68rem] uppercase tracking-[0.2em] text-muted">
                  Name
                </span>
                <input name="name" className="field-input" required />
              </label>
              <label className="block">
                <span className="mb-2 block text-[0.68rem] uppercase tracking-[0.2em] text-muted">
                  Email
                </span>
                <input name="email" type="email" className="field-input" required />
              </label>
              <label className="block">
                <span className="mb-2 block text-[0.68rem] uppercase tracking-[0.2em] text-muted">
                  Message
                </span>
                <textarea name="message" className="field-input min-h-32" required />
              </label>
              <button type="submit" className="btn-lux btn-lux-solid">
                Send
              </button>
            </form>
          </div>
        </Container>
      </section>
    </>
  );
}