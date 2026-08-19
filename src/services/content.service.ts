import { db } from "@/lib/db";

export type SiteSettings = Record<string, string>;

export async function getSiteSettings(): Promise<SiteSettings> {
  const rows = await db.siteSetting.findMany();
  const out: SiteSettings = {};
  for (const row of rows) {
    if (typeof row.value === "string") out[row.key] = row.value;
    else if (row.value && typeof row.value === "object") {
      // Values may be stored as JSON strings.
      try {
        const parsed = JSON.parse(row.value as unknown as string);
        if (typeof parsed === "string") out[row.key] = parsed;
      } catch {
        // keep raw
      }
    }
  }
  return out;
}

export async function getPublishedPage(slug: string) {
  return db.page.findFirst({
    where: { slug, status: "PUBLISHED" },
  });
}

export async function listPublishedPages() {
  return db.page.findMany({ where: { status: "PUBLISHED" } });
}