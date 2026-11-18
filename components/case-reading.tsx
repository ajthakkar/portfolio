"use client";

import { useEffect, useState } from "react";
import type { GlyphMark } from "@/lib/content";
import { Glyph } from "./ui";

/** Reading progress drawn like a chess engine's evaluation bar. */
export function EvalBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  const evaluation = (progress * 2 - 1).toFixed(1);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed bottom-0 left-0 top-14 z-30 w-1 bg-[#2a2622] sm:w-2">
      <div className="absolute inset-x-0 bottom-0 bg-[#ece3d3] transition-[height] duration-150" style={{ height: `${progress * 100}%` }} />
      <span className="absolute bottom-2 left-3 hidden rounded bg-[#2a2622] px-1.5 py-0.5 font-mono text-[10px] text-[#ece3d3] lg:block">
        {Number(evaluation) > 0 ? "+" : ""}
        {evaluation}
      </span>
    </div>
  );
}

/** Sticky list of key moves that highlights the one being read. */
export function MoveList({ moves }: { moves: { glyph: GlyphMark; title: string }[] }) {
  const [active, setActive] = useState(-1);

  useEffect(() => {
    const targets = moves.map((_, i) => document.getElementById(`move-${i + 1}`)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(targets.indexOf(visible[0].target as HTMLElement));
      },
      { rootMargin: "-20% 0px -55% 0px" },
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, [moves]);

  if (moves.length === 0) return null;

  return (
    <nav aria-label="Key moves" className="space-y-3">
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-faint">Key moves</p>
      <ol className="space-y-1">
        {moves.map((move, i) => (
          <li key={move.title}>
            <a
              href={`#move-${i + 1}`}
              className={`flex items-start gap-2.5 rounded-lg px-2 py-1.5 text-[13px] transition-colors ${
                active === i ? "bg-paper-2 text-ink" : "text-muted hover:text-ink"
              }`}
            >
              <span className="w-4 pt-1 font-mono text-[11px] text-faint">{i + 1}.</span>
              <Glyph mark={move.glyph} />
              <span className="min-w-0 leading-snug">{move.title}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
