import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { MoveList } from "@/components/case-reading";
import { KnightsLab } from "@/components/knights-lab";
import { CountUp } from "@/components/hud";
import { TransitionLink } from "@/components/transition-link";
import { CaseBoard, ExternalLink, Gaps, Glyph, Kicker, Panel, StatusChip } from "@/components/ui";
import { cases, skillName } from "@/lib/content";

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
        <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-ink sm:text-[1.75rem]">{title}</h2>
        <span className="pixel text-faint">{kicker}</span>
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

export default function ProjectPage({ params }: Params) {
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
    <article className="mx-auto w-full max-w-6xl px-4 sm:px-6">
      <div className="pt-8 sm:pt-12">
        <TransitionLink
          href="/#projects"
          className="group inline-flex items-center gap-1.5 font-mono text-xs text-muted transition-colors hover:text-ink"
        >
          <ArrowLeft aria-hidden="true" className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
          Quest log
        </TransitionLink>
      </div>

      {/* Header */}
      <header className="grid gap-8 pb-12 pt-8 sm:pt-10 md:grid-cols-[1fr_180px] md:items-end">
        <div className="space-y-5">
          <div className="rise flex flex-wrap items-center gap-3">
            <StatusChip state="complete" />
            <Kicker>
              {c.kind} {c.number} · {c.result}
            </Kicker>
          </div>
          <h1
            className="vt-name w-fit font-display text-5xl font-extrabold leading-[0.95] tracking-[-0.04em] text-ink sm:text-6xl lg:text-7xl"
            style={{ "--vt-name": `title-${c.slug}` } as React.CSSProperties}
          >
            {c.title}
          </h1>
          <p className="rise max-w-2xl text-lg leading-relaxed text-copy sm:text-xl" style={{ "--i": 1 } as React.CSSProperties}>
            {c.dek}
          </p>
          {c.rewards.length > 0 && (
            <div className="rise flex flex-wrap items-center gap-2" style={{ "--i": 2 } as React.CSSProperties}>
              <span className="pixel text-faint">Skills proven</span>
              {c.rewards.map((r) => (
                <span key={r} className="border border-accent px-1.5 py-0.5 font-mono text-[11px] text-accent">
                  +{skillName(r)}
                </span>
              ))}
            </div>
          )}
        </div>
        <span className="vt-name hidden w-full md:block" style={{ "--vt-name": `board-${c.slug}` } as React.CSSProperties}>
          <CaseBoard seed={c.slug} className="w-full" />
        </span>
      </header>

      {/* Meta + stats */}
      <Panel className="rise" inner="grid gap-px bg-line sm:grid-cols-2" >
        <dl className="grid content-start gap-3 bg-paper-2 p-5 sm:p-6">
          {meta.map((m) => (
            <div key={m.label} className="grid grid-cols-[72px_1fr] gap-3 text-sm">
              <dt className="pixel pt-1 text-faint">{m.label}</dt>
              <dd className="text-ink">{m.value}</dd>
            </div>
          ))}
        </dl>
        <dl className="grid grid-cols-2 gap-px bg-line">
          {c.stats.map((s) => (
            <div key={s.label} className="flex flex-col justify-end gap-1 bg-paper-2 p-5 sm:p-6">
              <dt className="order-2 text-xs leading-snug text-muted">{s.label}</dt>
              <dd className="order-1 font-display text-3xl font-extrabold tracking-[-0.03em] text-accent sm:text-4xl">
                <CountUp value={s.value} />
              </dd>
            </div>
          ))}
        </dl>
      </Panel>

      {c.demo === "knights-tour" && (
        <section aria-labelledby="demo-heading" className="pt-14 lg:pt-20">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div className="space-y-2">
              <Kicker>Try it</Kicker>
              <h2 id="demo-heading" className="font-display text-3xl font-extrabold tracking-[-0.03em] text-ink">
                Race the two searches
              </h2>
            </div>
            <p className="max-w-sm text-sm text-muted">
              Both boards start on the same square and take the same number of steps per frame. One of them knows where
              to go.
            </p>
          </div>
          <KnightsLab />
        </section>
      )}

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
                  <span aria-hidden="true" className="mt-[0.7em] h-1.5 w-1.5 shrink-0 bg-accent" />
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
                    className="scroll-mt-24 border border-line bg-paper-2/60 p-4 transition-colors hover:border-accent/60 sm:p-5"
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
      <nav aria-label="Next project" className="mt-20 border-t border-line pt-8">
        <TransitionLink href={`/projects/${next.slug}/`} className="group flex items-center justify-between gap-6">
          <span className="space-y-2">
            <span className="pixel block text-faint">
              Next quest · {next.kind} {next.number}
            </span>
            <span className="block font-display text-3xl font-extrabold tracking-[-0.03em] text-ink transition-colors group-hover:text-accent sm:text-4xl">
              {next.title}
            </span>
          </span>
          <ArrowRight aria-hidden="true" className="h-5 w-5 shrink-0 text-faint transition-all group-hover:translate-x-1 group-hover:text-accent" />
        </TransitionLink>
      </nav>
    </article>
  );
}
