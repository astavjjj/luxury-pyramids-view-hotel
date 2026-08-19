import { NextResponse } from "next/server";
import { getCurrentStaff } from "@/services/auth.service";
import { updateRoom, deleteRoom } from "@/repositories/room.repository";
import { BedType, Currency } from "@prisma/client";
import { z } from "zod";
import { db } from "@/lib/db";

const roomSchema = z.object({
  name: z.string().min(2).optional(),
  nameAr: z.string().nullable().optional(),
  description: z.string().min(10).optional(),
  descriptionAr: z.string().nullable().optional(),
  sizeSqm: z.coerce.number().int().min(8).optional(),
  bedType: z.nativeEnum(BedType).optional(),
  maxGuests: z.coerce.number().int().min(1).max(8).optional(),
  view: z.string().nullable().optional(),
  image: z.string().nullable().optional(),
  pricePerNight: z.coerce.number().positive().optional(),
  currency: z.nativeEnum(Currency).optional(),
  active: z.boolean().optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const staff = await getCurrentStaff().catch(() => null);
  if (!staff) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = roomSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const data = parsed.data;
  const { pricePerNight, currency, ...rest } = data;

  const room = await updateRoom(id, rest as Record<string, unknown>);

  if (pricePerNight !== undefined || currency !== undefined) {
    await db.rate.upsert({
      where: { roomId: id },
      update: {
        ...(pricePerNight !== undefined ? { basePrice: pricePerNight } : {}),
        ...(currency !== undefined ? { currency } : {}),
      },
      create: { roomId: id, basePrice: pricePerNight ?? Number(room.pricePerNight), currency: currency ?? room.currency, minStay: 1 },
    });
  }

  return NextResponse.json({ room });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const staff = await getCurrentStaff().catch(() => null);
  if (!staff) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await deleteRoom(id);
  return NextResponse.json({ ok: true });
}