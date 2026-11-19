"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChessKnight, Pause, Play, RotateCcw } from "lucide-react";
import { prefersReducedMotion } from "./transition-link";

/* The same algorithm as the Python repo, ported to run live in the browser. */

const MOVES = [
  [1, 2],
  [2, 1],
  [2, -1],
  [1, -2],
  [-1, -2],
  [-2, -1],
  [-2, 1],
  [-1, 2],
] as const;
const LIMIT = 3_000_000;
const SPEEDS = [1, 4, 16, 64, 256, 1024, 4096];

type Order = "plain" | "warnsdorff";
type Step = { kind: "push" | "pop"; sq: number };
type Outcome = "found" | "exhausted";

function geometry(n: number) {
  const neighbors: number[][] = [];
  const dist: number[] = [];
  const c = (n - 1) / 2;
  for (let sq = 0; sq < n * n; sq++) {
    const r = Math.floor(sq / n);
    const col = sq % n;
    neighbors.push(
      MOVES.filter(([dr, dc]) => r + dr >= 0 && r + dr < n && col + dc >= 0 && col + dc < n).map(
        ([dr, dc]) => (r + dr) * n + col + dc,
      ),
    );
    dist.push((r - c) ** 2 + (col - c) ** 2);
  }
  return { neighbors, dist };
}

/** Depth-first search that yields every step onto (push) and back off (pop) a square. */
function* search(n: number, start: number, order: Order): Generator<Step, Outcome> {
  const { neighbors, dist } = geometry(n);
  const total = n * n;
  const visited = new Uint8Array(total);
  const degree = neighbors.map((a) => a.length);
  const visit = (sq: number) => {
    visited[sq] = 1;
    for (const x of neighbors[sq]) degree[x]--;
  };
  const leave = (sq: number) => {
    visited[sq] = 0;
    for (const x of neighbors[sq]) degree[x]++;
  };
  const candidates = (sq: number) => {
    const c = neighbors[sq].filter((x) => !visited[x]);
    if (order === "warnsdorff") c.sort((a, b) => degree[a] - degree[b] || dist[b] - dist[a]);
    return c;
  };

  const path = [start];
  visit(start);
  const stack = [{ c: candidates(start), i: 0 }];
  yield { kind: "push", sq: start };

  while (stack.length) {
    if (path.length === total) return "found";
    const top = stack[stack.length - 1];
    if (top.i >= top.c.length) {
      stack.pop();
      const sq = path.pop()!;
      leave(sq);
      yield { kind: "pop", sq };
      continue;
    }
    const next = top.c[top.i++];
    if (visited[next]) continue;
    path.push(next);
    visit(next);
    stack.push({ c: candidates(next), i: 0 });
    yield { kind: "push", sq: next };
  }
  return "exhausted";
}

type Racer = {
  order: Order;
  gen: Generator<Step, Outcome>;
  path: number[];
  steps: number;
  backtracks: number;
  status: "ready" | "running" | Outcome | "gave up";
};

const makeRacer = (n: number, start: number, order: Order): Racer => ({
  order,
  gen: search(n, start, order),
  path: [],
  steps: 0,
  backtracks: 0,
  status: "ready",
});

const fileName = (n: number, sq: number) => `${"abcdefghijkl"[sq % n]}${Math.floor(sq / n) + 1}`;

export function KnightsLab() {
  const [n, setN] = useState(8);
  const [start, setStart] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [running, setRunning] = useState(false);
  const [, setTick] = useState(0);
  const racers = useRef<Racer[]>([makeRacer(8, 0, "plain"), makeRacer(8, 0, "warnsdorff")]);
  const frame = useRef(0);

  const reset = useCallback((size: number, sq: number) => {
    cancelAnimationFrame(frame.current);
    racers.current = [makeRacer(size, sq, "plain"), makeRacer(size, sq, "warnsdorff")];
    setRunning(false);
    setTick((t) => t + 1);
  }, []);

  const advance = useCallback((count: number) => {
    let active = false;
    for (const r of racers.current) {
      if (r.status !== "ready" && r.status !== "running") continue;
      r.status = "running";
      for (let i = 0; i < count; i++) {
        const next = r.gen.next();
        if (next.done) {
          r.status = next.value;
          break;
        }
        if (next.value.kind === "push") {
          r.path.push(next.value.sq);
          r.steps++;
        } else {
          r.path.pop();
          r.backtracks++;
        }
        if (r.steps >= LIMIT) {
          r.status = "gave up";
          break;
        }
      }
      if (r.status === "running") active = true;
    }
    return active;
  }, []);

  useEffect(() => {
    if (!running) return;
    const loop = () => {
      const active = advance(SPEEDS[speed]);
      setTick((t) => t + 1);
      if (active) frame.current = requestAnimationFrame(loop);
      else setRunning(false);
    };
    frame.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame.current);
  }, [running, speed, advance]);

  const finished = racers.current.every((r) => r.status !== "ready" && r.status !== "running");

  const play = () => {
    if (finished) reset(n, start);
    if (prefersReducedMotion()) {
      advance(LIMIT * 2);
      setTick((t) => t + 1);
      return;
    }
    setRunning(true);
  };

  const pick = (sq: number) => {
    setStart(sq);
    reset(n, sq);
  };

  return (
    <div className="space-y-5">
      {/* Controls */}
      <div className="flex flex-col gap-4 border border-line bg-paper-2/60 p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <div className="flex items-center gap-2">
            <span className="pixel text-muted">Board</span>
            {[5, 6, 7, 8].map((size) => (
              <button
                key={size}
                type="button"
                aria-pressed={n === size}
                onClick={() => {
                  setN(size);
                  setStart(0);
                  reset(size, 0);
                }}
                className={`cursor-pointer border px-2 py-1 font-mono text-xs transition-colors ${
                  n === size ? "border-accent bg-accent text-accent-ink" : "border-line text-muted hover:text-ink"
                }`}
              >
                {size}×{size}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2">
            <span className="pixel text-muted">Start</span>
            <select
              value={start}
              onChange={(e) => pick(Number(e.target.value))}
              className="cursor-pointer border border-line bg-paper px-2 py-1 font-mono text-xs text-ink"
            >
              {Array.from({ length: n * n }, (_, sq) => (
                <option key={sq} value={sq}>
                  {fileName(n, sq)}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2">
            <span className="pixel text-muted">Speed</span>
            <input
              type="range"
              min={0}
              max={SPEEDS.length - 1}
              step={1}
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-28 accent-[rgb(var(--accent))]"
              aria-label="Speed"
              aria-valuetext={`${SPEEDS[speed]} steps per frame`}
            />
            <span className="w-16 font-mono text-xs text-muted">{SPEEDS[speed]}/frame</span>
          </label>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => (running ? setRunning(false) : play())}
            className="btn-game inline-flex items-center gap-2 bg-lime px-4 py-2 font-display text-sm font-bold text-lime-ink"
          >
            {running ? <Pause aria-hidden="true" className="h-4 w-4" /> : <Play aria-hidden="true" className="h-4 w-4" />}
            {running ? "Pause" : finished ? "Race again" : "Start race"}
          </button>
          <button
            type="button"
            onClick={() => reset(n, start)}
            className="btn-game inline-flex items-center gap-2 border-2 border-ink bg-paper px-3 py-[6px] font-display text-sm font-bold text-ink"
          >
            <RotateCcw aria-hidden="true" className="h-4 w-4" />
            Reset
          </button>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {racers.current.map((r) => (
          <RacerBoard key={r.order} racer={r} n={n} start={start} onPick={pick} />
        ))}
      </div>
      <p className="text-xs text-muted">
        Click any square to start there. On 5×5 and 7×7, only squares the color of a1 can start a tour, so watch what
        happens from the other color.
      </p>
    </div>
  );
}

const statusText = (r: Racer) => {
  switch (r.status) {
    case "ready":
      return "Ready";
    case "running":
      return "Searching…";
    case "found":
      return `Tour found after ${r.steps.toLocaleString()} steps`;
    case "exhausted":
      return `No tour from here. Every path checked (${r.steps.toLocaleString()} steps)`;
    case "gave up":
      return `Gave up after ${LIMIT.toLocaleString()} steps`;
  }
};

function RacerBoard({ racer, n, start, onPick }: { racer: Racer; n: number; start: number; onPick: (sq: number) => void }) {
  const S = 100;
  const index = new Map(racer.path.map((sq, i) => [sq, i + 1]));
  const center = (sq: number) => [(sq % n) * S + S / 2, (n - 1 - Math.floor(sq / n)) * S + S / 2] as const;
  const points = racer.path.map((sq) => center(sq).join(",")).join(" ");
  const head = racer.path.length ? center(racer.path[racer.path.length - 1]) : center(start);
  const done = racer.status === "found";
  const title = racer.order === "plain" ? "Brute force" : "Warnsdorff order";
  const sub = racer.order === "plain" ? "Tries moves in a fixed order" : "Fewest onward moves first";

  return (
    <figure className="space-y-3">
      <figcaption className="flex items-end justify-between gap-3">
        <span>
          <span className="block font-display text-lg font-bold tracking-tight text-ink">{title}</span>
          <span className="block text-xs text-muted">{sub}</span>
        </span>
        <span className="text-right font-mono text-[11px] text-muted">
          <span className="block">
            <span className="text-ink">{racer.steps.toLocaleString()}</span> steps
          </span>
          <span className="block">
            <span className="text-ink">{racer.backtracks.toLocaleString()}</span> backtracks
          </span>
        </span>
      </figcaption>
      <div className={`border-2 p-1 transition-colors ${done ? "border-accent" : "border-line"}`}>
        <svg viewBox={`0 0 ${n * S} ${n * S}`} className="block w-full" role="img" aria-label={`${title}: ${statusText(racer)}`}>
          {Array.from({ length: n * n }, (_, sq) => {
            const [cx, cy] = center(sq);
            const step = index.get(sq);
            const light = (Math.floor(sq / n) + (sq % n)) % 2 === 1;
            return (
              <g key={sq} onClick={() => onPick(sq)} className="cursor-pointer">
                <rect
                  x={cx - S / 2}
                  y={cy - S / 2}
                  width={S}
                  height={S}
                  className={sq === start ? "fill-accent/40" : light ? "fill-sq-light" : "fill-sq-dark"}
                />
                {step && (
                  <text x={cx - S / 2 + 8} y={cy - S / 2 + 24} className="fill-ink/70 font-mono" fontSize="20">
                    {step}
                  </text>
                )}
              </g>
            );
          })}
          {racer.path.length > 1 && (
            <polyline points={points} fill="none" className="stroke-accent" strokeWidth="5" strokeLinejoin="round" strokeLinecap="round" />
          )}
          <g transform={`translate(${head[0] - 30} ${head[1] - 30})`} className="pointer-events-none">
            <rect width="60" height="60" className="fill-lime" />
            <ChessKnight x={10} y={10} width={40} height={40} className="text-lime-ink" strokeWidth={2.2} />
          </g>
        </svg>
      </div>
      <p className={`font-mono text-xs ${done ? "text-accent" : racer.status === "gave up" || racer.status === "exhausted" ? "text-coral" : "text-muted"}`}>
        {statusText(racer)}
      </p>
    </figure>
  );
}
