"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import accounts from "@/lib/chess-accounts.json";
import { CountUp } from "./hud";

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
          <CountUp value={String(uscf.current)} className="font-mono text-base text-ink" />{" "}
          <span className="text-muted">
            US Chess · {uscf.title} · peak {uscf.peak}
          </span>
        </p>
      )}
      {online.length > 0 && (
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-muted">
          <span aria-hidden="true" className="blink inline-block h-1.5 w-1.5 bg-accent" />
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
            className="pixel inline-flex items-center gap-1 border border-accent px-2 py-1 text-accent transition-colors hover:bg-accent hover:text-accent-ink"
          >
            Play me · {p.site}
            <ArrowUpRight aria-hidden="true" className="h-2.5 w-2.5" />
          </a>
        ))}
      </p>
    </div>
  );
}
