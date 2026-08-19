import { NextResponse } from "next/server";
import { staffLogin } from "@/services/auth.service";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email : "";
  const password = typeof body?.password === "string" ? body.password : "";

  const result = await staffLogin(email, password);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 401 });
  }

  return NextResponse.json({ staff: { id: result.staff.id, name: result.staff.name, role: result.staff.role } });
}