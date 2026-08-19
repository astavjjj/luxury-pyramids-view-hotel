import Link from "next/link";
import type { Dictionary } from "@/lib/i18n/dictionary";
import { LocaleSwitcher } from "@/components/storefront/locale-switcher";
import { AccountButton } from "@/components/storefront/account-button";

const navLinks = ["home", "rooms", "suites", "offers", "spa", "experiences", "contact"] as const;

const paths: Record<(typeof navLinks)[number], string> = {
  home: "/",
  rooms: "/rooms",
  suites: "/suites",
  offers: "/offers",
  spa: "/spa",
  experiences: "/experiences",
  contact: "/contact",
};

export function Header({
  dict,
  settings,
  signedIn,
}: {
  dict: Dictionary;
  settings: Record<string, string>;
  signedIn: boolean;
}) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-ink/80 text-white backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:h-20">
        <Link href="/" className="font-display text-xl tracking-wide md:text-2xl">
          {settings.siteName ?? "Luxury Pyramids View"}
        </Link>

        <nav className="hidden items-center gap-7 text-[0.72rem] uppercase tracking-[0.2em] lg:flex">
          {navLinks.map((key) => (
            <Link key={key} href={paths[key]} className="opacity-80 transition hover:opacity-100">
              {dict.nav[key]}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LocaleSwitcher current={dict.common.language} />
          <AccountButton dict={dict} signedIn={signedIn} />
          <Link
            href="/booking"
            className="hidden border border-white/40 px-5 py-2.5 text-[0.68rem] uppercase tracking-[0.25em] transition hover:bg-white hover:text-ink md:inline-flex"
          >
            {dict.nav.booking}
          </Link>
        </div>
      </div>
    </header>
  );
}