export const CURRENCIES = {
  INR: { name: "Indian Rupee", symbol: "₹", rate: 1, locale: "en-IN" },
  USD: { name: "US Dollar", symbol: "$", rate: 1, locale: "en-US" },
  EUR: { name: "Euro", symbol: "€", rate: 0.92, locale: "en-US" },
  GBP: { name: "British Pound", symbol: "£", rate: 0.78, locale: "en-US" },
  AED: { name: "UAE Dirham", symbol: "AED ", rate: 3.67, locale: "en-US" },
  CAD: { name: "Canadian Dollar", symbol: "C$", rate: 1.37, locale: "en-US" },
  AUD: { name: "Australian Dollar", symbol: "A$", rate: 1.52, locale: "en-US" },
  SGD: { name: "Singapore Dollar", symbol: "S$", rate: 1.3, locale: "en-US" },
  JPY: { name: "Japanese Yen", symbol: "¥", rate: 150, locale: "en-US" },
} as const;

export type Code = keyof typeof CURRENCIES;

// INR uses the real rupee price; every other currency converts from dollars.
// The rates are rough placeholders for now.
export function toAmount(code: Code, usd: number, inr: number) {
  return code === "INR" ? inr : usd * CURRENCIES[code].rate;
}

export function formatAmount(code: Code, amount: number) {
  const c = CURRENCIES[code];
  return c.symbol + Math.round(amount).toLocaleString(c.locale);
}