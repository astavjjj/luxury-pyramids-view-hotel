"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AuthForm({
  mode,
  redirectTo,
}: {
  mode: "login" | "register";
  redirectTo?: string;
}) {
  const router = useRouter();
  const isLogin = mode === "login";
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  function update(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong");
        setLoading(false);
        return;
      }
      router.push(redirectTo ?? "/account");
      router.refresh();
    } catch {
      setError("Something went wrong");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5">
      {!isLogin && (
        <label className="block">
          <span className="mb-2 block text-[0.68rem] uppercase tracking-[0.2em] text-muted">
            Full name
          </span>
          <input
            value={form.name}
            onChange={update("name")}
            className="field-input"
            placeholder="Jane Doe"
            required
          />
        </label>
      )}
      <label className="block">
        <span className="mb-2 block text-[0.68rem] uppercase tracking-[0.2em] text-muted">Email</span>
        <input
          type="email"
          value={form.email}
          onChange={update("email")}
          className="field-input"
          placeholder="jane@example.com"
          required
        />
      </label>
      <label className="block">
        <span className="mb-2 block text-[0.68rem] uppercase tracking-[0.2em] text-muted">
          Password
        </span>
        <input
          type="password"
          value={form.password}
          onChange={update("password")}
          className="field-input"
          placeholder="••••••••"
          minLength={isLogin ? 1 : 8}
          required
        />
      </label>

      {error && <p className="text-sm text-red-700">{error}</p>}

      <button type="submit" disabled={loading} className="btn-lux btn-lux-solid disabled:opacity-60">
        {loading ? "Please wait…" : isLogin ? "Sign in" : "Create account"}
      </button>
    </form>
  );
}