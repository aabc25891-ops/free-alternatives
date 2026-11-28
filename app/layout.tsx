import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CurrencyProvider } from "./components/CurrencyProvider";
import Header from "./components/Header";
import { Analytics } from "@vercel/analytics/next";
import { SITE_NAME, SITE_URL } from "@/lib/site";
const inter = Inter({ subsets: ["latin"] });



export const metadata: Metadata = {
  
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME}: Free Alternatives to Paid Software`,
    template: `%s | ${SITE_NAME}`,
  },
  
  
  description:
    "Find free and open-source alternatives to paid apps. See what you can save every year.",
  verification: { google: ["1A-zESw98vZgifMEoRNZmFXdXsONgytiYE5Qr2D4lHs", "xlV4qAqmxdpv4f406UtGebhNXCRcSVKaozJ9I2-sCg4"] },  
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
          <footer className="border-t border-slate-200 py-6 text-center text-sm text-slate-500">
            <a
              href="https://logo.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Logos provided by Logo.dev
            </a>
          </footer>
        </CurrencyProvider>
        <Analytics />
      </body>
    </html>
  );
}