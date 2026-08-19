import Link from "next/link";
import { User } from "lucide-react";
import type { Dictionary } from "@/lib/i18n/dictionary";

export function AccountButton({ dict, signedIn }: { dict: Dictionary; signedIn: boolean }) {
  if (signedIn) {
    return (
      <Link
        href="/account"
        className="flex items-center gap-1.5 text-xs uppercase tracking-widest opacity-80 transition hover:opacity-100"
      >
        <User size={14} />
        <span className="hidden sm:inline">{dict.nav.account}</span>
      </Link>
    );
  }
  return (
    <Link
      href="/auth/login"
      className="flex items-center gap-1.5 text-xs uppercase tracking-widest opacity-80 transition hover:opacity-100"
    >
      <User size={14} />
      <span className="hidden sm:inline">{dict.nav.signIn}</span>
    </Link>
  );
}