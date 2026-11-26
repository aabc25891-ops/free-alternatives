"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { CURRENCIES, formatAmount, toAmount, type Code } from "@/lib/currency";

type Ctx = { code: Code; setCode: (c: Code) => void };
const CurrencyCtx = createContext<Ctx>({ code: "INR", setCode: () => {} });

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [code, setCodeState] = useState<Code>("INR");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("currency");
      if (saved && saved in CURRENCIES) setCodeState(saved as Code);
    } catch {}
  }, []);

  const setCode = (c: Code) => {
    setCodeState(c);
    try {
      localStorage.setItem("currency", c);
    } catch {}
  };

  return (
    <CurrencyCtx.Provider value={{ code, setCode }}>
      {children}
    </CurrencyCtx.Provider>
  );
}

export const useCurrency = () => useContext(CurrencyCtx);

export function Price({ usd, inr }: { usd: number; inr: number }) {
  const { code } = useCurrency();
  return <>{formatAmount(code, toAmount(code, usd, inr))}</>;
}