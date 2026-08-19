import { NextResponse } from "next/server";
import { login } from "@/services/auth.service";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const result = await login(body);

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 401 });
  }

  return NextResponse.json({ user: result.user });
}