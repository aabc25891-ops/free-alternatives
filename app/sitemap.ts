import type { MetadataRoute } from "next";
import { sql } from "@/lib/db";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const rows = await sql`SELECT slug FROM apps`;
  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/calculator`, changeFrequency: "monthly", priority: 0.8 },
    ...rows.map((r) => ({
      url: `${SITE_URL}/alternatives/${r.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}