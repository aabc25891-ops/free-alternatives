import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CurrencyProvider } from "./components/CurrencyProvider";
import Header from "./components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Free Alternatives to Paid Software",
  description:
    "Find free and open-source alternatives to paid apps. See what you can save every year.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 text-slate-900`}>
        <CurrencyProvider>
          <Header />
          {children}
        </CurrencyProvider>
      </body>
    </html>
  );
}