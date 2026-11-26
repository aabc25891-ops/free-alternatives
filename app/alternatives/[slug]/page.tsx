import { Suspense } from "react";
import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { sql } from "@/lib/db";
import { Price } from "@/app/components/CurrencyProvider";
import AlternativeList, { type Alt } from "@/app/components/AlternativeList";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const rows = await sql`SELECT name FROM apps WHERE slug = ${slug}`;
  if (rows.length === 0) return { title: "App not found" };
  const name = rows[0].name as string;
  return {
    title: `Free alternatives to ${name}`,
    description: `Community-verified free and open-source alternatives to ${name}. See what you can save every year.`,
  };
}

async function Content({ params }: Props) {
  const { slug } = await params;
  const apps = await sql`
    SELECT id, name, price_usd, price_inr FROM apps WHERE slug = ${slug}`;
  if (apps.length === 0) notFound();
  const app = apps[0];

  const voterId = (await cookies()).get("voter_id")?.value ?? "";
  const rows = await sql`
    SELECT a.*,
      COUNT(v.id) FILTER (WHERE v.vote = 'free')::int AS free_votes,
      COUNT(v.id) FILTER (WHERE v.vote = 'paywall')::int AS paywall_votes,
      (SELECT mv.vote FROM votes mv
        WHERE mv.alternative_id = a.id AND mv.voter_id = ${voterId}) AS my_vote
    FROM alternatives a
    LEFT JOIN votes v ON v.alternative_id = a.id
    WHERE a.app_id = ${app.id}
    GROUP BY a.id
    ORDER BY a.name`;

  const alts: Alt[] = rows.map((r) => ({
    id: r.id as number,
    name: r.name as string,
    url: r.url as string,
    pitch: r.pitch as string,
    free_limit: r.free_limit as string,
    platforms: r.platforms as string[],
    open_source: r.open_source as boolean,
    no_signup: r.no_signup as boolean,
    free_votes: r.free_votes as number,
    paywall_votes: r.paywall_votes as number,
    myVote: (r.my_vote as "free" | "paywall" | null) ?? null,
  }));

  const hasPrice = app.price_usd != null && app.price_inr != null;

  return (
    <div className="enter">
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-5xl">
        Free alternatives to {app.name as string}
      </h1>
      <p className="mt-3 text-lg text-slate-600">
        {hasPrice ? (
          <>
            {app.name as string} costs about{" "}
            <Price usd={Number(app.price_usd)} inr={Number(app.price_inr)} /> per
            month. These tools cost nothing.
          </>
        ) : (
          "These tools cost nothing."
        )}
      </p>
      <AlternativeList alts={alts} slug={slug} />
    </div>
  );
}

export default function Page({ params }: Props) {
  return (
    <main className="mx-auto max-w-6xl px-5 pb-16 pt-8">
      <Link href="/" className="inline-flex min-h-11 items-center font-semibold text-slate-600">
        ← All apps
      </Link>
      <Suspense fallback={<p className="mt-6 text-slate-500">Loading...</p>}>
        <Content params={params} />
      </Suspense>
    </main>
  );
}