import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

const roomInclude = {
  amenities: { include: { amenity: true } },
  rate: true,
  reviews: { where: { approved: true } },
} satisfies Prisma.RoomInclude;

export type RoomWithRelations = Prisma.RoomGetPayload<{ include: typeof roomInclude }>;

export async function listRooms(activeOnly = true) {
  return db.room.findMany({
    where: activeOnly ? { active: true } : undefined,
    include: roomInclude,
    orderBy: { pricePerNight: "asc" },
  });
}

export async function getRoomBySlug(slug: string) {
  return db.room.findUnique({
    where: { slug },
    include: roomInclude,
  });
}

export async function getRoomsByIds(ids: string[]) {
  return db.room.findMany({
    where: { id: { in: ids }, active: true },
    include: roomInclude,
  });
}

export async function createRoom(data: Prisma.RoomCreateInput) {
  return db.room.create({ data });
}

export async function updateRoom(id: string, data: Prisma.RoomUpdateInput) {
  return db.room.update({ where: { id }, data });
}

export async function deleteRoom(id: string) {
  return db.room.delete({ where: { id } });
}

export async function listAmenities() {
  return db.amenity.findMany({ orderBy: { name: "asc" } });
}