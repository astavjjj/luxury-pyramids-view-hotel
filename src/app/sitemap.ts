import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { withFallback } from "@/lib/data";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const rooms = await withFallback(
    () => db.room.findMany({ where: { active: true }, select: { slug: true } }),
    [],
  );

  const staticRoutes = [
    "",
    "/rooms",
    "/suites",
    "/offers",
    "/spa",
    "/dining",
    "/experiences",
    "/gallery",
    "/about",
    "/contact",
    "/location",
    "/booking",
  ];

  return [
    ...staticRoutes.map((path) => ({
      url: `${base}${path}`,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.7,
    })),
    ...rooms.map((room) => ({
      url: `${base}/rooms/${room.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}