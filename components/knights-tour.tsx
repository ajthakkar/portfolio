"use client";

import { useEffect, useRef, useState } from "react";

/* A knight's tour found with Warnsdorff's rule: always jump to the square
   with the fewest onward moves. Computed once, deterministically. */
const JUMPS = [
  [1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1], [-2, 1], [-1, 2],
] as const;

function findTour(start: [number, number]): [number, number][] {
  const seen = new Set<string>();
  const key = (x: number, y: number) => `${x},${y}`;
  const onBoard = (x: number, y: number) => x >= 0 && x < 8 && y >= 0 && y < 8;
  const next = (x: number, y: number) =>
    JUMPS.map(([dx, dy]) => [x + dx, y + dy] as [number, number]).filter(([a, b]) => onBoard(a, b) && !seen.has(key(a, b)));

  const tour: [number, number][] = [start];
  seen.add(key(...start));
  while (tour.length < 64) {
    const [x, y] = tour[tour.length - 1];
    const options = next(x, y);
    if (options.length === 0) break;
    options.sort((p, q) => next(...p).length - next(...q).length);
    tour.push(options[0]);
    seen.add(key(...options[0]));
  }
  return tour;
}

const TOUR = findTour([0, 7]);
const STEP_MS = 420;
const S = 100; // user units per square
const HOLD_MS = 3200;

export function KnightsTour({ className = "" }: { className?: string }) {
  const [step, setStep] = useState(TOUR.length);
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let visible = true;
    let timer = 0;
    let current = 1;
    setStep(1);

    const tick = () => {
      if (!visible || document.hidden) {
        timer = window.setTimeout(tick, 600);
        return;
      }
      current = current >= TOUR.length ? 1 : current + 1;
      setStep(current);
      timer = window.setTimeout(tick, current >= TOUR.length ? HOLD_MS : STEP_MS);
    };
    timer = window.setTimeout(tick, 700);

    const observer = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    if (ref.current) observer.observe(ref.current);
    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  const center = ([x, y]: [number, number]) => [(x + 0.5) * S, (y + 0.5) * S] as const;
  const points = TOUR.slice(0, step)
    .map((p) => center(p).join(","))
    .join(" ");
  const [hx, hy] = center(TOUR[Math.max(0, step - 1)]);

  return (
    <figure className={className}>
      <svg
        ref={ref}
        viewBox="-15 -15 830 830"
        role="img"
        aria-label="A knight's tour: a knight visits all 64 squares of a chessboard exactly once."
        className="w-full rounded-lg"
      >
        <rect x="-15" y="-15" width="830" height="830" rx="22" className="fill-ink/10" />
        {Array.from({ length: 64 }, (_, i) => {
          const x = i % 8;
          const y = Math.floor(i / 8);
          return (
            <rect
              key={i}
              x={x * S}
              y={y * S}
              width={S}
              height={S}
              className={(x + y) % 2 === 0 ? "fill-sq-light" : "fill-sq-dark"}
            />
          );
        })}
        {TOUR.slice(0, step).map((p, i) => {
          return (
            <text
              key={`${p[0]}-${p[1]}`}
              x={p[0] * S + 10}
              y={p[1] * S + 30}
              className="fill-ink/50 font-mono"
              style={{ fontSize: 24 }}
            >
              {i + 1}
            </text>
          );
        })}
        <polyline
          points={points}
          fill="none"
          className="stroke-accent"
          strokeWidth="6"
          strokeLinejoin="round"
          strokeLinecap="round"
          opacity="0.85"
        />
        <g style={{ transform: `translate(${hx}px, ${hy}px)`, transition: "transform 260ms cubic-bezier(.2,.7,.2,1)" }}>
          <circle r="30" className="fill-accent" />
          <circle r="30" className="fill-none stroke-paper" strokeWidth="5" />
          <text y="11" textAnchor="middle" className="fill-accent-ink font-display" style={{ fontSize: 34, fontWeight: 600 }}>
            N
          </text>
        </g>
      </svg>
      <figcaption className="mt-2.5 flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-faint">
        <span>Knight&apos;s tour</span>
        <span aria-hidden="true">{String(step).padStart(2, "0")} / 64</span>
      </figcaption>
    </figure>
  );
}
