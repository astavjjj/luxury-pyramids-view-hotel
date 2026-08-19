import { z } from "zod";

function firstError(error: z.ZodError) {
  return error.issues[0]?.message ?? "Invalid input";
}

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const availabilitySchema = z.object({
  checkIn: z.string().refine((v) => !isNaN(Date.parse(v)), "Invalid date"),
  checkOut: z.string().refine((v) => !isNaN(Date.parse(v)), "Invalid date"),
  adults: z.coerce.number().int().min(1).max(8).default(2),
  children: z.coerce.number().int().min(0).max(6).default(0),
  rooms: z.coerce.number().int().min(1).max(5).default(1),
});

export const bookingSchema = z.object({
  checkIn: z.string().refine((v) => !isNaN(Date.parse(v)), "Invalid date"),
  checkOut: z.string().refine((v) => !isNaN(Date.parse(v)), "Invalid date"),
  roomIds: z.array(z.string()).min(1),
  adults: z.coerce.number().int().min(1).max(8).default(2),
  children: z.coerce.number().int().min(0).max(6).default(0),
  guestName: z.string().min(2),
  guestEmail: z.string().email(),
  guestPhone: z.string().optional(),
  guestAddress: z.string().optional(),
  specialRequests: z.string().max(1000).optional(),
});

export { firstError };