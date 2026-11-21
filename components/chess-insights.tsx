"use client";

import { useEffect, useMemo, useState } from "react";

/* Data from the chess-analytics repo (scripts/analyze.py -> results/summary.json). */

type Effect = { key: string; n: number; mean: number; lo: number; hi: number; p: number; q?: number };
type AfterResult = { key: string; games: number; stopRate: number; minutesToNext: number };
type Clock = { timeClass: string; games: number; wonOnTime: number; lostOnTime: number; flagBalance: number };
type FilterData = {
  games: number;
  prev: Effect[];
  streak: Effect[];
  session: Effect[];
  hour: Effect[];
  color: Effect[];
  afterResult: AfterResult[];
  openings: { white: Effect[]; black: Effect[] };
};
type Summary = {
  games: number;
  sessions: number;
  from: string;
  to: string;
  eloPerPoint: number;
  clock: Clock[];
  byFilter: Record<FilterId, FilterData>;
};

type FilterId = "all" | "bullet" | "blitz" | "rapid";
type TabId = "tilt" | "session" | "hour" | "openings" | "clock";

const FILTERS: [FilterId, string][] = [
  ["all", "All"],
  ["bullet", "Bullet"],
  ["blitz", "Blitz"],
  ["rapid", "Rapid"],
];
const TABS: { id: TabId; label: string; question: string }[] = [
  { id: "tilt", label: "Tilt", question: "Do I play worse after a loss?" },
  { id: "session", label: "Fatigue", question: "Do I fade deep into a session?" },
  { id: "hour", label: "Time of day", question: "When do I play best?" },
  { id: "openings", label: "Openings", question: "Which openings work for me?" },
  { id: "clock", label: "The clock", question: "Who wins the time scramble?" },
];

const PREV_LABELS: Record<string, string> = {
  first: "First game of a session",
  win: "After a win",
  draw: "After a draw",
  loss: "After a loss",
};
const STREAK_LABELS: Record<string, string> = { "2": "After 2 losses in a row", "3+": "After 3+ losses in a row" };
const HOUR_LABELS: Record<string, string> = {
  "Morning (6-12)": "6 AM – noon",
  "Afternoon (12-5)": "Noon – 5 PM",
  "Evening (5-9)": "5 – 9 PM",
  "Late (9-12)": "9 PM – midnight",
  "After midnight (12-3)": "Midnight – 3 AM",
  "Very late (3-6)": "3 – 6 AM",
};
const SESSION_LABELS: Record<string, string> = {
  "1": "Game 1",
  "2-3": "Games 2–3",
  "4-6": "Games 4–6",
  "7-10": "Games 7–10",
  "11-20": "Games 11–20",
  "21+": "Game 21 and later",
};

type Row = Effect & { label: string; sig: boolean };
type Section = { title?: string; rows: Row[] };

const fmt = (v: number) => {
  const r = Math.round(v * 10) / 10;
  return `${r > 0 ? "+" : r < 0 ? "−" : ""}${Math.abs(r).toFixed(1)}`;
};

function toRows(effects: Effect[], labels?: Record<string, string>, useQ = false): Row[] {
  return effects
    .filter((e) => !labels || e.key in labels)
    .map((e) => ({
      ...e,
      label: labels?.[e.key] ?? e.key,
      sig: useQ ? (e.q ?? 1) < 0.05 : e.lo > 0 || e.hi < 0,
    }));
}

export function ChessInsights() {
  const [data, setData] = useState<Summary | null>(null);
  const [failed, setFailed] = useState(false);
  const [tab, setTab] = useState<TabId>("tilt");
  const [filter, setFilter] = useState<FilterId>("all");

  useEffect(() => {
    const controller = new AbortController();
    fetch("/data/chess-insights.json", { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setData)
      .catch((e) => {
        if (e?.name !== "AbortError") setFailed(true);
      });
    return () => controller.abort();
  }, []);

  const f = data?.byFilter[filter];
  const sections: Section[] = useMemo(() => {
    if (!f) return [];
    switch (tab) {
      case "tilt":
        return [
          { rows: toRows(f.prev, PREV_LABELS) },
          { title: "Losing streaks", rows: toRows(f.streak, STREAK_LABELS) },
        ];
      case "session":
        return [{ rows: toRows(f.session, SESSION_LABELS) }];
      case "hour":
        return [{ rows: toRows(f.hour, HOUR_LABELS) }];
      case "openings":
        return [
          { title: "As White", rows: toRows(f.openings.white.slice(0, 7), undefined, true) },
          { title: "As Black", rows: toRows(f.openings.black.slice(0, 7), undefined, true) },
        ];
      default:
        return [];
    }
  }, [f, tab]);

  const current = TABS.find((t) => t.id === tab)!;

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div role="tablist" aria-label="Question" className="flex flex-wrap gap-1.5">
          {TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              type="button"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={`cursor-pointer border px-3 py-1.5 font-display text-sm font-bold transition-colors ${
                tab === t.id ? "border-ink bg-ink text-paper" : "border-line text-muted hover:border-ink/40 hover:text-ink"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        {tab !== "clock" && (
          <div aria-label="Time control" className="flex flex-wrap gap-1.5">
            {FILTERS.map(([id, label]) => (
              <button
                key={id}
                type="button"
                aria-pressed={filter === id}
                onClick={() => setFilter(id)}
                className={`cursor-pointer border px-2.5 py-1 font-mono text-xs transition-colors ${
                  filter === id ? "border-accent bg-accent text-accent-ink" : "border-line text-muted hover:text-ink"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-3 border border-line bg-paper p-4 sm:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <p className="font-display text-xl font-bold tracking-tight text-ink">{current.question}</p>
          {f && tab !== "clock" && (
            <p className="font-mono text-[11px] text-faint">{f.games.toLocaleString("en-US")} games</p>
          )}
        </div>

        {!data ? (
          <div className="grid h-[240px] place-items-center text-sm text-muted">
            {failed ? "The data couldn't load. Try refreshing." : "Loading games…"}
          </div>
        ) : tab === "clock" ? (
          <ClockChart rows={data.clock} />
        ) : (
          <>
            <ForestPlot key={`${tab}-${filter}`} sections={sections} eloPerPoint={data.eloPerPoint} />
            {tab === "tilt" && f && <AfterResultNote rows={f.afterResult} />}
          </>
        )}
      </div>

      {data && (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 font-mono text-[11px] text-faint">
          <p>
            {data.games.toLocaleString("en-US")} rated games on Chess.com and Lichess, {data.from.slice(0, 4)} to{" "}
            {data.to.slice(0, 4)}. Bars are 95% intervals.
          </p>
          {tab !== "clock" && <DataTable sections={sections} />}
        </div>
      )}
    </div>
  );
}

function niceTicks(lo: number, hi: number) {
  const span = hi - lo;
  const step = [1, 2, 2.5, 5, 10, 20, 25, 50].find((s) => span / s <= 6) ?? 100;
  const ticks: number[] = [];
  for (let v = Math.ceil(lo / step) * step; v <= hi + 1e-9; v += step) ticks.push(Number(v.toFixed(2)));
  return ticks;
}

function ForestPlot({ sections, eloPerPoint }: { sections: Section[]; eloPerPoint: number }) {
  const all = sections.flatMap((s) => s.rows);
  const [active, setActive] = useState<string | null>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setDrawn(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const domain = useMemo(() => {
    if (!all.length) return { lo: -5, hi: 5 };
    const lo = Math.min(0, ...all.map((r) => r.lo));
    const hi = Math.max(0, ...all.map((r) => r.hi));
    const pad = (hi - lo) * 0.08 + 0.5;
    return { lo: lo - pad, hi: hi + pad };
  }, [all]);

  if (!all.length) return <p className="py-10 text-center text-sm text-muted">Not enough games for this view.</p>;

  const pct = (v: number) => ((v - domain.lo) / (domain.hi - domain.lo)) * 100;
  const zero = pct(0);
  const ticks = niceTicks(domain.lo, domain.hi);
  const keys = all.map((r) => r.label);
  // On phones only every other tick is labeled, always including 0.
  const zeroTick = Math.max(0, ticks.indexOf(0));

  const onKey = (e: React.KeyboardEvent, label: string) => {
    const i = keys.indexOf(label);
    const next = e.key === "ArrowDown" ? i + 1 : e.key === "ArrowUp" ? i - 1 : -1;
    if (next < 0 || next >= keys.length || (e.key !== "ArrowDown" && e.key !== "ArrowUp")) return;
    e.preventDefault();
    const el = document.querySelector<HTMLElement>(`[data-row="${CSS.escape(keys[next])}"]`);
    el?.focus();
  };

  return (
    <div className="mt-5">
      {sections.map((section, si) => (
        <div key={section.title ?? si} className={si ? "mt-5" : ""}>
          {section.title && <p className="pixel mb-1 text-faint">{section.title}</p>}
          <ul>
            {section.rows.map((r) => {
              const on = active === r.label;
              const elo = Math.round(r.mean * eloPerPoint);
              return (
                <li
                  key={r.label}
                  data-row={r.label}
                  tabIndex={0}
                  aria-label={`${r.label}: ${fmt(r.mean)} points per 100 games versus my baseline, 95% interval ${fmt(r.lo)} to ${fmt(r.hi)}, ${r.n} games.`}
                  onPointerEnter={() => setActive(r.label)}
                  onPointerLeave={() => setActive(null)}
                  onFocus={() => setActive(r.label)}
                  onBlur={() => setActive(null)}
                  onKeyDown={(e) => onKey(e, r.label)}
                  className={`relative grid cursor-default grid-cols-[1fr_3rem] items-center gap-x-3 py-1.5 outline-none sm:grid-cols-[minmax(0,34%)_1fr_3.5rem] ${
                    on ? "bg-ink/[0.04]" : ""
                  } focus-visible:ring-1 focus-visible:ring-accent`}
                >
                  <span className="col-span-2 truncate pl-1 text-[13px] text-copy sm:col-span-1">
                    {r.label} <span className="font-mono text-[11px] text-faint">{r.n.toLocaleString("en-US")}</span>
                  </span>
                  <span className="relative h-6 sm:h-7">
                    {ticks.map((t) => (
                      <span
                        key={t}
                        aria-hidden="true"
                        className={`absolute inset-y-[-6px] w-px ${t === 0 ? "bg-ink/70" : "bg-line"}`}
                        style={{ left: `${pct(t)}%` }}
                      />
                    ))}
                    <span
                      aria-hidden="true"
                      className="absolute top-1/2 h-[2px] -translate-y-1/2 rounded-full bg-accent transition-[left,width] duration-700 ease-out motion-reduce:transition-none"
                      style={{
                        left: `${drawn ? pct(r.lo) : zero}%`,
                        width: `${drawn ? pct(r.hi) - pct(r.lo) : 0}%`,
                      }}
                    />
                    <span
                      aria-hidden="true"
                      className={`absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-accent transition-[left] duration-700 ease-out motion-reduce:transition-none ${
                        r.sig ? "bg-accent" : "bg-paper"
                      } ${on ? "scale-125" : ""}`}
                      style={{ left: `${drawn ? pct(r.mean) : zero}%` }}
                    />
                    {on && (
                      <span
                        role="tooltip"
                        className="pointer-events-none absolute bottom-full z-10 mb-1 -translate-x-1/2 whitespace-nowrap border border-line bg-paper-2 px-2.5 py-1.5 text-left shadow-[3px_3px_0_0_rgb(var(--ink)/0.25)]"
                        style={{ left: `${Math.min(Math.max(pct(r.mean), 18), 82)}%` }}
                      >
                        <span className="block font-mono text-sm font-semibold tabular-nums text-ink">
                          {fmt(r.mean)} per 100 games
                        </span>
                        <span className="block text-[11px] text-muted">
                          95%: {fmt(r.lo)} to {fmt(r.hi)} · ≈ {elo > 0 ? "+" : elo < 0 ? "−" : ""}
                          {Math.abs(elo)} rating points
                        </span>
                      </span>
                    )}
                  </span>
                  <span className="text-right font-mono text-xs tabular-nums text-ink">{fmt(r.mean)}</span>
                </li>
              );
            })}
          </ul>
        </div>
      ))}

      <div className="mt-1 grid grid-cols-[1fr_3rem] gap-x-3 sm:grid-cols-[minmax(0,34%)_1fr_3.5rem]">
        <span className="hidden sm:block" />
        <span className="relative h-4">
          {ticks.map((t, i) => (
            <span
              key={t}
              className={`absolute -translate-x-1/2 font-mono text-[11px] text-faint ${(i - zeroTick) % 2 ? "hidden sm:block" : ""}`}
              style={{ left: `${pct(t)}%` }}
            >
              {t > 0 ? `+${t}` : t}
            </span>
          ))}
        </span>
        <span />
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-muted">
        <span>Points per 100 games above (+) or below (−) what I usually score in that situation.</span>
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden="true" className="inline-block h-2.5 w-2.5 rounded-full bg-accent" /> clear effect
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden="true" className="inline-block h-2.5 w-2.5 rounded-full border-2 border-accent" /> could be
          noise
        </span>
      </div>
    </div>
  );
}

function AfterResultNote({ rows }: { rows: AfterResult[] }) {
  const win = rows.find((r) => r.key === "win");
  const loss = rows.find((r) => r.key === "loss");
  if (!win || !loss) return null;
  const secs = (m: number) => `${Math.round(m * 60)} seconds`;
  return (
    <p className="mt-5 border-t border-line pt-4 text-sm leading-relaxed text-copy">
      What I do next: after a loss I end the session{" "}
      <strong className="font-semibold text-ink">{Math.round(loss.stopRate * 100)}%</strong> of the time, versus{" "}
      <strong className="font-semibold text-ink">{Math.round(win.stopRate * 100)}%</strong> after a win. When I keep
      going, the next game starts a median of {secs(loss.minutesToNext)} after a loss and {secs(win.minutesToNext)}{" "}
      after a win.
    </p>
  );
}

function ClockChart({ rows }: { rows: Clock[] }) {
  const max = Math.max(...rows.flatMap((r) => [r.wonOnTime, r.lostOnTime])) * 100;
  const w = (v: number) => `${((v * 100) / max) * 100}%`;
  return (
    <div className="mt-5 space-y-5">
      {rows.map((r) => (
        <div key={r.timeClass} className="grid grid-cols-[4.5rem_1fr] items-center gap-3 sm:grid-cols-[6rem_1fr]">
          <span className="text-[13px] capitalize text-copy">{r.timeClass}</span>
          <div className="space-y-1.5">
            {[
              { label: "Won on time", v: r.wonOnTime, solid: true },
              { label: "Lost on time", v: r.lostOnTime, solid: false },
            ].map((b) => (
              <div key={b.label} className="flex items-center gap-2">
                <span className="relative h-3.5 flex-1">
                  <span
                    className={`absolute inset-y-0 left-0 rounded-r-[3px] ${
                      b.solid ? "bg-accent" : "border border-accent bg-[repeating-linear-gradient(135deg,rgb(var(--accent)/0.55)_0_2px,transparent_2px_6px)]"
                    }`}
                    style={{ width: w(b.v) }}
                  />
                </span>
                <span className="w-[8.5rem] shrink-0 font-mono text-[11px] tabular-nums text-muted">
                  {(b.v * 100).toFixed(1)} per 100 · {b.label.toLowerCase()}
                </span>
              </div>
            ))}
            <p className="font-mono text-[11px] text-ink">
              Net {r.flagBalance > 0 ? "+" : ""}
              {r.flagBalance.toFixed(1)} games per 100 · {r.games.toLocaleString("en-US")} games
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function DataTable({ sections }: { sections: Section[] }) {
  return (
    <details className="group w-full sm:w-auto">
      <summary className="cursor-pointer list-none text-muted hover:text-ink sm:text-right">
        <span className="group-open:hidden">View as table ▾</span>
        <span className="hidden group-open:inline">Hide table ▴</span>
      </summary>
      <table className="mt-3 w-full border-collapse text-left font-mono text-xs text-copy sm:min-w-[420px]">
        <thead>
          <tr className="border-b border-line text-faint">
            <th className="py-1.5 pr-4 font-normal">Group</th>
            <th className="py-1.5 pr-4 text-right font-normal">Games</th>
            <th className="py-1.5 pr-4 text-right font-normal">vs. baseline</th>
            <th className="py-1.5 text-right font-normal">95% interval</th>
          </tr>
        </thead>
        <tbody>
          {sections.flatMap((s) =>
            s.rows.map((r) => (
              <tr key={`${s.title}-${r.label}`} className="border-b border-line/60">
                <td className="py-1.5 pr-4 text-ink">{r.label}</td>
                <td className="py-1.5 pr-4 text-right tabular-nums">{r.n.toLocaleString("en-US")}</td>
                <td className="py-1.5 pr-4 text-right tabular-nums">{fmt(r.mean)}</td>
                <td className="py-1.5 text-right tabular-nums">
                  {fmt(r.lo)} to {fmt(r.hi)}
                </td>
              </tr>
            )),
          )}
        </tbody>
      </table>
    </details>
  );
}
