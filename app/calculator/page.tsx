import { Suspense } from "react";
import Link from "next/link";
import { sql } from "@/lib/db";
import Calculator from "./Calculator";

async function Loader() {
  const rows = await sql`
    SELECT id, name, price_usd FROM apps
    WHERE price_usd IS NOT NULL ORDER BY name`;
  const apps = rows.map((r) => ({
    id: r.id as number,
    name: r.name as string,
    price_usd: Number(r.price_usd),
  }));
  return <Calculator apps={apps} />;
}

export default function Page() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 max-w-3xl mx-auto">
      <Link href="/" className="text-sm text-gray-500">← Back</Link>
      <h1 className="mt-4 text-2xl font-bold text-gray-900 sm:text-4xl">
        Subscription Savings Calculator
      </h1>
      <p className="mt-2 mb-6 text-gray-600">
        Tick the paid apps you use and see how much you save with free tools.
      </p>
      <Suspense fallback={<p className="text-gray-500">Loading...</p>}>
        <Loader />
      </Suspense>
    </main>
  );
}