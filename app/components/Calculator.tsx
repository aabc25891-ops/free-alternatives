"use client";
import { useState } from "react";
import { formatAmount, toAmount } from "@/lib/currency";
import { useCurrency, useShowCurrency } from "./CurrencyProvider";

export type CalcApp = {
  id: number;
  name: string;
  category: string;
  usd: number;
  inr: number;
};

export default function Calculator({ apps }: { apps: CalcApp[] }) {
  const { code } = useCurrency();
  useShowCurrency();
  const [picked, setPicked] = useState<number[]>([]);
  const [q, setQ] = useState("");

  const amount = (a: CalcApp) => toAmount(code, a.usd, a.inr);
  const term = q.trim().toLowerCase();
  const shown = apps.filter(
    (a) =>
      !term ||
      a.name.toLowerCase().includes(term) ||
      a.category.toLowerCase().includes(term)
  );

  const monthly = apps
    .filter((a) => picked.includes(a.id))
    .reduce((sum, a) => sum + amount(a), 0);
  const yearlyText = formatAmount(code, monthly * 12);
  const monthlyText = formatAmount(code, monthly);

  const toggle = (id: number) =>
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const share = (platform: "whatsapp" | "x") => {
    const text = `I could save ${yearlyText} per year by switching to free alternatives! Check yours:`;
    const url = window.location.origin + "/calculator";
    const link =
      platform === "whatsapp"
        ? `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`
        : `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(link, "_blank", "noopener,noreferrer");
  };

  return (
    <div>
      <div className="relative mt-5">
        <input
          aria-label="Search paid apps"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search your paid apps..."
          className="min-h-[52px] w-full rounded-xl border border-slate-300 bg-white pl-5 pr-12 text-base outline-none focus:border-green-700"
        />
        {q && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => setQ("")}
            className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full text-xl text-slate-500 hover:bg-slate-100"
          >
            ×
          </button>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between text-sm text-slate-600">
        <span>{picked.length} selected</span>
        {picked.length > 0 && (
          <button className="font-semibold text-green-700" onClick={() => setPicked([])}>
            Clear all
          </button>
        )}
      </div>

      {shown.length === 0 && (
        <div className="card mt-3 text-slate-600">No paid apps match that search.</div>
      )}

      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {shown.map((a) => {
          const on = picked.includes(a.id);
          return (
            <button
              key={a.id}
              onClick={() => toggle(a.id)}
              className={`card text-left ${on ? "pulse !border-green-700 !bg-green-50" : ""}`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold">{a.name}</span>
                <span className="text-sm text-slate-600">
                  {formatAmount(code, amount(a))}/mo
                </span>
              </div>
              <div className="mt-1 text-sm font-semibold text-green-700">
                {on ? "Replaced with a free tool" : "Tap to add"}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-6 rounded-2xl bg-green-700 p-7 text-center text-white">
        <div className="text-sm">You could save</div>
        <div key={yearlyText} className="pulse text-5xl font-extrabold leading-tight sm:text-6xl">
          {yearlyText}
        </div>
        <div className="text-sm">per year · {monthlyText} per month</div>
      </div>

      {monthly > 0 && (
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <button className="btn-ghost" onClick={() => share("whatsapp")}>
            Share on WhatsApp
          </button>
          <button className="btn-ghost" onClick={() => share("x")}>
            Share on X
          </button>
        </div>
      )}
    </div>
  );
}