import { NextResponse } from "next/server";
import { register } from "@/services/auth.service";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const result = await register(body);

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ user: result.user });
}