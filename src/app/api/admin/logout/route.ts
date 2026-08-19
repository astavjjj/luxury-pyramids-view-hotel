import { NextResponse } from "next/server";
import { staffLogout } from "@/services/auth.service";

export async function POST() {
  await staffLogout();
  return NextResponse.json({ ok: true });
}