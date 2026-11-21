"use client";

import { useEffect, useMemo, useState } from "react";

type Bin = { lo: number; hi: number; n: number; mean_price: number; freq: number; lo_ci: number; hi_ci: number };
type Slope = { slope: number; slope_lo: number; slope_hi: number; n: number };
type Group = { n: number; brier: number; slope: Slope; bins: Bin[] };
type Data = {
  markets: number;
  events: number;
  horizons: Record<string, Group>;
  categories: Record<string, Group>;
};

const HORIZONS: [string, string][] = [
  ["30", "30 days out"],
  ["7", "7 days out"],
  ["1", "1 day out"],
];
const pct = (x: number) => `${(x * 100).toFixed(x < 0.1 || x > 0.9 ? 1 : 0)}%`;

/** Reliability diagram: market price vs. how often YES actually happened, with 95% intervals. */
export function MarketCalibration() {
  const [data, setData] = useState<Data | null>(null);
  const [failed, setFailed] = useState(false);
  const [horizon, setHorizon] = useState("7");
  const [category, setCategory] = useState("All");
  const [active, setActive] = useState<number | null>(null);
  const [showTable, setShowTable] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/data/prediction-markets.json", { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setData)
      .catch((e) => {
        if (e?.name !== "AbortError") setFailed(true);
      });
    return () => controller.abort();
  }, []);

  // Categories are measured 7 days out; picking one locks the horizon there.
  const group: Group | undefined = useMemo(() => {
    if (!data) return undefined;
    return category === "All" ? data.horizons[horizon] : data.categories[category];
  }, [data, horizon, category]);
  const categories = data ? ["All", ...Object.keys(data.categories).sort((a, b) => data.categories[b].n - data.categories[a].n)] : ["All"];

  const S = 300;
  const pad = { l: 44, r: 12, t: 12, b: 40 };
  const W = S + pad.l + pad.r;
  const H = S + pad.t + pad.b;
  const x = (v: number) => pad.l + v * S;
  const y = (v: number) => pad.t + (1 - v) * S;
  const ticks = [0, 0.25, 0.5, 0.75, 1];
  const shown = active !== null && group ? group.bins[active] : null;

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div role="tablist" aria-label="How long before the market closed" className="flex flex-wrap gap-1.5">
          {HORIZONS.map(([id, label]) => (
            <button
              key={id}
              role="tab"
              type="button"
              aria-selected={horizon === id}
              disabled={category !== "All" && id !== "7"}
              onClick={() => {
                setHorizon(id);
                setActive(null);
              }}
              className={`cursor-pointer border px-3 py-1.5 font-display text-sm font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                horizon === id ? "border-ink bg-ink text-paper" : "border-line text-muted hover:border-ink/40 hover:text-ink"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div aria-label="Category" className="flex flex-wrap gap-1.5">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={category === c}
              onClick={() => {
                setCategory(c);
                if (c !== "All") setHorizon("7");
                setActive(null);
              }}
              className={`cursor-pointer border px-2.5 py-1 font-mono text-xs transition-colors ${
                category === c ? "border-accent bg-accent text-accent-ink" : "border-line text-muted hover:text-ink"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3 grid gap-6 border border-line bg-paper p-4 sm:p-6 lg:grid-cols-[minmax(0,380px)_1fr] lg:items-center">
        {!data || !group ? (
          <div className="grid h-[300px] place-items-center text-sm text-muted lg:col-span-2">
            {failed ? "The data couldn't load. Try refreshing." : "Loading markets…"}
          </div>
        ) : (
          <>
            <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Market price against how often the event happened" className="w-full max-w-[380px]">
              {ticks.map((t) => (
                <g key={t}>
                  <line x1={x(t)} x2={x(t)} y1={y(0)} y2={y(1)} className="stroke-line" strokeWidth={1} />
                  <line x1={x(0)} x2={x(1)} y1={y(t)} y2={y(t)} className="stroke-line" strokeWidth={1} />
                  <text x={x(t)} y={y(0) + 16} textAnchor="middle" className="fill-faint font-mono" fontSize={11}>
                    {t * 100}%
                  </text>
                  <text x={x(0) - 8} y={y(t) + 4} textAnchor="end" className="fill-faint font-mono" fontSize={11}>
                    {t * 100}%
                  </text>
                </g>
              ))}
              <line x1={x(0)} y1={y(0)} x2={x(1)} y2={y(1)} className="stroke-muted" strokeWidth={1} strokeDasharray="4 3" />
              {/* Key in the empty lower-right corner, where no market ever lands, so it can't cover a point. */}
              <line x1={x(0.56)} y1={y(0.07)} x2={x(0.63)} y2={y(0.07)} className="stroke-muted" strokeWidth={1} strokeDasharray="4 3" />
              <text x={x(0.65)} y={y(0.07) + 4} className="fill-faint" fontSize={11}>
                perfectly calibrated
              </text>
              {group.bins.map((b, i) => (
                <g
                  key={i}
                  onMouseEnter={() => setActive(i)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(i)}
                  onBlur={() => setActive(null)}
                  tabIndex={0}
                  role="button"
                  aria-label={`Priced ${pct(b.lo)} to ${pct(b.hi)}: happened ${pct(b.freq)} of the time`}
                  className="cursor-pointer outline-none"
                >
                  <rect x={x(b.mean_price) - 12} y={y(1)} width={24} height={S} fill="transparent" />
                  <line x1={x(b.mean_price)} x2={x(b.mean_price)} y1={y(b.lo_ci)} y2={y(b.hi_ci)} className="stroke-accent" strokeWidth={2} />
                  <circle
                    cx={x(b.mean_price)}
                    cy={y(b.freq)}
                    r={active === i ? 6.5 : 5}
                    className="fill-accent stroke-paper"
                    strokeWidth={2}
                  />
                </g>
              ))}
              <text x={x(0.5)} y={H - 4} textAnchor="middle" className="fill-muted" fontSize={12}>
                Market price of YES
              </text>
              <text x={12} y={y(0.5)} textAnchor="middle" className="fill-muted" fontSize={12} transform={`rotate(-90 12 ${y(0.5)})`}>
                Share that happened
              </text>
            </svg>

            <div className="space-y-4">
              <div aria-live="polite" className="min-h-[92px] border-l-2 border-accent pl-4">
                {shown ? (
                  <>
                    <p className="font-display text-lg font-bold text-ink">
                      Priced {pct(shown.lo)}–{pct(shown.hi)}
                    </p>
                    <p className="text-sm text-copy">
                      Average price {pct(shown.mean_price)}. It happened {pct(shown.freq)} of the time (95% interval{" "}
                      {pct(shown.lo_ci)}–{pct(shown.hi_ci)}), across {shown.n.toLocaleString("en-US")} contracts.
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-muted">Hover or tab to a point to see the numbers behind it.</p>
                )}
              </div>
              <dl className="grid grid-cols-2 gap-3">
                <div>
                  <dt className="pixel text-muted">Calibration slope</dt>
                  <dd className="font-display text-2xl font-bold text-ink">
                    {group.slope.slope.toFixed(2)}
                    <span className="ml-1.5 font-mono text-xs font-normal text-faint">
                      {group.slope.slope_lo.toFixed(2)}–{group.slope.slope_hi.toFixed(2)}
                    </span>
                  </dd>
                  <dd className="text-xs text-muted">1.00 is perfect. Above 1, prices sit too close to 50%.</dd>
                </div>
                <div>
                  <dt className="pixel text-muted">Brier score</dt>
                  <dd className="font-display text-2xl font-bold text-ink">{group.brier.toFixed(3)}</dd>
                  <dd className="text-xs text-muted">Average squared miss. 0 is perfect; always saying 50% scores 0.25.</dd>
                </div>
              </dl>
              <p className="font-mono text-[11px] text-faint">{group.n.toLocaleString("en-US")} contracts in this view.</p>
            </div>
          </>
        )}
      </div>

      {data && group && (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 font-mono text-[11px] text-faint">
          <p>
            {data.markets.toLocaleString("en-US")} resolved Polymarket yes/no markets from {data.events.toLocaleString("en-US")}{" "}
            events, 2024–2026. Intervals resample whole events.
          </p>
          <button type="button" onClick={() => setShowTable((v) => !v)} className="cursor-pointer py-1 text-accent" aria-expanded={showTable}>
            {showTable ? "Hide" : "Show"} the numbers
          </button>
        </div>
      )}
      {showTable && group && (
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[420px] border-collapse text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-line text-faint">
                <th className="py-1.5 pr-3 font-normal">Price range</th>
                <th className="py-1.5 pr-3 font-normal">Avg. price</th>
                <th className="py-1.5 pr-3 font-normal">Happened</th>
                <th className="py-1.5 pr-3 font-normal">95% interval</th>
                <th className="py-1.5 font-normal">Contracts</th>
              </tr>
            </thead>
            <tbody>
              {group.bins.map((b, i) => (
                <tr key={i} className="border-b border-line/60 text-copy">
                  <td className="py-1.5 pr-3">
                    {pct(b.lo)}–{pct(b.hi)}
                  </td>
                  <td className="py-1.5 pr-3">{pct(b.mean_price)}</td>
                  <td className="py-1.5 pr-3">{pct(b.freq)}</td>
                  <td className="py-1.5 pr-3">
                    {pct(b.lo_ci)}–{pct(b.hi_ci)}
                  </td>
                  <td className="py-1.5">{b.n.toLocaleString("en-US")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
