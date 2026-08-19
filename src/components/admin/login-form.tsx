"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Invalid credentials");
        setLoading(false);
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Something went wrong");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5">
      <label className="block">
        <span className="mb-2 block text-[0.68rem] uppercase tracking-[0.2em] text-muted">Email</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="field-input"
          required
        />
      </label>
      <label className="block">
        <span className="mb-2 block text-[0.68rem] uppercase tracking-[0.2em] text-muted">
          Password
        </span>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="field-input"
          required
        />
      </label>
      {error && <p className="text-sm text-red-700">{error}</p>}
      <button type="submit" disabled={loading} className="btn-lux btn-lux-solid disabled:opacity-60">
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}