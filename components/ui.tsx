import type { ReactNode } from "react";
import { ChessBishop, ChessKing, ChessKnight, ChessQueen, ChessRook, Lock } from "lucide-react";
import { glyphMeaning, type GlyphMark, type Piece, type SkillState } from "@/lib/content";

const pieceIcons = { king: ChessKing, queen: ChessQueen, rook: ChessRook, bishop: ChessBishop, knight: ChessKnight };

export function PieceIcon({ piece, className = "" }: { piece: Piece; className?: string }) {
  const Icon = pieceIcons[piece];
  return <Icon aria-hidden="true" className={className} />;
}

/** A panel with cut corners. The outer layer draws the border, the inner one the fill. */
export function Panel({
  children,
  className = "",
  inner = "",
  small = false,
}: {
  children: ReactNode;
  className?: string;
  inner?: string;
  small?: boolean;
}) {
  const notch = small ? "notch notch-sm" : "notch";
  return (
    <div className={`${notch} bg-line p-px ${className}`}>
      <div className={`${notch} h-full bg-paper-2 ${inner}`}>{children}</div>
    </div>
  );
}

const chipStyle: Record<SkillState | "complete", string> = {
  complete: "bg-lime text-lime-ink",
  unlocked: "bg-lime text-lime-ink",
  training: "border border-coral text-coral",
  locked: "border border-line text-faint",
};
const chipLabel: Record<SkillState | "complete", string> = {
  complete: "Complete",
  unlocked: "Unlocked",
  training: "In progress",
  locked: "Locked",
};

export function StatusChip({ state, className = "" }: { state: SkillState | "complete"; className?: string }) {
  return (
    <span className={`pixel inline-flex items-center gap-1 px-1.5 py-[3px] ${chipStyle[state]} ${className}`}>
      {state === "locked" && <Lock aria-hidden="true" className="h-2.5 w-2.5" />}
      {chipLabel[state]}
    </span>
  );
}

/** A strip of highlights that scrolls sideways. Paused on hover and for reduced motion. */
export function Ticker({ items }: { items: string[] }) {
  return (
    <div className="marquee-wrap overflow-hidden border-y border-line bg-paper-2/70 py-3">
      <ul aria-label="Highlights" className="marquee flex w-max">
        {[...items, ...items].map((item, i) => (
          <li
            key={`${item}-${i}`}
            aria-hidden={i >= items.length ? true : undefined}
            className="flex shrink-0 items-center gap-6 pr-6 font-mono text-xs uppercase tracking-wider text-muted"
          >
            <span aria-hidden="true" className="text-accent">
              ✦
            </span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

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
    <svg viewBox="0 0 80 80" aria-hidden="true" className={`overflow-hidden ${className}`}>
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

/** HUD label with a menu cursor, e.g. "▸ Skill tree". */
export function Kicker({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`pixel flex items-center gap-1.5 text-accent ${className}`}>
      <span aria-hidden="true">▸</span>
      {children}
    </p>
  );
}

export function SectionTitle({ kicker, title, aside }: { kicker: string; title: ReactNode; aside?: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 border-b border-line pb-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-2.5">
        <Kicker>{kicker}</Kicker>
        <h2 className="font-display text-3xl font-bold tracking-[-0.02em] text-ink sm:text-[2.6rem]">{title}</h2>
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
