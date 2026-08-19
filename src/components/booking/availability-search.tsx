"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Users } from "lucide-react";

type Props = {
  roomSlug?: string;
  compact?: boolean;
};

export function AvailabilitySearch({ roomSlug, compact = false }: Props) {
  const router = useRouter();
  const today = new Date().toISOString().slice(0, 10);
  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!checkIn || !checkOut) {
      setError("Select check-in and check-out dates");
      return;
    }
    if (new Date(checkOut).getTime() <= new Date(checkIn).getTime()) {
      setError("Check-out must be after check-in");
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams({
        checkIn,
        checkOut,
        adults: String(adults),
        children: String(children),
        rooms: "1",
      });
      if (roomSlug) params.set("room", roomSlug);

      const res = await fetch(`/api/booking/availability?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong");
        setLoading(false);
        return;
      }

      router.push(
        `/booking?checkIn=${checkIn}&checkOut=${checkOut}&adults=${adults}&children=${children}`,
      );
    } catch {
      setError("Could not check availability");
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className={`grid items-end gap-4 ${compact ? "" : "md:grid-cols-[1fr_1fr_0.7fr_0.7fr_auto]"}`}
    >
      <label className="block">
        <span className="mb-2 flex items-center gap-2 text-[0.68rem] uppercase tracking-[0.2em] text-muted">
          <Calendar size={13} /> Check-in
        </span>
        <input
          type="date"
          value={checkIn}
          min={today}
          onChange={(e) => setCheckIn(e.target.value)}
          className="field-input"
          required
        />
      </label>

      <label className="block">
        <span className="mb-2 flex items-center gap-2 text-[0.68rem] uppercase tracking-[0.2em] text-muted">
          <Calendar size={13} /> Check-out
        </span>
        <input
          type="date"
          value={checkOut}
          min={checkIn}
          onChange={(e) => setCheckOut(e.target.value)}
          className="field-input"
          required
        />
      </label>

      <label className="block">
        <span className="mb-2 flex items-center gap-2 text-[0.68rem] uppercase tracking-[0.2em] text-muted">
          <Users size={13} /> Adults
        </span>
        <select value={adults} onChange={(e) => setAdults(Number(e.target.value))} className="field-input">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="mb-2 flex items-center gap-2 text-[0.68rem] uppercase tracking-[0.2em] text-muted">
          <Users size={13} /> Children
        </span>
        <select value={children} onChange={(e) => setChildren(Number(e.target.value))} className="field-input">
          {[0, 1, 2, 3, 4].map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </label>

      <button
        type="submit"
        disabled={loading}
        className="btn-lux btn-lux-solid disabled:opacity-60"
      >
        {loading ? "Checking…" : "Check availability"}
      </button>

      {error && (
        <p className="text-sm text-red-700 md:col-span-full">{error}</p>
      )}
    </form>
  );
}