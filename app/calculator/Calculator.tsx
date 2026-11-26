"use client";
import { useState } from "react";

type App = { id: number; name: string; price_usd: number; price_inr: number };

export default function Calculator({ apps }: { apps: App[] }) {
  const [selected, setSelected] = useState<number[]>([]);
  const [currency, setCurrency] = useState<"INR" | "USD">("INR");

  const toggle = (id: number) =>
    setSelected((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id]
    );

  const price = (a: App) => (currency === "INR" ? a.price_inr : a.price_usd);
  const money = (n: number) =>
    (currency === "INR" ? "₹" : "$") +
    Math.round(n).toLocaleString(currency === "INR" ? "en-IN" : "en-US");

  const monthly = apps
    .filter((a) => selected.includes(a.id))
    .reduce((sum, a) => sum + price(a), 0);

  return (
    <div>
      <div className="flex justify-end gap-2">
        {(["INR", "USD"] as const).map((c) => (
          <button
            key={c}
            onClick={() => setCurrency(c)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold ${
              currency === c ? "bg-green-600 text-white" : "bg-white text-gray-700 shadow"
            }`}
          >
            {c === "INR" ? "₹ INR" : "$ USD"}
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {apps.map((a) => (
          <label
            key={a.id}
            className="flex cursor-pointer items-center justify-between rounded-lg bg-white p-4 shadow"
          >
            <span className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={selected.includes(a.id)}
                onChange={() => toggle(a.id)}
                className="h-5 w-5"
              />
              <span className="font-semibold text-gray-900">{a.name}</span>
            </span>
            <span className="text-sm text-gray-500">{money(price(a))}/mo</span>
          </label>
        ))}
      </div>

      <div className="mt-6 rounded-lg bg-green-600 p-6 text-center text-white">
        <p className="text-sm">You could save</p>
        <p className="text-4xl font-bold">{money(monthly * 12)}</p>
        <p className="text-sm">per year ({money(monthly)} per month)</p>
      </div>
    </div>
  );
}