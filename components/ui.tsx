import type { ReactNode } from "react";
import { ChessBishop, ChessKing, ChessKnight, ChessQueen, ChessRook } from "lucide-react";
import { glyphMeaning, type GlyphMark, type Piece } from "@/lib/content";

const pieceIcons = { king: ChessKing, queen: ChessQueen, rook: ChessRook, bishop: ChessBishop, knight: ChessKnight };

export function PieceIcon({ piece, className = "" }: { piece: Piece; className?: string }) {
  const Icon = pieceIcons[piece];
  return <Icon aria-hidden="true" className={className} />;
}

/** A bordered surface. Its look (radius, border, fill) comes from the theme. */
export function Panel({
  children,
  className = "",
  inner = "",
}: {
  children: ReactNode;
  className?: string;
  inner?: string;
  small?: boolean;
}) {
  return <div className={`panel ${className} ${inner}`}>{children}</div>;
}

/** A project card. Hover effects come from the theme; `active` marks it as matching the selected skill. */
export function Card({ children, className = "", active = false }: { children: ReactNode; className?: string; active?: boolean }) {
  return (
    <div className={`card ${className}`} data-active={active || undefined}>
      {children}
    </div>
  );
}

/** A skill tag. */
export function Chip({ children, active = false, className = "" }: { children: ReactNode; active?: boolean; className?: string }) {
  return (
    <span className={`chip ${className}`} data-active={active || undefined}>
      {children}
    </span>
  );
}

/** A strip of highlights that scrolls sideways. Paused on hover and for reduced motion. */
export function Ticker({ items }: { items: string[] }) {
  return (
    <div className="ticker marquee-wrap overflow-hidden py-3">
      <ul aria-label="Highlights" className="marquee flex w-max">
        {[...items, ...items].map((item, i) => (
          <li
            key={`${item}-${i}`}
            aria-hidden={i >= items.length ? true : undefined}
            className="flex shrink-0 items-center gap-6 pr-6 font-mono text-xs uppercase tracking-wider text-muted"
          >
            <span aria-hidden="true" className="ticker-sep">
              ·
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

/** The small label above a heading, e.g. "Selected work". */
export function Kicker({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`label kicker ${className}`}>{children}</p>;
}

export function SectionTitle({ kicker, title, aside }: { kicker: string; title: ReactNode; aside?: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 border-b border-line pb-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-2.5">
        <Kicker>{kicker}</Kicker>
        <h2 className="section-title font-display text-3xl font-bold tracking-[-0.02em] text-ink sm:text-[2.6rem]">{title}</h2>
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
