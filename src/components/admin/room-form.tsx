"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BedType, Currency } from "@prisma/client";

type RoomFormValues = {
  id?: string;
  name: string;
  nameAr: string;
  slug: string;
  description: string;
  descriptionAr: string;
  sizeSqm: number;
  bedType: string;
  maxGuests: number;
  view: string;
  image: string;
  pricePerNight: number;
  currency: string;
  active: boolean;
};

export function RoomForm({ initial }: { initial?: Partial<RoomFormValues> }) {
  const router = useRouter();
  const isEdit = Boolean(initial?.id);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<RoomFormValues>({
    name: initial?.name ?? "",
    nameAr: initial?.nameAr ?? "",
    slug: initial?.slug ?? "",
    description: initial?.description ?? "",
    descriptionAr: initial?.descriptionAr ?? "",
    sizeSqm: initial?.sizeSqm ?? 30,
    bedType: initial?.bedType ?? BedType.KING,
    maxGuests: initial?.maxGuests ?? 2,
    view: initial?.view ?? "",
    image: initial?.image ?? "/media/demo/deluxe.svg",
    pricePerNight: initial?.pricePerNight ?? 200,
    currency: initial?.currency ?? Currency.USD,
    active: initial?.active ?? true,
  });

  function update<K extends keyof RoomFormValues>(key: K) {
    return (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    ) => {
      const value = e.target.type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : e.target.value;
      setForm((f) => ({ ...f, [key]: value }));
    };
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(
        isEdit ? `/api/admin/rooms/${initial?.id}` : "/api/admin/rooms",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not save room");
        setLoading(false);
        return;
      }
      router.push("/admin/rooms");
      router.refresh();
    } catch {
      setError("Could not save room");
      setLoading(false);
    }
  }

  const inputCls = "field-input";
  const labelCls = "mb-2 block text-[0.68rem] uppercase tracking-[0.2em] text-muted";

  return (
    <form onSubmit={onSubmit} className="grid gap-5 max-w-3xl">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className={labelCls}>Name</span>
          <input value={form.name} onChange={update("name")} className={inputCls} required />
        </label>
        <label className="block">
          <span className={labelCls}>Name (Arabic)</span>
          <input value={form.nameAr} onChange={update("nameAr")} className={inputCls} />
        </label>
        <label className="block">
          <span className={labelCls}>Slug</span>
          <input value={form.slug} onChange={update("slug")} className={inputCls} required />
        </label>
        <label className="block">
          <span className={labelCls}>View</span>
          <input value={form.view} onChange={update("view")} className={inputCls} />
        </label>
      </div>

      <label className="block">
        <span className={labelCls}>Description</span>
        <textarea
          value={form.description}
          onChange={update("description")}
          className={`${inputCls} min-h-24`}
          required
        />
      </label>
      <label className="block">
        <span className={labelCls}>Description (Arabic)</span>
        <textarea value={form.descriptionAr} onChange={update("descriptionAr")} className={`${inputCls} min-h-24`} />
      </label>

      <div className="grid gap-5 sm:grid-cols-4">
        <label className="block">
          <span className={labelCls}>Size (m²)</span>
          <input type="number" value={form.sizeSqm} onChange={update("sizeSqm")} className={inputCls} required />
        </label>
        <label className="block">
          <span className={labelCls}>Max guests</span>
          <input type="number" value={form.maxGuests} onChange={update("maxGuests")} className={inputCls} required />
        </label>
        <label className="block">
          <span className={labelCls}>Bed</span>
          <select value={form.bedType} onChange={update("bedType")} className={inputCls}>
            {Object.values(BedType).map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className={labelCls}>Price / night</span>
          <input type="number" step="0.01" value={form.pricePerNight} onChange={update("pricePerNight")} className={inputCls} required />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className={labelCls}>Currency</span>
          <select value={form.currency} onChange={update("currency")} className={inputCls}>
            {Object.values(Currency).map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className={labelCls}>Image path</span>
          <input value={form.image} onChange={update("image")} className={inputCls} />
        </label>
      </div>

      <label className="flex items-center gap-3 text-sm">
        <input
          type="checkbox"
          checked={form.active}
          onChange={update("active") as (e: React.ChangeEvent<HTMLInputElement>) => void}
        />
        Active
      </label>

      {error && <p className="text-sm text-red-700">{error}</p>}

      <div className="flex gap-4">
        <button type="submit" disabled={loading} className="btn-lux btn-lux-solid disabled:opacity-60">
          {loading ? "Saving…" : isEdit ? "Save changes" : "Create room"}
        </button>
        <a href="/admin/rooms" className="btn-lux btn-lux-line">Cancel</a>
      </div>
    </form>
  );
}