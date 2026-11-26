import { Suspense } from "react";
import { sql } from "@/lib/db";
import Calculator, { type CalcApp } from "@/app/components/Calculator";

async function Loader() {
  const rows = await sql`
    SELECT id, name, category, price_usd, price_inr FROM apps
    WHERE price_usd IS NOT NULL AND price_inr IS NOT NULL
    ORDER BY name`;
  const apps: CalcApp[] = rows.map((r) => ({
    id: r.id as number,
    name: r.name as string,
    category: r.category as string,
    usd: Number(r.price_usd),
    inr: Number(r.price_inr),
  }));
  return <Calculator apps={apps} />;
}

export default function Page() {
  return (
    <main className="enter mx-auto max-w-3xl px-5 pb-16 pt-10">
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
        Subscription savings calculator
      </h1>
      <p className="mt-3 text-lg text-slate-600">
        Tick the paid apps you use and see what you could save each year.
      </p>
      <Suspense fallback={<p className="mt-6 text-slate-500">Loading...</p>}>
        <Loader />
      </Suspense>
    </main>
  );
}