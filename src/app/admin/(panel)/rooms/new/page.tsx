import Link from "next/link";
import { RoomForm } from "@/components/admin/room-form";

export const dynamic = "force-dynamic";

export default function AdminNewRoomPage() {
  return (
    <div>
      <Link href="/admin/rooms" className="text-sm text-muted underline underline-offset-4">
        ← Rooms
      </Link>
      <h1 className="font-display text-4xl mt-6">New room</h1>
      <div className="mt-10">
        <RoomForm />
      </div>
    </div>
  );
}