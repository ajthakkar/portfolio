import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { EvalBar, MoveList } from "@/components/case-reading";
import { TransitionLink } from "@/components/transition-link";
import { CaseBoard, ExternalLink, Gaps, Glyph, Kicker } from "@/components/ui";
import { cases } from "@/lib/content";

type Params = { params: { slug: string } };

export function generateStaticParams() {
  return cases.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: Params): Metadata {
  const c = cases.find((x) => x.slug === params.slug);
  return c ? { title: c.title, description: c.dek } : {};
}

function Block({ kicker, title, children }: { kicker: string; title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <div className="flex items-baseline gap-3">
        <h2 className="font-display text-2xl tracking-tight text-ink sm:text-[1.75rem]">{title}</h2>
        <span className="font-mono text-[11px] uppercase tracking-wider text-faint">{kicker}</span>
      </div>
      {children}
    </section>
  );
}

function Paragraphs({ items }: { items: string[] }) {
  return (
    <div className="space-y-4 text-[15px] leading-[1.75] text-copy sm:text-base">
      {items.map((p) => (
        <p key={p}>{p}</p>
      ))}
    </div>
  );
}

export default function CasePage({ params }: Params) {
  const index = cases.findIndex((x) => x.slug === params.slug);
  if (index === -1) notFound();
  const c = cases[index];
  const next = cases[(index + 1) % cases.length];

  const meta = [
    { label: "Role", value: c.role },
    { label: "Period", value: c.period },
    ...(c.team ? [{ label: "Team", value: c.team }] : []),
    ...(c.tools.length ? [{ label: "Tools", value: c.tools.join(", ") }] : []),
  ];

  return (
    <article className="mx-auto w-full max-w-5xl px-4 sm:px-6">
      <EvalBar />

      <div className="pt-8 sm:pt-12">
        <TransitionLink
          href="/#cases"
          className="group inline-flex items-center gap-1.5 font-mono text-xs text-muted transition-colors hover:text-ink"
        >
          <ArrowLeft aria-hidden="true" className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
          All cases
        </TransitionLink>
      </div>

      {/* Header */}
      <header className="grid gap-8 pb-12 pt-8 sm:pt-10 md:grid-cols-[1fr_180px] md:items-end">
        <div className="space-y-5">
          <Kicker className="rise">
            {c.kind} {c.number} · {c.result}
          </Kicker>
          <h1
            className="vt-name w-fit font-display text-5xl leading-[1] tracking-[-0.02em] text-ink sm:text-6xl lg:text-7xl"
            style={{ "--vt-name": `title-${c.slug}` } as React.CSSProperties}
          >
            {c.title}
          </h1>
          <p className="rise max-w-2xl text-lg leading-relaxed text-copy sm:text-xl" style={{ "--i": 1 } as React.CSSProperties}>
            {c.dek}
          </p>
        </div>
        <span className="vt-name hidden w-full md:block" style={{ "--vt-name": `board-${c.slug}` } as React.CSSProperties}>
          <CaseBoard seed={c.slug} className="w-full shadow-sm" />
        </span>
      </header>

      {/* Meta + stats */}
      <div className="rise grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2" style={{ "--i": 2 } as React.CSSProperties}>
        <dl className="grid content-start gap-3 bg-paper p-5 sm:p-6">
          {meta.map((m) => (
            <div key={m.label} className="grid grid-cols-[72px_1fr] gap-3 text-sm">
              <dt className="font-mono text-[11px] uppercase tracking-wider text-faint">{m.label}</dt>
              <dd className="text-ink">{m.value}</dd>
            </div>
          ))}
        </dl>
        <dl className="grid grid-cols-2 gap-px bg-line">
          {c.stats.map((s) => (
            <div key={s.label} className="flex flex-col justify-end gap-1 bg-paper p-5 sm:p-6">
              <dt className="order-2 text-xs leading-snug text-muted">{s.label}</dt>
              <dd className="order-1 font-display text-3xl tracking-tight text-accent sm:text-4xl">{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Body */}
      <div className="grid gap-12 pt-14 lg:grid-cols-[220px_1fr] lg:gap-16 lg:pt-20">
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <MoveList moves={c.moves} />
          </div>
        </aside>

        <div className="max-w-2xl space-y-14">
          <Block kicker="Context" title="The position">
            <Paragraphs items={c.position} />
          </Block>

          <Block kicker="Approach" title="The plan">
            <ul className="space-y-3 text-[15px] leading-[1.75] text-copy sm:text-base">
              {c.plan.map((p) => (
                <li key={p} className="flex gap-3">
                  <span aria-hidden="true" className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rotate-45 bg-accent" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </Block>

          {c.moves.length > 0 && (
            <Block kicker="Decisions" title="Key moves">
              <ol className="space-y-3">
                {c.moves.map((move, i) => (
                  <li
                    key={move.title}
                    id={`move-${i + 1}`}
                    className="scroll-mt-24 rounded-xl border border-line bg-paper-2/50 p-4 transition-colors hover:border-ink/20 sm:p-5"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-faint">{i + 1}.</span>
                      <Glyph mark={move.glyph} />
                      <h3 className="text-base font-semibold text-ink">{move.title}</h3>
                    </div>
                    <p className="mt-2 text-[15px] leading-relaxed text-copy sm:pl-[3.1rem]">{move.body}</p>
                  </li>
                ))}
              </ol>
            </Block>
          )}

          <Block kicker="Outcome" title="Result">
            <Paragraphs items={c.outcome} />
            {c.links && (
              <div className="flex flex-wrap gap-4 pt-1 font-mono text-xs text-accent">
                {c.links.map((l) => (
                  <ExternalLink key={l.href} href={l.href}>
                    {l.label}
                  </ExternalLink>
                ))}
              </div>
            )}
            {c.note && <p className="font-mono text-[11px] text-faint">{c.note}</p>}
          </Block>

          {c.postGame.length > 0 && (
            <Block kicker="What I'd change" title="Post-game">
              <Paragraphs items={c.postGame} />
            </Block>
          )}

          <Gaps items={c.gaps} />
        </div>
      </div>

      {/* Next */}
      <nav aria-label="Next case" className="mt-20 border-t border-line pt-8">
        <TransitionLink href={`/cases/${next.slug}/`} className="group flex items-center justify-between gap-6">
          <span className="space-y-1">
            <span className="block font-mono text-[11px] uppercase tracking-wider text-faint">
              Next · {next.kind} {next.number}
            </span>
            <span className="block font-display text-3xl tracking-tight text-ink transition-colors group-hover:text-accent sm:text-4xl">
              {next.title}
            </span>
          </span>
          <ArrowRight aria-hidden="true" className="h-5 w-5 shrink-0 text-faint transition-all group-hover:translate-x-1 group-hover:text-accent" />
        </TransitionLink>
      </nav>
    </article>
  );
}
