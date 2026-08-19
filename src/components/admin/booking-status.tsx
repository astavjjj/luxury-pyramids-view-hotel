"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookingStatus } from "@prisma/client";

const transitions: Partial<Record<BookingStatus, BookingStatus[]>> = {
  PENDING: [BookingStatus.CONFIRMED, BookingStatus.CANCELLED],
  PAYMENT_PENDING: [BookingStatus.CONFIRMED, BookingStatus.FAILED, BookingStatus.CANCELLED],
  CONFIRMED: [BookingStatus.CHECKED_IN, BookingStatus.CANCELLED],
  CHECKED_IN: [BookingStatus.CHECKED_OUT],
  PROCESSING: [BookingStatus.CONFIRMED, BookingStatus.CANCELLED],
  CHECKED_OUT: [],
  CANCELLED: [],
  REFUNDED: [],
  FAILED: [],
  NO_SHOW: [],
};

export function BookingStatusControl({ id, current }: { id: string; current: BookingStatus }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const allowed = transitions[current] ?? [];

  async function onStatus(next: BookingStatus) {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Update failed");
        setLoading(false);
        return;
      }
      router.refresh();
      setLoading(false);
    } catch {
      setError("Update failed");
      setLoading(false);
    }
  }

  return (
    <div>
      <p className="text-[0.68rem] uppercase tracking-[0.25em] text-muted mb-3">Update status</p>
      <div className="flex flex-wrap gap-2">
        {allowed.map((s) => (
          <button
            key={s}
            type="button"
            disabled={loading}
            onClick={() => onStatus(s)}
            className="btn-lux btn-lux-line !px-4 !py-2 disabled:opacity-50"
          >
            {s}
          </button>
        ))}
      </div>
      {allowed.length === 0 && <p className="text-sm text-muted">Terminal status — no transitions.</p>}
      {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
    </div>
  );
}