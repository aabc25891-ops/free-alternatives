"use client";
import Link from "next/link";
import { useState } from "react";
import { CURRENCIES, type Code } from "@/lib/currency";
import { useCurrency } from "./CurrencyProvider";

export default function Header() {
  const { code, setCode, showPicker } = useCurrency();
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-3">
        <Link href="/" className="text-xl font-extrabold">
          Ditch<span className="text-green-700">Paid</span>
        </Link>
        <nav className="flex flex-wrap items-center gap-2">
          <Link href="/" className="pill">Browse</Link>
          <Link href="/calculator" className="pill">Savings calculator</Link>
          <div className={showPicker ? "relative" : "hidden"}>
            <button
              className="pill"
              onClick={() => setOpen(!open)}
              aria-haspopup="listbox"
              aria-expanded={open}
            >
              {code} ▾
            </button>
            {open && (
              <>
                <button
                  aria-label="Close currency list"
                  className="fixed inset-0 z-10 cursor-default"
                  onClick={() => setOpen(false)}
                />
                <ul className="pop absolute right-0 top-14 z-20 max-h-80 w-64 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl">
                  {(Object.keys(CURRENCIES) as Code[]).map((c) => (
                    <li key={c}>
                      <button
                        onClick={() => {
                          setCode(c);
                          setOpen(false);
                        }}
                        className={`flex min-h-11 w-full items-center justify-between rounded-lg px-3 text-left font-semibold ${
                          c === code ? "bg-green-100 text-green-900" : "hover:bg-slate-100"
                        }`}
                      >
                        <span>{c} · {CURRENCIES[c].name}</span>
                        <span>{CURRENCIES[c].symbol}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}