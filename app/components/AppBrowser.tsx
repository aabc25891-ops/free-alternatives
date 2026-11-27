"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Price } from "./CurrencyProvider";
import Logo from "./Logo";

export type AppCard = {
  id: number;
  name: string;
  slug: string;
  category: string;
  domain: string | null;
  usd: number | null;
  inr: number | null;
  count: number;
};

const POPULAR = ["Photoshop", "Notion", "Canva", "Premiere"];

// Lower number = better match. -1 = no match.
function rank(a: AppCard, term: string) {
  const name = a.name.toLowerCase();
  if (name.startsWith(term)) return 0;
  if (name.split(/\s+/).some((w) => w.startsWith(term))) return 1;
  if (name.includes(term)) return 2;
  if (a.category.toLowerCase().includes(term)) return 3;
  return -1;
}

const plural = (n: number) =>
  `${n} free alternative${n === 1 ? "" : "s"}`;

export default function AppBrowser({ apps }: { apps: AppCard[] }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  const term = q.trim().toLowerCase();
  const shown = term ? apps.filter((a) => rank(a, term) >= 0) : apps;
  const suggestions = term
    ? apps
        .map((a) => ({ a, r: rank(a, term) }))
        .filter((x) => x.r >= 0)
        .sort((x, y) => x.r - y.r || x.a.name.localeCompare(y.a.name))
        .slice(0, 6)
        .map((x) => x.a)
    : [];
  const showList = open && term !== "";

  const go = (a: AppCard) => {
    setOpen(false);
    router.push(`/alternatives/${a.slug}`);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showList) return;
    const n = suggestions.length;
    if (e.key === "ArrowDown" && n > 0) {
      e.preventDefault();
      setActive((i) => (i + 1) % n);
    } else if (e.key === "ArrowUp" && n > 0) {
      e.preventDefault();
      setActive((i) => (i <= 0 ? n - 1 : i - 1));
    } else if (e.key === "Enter" && n > 0) {
      e.preventDefault();
      go(suggestions[active >= 0 ? active : 0]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

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

        {showList && (
          <button
            type="button"
            aria-label="Close suggestions"
            className="fixed inset-0 z-10 cursor-default"
            onClick={() => setOpen(false)}
          />
        )}

        <div className="relative z-20 mt-7">
          <input
            role="combobox"
            aria-expanded={showList}
            aria-controls="app-suggestions"
            aria-autocomplete="list"
            aria-label="Search apps"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setOpen(true);
              setActive(-1);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={onKeyDown}
            placeholder="Search Photoshop, Notion, Canva..."
            className="min-h-[52px] w-full rounded-xl border border-slate-300 bg-white pl-5 pr-12 text-base outline-none focus:border-green-700"
          />
          {q && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => {
                setQ("");
                setOpen(false);
                setActive(-1);
              }}
              className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full text-xl text-slate-500 hover:bg-slate-100"
            >
              ×
            </button>
          )}

          {showList && (
            <ul
              id="app-suggestions"
              role="listbox"
              className="pop absolute left-0 right-0 top-14 z-20 origin-top-left overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 text-left shadow-xl"
            >
              {suggestions.length === 0 && (
                <li className="px-3 py-3 text-sm text-slate-600">
                  No apps found. Try another name.
                </li>
              )}
              {suggestions.map((a, i) => (
                <li key={a.id} role="option" aria-selected={i === active}>
                  <Link
                    href={`/alternatives/${a.slug}`}
                    onClick={() => setOpen(false)}
                    onMouseEnter={() => setActive(i)}
                    className={`flex min-h-12 items-center justify-between gap-3 rounded-xl px-3 py-2 ${
                      i === active ? "bg-green-50" : "hover:bg-slate-50"
                    }`}
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <Logo domain={a.domain} name={a.name} size={32} />
                      <span className="min-w-0">
                        <span className="block truncate font-semibold">{a.name}</span>
                        <span className="block text-xs text-slate-500">{a.category}</span>
                      </span>
                    </span>
                    
                    
                    
                    <span className="whitespace-nowrap rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800">
                      {plural(a.count)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm text-slate-600">
          <span>Popular:</span>
          {POPULAR.map((p) => (
            <button
              key={p}
              className="pill"
              onClick={() => {
                setQ(p);
                setOpen(false);
                setActive(-1);
              }}
            >
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
            <div className="mt-4 flex items-center gap-3">
              <Logo domain={a.domain} name={a.name} size={40} />
              <div className="text-lg font-bold">{a.name}</div>
            </div>
            <div className="mt-1 text-sm text-slate-600">{plural(a.count)}</div>
            <div className="mt-4 text-sm font-bold text-green-700">
              See alternatives →
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}