import { NextResponse } from "next/server";
import { getCurrentStaff } from "@/services/auth.service";
import { createRoom, listRooms } from "@/repositories/room.repository";
import { BedType, Currency } from "@prisma/client";
import { z } from "zod";

const roomSchema = z.object({
  name: z.string().min(2),
  nameAr: z.string().optional(),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
  description: z.string().min(10),
  descriptionAr: z.string().optional(),
  sizeSqm: z.coerce.number().int().min(8),
  bedType: z.nativeEnum(BedType).default(BedType.KING),
  maxGuests: z.coerce.number().int().min(1).max(8).default(2),
  view: z.string().optional(),
  image: z.string().optional(),
  pricePerNight: z.coerce.number().positive(),
  currency: z.nativeEnum(Currency).default(Currency.USD),
  active: z.boolean().default(true),
});

export async function GET() {
  const staff = await getCurrentStaff().catch(() => null);
  if (!staff) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rooms = await listRooms(false);
  return NextResponse.json({ rooms });
}

export async function POST(request: Request) {
  const staff = await getCurrentStaff().catch(() => null);
  if (!staff) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = roomSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const data = parsed.data;
  const room = await createRoom({
    name: data.name,
    nameAr: data.nameAr,
    slug: data.slug,
    description: data.description,
    descriptionAr: data.descriptionAr,
    sizeSqm: data.sizeSqm,
    bedType: data.bedType,
    maxGuests: data.maxGuests,
    view: data.view,
    image: data.image,
    pricePerNight: data.pricePerNight,
    currency: data.currency,
    active: data.active,
  });

  await dbRateCreate(room.id, data.pricePerNight, data.currency);

  return NextResponse.json({ room }, { status: 201 });
}

async function dbRateCreate(roomId: string, price: number, currency: Currency) {
  const { db } = await import("@/lib/db");
  await db.rate.upsert({
    where: { roomId },
    update: { basePrice: price, currency },
    create: { roomId, basePrice: price, currency, minStay: 1 },
  });
}