import type { ReactNode } from "react";
import { glyphMeaning, type GlyphMark } from "@/lib/content";

/* Chess annotation mark used to grade decisions in a case. */
const glyphStyle: Record<GlyphMark, string> = {
  "!!": "bg-accent text-accent-ink border-accent",
  "!": "text-accent border-accent/60",
  "!?": "text-ink border-ink/30",
  "?!": "text-muted border-dashed border-muted/60",
  "?": "bg-ink text-paper border-ink",
};

export function Glyph({ mark, className = "" }: { mark: GlyphMark; className?: string }) {
  return (
    <span
      title={glyphMeaning[mark]}
      aria-label={glyphMeaning[mark]}
      className={`inline-grid h-6 min-w-6 shrink-0 place-items-center rounded-md border px-1 font-mono text-[11px] font-semibold leading-none ${glyphStyle[mark]} ${className}`}
    >
      {mark}
    </span>
  );
}

export function GlyphLegend() {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-2">
      {(Object.keys(glyphMeaning) as GlyphMark[]).map((mark) => (
        <li key={mark} className="flex items-center gap-1.5 text-xs text-muted">
          <Glyph mark={mark} />
          <span>{glyphMeaning[mark].split(":")[0]}</span>
        </li>
      ))}
    </ul>
  );
}

/* A small 8×8 "position" unique to each case, generated from its slug. */
function seeded(text: string) {
  let h = 2166136261;
  for (const ch of text) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

export function CaseBoard({ seed, muted = false, className = "" }: { seed: string; muted?: boolean; className?: string }) {
  const rand = seeded(seed);
  const marked = new Set<number>();
  const count = 6 + Math.floor(rand() * 4);
  while (marked.size < count) marked.add(Math.floor(rand() * 64));
  const king = [...marked][0];

  return (
    <svg viewBox="0 0 80 80" aria-hidden="true" className={`overflow-hidden rounded-md ${className}`}>
      {Array.from({ length: 64 }, (_, i) => {
        const x = i % 8;
        const y = Math.floor(i / 8);
        const isMarked = marked.has(i) && !muted;
        return (
          <rect
            key={i}
            x={x * 10}
            y={y * 10}
            width="10"
            height="10"
            className={
              i === king && !muted
                ? "fill-accent"
                : isMarked
                  ? "fill-ink/70 transition-opacity duration-300 group-hover:opacity-40"
                  : (x + y) % 2 === 0
                    ? "fill-sq-light"
                    : "fill-sq-dark"
            }
          />
        );
      })}
    </svg>
  );
}

export function Kicker({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`font-mono text-[11px] uppercase tracking-[0.14em] text-accent ${className}`}>{children}</p>;
}

export function SectionTitle({ kicker, title, aside }: { kicker: string; title: ReactNode; aside?: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 border-b border-line pb-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-1.5">
        <Kicker>{kicker}</Kicker>
        <h2 className="font-display text-3xl tracking-tight text-ink sm:text-4xl">{title}</h2>
      </div>
      {aside}
    </div>
  );
}

export function ExternalLink({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`link-underline ${className}`}
    >
      {children}
      <span aria-hidden="true"> ↗</span>
    </a>
  );
}

/** Notes for Aayush about missing content. Rendered only by `npm run dev`. */
export function Gaps({ items, title = "Needs your input" }: { items?: string[]; title?: string }) {
  if (process.env.NODE_ENV !== "development" || !items?.length) return null;
  return (
    <aside className="rounded-lg border border-dashed border-accent/50 bg-accent/[0.04] p-4">
      <p className="font-mono text-[11px] uppercase tracking-wider text-accent">{title} · only visible locally</p>
      <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-copy">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </aside>
  );
}
