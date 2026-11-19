"use client";

import { useEffect, useState } from "react";
import { profile } from "@/lib/content";
import { CountUp } from "./hud";

type Live = {
  site: "Lichess" | "Chess.com";
  ratings: { label: string; value?: number }[];
  playing?: string;
  play: string;
  url: string;
};

async function fetchLichess(user: string, signal: AbortSignal): Promise<Live> {
  const res = await fetch(`https://lichess.org/api/user/${encodeURIComponent(user)}`, {
    signal,
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(String(res.status));
  const data = await res.json();
  const perfs = data.perfs ?? {};
  return {
    site: "Lichess",
    ratings: [
      { label: "Bullet", value: perfs.bullet?.rating },
      { label: "Blitz", value: perfs.blitz?.rating },
      { label: "Rapid", value: perfs.rapid?.rating },
    ],
    playing: typeof data.playing === "string" ? data.playing : undefined,
    play: `https://lichess.org/?user=${encodeURIComponent(user)}#friend`,
    url: `https://lichess.org/@/${encodeURIComponent(user)}`,
  };
}

async function fetchChessCom(user: string, signal: AbortSignal): Promise<Live> {
  const res = await fetch(`https://api.chess.com/pub/player/${encodeURIComponent(user.toLowerCase())}/stats`, { signal });
  if (!res.ok) throw new Error(String(res.status));
  const data = await res.json();
  return {
    site: "Chess.com",
    ratings: [
      { label: "Bullet", value: data.chess_bullet?.last?.rating },
      { label: "Blitz", value: data.chess_blitz?.last?.rating },
      { label: "Rapid", value: data.chess_rapid?.last?.rating },
    ],
    play: `https://www.chess.com/play/online/new?opponent=${encodeURIComponent(user)}`,
    url: `https://www.chess.com/member/${encodeURIComponent(user)}`,
  };
}

/** USCF rating, plus live online ratings and a "Play me" link once a username is set. */
export function ChessRating() {
  const { uscf, uscfTitle, lichess, chesscom } = profile.chess;
  const [live, setLive] = useState<Live | null>(null);

  useEffect(() => {
    if (!lichess && !chesscom) return;
    const controller = new AbortController();
    const load = lichess ? fetchLichess(lichess, controller.signal) : fetchChessCom(chesscom, controller.signal);
    load.then(setLive).catch(() => {
      /* Offline or rate-limited: the USCF rating still shows. */
    });
    return () => controller.abort();
  }, [lichess, chesscom]);

  const ratings = live?.ratings.filter((r) => typeof r.value === "number") ?? [];

  return (
    <div className="space-y-2">
      <p>
        <CountUp value={String(uscf)} className="font-mono text-base text-ink" />{" "}
        <span className="text-muted">USCF · {uscfTitle}</span>
      </p>
      {live && ratings.length > 0 && (
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-muted">
          <a href={live.url} target="_blank" rel="noopener noreferrer" className="link-underline text-copy">
            {live.site}
          </a>
          {ratings.map((r) => (
            <span key={r.label}>
              {r.label} <span className="text-ink">{r.value}</span>
            </span>
          ))}
          {live.playing && (
            <a href={live.playing} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-accent">
              <span className="blink inline-block h-1.5 w-1.5 bg-coral" />
              Playing now
            </a>
          )}
        </p>
      )}
      {live && (
        <a
          href={live.play}
          target="_blank"
          rel="noopener noreferrer"
          className="pixel inline-flex items-center gap-1.5 border border-accent px-2 py-1 text-accent transition-colors hover:bg-accent hover:text-accent-ink"
        >
          ▸ Play me
        </a>
      )}
    </div>
  );
}
