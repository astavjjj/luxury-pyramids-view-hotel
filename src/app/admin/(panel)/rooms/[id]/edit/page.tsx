import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { RoomForm } from "@/components/admin/room-form";

export const dynamic = "force-dynamic";

export default async function AdminEditRoomPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const room = await db.room.findUnique({ where: { id } });
  if (!room) notFound();

  return (
    <div>
      <Link href="/admin/rooms" className="text-sm text-muted underline underline-offset-4">
        ← Rooms
      </Link>
      <h1 className="font-display text-4xl mt-6">Edit room</h1>
      <div className="mt-10">
        <RoomForm
          initial={{
            id: room.id,
            name: room.name,
            nameAr: room.nameAr ?? "",
            slug: room.slug,
            description: room.description,
            descriptionAr: room.descriptionAr ?? "",
            sizeSqm: room.sizeSqm,
            bedType: room.bedType,
            maxGuests: room.maxGuests,
            view: room.view ?? "",
            image: room.image ?? "",
            pricePerNight: Number(room.pricePerNight),
            currency: room.currency,
            active: room.active,
          }}
        />
      </div>
    </div>
  );
}