import { db } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import {
  createCustomerSession,
  destroyCustomerSession,
  getCustomerSession,
  getStaffSession,
  createStaffSession,
  destroyStaffSession,
} from "@/lib/auth/session";
import * as userRepo from "@/repositories/user.repository";
import { loginSchema, registerSchema, firstError } from "@/lib/validation";

export async function register(input: unknown) {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: firstError(parsed.error) };
  }

  const { name, email, password } = parsed.data;
  const existing = await userRepo.findByEmail(email);
  if (existing) {
    return { ok: false as const, error: "An account with this email already exists" };
  }

  const passwordHash = await hashPassword(password);
  const user = await userRepo.createUser({
    name,
    email: email.toLowerCase(),
    passwordHash,
  });

  await createCustomerSession({ userId: user.id, email: user.email, name: user.name });
  return { ok: true as const, user: { id: user.id, name: user.name, email: user.email } };
}

export async function login(input: unknown) {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: firstError(parsed.error) };
  }

  const { email, password } = parsed.data;
  const user = await userRepo.findByEmail(email);
  if (!user || !user.passwordHash) {
    return { ok: false as const, error: "Invalid email or password" };
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return { ok: false as const, error: "Invalid email or password" };
  }

  await createCustomerSession({ userId: user.id, email: user.email, name: user.name });
  return { ok: true as const, user: { id: user.id, name: user.name, email: user.email } };
}

export async function logout() {
  await destroyCustomerSession();
}

export async function getCurrentUser() {
  const session = await getCustomerSession();
  if (!session) return null;
  return userRepo.findByEmail(session.email);
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("AUTH_REQUIRED");
  }
  return user;
}

export async function staffLogin(email: string, password: string) {
  const staff = await db.staff.findUnique({ where: { email: email.toLowerCase() } });
  if (!staff || !staff.active) return { ok: false as const, error: "Invalid credentials" };
  const valid = await verifyPassword(password, staff.passwordHash);
  if (!valid) return { ok: false as const, error: "Invalid credentials" };

  await createStaffSession({
    staffId: staff.id,
    email: staff.email,
    role: staff.role,
    name: staff.name,
  });
  return { ok: true as const, staff };
}

export async function getCurrentStaff() {
  const session = await getStaffSession();
  if (!session) return null;
  return db.staff.findUnique({ where: { id: session.staffId } });
}

export async function requireStaff() {
  const staff = await getCurrentStaff();
  if (!staff) throw new Error("STAFF_REQUIRED");
  return staff;
}

export async function staffLogout() {
  await destroyStaffSession();
}

export { getCustomerSession };