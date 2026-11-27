"use client";
import { useState } from "react";

const TILES = [
  "bg-green-100 text-green-800",
  "bg-blue-100 text-blue-800",
  "bg-amber-100 text-amber-800",
  "bg-purple-100 text-purple-800",
  "bg-rose-100 text-rose-800",
  "bg-cyan-100 text-cyan-800",
];

const KEY = process.env.NEXT_PUBLIC_LOGO_DEV_KEY;

// Turns a tool's link into a domain. GitHub links return null (letter tile),
// because the GitHub logo would be misleading.
export function domainFromUrl(url: string) {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    return host === "github.com" ? null : host;
  } catch {
    return null;
  }
}

export default function Logo({
  domain,
  name,
  size = 40,
}: {
  domain?: string | null;
  name: string;
  size?: number;
}) {
  const [failed, setFailed] = useState(false);
  const box = { width: size, height: size };

  if (!domain || !KEY || failed) {
    const tile = TILES[name.charCodeAt(0) % TILES.length];
    return (
      <span
        style={box}
        aria-hidden="true"
        className={`flex shrink-0 items-center justify-center rounded-xl text-base font-bold ${tile}`}
      >
        {name.charAt(0).toUpperCase()}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://img.logo.dev/${domain}?token=${KEY}&size=128&format=png&fallback=404`}
      alt=""
      width={size}
      height={size}
      loading="lazy"
      onError={() => setFailed(true)}
      style={box}
      className="shrink-0 rounded-xl bg-white object-contain p-1 ring-1 ring-slate-200"
    />
  );
}