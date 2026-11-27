import { Suspense } from "react";
import { sql } from "@/lib/db";
import AppBrowser, { type AppCard } from "./components/AppBrowser";

async function Loader() {
  const rows = await sql`
    SELECT a.id, a.name, a.slug, a.category, a.domain, a.price_usd, a.price_inr,
      COUNT(alt.id)::int AS alt_count
    FROM apps a
    LEFT JOIN alternatives alt ON alt.app_id = a.id
    GROUP BY a.id
    ORDER BY a.id`;

  const apps: AppCard[] = rows.map((r) => ({
    id: r.id as number,
    name: r.name as string,
    slug: r.slug as string,
    category: r.category as string,
    domain: (r.domain as string | null) ?? null,
    usd: r.price_usd == null ? null : Number(r.price_usd),
    inr: r.price_inr == null ? null : Number(r.price_inr),
    count: r.alt_count as number,
  }));

  return <AppBrowser apps={apps} />;
}

export default function Home() {
  return (
    <main>
      <Suspense
        fallback={<p className="p-10 text-center text-slate-500">Loading...</p>}
      >
        <Loader />
      </Suspense>
    </main>
  );
}