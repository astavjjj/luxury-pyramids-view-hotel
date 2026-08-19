import Link from "next/link";
import { ArrowRight, Landmark, Sun, Waves } from "lucide-react";
import { getDictionary } from "@/lib/i18n/server";
import { getSiteSettings } from "@/services/content.service";
import { listRooms } from "@/repositories/room.repository";
import { Container, Eyebrow } from "@/components/ui/section";
import { formatPrice } from "@/lib/utils";

export const revalidate = 60;

export default async function HomePage() {
  const [dict, settings, rooms] = await Promise.all([
    getDictionary(),
    getSiteSettings(),
    listRooms(),
  ]);

  const featured = rooms.slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="relative flex h-[92vh] min-h-[560px] w-full items-end overflow-hidden">
        <img
          src="/media/demo/hero-pyramids.svg"
          alt="Pyramids of Giza at dawn (demo asset)"
          className="image-soft absolute inset-0 h-full w-full object-cover"
        />
        <div className="overlay-gradient absolute inset-0" />
        <Container className="relative z-10 pb-20 text-white">
          <p className="eyebrow mb-5 !text-white/80">{dict.home.heroKicker}</p>
          <h1 className="font-display max-w-3xl text-5xl leading-[1.05] text-balance md:text-7xl">
            {dict.home.heroTitle}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/80 md:text-lg">
            {dict.home.heroSubtitle}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/booking" className="btn-lux btn-lux-solid !bg-white !text-ink !border-white hover:!bg-bronze-soft">
              {dict.home.reserve}
            </Link>
            <Link href="/rooms" className="btn-lux btn-lux-line-light">
              {dict.home.explore}
            </Link>
          </div>
        </Container>
      </section>

      {/* Rooms preview */}
      <section className="py-24 md:py-32">
        <Container>
          <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <Eyebrow>{dict.home.roomsTitle}</Eyebrow>
              <h2 className="font-display text-4xl leading-tight md:text-5xl">
                {dict.home.roomsTitle}
              </h2>
              <p className="mt-4 text-muted">{dict.home.roomsSubtitle}</p>
            </div>
            <Link href="/rooms" className="group inline-flex items-center gap-2 text-[0.72rem] uppercase tracking-[0.25em]">
              <span className="border-b border-bronze pb-1">{dict.common.viewDetails}</span>
              <ArrowRight size={14} className="transition group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {featured.map((room) => (
              <Link key={room.id} href={`/rooms/${room.slug}`} className="group">
                <div className="overflow-hidden bg-sand-deep">
                  <img
                    src={room.image ?? "/media/demo/deluxe.svg"}
                    alt={room.name}
                    className="image-soft aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                  />
                </div>
                <div className="flex items-start justify-between gap-4 pt-5">
                  <div>
                    <h3 className="font-display text-2xl">{room.name}</h3>
                    <p className="mt-1 text-sm text-muted">
                      {room.sizeSqm} m² · {room.maxGuests} {dict.common.guests}
                    </p>
                  </div>
                  <p className="whitespace-nowrap text-sm">
                    <span className="text-muted">{dict.common.from}</span>{" "}
                    <span className="font-medium">
                      {formatPrice(Number(room.pricePerNight), room.currency)}
                    </span>
                    <span className="text-muted"> / {dict.common.perNight}</span>
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Pyramids storytelling */}
      <section className="relative min-h-[85vh] overflow-hidden bg-ink text-white">
        <div className="absolute inset-0">
          <img
            src="/media/demo/pyramids-room.svg"
            alt="Pyramids view (demo asset)"
            className="image-soft h-full w-full object-cover opacity-50"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/60 to-transparent" />
        <Container className="relative z-10 flex min-h-[85vh] items-center">
          <div className="max-w-xl py-24">
            <Eyebrow>{dict.home.experiencesTitle}</Eyebrow>
            <h2 className="font-display text-4xl leading-tight text-balance md:text-6xl">
              {dict.home.experiencesTitle}
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-white/80">
              {dict.home.experiencesSubtitle}
            </p>
            <div className="mt-10 flex gap-4">
              <Link href="/rooms/pyramids-view-room" className="btn-lux btn-lux-line-light">
                {dict.home.reserve}
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Amenities */}
      <section className="py-24 md:py-32">
        <Container>
          <div className="mb-14 max-w-2xl">
            <Eyebrow>{dict.home.amenitiesTitle}</Eyebrow>
            <h2 className="font-display text-4xl md:text-5xl">{dict.home.amenitiesTitle}</h2>
          </div>
          <div className="grid gap-px overflow-hidden border border-line bg-line md:grid-cols-3">
            {[
              { icon: Sun, title: "Pool & Gardens", text: "A quiet pool terrace looking toward the plateau." },
              { icon: Landmark, title: "Pyramids View Rooms", text: "Signature rooms framing the Pyramids of Giza." },
              { icon: Waves, title: "Spa & Wellness", text: "Treatments rooted in Egyptian tradition." },
            ].map((item) => (
              <div key={item.title} className="bg-sand p-10">
                <item.icon size={22} className="mb-6 text-bronze" strokeWidth={1.2} />
                <h3 className="font-display text-2xl">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{item.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Dining */}
      <section className="py-24 md:py-32">
        <Container>
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div className="order-2 md:order-1">
              <img
                src="/media/demo/dining.svg"
                alt="Dining (demo asset)"
                className="image-soft aspect-[4/3] w-full object-cover"
              />
            </div>
            <div className="order-1 md:order-2">
              <Eyebrow>{dict.home.diningTitle}</Eyebrow>
              <h2 className="font-display text-4xl leading-tight md:text-5xl">
                {dict.home.diningTitle}
              </h2>
              <p className="mt-5 max-w-md text-muted">{dict.home.diningSubtitle}</p>
              <div className="mt-8">
                <Link href="/dining" className="btn-lux btn-lux-line">
                  {dict.nav.dining}
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA strip */}
      <section className="bg-ink py-20 text-center text-white">
        <Container>
          <h2 className="font-display text-4xl md:text-5xl text-balance">{dict.home.visitTitle}</h2>
          <div className="mt-10 flex justify-center">
            <Link href="/booking" className="btn-lux btn-lux-solid !bg-white !text-ink !border-white hover:!bg-bronze-soft">
              {dict.home.reserve}
            </Link>
          </div>
          <p className="mt-8 text-sm text-white/60">{settings.address ?? "Giza, Egypt"}</p>
        </Container>
      </section>
    </>
  );
}