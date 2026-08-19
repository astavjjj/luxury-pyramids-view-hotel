import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export async function findByEmail(email: string) {
  return db.user.findUnique({ where: { email: email.toLowerCase() } });
}

export async function createUser(data: Prisma.UserCreateInput) {
  return db.user.create({ data });
}

export async function findByGoogleId(googleId: string) {
  return db.user.findUnique({ where: { googleId } });
}

export async function updateUser(id: string, data: Prisma.UserUpdateInput) {
  return db.user.update({ where: { id }, data });
}