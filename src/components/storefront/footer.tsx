import Link from "next/link";
import type { Dictionary } from "@/lib/i18n/dictionary";

export function Footer({
  dict,
  settings,
}: {
  dict: Dictionary;
  settings: Record<string, string>;
}) {
  const columns: { title: string; links: { label: string; href: string }[] }[] = [
    {
      title: dict.nav.rooms,
      links: [
        { label: dict.nav.rooms, href: "/rooms" },
        { label: dict.nav.suites, href: "/suites" },
        { label: dict.nav.offers, href: "/offers" },
        { label: dict.nav.gallery, href: "/gallery" },
      ],
    },
    {
      title: dict.nav.experiences,
      links: [
        { label: dict.nav.spa, href: "/spa" },
        { label: dict.nav.dining, href: "/dining" },
        { label: "Location", href: "/location" },
        { label: dict.nav.about, href: "/about" },
      ],
    },
  ];

  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="font-display text-2xl">{settings.siteName ?? "Luxury Pyramids View"}</p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/60">
              {settings.address ?? "Giza, Egypt"}
            </p>
            <p className="mt-2 text-sm text-white/60">{settings.phone ?? ""}</p>
            <p className="text-sm text-white/60">{settings.email ?? ""}</p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <p className="eyebrow mb-5">{col.title}</p>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/70 transition hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/50 md:flex-row">
          <p>
            © {new Date().getFullYear()} {settings.siteName ?? "Luxury Pyramids View"} — Demo site
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms
            </Link>
            <Link href="/cancellation-policy" className="hover:text-white">
              Cancellation
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}