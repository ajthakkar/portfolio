"use client";

import { useEffect, useState } from "react";
import type { GlyphMark } from "@/lib/content";
import { Glyph } from "./ui";

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
      <p className="pixel text-faint">Key moves</p>
      <ol className="space-y-1">
        {moves.map((move, i) => (
          <li key={move.title}>
            <a
              href={`#move-${i + 1}`}
              className={`flex items-start gap-2.5 border-l-2 px-2 py-1.5 text-[13px] transition-colors ${
                active === i ? "border-accent bg-paper-2 text-ink" : "border-transparent text-muted hover:text-ink"
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
