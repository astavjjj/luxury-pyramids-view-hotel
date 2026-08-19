"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, Users } from "lucide-react";
import { formatPrice } from "@/lib/utils";

type AvailableRoom = {
  id: string;
  slug: string;
  name: string;
  image: string | null;
  sizeSqm: number;
  maxGuests: number;
  bedType: string;
  view: string | null;
  amenities: { name: string }[];
  perNight: number;
  total: number;
  currency: string;
};

export function BookingSearch() {
  const today = new Date().toISOString().slice(0, 10);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nights, setNights] = useState<number | null>(null);
  const [results, setResults] = useState<AvailableRoom[] | null>(null);

  async function onSearch(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResults(null);

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
      const res = await fetch(`/api/booking/availability?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong");
        setLoading(false);
        return;
      }
      setNights(data.nights);
      setResults(data.rooms);
    } catch {
      setError("Could not check availability");
    } finally {
      setLoading(false);
    }
  }

  const query = `checkIn=${checkIn}&checkOut=${checkOut}&adults=${adults}&children=${children}`;

  return (
    <div>
      <form
        onSubmit={onSearch}
        className="grid gap-4 border border-line bg-white p-6 md:grid-cols-[1fr_1fr_0.7fr_0.7fr_auto] md:items-end"
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
        <button type="submit" disabled={loading} className="btn-lux btn-lux-solid disabled:opacity-60">
          {loading ? "Checking…" : "Search"}
        </button>
        {error && <p className="text-sm text-red-700 md:col-span-full">{error}</p>}
      </form>

      {results && (
        <div className="mt-12">
          <p className="mb-8 text-sm text-muted">
            {results.length} room type{nights !== null ? ` · ${nights} nights` : ""}
          </p>

          {results.length === 0 && (
            <p className="border border-line bg-white p-10 text-center text-muted">
              No rooms available for these dates. Try different dates or group size.
            </p>
          )}

          <div className="grid gap-6">
            {results.map((room) => (
              <div
                key={room.id}
                className="grid gap-6 border border-line bg-white p-6 md:grid-cols-[220px_1fr_auto] md:items-center"
              >
                <img
                  src={room.image ?? "/media/demo/deluxe.svg"}
                  alt={room.name}
                  className="aspect-[4/3] w-full object-cover md:aspect-square"
                />
                <div>
                  <h2 className="font-display text-2xl">{room.name}</h2>
                  <p className="mt-1 text-sm text-muted">
                    {room.sizeSqm} m² · up to {room.maxGuests} guests · {room.bedType.toLowerCase()} bed
                  </p>
                  {room.view && (
                    <p className="mt-1 text-xs uppercase tracking-widest text-bronze">{room.view}</p>
                  )}
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {room.amenities.slice(0, 4).map((a) => (
                      <li
                        key={a.name}
                        className="border border-line px-2.5 py-1 text-xs text-muted"
                      >
                        {a.name}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted">
                    {formatPrice(room.perNight, room.currency)} / night
                  </p>
                  <p className="font-display text-3xl mt-1">
                    {formatPrice(room.total, room.currency)}
                  </p>
                  <Link
                    href={`/booking/checkout?${query}&roomId=${room.id}`}
                    className="btn-lux btn-lux-solid mt-4"
                  >
                    Select
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}