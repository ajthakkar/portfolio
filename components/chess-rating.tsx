"use client";

import { useEffect, useState } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import accounts from "@/lib/chess-accounts.json";
import { TransitionLink } from "./transition-link";

type Online = { site: string; rating: number; control: string; url: string };

const CONTROLS = ["bullet", "blitz", "rapid"] as const;

/** Each site's best current rating, fetched live. */
async function fetchOnline(signal: AbortSignal): Promise<Online[]> {
  const results = await Promise.allSettled([
    fetch(`https://api.chess.com/pub/player/${accounts.chesscom}/stats`, { signal })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => {
        const best = CONTROLS.map((c) => ({ control: c, rating: d[`chess_${c}`]?.last?.rating as number | undefined }))
          .filter((x) => typeof x.rating === "number")
          .sort((a, b) => b.rating! - a.rating!)[0];
        if (!best) throw new Error("no ratings");
        return { site: "Chess.com", rating: best.rating!, control: best.control, url: `https://www.chess.com/member/${accounts.chesscom}` };
      }),
    fetch(`https://lichess.org/api/user/${accounts.lichess}`, { signal, headers: { Accept: "application/json" } })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => {
        const best = CONTROLS.map((c) => ({ control: c, rating: d.perfs?.[c]?.rating as number | undefined }))
          .filter((x) => typeof x.rating === "number")
          .sort((a, b) => b.rating! - a.rating!)[0];
        if (!best) throw new Error("no ratings");
        return { site: "Lichess", rating: best.rating!, control: best.control, url: `https://lichess.org/@/${accounts.lichess}` };
      }),
  ]);
  return results.flatMap((r) => (r.status === "fulfilled" ? [r.value] : []));
}

/** US Chess rating from the build, plus live online ratings and "Play me" links. */
export function ChessRating({ uscf }: { uscf: { current: number; peak: number; title: string } | null }) {
  const [online, setOnline] = useState<Online[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    fetchOnline(controller.signal).then(setOnline).catch(() => {});
    return () => controller.abort();
  }, []);

  return (
    <div className="space-y-2">
      {uscf && (
        <p>
          <span className="font-mono text-base tabular-nums text-ink">{uscf.current}</span>{" "}
          <span className="text-muted">
            US Chess · {uscf.title} · peak {uscf.peak}
          </span>
        </p>
      )}
      {online.length > 0 && (
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-muted">
          <span aria-hidden="true" className="status-dot" />
          {online.map((o) => (
            <a key={o.site} href={o.url} target="_blank" rel="noopener noreferrer" className="link-underline">
              {o.site} <span className="text-ink">{o.rating}</span> {o.control}
            </a>
          ))}
        </p>
      )}
      <p className="flex flex-wrap gap-2 pt-0.5">
        {[
          { site: "Chess.com", href: `https://www.chess.com/play/online/new?opponent=${accounts.chesscom}` },
          { site: "Lichess", href: `https://lichess.org/?user=${accounts.lichess}#friend` },
        ].map((p) => (
          <a
            key={p.site}
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            className="chip"
          >
            Play me on {p.site}
            <ArrowUpRight aria-hidden="true" className="h-3 w-3" />
          </a>
        ))}
        <TransitionLink
          href="/projects/plays-like-me/"
          className="chip text-muted"
        >
          Or play my AI
          <ArrowRight aria-hidden="true" className="h-3 w-3" />
        </TransitionLink>
      </p>
    </div>
  );
}
