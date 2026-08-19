import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SESSION_COOKIE = "lpv_session";
const STAFF_SESSION_COOKIE = "lpv_staff_session";

const secret = () => new TextEncoder().encode(process.env.AUTH_SECRET ?? "insecure-dev-secret");

export type CustomerSession = {
  userId: string;
  email: string;
  name: string;
};

export type StaffSession = {
  staffId: string;
  email: string;
  role: string;
  name: string;
};

function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  };
}

export async function createCustomerSession(payload: CustomerSession) {
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret());

  (await cookies()).set(SESSION_COOKIE, token, cookieOptions());
}

export async function createStaffSession(payload: StaffSession) {
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret());

  (await cookies()).set(STAFF_SESSION_COOKIE, token, cookieOptions());
}

export async function getCustomerSession(): Promise<CustomerSession | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return payload as unknown as CustomerSession;
  } catch {
    return null;
  }
}

export async function getStaffSession(): Promise<StaffSession | null> {
  const store = await cookies();
  const token = store.get(STAFF_SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return payload as unknown as StaffSession;
  } catch {
    return null;
  }
}

export async function destroyCustomerSession() {
  (await cookies()).set(SESSION_COOKIE, "", { ...cookieOptions(), maxAge: 0 });
}

export async function destroyStaffSession() {
  (await cookies()).set(STAFF_SESSION_COOKIE, "", { ...cookieOptions(), maxAge: 0 });
}