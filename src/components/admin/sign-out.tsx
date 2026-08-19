"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function AdminSignOut() {
  const router = useRouter();

  async function onSignOut() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={onSignOut}
      className="flex w-full items-center gap-3 px-3 py-2.5 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
    >
      <LogOut size={16} />
      Sign out
    </button>
  );
}