"use client";
import { useState } from "react";
import { castVote } from "@/app/actions";

export type Alt = {
  id: number;
  name: string;
  url: string;
  pitch: string;
  free_limit: string;
  platforms: string[];
  open_source: boolean;
  no_signup: boolean;
  free_votes: number;
  paywall_votes: number;
  myVote: "free" | "paywall" | null;
};

type Filter = "all" | "open" | "nosignup";
const FILTERS: [Filter, string][] = [
  ["all", "All"],
  ["open", "Open source"],
  ["nosignup", "No sign-up"],
];

export default function AlternativeList({
  alts,
  slug,
}: {
  alts: Alt[];
  slug: string;
}) {
  const [filter, setFilter] = useState<Filter>("all");
  const shown = alts.filter((a) =>
    filter === "open" ? a.open_source : filter === "nosignup" ? a.no_signup : true
  );

  return (
    <>
      <div className="mt-5 flex flex-wrap gap-2">
        {FILTERS.map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`pill ${filter === key ? "pill-on pulse" : ""}`}
          >
            {label}
          </button>
        ))}
      </div>

      {shown.length === 0 && (
        <div className="card mt-4 text-slate-600">No tools match this filter.</div>
      )}

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {shown.map((a) => (
          <div key={a.id} className="card flex flex-col">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-xl font-bold">{a.name}</h3>
              <span className="whitespace-nowrap rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800">
                {a.open_source ? "Open source" : a.no_signup ? "No sign-up" : "Free tier"}
              </span>
            </div>
            <p className="mt-2 text-slate-600">{a.pitch}</p>
            <p className="mt-2 text-sm font-semibold text-green-700">{a.free_limit}</p>
            <p className="text-sm text-slate-600">{a.platforms.join(" · ")}</p>
            <div className="mt-3 rounded-xl bg-slate-100 p-3 text-sm">
              {a.free_votes} say still free · {a.paywall_votes} report a paywall
            </div>
            <form action={castVote} className="mt-3 flex flex-wrap gap-2">
              <input type="hidden" name="alternativeId" value={a.id} />
              <input type="hidden" name="slug" value={slug} />
              <button
                name="vote"
                value="free"
                className={`btn-ghost ${
                  a.myVote === "free" ? "pulse !border-green-700 !bg-green-700 !text-white" : ""
                }`}
              >
                Still free
              </button>
              <button
                name="vote"
                value="paywall"
                className={`btn-ghost ${
                  a.myVote === "paywall" ? "pulse !border-red-700 !bg-red-700 !text-white" : ""
                }`}
              >
                Hidden paywall
              </button>
            </form>
            <a
              href={a.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-go mt-4 self-start"
            >
              Launch free tool ↗
            </a>
          </div>
        ))}
      </div>
    </>
  );
}