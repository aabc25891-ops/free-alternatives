"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { CURRENCIES, formatAmount, toAmount, type Code } from "@/lib/currency";

type Ctx = {
  code: Code;
  setCode: (c: Code) => void;
  showPicker: boolean;
  register: () => () => void;
};

const CurrencyCtx = createContext<Ctx>({
  code: "USD",
  setCode: () => {},
  showPicker: false,
  register: () => () => {},
});

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [code, setCodeState] = useState<Code>("USD");
  const [users, setUsers] = useState(0);

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

  const register = useCallback(() => {
    setUsers((n) => n + 1);
    return () => setUsers((n) => n - 1);
  }, []);

  return (
    <CurrencyCtx.Provider
      value={{ code, setCode, showPicker: users > 0, register }}
    >
      {children}
    </CurrencyCtx.Provider>
  );
}

export const useCurrency = () => useContext(CurrencyCtx);

// Any component that shows prices calls this, so the currency button appears.
export function useShowCurrency() {
  const { register } = useCurrency();
  useEffect(() => register(), [register]);
}

export function Price({ usd, inr }: { usd: number; inr: number }) {
  const { code } = useCurrency();
  useShowCurrency();
  return <>{formatAmount(code, toAmount(code, usd, inr))}</>;
}