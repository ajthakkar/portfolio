import type { Metadata } from "next";
import { TransitionLink } from "@/components/transition-link";
import { Kicker } from "@/components/ui";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 pb-10 pt-16 sm:px-6 sm:pt-24 md:grid-cols-[1fr_220px] md:items-center">
      <div className="space-y-5">
        <Kicker>404 · Illegal move</Kicker>
        <h1 className="font-display text-5xl font-extrabold leading-[0.9] tracking-[-0.04em] text-ink sm:text-7xl">
          That square isn&apos;t <span className="text-accent">on the board.</span>
        </h1>
        <p className="max-w-md text-base leading-relaxed text-copy">The page you&apos;re looking for doesn&apos;t exist. Take the move back.</p>
        <TransitionLink
          href="/"
          className="btn-game inline-flex bg-lime px-4 py-2.5 font-display text-sm font-bold text-lime-ink"
        >
          Back to the start
        </TransitionLink>
      </div>
      <svg viewBox="0 0 90 90" aria-hidden="true" className="mx-auto w-40 md:w-full">
        {Array.from({ length: 64 }, (_, i) => {
          const x = i % 8;
          const y = Math.floor(i / 8);
          return (
            <rect key={i} x={5 + x * 10} y={5 + y * 10} width="10" height="10" className={(x + y) % 2 ? "fill-sq-dark" : "fill-sq-light"} />
          );
        })}
        <rect x="5" y="5" width="80" height="80" fill="none" className="stroke-ink/20" strokeWidth="0.6" />
        <g className="stroke-accent" strokeWidth="2.2" strokeLinecap="round">
          <line x1="80" y1="-2" x2="90" y2="8" />
          <line x1="90" y1="-2" x2="80" y2="8" />
        </g>
      </svg>
    </div>
  );
}
