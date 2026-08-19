import Link from "next/link";
import type { RoomWithRelations } from "@/repositories/room.repository";
import { formatPrice } from "@/lib/utils";

export function RoomCard({ room }: { room: RoomWithRelations }) {
  return (
    <Link href={`/rooms/${room.slug}`} className="group block">
      <div className="overflow-hidden bg-sand-deep">
        <img
          src={room.image ?? "/media/demo/deluxe.svg"}
          alt={room.name}
          className="image-soft aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-[1.04]"
        />
      </div>
      <div className="flex items-start justify-between gap-4 pt-5">
        <div>
          <h3 className="font-display text-2xl">{room.name}</h3>
          <p className="mt-1 text-sm text-muted">
            {room.sizeSqm} m² · {room.maxGuests} guests
          </p>
          {room.view && <p className="mt-1 text-xs uppercase tracking-widest text-bronze">{room.view}</p>}
        </div>
        <p className="whitespace-nowrap text-sm">
          <span className="text-muted">from</span>{" "}
          <span className="font-medium">{formatPrice(Number(room.pricePerNight), room.currency)}</span>
          <span className="text-muted"> / night</span>
        </p>
      </div>
    </Link>
  );
}