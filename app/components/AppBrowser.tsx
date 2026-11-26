"use client";
import Link from "next/link";
import { useState } from "react";
import { Price } from "./CurrencyProvider";

export type AppCard = {
  id: number;
  name: string;
  slug: string;
  category: string;
  usd: number | null;
  inr: number | null;
  count: number;
};

const POPULAR = ["Photoshop", "Notion", "Canva", "Premiere"];

export default function AppBrowser({ apps }: { apps: AppCard[] }) {
  const [q, setQ] = useState("");
  const term = q.trim().toLowerCase();
  const shown = apps.filter(
    (a) =>
      !term ||
      a.name.toLowerCase().includes(term) ||
      a.category.toLowerCase().includes(term)
  );

  return (
    <div className="enter mx-auto max-w-6xl px-5 pb-16 pt-14">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
          Stop paying for software.
          <br />
          Find the free one.
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          Community-verified free and open-source alternatives to any paid app.
        </p>
        <input
          aria-label="Search apps"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search Photoshop, Notion, Canva..."
          className="mt-7 min-h-[52px] w-full rounded-xl border border-slate-300 bg-white px-5 text-base outline-none focus:border-green-700"
        />
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm text-slate-600">
          <span>Popular:</span>
          {POPULAR.map((p) => (
            <button key={p} className="pill" onClick={() => setQ(p)}>
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-12 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-2xl font-bold">
          {term ? `Results for "${q.trim()}"` : "Popular paid apps"}
        </h2>
        <span className="text-sm text-slate-600">
          No sign-up needed. Votes come from real users.
        </span>
      </div>

      {shown.length === 0 && (
        <div className="card mt-4 text-slate-600">
          No apps match that search yet. Try another name.
        </div>
      )}

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((a) => (
          <Link
            key={a.id}
            href={`/alternatives/${a.slug}`}
            className="card lift block"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800">
                {a.category}
              </span>
              <span className="text-sm text-slate-600">
                {a.usd != null && a.inr != null ? (
                  <>
                    <Price usd={a.usd} inr={a.inr} />/mo
                  </>
                ) : (
                  "One-time price"
                )}
              </span>
            </div>
            <div className="mt-4 text-lg font-bold">{a.name}</div>
            <div className="mt-1 text-sm text-slate-600">
              {a.count} free alternatives
            </div>
            <div className="mt-4 text-sm font-bold text-green-700">
              See alternatives →
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}