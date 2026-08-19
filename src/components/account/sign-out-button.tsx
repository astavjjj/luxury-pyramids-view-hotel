"use client";

import { useRouter } from "next/navigation";

export function SignOutButton() {
  const router = useRouter();

  async function onSignOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <button type="button" onClick={onSignOut} className="btn-lux btn-lux-line">
      Sign out
    </button>
  );
}