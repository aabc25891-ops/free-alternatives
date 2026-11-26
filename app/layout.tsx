import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CurrencyProvider } from "./components/CurrencyProvider";
import Header from "./components/Header";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"] });



export const metadata: Metadata = {
  title: {
    default: "Free Alternatives to Paid Software",
    template: "%s | FreeAlt",
  },
  description:
    "Find free and open-source alternatives to paid apps. See what you can save every year.",
  verification: { google: "1A-zESw98vZgifMEoRNZmFXdXsONgytiYE5Qr2D4lHs" },  
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
        <Analytics />
      </body>
    </html>
  );
}