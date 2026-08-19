import "server-only";
import { cookies } from "next/headers";
import { dictionaries, isLocale, type Locale, type Dictionary } from "./dictionary";

const LOCALE_COOKIE = "lpv_locale";

export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const value = store.get(LOCALE_COOKIE)?.value;
  return isLocale(value) ? value : "en";
}

export async function getDictionary(): Promise<Dictionary> {
  const locale = await getLocale();
  return dictionaries[locale];
}

export async function setLocaleCookie(locale: string) {
  const store = await cookies();
  store.set(LOCALE_COOKIE, isLocale(locale) ? locale : "en", {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
}

export function getDir(locale: Locale) {
  return locale === "ar" ? "rtl" : "ltr";
}

export { dictionaries, isLocale, type Locale };