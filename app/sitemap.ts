import type { MetadataRoute } from "next";
import { sql } from "@/lib/db";

const BASE =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://free-alternativess-huin.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const rows = await sql`SELECT slug FROM apps`;
  return [
    { url: BASE, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/calculator`, changeFrequency: "monthly", priority: 0.8 },
    ...rows.map((r) => ({
      url: `${BASE}/alternatives/${r.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}