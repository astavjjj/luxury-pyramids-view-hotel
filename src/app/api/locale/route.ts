import { NextResponse } from "next/server";
import { setLocaleCookie } from "@/lib/i18n/server";

export async function POST(request: Request) {
  let locale = "en";
  try {
    const body = (await request.json()) as { locale?: string };
    locale = body.locale ?? "en";
  } catch {
    // keep default
  }

  await setLocaleCookie(locale);
  return NextResponse.json({ ok: true, locale });
}