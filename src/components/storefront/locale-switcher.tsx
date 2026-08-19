"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Globe } from "lucide-react";

export function LocaleSwitcher({ current }: { current: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function setLocale(locale: string) {
    await fetch("/api/locale", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locale }),
    });
    setOpen(false);
    router.refresh();
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-xs uppercase tracking-widest opacity-80 transition hover:opacity-100"
        aria-label={current}
      >
        <Globe size={14} />
        <span className="hidden sm:inline">EN / AR</span>
      </button>
      {open && (
        <div className="absolute right-0 top-8 flex flex-col border border-white/20 bg-ink py-1 text-xs uppercase tracking-widest">
          <button
            type="button"
            onClick={() => setLocale("en")}
            className="px-4 py-2 text-left hover:bg-white/10"
          >
            English
          </button>
          <button
            type="button"
            onClick={() => setLocale("ar")}
            className="px-4 py-2 text-left hover:bg-white/10"
          >
            العربية
          </button>
        </div>
      )}
    </div>
  );
}