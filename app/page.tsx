import { Suspense } from "react";
import Link from "next/link";
import { sql } from "@/lib/db";

type Props = { searchParams: Promise<{ q?: string }> };

async function AppList({ searchParams }: Props) {
  const { q = "" } = await searchParams;
  const like = `%${q}%`;
  const apps = await sql`
    SELECT name, slug, category FROM apps
    WHERE name ILIKE ${like} OR category ILIKE ${like}
    ORDER BY name`;

  if (apps.length === 0) {
    return <p className="mt-8 text-gray-500">No apps found. Try another name.</p>;
  }

  return (
    <ul className="mt-8 grid w-full max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {apps.map((a) => (
        <li key={a.slug}>
          <Link
            href={`/alternatives/${a.slug}`}
            className="block rounded-lg bg-white p-4 shadow hover:shadow-md"
          >
            <p className="font-semibold text-gray-900">{a.name}</p>
            <p className="text-sm text-gray-500">{a.category}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function Home({ searchParams }: Props) {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-10 sm:px-6 sm:pt-20">
      <h1 className="text-3xl font-bold text-gray-900 text-center sm:text-5xl">
        Stop paying for software
      </h1>
      <p className="mt-3 text-base text-gray-600 text-center sm:text-xl">
        Find free alternatives to any paid app.
      </p>
      <form action="/" className="mt-6 flex w-full max-w-xl gap-2">
        <input
          name="q"
          placeholder="Search Photoshop, Notion..."
          className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900"
        />
        <button className="rounded-lg bg-green-600 px-5 py-3 font-semibold text-white">
          Search
        </button>
      </form>
      <Link href="/calculator" className="mt-4 text-sm font-semibold text-green-700">
        How much can you save? Try the calculator →
      </Link>
      <Suspense fallback={<p className="mt-8 text-gray-500">Loading...</p>}>
        <AppList searchParams={searchParams} />
      </Suspense>
    </main>
  );
}