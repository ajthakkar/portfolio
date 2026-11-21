import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { MoveList } from "@/components/case-reading";
import { ChessInsights } from "@/components/chess-insights";
import { KnightsLab } from "@/components/knights-lab";
import { MarketCalibration } from "@/components/market-calibration";
import { PlaysLikeMeLoader } from "@/components/plays-like-me-loader";
import { CountUp } from "@/components/hud";
import { Tldr } from "@/components/tldr";
import { TransitionLink } from "@/components/transition-link";
import { CaseBoard, ExternalLink, Gaps, Glyph, Kicker, Panel } from "@/components/ui";
import { cases, skillName } from "@/lib/content";
import { pageMeta } from "@/lib/meta";

type Params = { params: { slug: string } };

export function generateStaticParams() {
  return cases.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: Params): Metadata {
  const c = cases.find((x) => x.slug === params.slug);
  // The preview image comes from opengraph-image.tsx next to this page.
  return c ? pageMeta({ title: c.title, description: c.dek, path: `/projects/${c.slug}/`, image: null }) : {};
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
          href="/projects/"
          className="group inline-flex items-center gap-1.5 py-1 font-mono text-xs text-muted transition-colors hover:text-ink"
        >
          <ArrowLeft aria-hidden="true" className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
          All projects
        </TransitionLink>
      </div>

      {/* Header */}
      <header className="grid gap-8 pb-12 pt-8 sm:pt-10 md:grid-cols-[1fr_180px] md:items-end">
        <div className="space-y-5">
          <Kicker className="rise">
            {c.area} · {c.period}
          </Kicker>
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
          {c.live && (
            <div className="rise pt-1" style={{ "--i": 3 } as React.CSSProperties}>
              <a
                href={c.live.href}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-game inline-flex items-center gap-2 bg-lime px-5 py-3 font-display text-sm font-bold text-lime-ink"
              >
                {c.live.label}
                <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
              </a>
            </div>
          )}
        </div>
        <span className="vt-name hidden w-full md:block" style={{ "--vt-name": `board-${c.slug}` } as React.CSSProperties}>
          <CaseBoard seed={c.slug} className="w-full" />
        </span>
      </header>

      {/* The 30-second version */}
      <Panel className="rise mb-3" inner="p-5 sm:p-6">
        <p className="pixel mb-4 text-accent">In 30 seconds</p>
        <Tldr items={c.tldr} className="max-w-3xl" />
      </Panel>

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

      {c.demo === "chess-insights" && (
        <section aria-labelledby="demo-heading" className="pt-14 lg:pt-20">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div className="space-y-2">
              <Kicker>Explore it</Kicker>
              <h2 id="demo-heading" className="font-display text-3xl font-extrabold tracking-[-0.03em] text-ink">
                Ask my games a question
              </h2>
            </div>
            <p className="max-w-sm text-sm text-muted">
              Every number compares a game to what I usually score at that rating gap, color, and time control, so
              a run of strong or weak opponents doesn&apos;t skew it.
            </p>
          </div>
          <ChessInsights />
        </section>
      )}

      {c.demo === "market-calibration" && (
        <section aria-labelledby="demo-heading" className="pt-14 lg:pt-20">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div className="space-y-2">
              <Kicker>Explore it</Kicker>
              <h2 id="demo-heading" className="font-display text-3xl font-extrabold tracking-[-0.03em] text-ink">
                Do the odds mean what they say?
              </h2>
            </div>
            <p className="max-w-sm text-sm text-muted">
              Each point groups contracts by their price. If the market is calibrated, the points sit on the dashed line.
            </p>
          </div>
          <MarketCalibration />
        </section>
      )}

      {c.demo === "plays-like-me" && (
        <section aria-labelledby="demo-heading" className="pt-14 lg:pt-20">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div className="space-y-2">
              <Kicker>Play it</Kicker>
              <h2 id="demo-heading" className="font-display text-3xl font-extrabold tracking-[-0.03em] text-ink">
                Play the model of me
              </h2>
            </div>
            <p className="max-w-sm text-sm text-muted">
              Switch its opponent setting to the typical player at my level and watch where the two disagree. That
              difference is what it learned about me.
            </p>
          </div>
          <PlaysLikeMeLoader />
        </section>
      )}

      {/* Body */}
      <div className="grid gap-12 pt-14 lg:grid-cols-[220px_1fr] lg:gap-16 lg:pt-20">
        <div className="hidden lg:block">
          <div className="sticky top-24">
            <MoveList moves={c.moves} />
          </div>
        </div>

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

          {c.photos && c.photos.length > 0 && (
            <Block kicker="From the project" title="Photos">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {c.photos.map((ph, i) => (
                  <figure key={ph.src} className={i === 0 && c.photos!.length % 2 === 1 ? "col-span-2" : ""}>
                    <div className="overflow-hidden border border-line bg-paper-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={ph.src} alt={ph.alt} width={ph.width} height={ph.height} loading="lazy" className="h-auto w-full" />
                    </div>
                    <figcaption className="mt-2 text-[13px] leading-snug text-muted">
                      {ph.caption}
                      {ph.credit && <span className="text-faint"> · {ph.credit}</span>}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </Block>
          )}

          {c.press && c.press.length > 0 && (
            <Block kicker="Press" title="Coverage">
              <ul className="divide-y divide-line border-y border-line">
                {c.press.map((pr) => (
                  <li key={pr.href}>
                    <a
                      href={pr.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-start justify-between gap-4 py-3.5"
                    >
                      <span>
                        <span className="pixel block text-muted">
                          {pr.outlet} · {pr.date}
                        </span>
                        <span className="mt-1 block text-[15px] text-ink transition-colors group-hover:text-accent">{pr.title}</span>
                      </span>
                      <ArrowUpRight aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-faint group-hover:text-accent" />
                    </a>
                  </li>
                ))}
              </ul>
            </Block>
          )}

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
            <span className="pixel block text-muted">
              Next project · {next.area}
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
