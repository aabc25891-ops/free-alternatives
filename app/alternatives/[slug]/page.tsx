import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { sql } from "@/lib/db";
import { castVote } from "@/app/actions";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ filter?: string }>;
};

const pills = [
  { key: "", label: "All" },
  { key: "open", label: "Open Source" },
  { key: "nosignup", label: "No Sign-Up" },
];

async function Alternatives({ params, searchParams }: Props) {
  const { slug } = await params;
  const { filter = "" } = await searchParams;
  const apps = await sql`SELECT id, name FROM apps WHERE slug = ${slug}`;
  if (apps.length === 0) notFound();
  const app = apps[0];
  const alts = await sql`
    SELECT a.*,
      COUNT(v.id) FILTER (WHERE v.vote = 'free') AS free_votes,
      COUNT(v.id) FILTER (WHERE v.vote = 'paywall') AS paywall_votes
    FROM alternatives a
    LEFT JOIN votes v ON v.alternative_id = a.id
    WHERE a.app_id = ${app.id}
    GROUP BY a.id
    ORDER BY a.name`;

  const shown = alts.filter((a) =>
    filter === "open" ? a.open_source : filter === "nosignup" ? a.no_signup : true
  );

  return (
    <>
      <h1 className="text-2xl font-bold text-gray-900 sm:text-4xl">
        Free alternatives to {app.name}
      </h1>

      <div className="mt-4 flex flex-wrap gap-2">
        {pills.map((p) => (
          <Link
            key={p.label}
            href={p.key ? `/alternatives/${slug}?filter=${p.key}` : `/alternatives/${slug}`}
            className={`rounded-full px-4 py-1 text-sm font-semibold ${
              filter === p.key ? "bg-green-600 text-white" : "bg-white text-gray-700 shadow"
            }`}
          >
            {p.label}
          </Link>
        ))}
      </div>

      {shown.length === 0 && (
        <p className="mt-6 text-gray-500">No tools match this filter.</p>
      )}

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {shown.map((a) => (
          <div key={a.id} className="rounded-lg bg-white p-5 shadow">
            <p className="text-lg font-semibold text-gray-900">{a.name}</p>
            <p className="text-gray-600">{a.pitch}</p>
            <p className="mt-2 text-sm text-green-700">{a.free_limit}</p>
            <p className="text-sm text-gray-500">{a.platforms.join(" · ")}</p>
            <p className="mt-2 text-sm text-gray-700">
              ✅ {Number(a.free_votes)} still free · 🚩 {Number(a.paywall_votes)} paywall
            </p>
            <form action={castVote} className="mt-3 flex flex-wrap gap-2">
              <input type="hidden" name="alternativeId" value={a.id} />
              <input type="hidden" name="slug" value={slug} />
              <button
                name="vote"
                value="free"
                className="rounded-lg border border-green-600 px-3 py-1 text-sm text-green-700"
              >
                ✅ Still Free
              </button>
              <button
                name="vote"
                value="paywall"
                className="rounded-lg border border-red-500 px-3 py-1 text-sm text-red-600"
              >
                🚩 Hidden Paywall
              </button>
            </form>
            <a
              href={a.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block rounded-lg bg-green-600 px-4 py-2 font-semibold text-white"
            >
              Launch Free Tool ↗
            </a>
          </div>
        ))}
      </div>
    </>
  );
}

export default function Page({ params, searchParams }: Props) {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 max-w-5xl mx-auto">
      <Link href="/" className="text-sm text-gray-500">← Back</Link>
      <div className="mt-4">
        <Suspense fallback={<p className="text-gray-500">Loading...</p>}>
          <Alternatives params={params} searchParams={searchParams} />
        </Suspense>
      </div>
    </main>
  );
}