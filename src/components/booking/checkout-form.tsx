"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";

type CheckoutProps = {
  checkIn: string;
  checkOut: string;
  adults: number;
  childCount: number;
  roomId: string;
  roomName: string;
  perNight: number;
  nights: number;
  currency: string;
  subtotal: number;
  taxes: number;
  fees: number;
  total: number;
};

export function CheckoutForm(props: CheckoutProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    guestAddress: "",
    specialRequests: "",
  });

  function update(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          checkIn: props.checkIn,
          checkOut: props.checkOut,
          roomIds: [props.roomId],
          adults: props.adults,
          children: props.childCount,
          ...form,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not create booking");
        setSubmitting(false);
        return;
      }
      router.push(`/booking/confirmation/${data.id}`);
    } catch {
      setError("Could not create booking");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="mb-2 block text-[0.68rem] uppercase tracking-[0.2em] text-muted">
            Full name
          </span>
          <input
            value={form.guestName}
            onChange={update("guestName")}
            className="field-input"
            placeholder="Jane Doe"
            required
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-[0.68rem] uppercase tracking-[0.2em] text-muted">
            Email
          </span>
          <input
            type="email"
            value={form.guestEmail}
            onChange={update("guestEmail")}
            className="field-input"
            placeholder="jane@example.com"
            required
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-[0.68rem] uppercase tracking-[0.2em] text-muted">
            Phone
          </span>
          <input
            value={form.guestPhone}
            onChange={update("guestPhone")}
            className="field-input"
            placeholder="+20 …"
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-2 block text-[0.68rem] uppercase tracking-[0.2em] text-muted">
            Address (optional)
          </span>
          <input
            value={form.guestAddress}
            onChange={update("guestAddress")}
            className="field-input"
            placeholder="City, Country"
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-2 block text-[0.68rem] uppercase tracking-[0.2em] text-muted">
            Special requests (optional)
          </span>
          <textarea
            value={form.specialRequests}
            onChange={update("specialRequests")}
            className="field-input min-h-24"
            placeholder="Arrival time, pillow preference, occasions…"
          />
        </label>
      </div>

      {error && <p className="text-sm text-red-700">{error}</p>}

      <button type="submit" disabled={submitting} className="btn-lux btn-lux-solid disabled:opacity-60">
        {submitting ? "Reserving…" : "Confirm reservation"}
      </button>

      <div className="border border-line bg-sand p-6">
        <h3 className="font-display text-xl mb-4">{props.roomName}</h3>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">Check-in</dt>
            <dd>{new Date(props.checkIn).toLocaleDateString()}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Check-out</dt>
            <dd>{new Date(props.checkOut).toLocaleDateString()}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">{props.nights} nights × {formatPrice(props.perNight, props.currency)}</dt>
            <dd>{formatPrice(props.subtotal, props.currency)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Taxes</dt>
            <dd>{formatPrice(props.taxes, props.currency)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Fees</dt>
            <dd>{formatPrice(props.fees, props.currency)}</dd>
          </div>
          <div className="flex justify-between border-t border-line pt-3 text-base font-medium">
            <dt>Total</dt>
            <dd>{formatPrice(props.total, props.currency)}</dd>
          </div>
        </dl>
        <p className="mt-4 text-xs text-muted">
          Demo booking — no payment is taken. Payment gateway integration requires provider
          credentials (see README).
        </p>
      </div>
    </form>
  );
}