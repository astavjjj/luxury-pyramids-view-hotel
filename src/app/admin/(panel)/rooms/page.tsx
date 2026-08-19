import Link from "next/link";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminRoomsPage() {
  const rooms = await db.room.findMany({
    include: { rate: true, amenities: { include: { amenity: true } } },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl">Rooms</h1>
          <p className="mt-2 text-sm text-muted">Manage room inventory and pricing.</p>
        </div>
        <Link href="/admin/rooms/new" className="btn-lux btn-lux-solid">
          Add room
        </Link>
      </div>

      <div className="mt-10 grid gap-3">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="flex flex-wrap items-center justify-between gap-4 border border-line bg-white p-5"
          >
            <div className="flex items-center gap-4">
              <img src={room.image ?? "/media/demo/deluxe.svg"} alt="" className="h-16 w-20 object-cover" />
              <div>
                <p className="font-display text-xl">{room.name}</p>
                <p className="text-sm text-muted">
                  {room.sizeSqm} m² · {room.maxGuests} guests ·{" "}
                  {formatPrice(Number(room.rate?.basePrice ?? room.pricePerNight), room.rate?.currency ?? room.currency)}
                  {" "}/ night
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className={`text-xs uppercase tracking-widest ${room.active ? "text-green-700" : "text-red-700"}`}>
                {room.active ? "Active" : "Inactive"}
              </span>
              <Link href={`/admin/rooms/${room.id}/edit`} className="btn-lux btn-lux-line !px-4 !py-2">
                Edit
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}