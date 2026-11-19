"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import accounts from "@/lib/chess-accounts.json";

type Series = [string, number][];
type Source = { series: Record<string, Series> };
type Data = { updated: string; chesscom: Source; lichess: Source; uscf: Source };
type SiteId = "uscf" | "chesscom" | "lichess";

const SITES: { id: SiteId; label: string; controls: [string, string][] }[] = [
  {
    id: "uscf",
    label: "US Chess",
    controls: [
      ["regular", "Classical"],
      ["quick", "Quick"],
      ["blitz", "Blitz"],
      ["online-regular", "Online classical"],
      ["online-quick", "Online quick"],
      ["online-blitz", "Online blitz"],
    ],
  },
  {
    id: "chesscom",
    label: "Chess.com",
    controls: [
      ["bullet", "Bullet"],
      ["blitz", "Blitz"],
      ["rapid", "Rapid"],
    ],
  },
  {
    id: "lichess",
    label: "Lichess",
    controls: [
      ["bullet", "Bullet"],
      ["blitz", "Blitz"],
      ["rapid", "Rapid"],
      ["classical", "Classical"],
    ],
  },
];

const fmtDate = (d: string, opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" }) =>
  new Date(`${d}T12:00:00Z`).toLocaleDateString("en-US", { ...opts, timeZone: "UTC" });
const today = () => new Date().toISOString().slice(0, 10);

/** Today's live rating from each site, so the chart ends on the current number. */
async function liveRatings(signal: AbortSignal) {
  const out: Partial<Record<"chesscom" | "lichess", Record<string, number>>> = {};
  await Promise.allSettled([
    fetch(`https://api.chess.com/pub/player/${accounts.chesscom}/stats`, { signal })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => {
        out.chesscom = {};
        for (const tc of ["bullet", "blitz", "rapid"]) {
          const r = d[`chess_${tc}`]?.last?.rating;
          if (typeof r === "number") out.chesscom[tc] = r;
        }
      }),
    fetch(`https://lichess.org/api/user/${accounts.lichess}`, { signal, headers: { Accept: "application/json" } })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => {
        out.lichess = {};
        for (const tc of ["bullet", "blitz", "rapid", "classical"]) {
          const r = d.perfs?.[tc]?.rating;
          if (typeof r === "number") out.lichess[tc] = r;
        }
      }),
  ]);
  return out;
}

function niceStep(range: number) {
  for (const step of [25, 50, 100, 200, 250, 500]) if (range / step <= 5) return step;
  return 1000;
}

export function RatingHistory() {
  const [data, setData] = useState<Data | null>(null);
  const [failed, setFailed] = useState(false);
  const [live, setLive] = useState(false);
  const [site, setSite] = useState<SiteId>("uscf");
  const [control, setControl] = useState("regular");

  useEffect(() => {
    const controller = new AbortController();
    fetch("/data/ratings.json", { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(async (d: Data) => {
        setData(d);
        const now = await liveRatings(controller.signal);
        let changed = false;
        for (const key of ["chesscom", "lichess"] as const) {
          for (const [tc, rating] of Object.entries(now[key] ?? {})) {
            const s = d[key].series[tc];
            if (!s?.length) continue;
            const last = s[s.length - 1];
            if (last[0] === today()) last[1] = rating;
            else if (last[1] !== rating) s.push([today(), rating]);
            changed = true;
          }
        }
        if (changed) {
          setData({ ...d });
          setLive(true);
        }
      })
      .catch((e) => {
        if (e?.name !== "AbortError") setFailed(true);
      });
    return () => controller.abort();
  }, []);

  const siteDef = SITES.find((s) => s.id === site)!;
  const available = siteDef.controls.filter(([key]) => (data?.[site].series[key]?.length ?? 0) > 1);
  const series = data?.[site].series[control] ?? [];

  const pickSite = (id: SiteId) => {
    setSite(id);
    const def = SITES.find((s) => s.id === id)!;
    const first = def.controls.find(([key]) => (data?.[id].series[key]?.length ?? 0) > 1);
    setControl(first?.[0] ?? def.controls[0][0]);
  };

  const stats = useMemo(() => {
    if (series.length < 2) return null;
    const current = series[series.length - 1];
    const peak = series.reduce((best, p) => (p[1] > best[1] ? p : best), series[0]);
    const yearAgo = new Date(`${current[0]}T00:00:00Z`);
    yearAgo.setUTCFullYear(yearAgo.getUTCFullYear() - 1);
    const cutoff = yearAgo.toISOString().slice(0, 10);
    const base = [...series].reverse().find((p) => p[0] <= cutoff) ?? series[0];
    return { current, peak, change: current[1] - base[1], first: series[0] };
  }, [series]);

  return (
    <div>
      {/* Filters: one row above the chart */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div role="tablist" aria-label="Rating source" className="flex flex-wrap gap-1.5">
          {SITES.map((s) => (
            <button
              key={s.id}
              role="tab"
              type="button"
              aria-selected={site === s.id}
              onClick={() => pickSite(s.id)}
              className={`cursor-pointer border px-3 py-1.5 font-display text-sm font-bold transition-colors ${
                site === s.id ? "border-ink bg-ink text-paper" : "border-line text-muted hover:border-ink/40 hover:text-ink"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
        <div aria-label="Time control" className="flex flex-wrap gap-1.5">
          {available.map(([key, label]) => (
            <button
              key={key}
              type="button"
              aria-pressed={control === key}
              onClick={() => setControl(key)}
              className={`cursor-pointer border px-2.5 py-1 font-mono text-xs transition-colors ${
                control === key ? "border-accent bg-accent text-accent-ink" : "border-line text-muted hover:text-ink"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Headline numbers */}
      <dl className="mt-5 grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-4">
        {[
          { label: "Current", value: stats ? String(stats.current[1]) : "—", sub: stats ? fmtDate(stats.current[0]) : "" },
          { label: "Peak", value: stats ? String(stats.peak[1]) : "—", sub: stats ? fmtDate(stats.peak[0]) : "" },
          {
            label: "Last 12 months",
            value: stats ? `${stats.change >= 0 ? "+" : "−"}${Math.abs(stats.change)}` : "—",
            sub: "rating change",
          },
          { label: "Rated since", value: stats ? stats.first[0].slice(0, 4) : "—", sub: siteDef.label },
        ].map((s) => (
          <div key={s.label} className="bg-paper p-4">
            <dt className="pixel text-muted">{s.label}</dt>
            <dd className="mt-2 font-display text-3xl font-extrabold tabular-nums tracking-[-0.03em] text-ink">{s.value}</dd>
            <dd className="mt-0.5 text-xs text-muted">{s.sub}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-3 border border-line bg-paper p-3 sm:p-5">
        {series.length > 1 ? (
          <Chart key={`${site}-${control}`} series={series} label={`${siteDef.label} ${control} rating`} />
        ) : (
          <div className="grid h-[260px] place-items-center text-sm text-muted">
            {failed ? "Rating data couldn't load. Try refreshing." : "Loading ratings…"}
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 font-mono text-[11px] text-faint">
        <p>
          {live && (
            <span className="mr-2 inline-flex items-center gap-1.5 text-accent">
              <span aria-hidden="true" className="blink inline-block h-1.5 w-1.5 bg-accent" />
              Live
            </span>
          )}
          {data && `History updated ${new Date(data.updated).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}. `}Data from the Chess.com, Lichess, and US Chess
          public APIs.
        </p>
        {series.length > 1 && <YearTable series={series} />}
      </div>
    </div>
  );
}

const W = 760;
const H = 280;
const PAD = { top: 18, right: 64, bottom: 28, left: 44 };

function Chart({ series, label }: { series: Series; label: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<number | null>(null);
  const [width, setWidth] = useState(W);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(Math.max(280, entry.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const geo = useMemo(() => {
    const ts = series.map(([d]) => Date.parse(`${d}T00:00:00Z`));
    const ys = series.map(([, r]) => r);
    const t0 = ts[0];
    const t1 = Math.max(ts[ts.length - 1], t0 + 86_400_000);
    const lo = Math.min(...ys);
    const hi = Math.max(...ys);
    const step = niceStep(Math.max(hi - lo, 100));
    const y0 = Math.floor((lo - step * 0.25) / step) * step;
    const y1 = Math.ceil((hi + step * 0.25) / step) * step;
    const x = (t: number) => PAD.left + ((t - t0) / (t1 - t0)) * (width - PAD.left - PAD.right);
    const y = (r: number) => PAD.top + (1 - (r - y0) / (y1 - y0)) * (H - PAD.top - PAD.bottom);
    const pts = series.map((p, i) => [x(ts[i]), y(p[1])] as const);
    const line = pts.map(([px, py], i) => `${i ? "L" : "M"}${px.toFixed(1)},${py.toFixed(1)}`).join("");
    const area = `${line}L${pts[pts.length - 1][0].toFixed(1)},${H - PAD.bottom}L${pts[0][0].toFixed(1)},${H - PAD.bottom}Z`;
    const yTicks: number[] = [];
    for (let v = y0; v <= y1; v += step) yTicks.push(v);
    const startYear = new Date(t0).getUTCFullYear();
    const endYear = new Date(t1).getUTCFullYear();
    const every = Math.ceil((endYear - startYear + 1) / Math.max(2, Math.floor(width / 90)));
    const xTicks: { x: number; label: string }[] = [];
    for (let yr = startYear + 1; yr <= endYear; yr += every) xTicks.push({ x: x(Date.UTC(yr, 0, 1)), label: String(yr) });
    const peakIndex = ys.indexOf(hi);
    return { pts, line, area, yTicks, xTicks, y, peakIndex };
  }, [series, width]);

  const nearest = useCallback(
    (clientX: number) => {
      const rect = wrapRef.current!.getBoundingClientRect();
      const px = ((clientX - rect.left) / rect.width) * width;
      let lo = 0;
      let hi = geo.pts.length - 1;
      while (hi - lo > 1) {
        const mid = (lo + hi) >> 1;
        if (geo.pts[mid][0] < px) lo = mid;
        else hi = mid;
      }
      return Math.abs(geo.pts[lo][0] - px) <= Math.abs(geo.pts[hi][0] - px) ? lo : hi;
    },
    [geo, width],
  );

  const onKey = (e: React.KeyboardEvent) => {
    const last = geo.pts.length - 1;
    const step = e.shiftKey ? 30 : 1;
    if (e.key === "ArrowLeft") setHover((h) => Math.max(0, (h ?? last) - step));
    else if (e.key === "ArrowRight") setHover((h) => Math.min(last, (h ?? last) + step));
    else if (e.key === "Home") setHover(0);
    else if (e.key === "End") setHover(last);
    else return;
    e.preventDefault();
  };

  const lastIndex = geo.pts.length - 1;
  const h = hover !== null ? geo.pts[hover] : null;
  const labelY = (i: number) => Math.max(PAD.top + 10, geo.pts[i][1] - 12);

  return (
    <div
      ref={wrapRef}
      tabIndex={0}
      role="img"
      aria-label={`${label}: ${series[0][1]} on ${fmtDate(series[0][0])} to ${series[lastIndex][1]} on ${fmtDate(series[lastIndex][0])}, peak ${series[geo.peakIndex][1]}. Use the arrow keys to read values.`}
      onPointerMove={(e) => setHover(nearest(e.clientX))}
      onPointerLeave={() => setHover(null)}
      onKeyDown={onKey}
      onBlur={() => setHover(null)}
      className="relative w-full touch-pan-y outline-offset-4"
    >
      <svg viewBox={`0 0 ${width} ${H}`} className="block h-[280px] w-full overflow-visible" aria-hidden="true">
        {geo.yTicks.map((v) => (
          <g key={v}>
            <line x1={PAD.left} x2={width - PAD.right} y1={geo.y(v)} y2={geo.y(v)} className="stroke-line" strokeWidth="1" />
            <text x={PAD.left - 8} y={geo.y(v) + 4} textAnchor="end" className="fill-faint font-mono text-[11px]">
              {v}
            </text>
          </g>
        ))}
        {geo.xTicks.map((t) => (
          <text key={t.label} x={t.x} y={H - 8} textAnchor="middle" className="fill-faint font-mono text-[11px]">
            {t.label}
          </text>
        ))}

        <g className="chart-draw">
          <path d={geo.area} className="fill-accent/10" />
          <path d={geo.line} className="fill-none stroke-accent" strokeWidth="2" strokeLinejoin="round" />
        </g>

        {/* Direct labels: peak and current only */}
        {geo.peakIndex !== lastIndex && (
          <g>
            <circle cx={geo.pts[geo.peakIndex][0]} cy={geo.pts[geo.peakIndex][1]} r="4" className="fill-accent stroke-paper" strokeWidth="2" />
            <text
              x={geo.pts[geo.peakIndex][0]}
              y={labelY(geo.peakIndex)}
              textAnchor="middle"
              className="fill-ink font-mono text-[11px] font-semibold"
            >
              Peak {series[geo.peakIndex][1]}
            </text>
          </g>
        )}
        <circle cx={geo.pts[lastIndex][0]} cy={geo.pts[lastIndex][1]} r="4" className="fill-accent stroke-paper" strokeWidth="2" />
        <text x={geo.pts[lastIndex][0] + 8} y={geo.pts[lastIndex][1] + 4} className="fill-ink font-mono text-[11px] font-semibold">
          {series[lastIndex][1]}
        </text>

        {h && (
          <g>
            <line x1={h[0]} x2={h[0]} y1={PAD.top} y2={H - PAD.bottom} className="stroke-ink/40" strokeWidth="1" />
            <circle cx={h[0]} cy={h[1]} r="5" className="fill-accent stroke-paper" strokeWidth="2" />
          </g>
        )}
      </svg>

      {h && hover !== null && (
        <div
          className="pointer-events-none absolute top-1 z-10 -translate-x-1/2 border border-line bg-paper-2 px-2.5 py-1.5 shadow-[3px_3px_0_0_rgb(var(--ink)/0.25)]"
          style={{ left: `${Math.min(Math.max((h[0] / width) * 100, 10), 90)}%` }}
        >
          <p className="font-mono text-sm font-semibold tabular-nums text-ink">{series[hover][1]}</p>
          <p className="whitespace-nowrap text-[11px] text-muted">{fmtDate(series[hover][0])}</p>
        </div>
      )}
    </div>
  );
}

/** The same data without the chart: start, end, and peak for each year. */
function YearTable({ series }: { series: Series }) {
  const rows = useMemo(() => {
    const byYear = new Map<string, number[]>();
    for (const [d, r] of series) {
      const y = d.slice(0, 4);
      byYear.set(y, [...(byYear.get(y) ?? []), r]);
    }
    return [...byYear.entries()].reverse().map(([year, rs]) => ({ year, start: rs[0], end: rs[rs.length - 1], peak: Math.max(...rs) }));
  }, [series]);

  return (
    <details className="group w-full sm:w-auto">
      <summary className="cursor-pointer list-none text-muted hover:text-ink sm:text-right">
        <span className="group-open:hidden">View as table ▾</span>
        <span className="hidden group-open:inline">Hide table ▴</span>
      </summary>
      <table className="mt-3 w-full border-collapse text-left font-mono text-xs text-copy sm:min-w-[320px]">
        <thead>
          <tr className="border-b border-line text-faint">
            <th className="py-1.5 pr-4 font-normal">Year</th>
            <th className="py-1.5 pr-4 text-right font-normal">Start</th>
            <th className="py-1.5 pr-4 text-right font-normal">End</th>
            <th className="py-1.5 text-right font-normal">Peak</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.year} className="border-b border-line/60">
              <td className="py-1.5 pr-4 text-ink">{r.year}</td>
              <td className="py-1.5 pr-4 text-right tabular-nums">{r.start}</td>
              <td className="py-1.5 pr-4 text-right tabular-nums">{r.end}</td>
              <td className="py-1.5 text-right tabular-nums">{r.peak}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </details>
  );
}
