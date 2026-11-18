import { ArrowRight } from "lucide-react";
import { KnightsTour } from "@/components/knights-tour";
import { RoleList } from "@/components/role-list";
import { LocalTime } from "@/components/site-chrome";
import { TransitionLink } from "@/components/transition-link";
import { CaseBoard, ExternalLink, GlyphLegend, Kicker, SectionTitle } from "@/components/ui";
import { cases, experience, now, profile } from "@/lib/content";

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
      {/* Hero */}
      <section className="grid items-center gap-10 pb-16 pt-12 sm:pt-20 md:grid-cols-[1fr_minmax(0,300px)] md:gap-14 lg:pb-24">
        <div className="space-y-6">
          <p className="rise flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-faint" style={{ "--i": 0 } as React.CSSProperties}>
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-50 motion-reduce:hidden" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            {profile.location} · <LocalTime />
          </p>
          <h1
            className="rise font-display text-[3.4rem] leading-[0.95] tracking-[-0.02em] text-ink sm:text-7xl lg:text-[5.5rem]"
            style={{ "--i": 1 } as React.CSSProperties}
          >
            {profile.firstName}
            <br />
            <span className="italic text-accent">{profile.lastName}</span>
          </h1>
          <p className="rise max-w-xl text-base leading-relaxed text-copy sm:text-lg" style={{ "--i": 2 } as React.CSSProperties}>
            {profile.tagline}
          </p>
          <nav
            aria-label="Profile links"
            className="rise flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-xs text-muted"
            style={{ "--i": 3 } as React.CSSProperties}
          >
            {profile.links.map((link) => (
              <ExternalLink key={link.label} href={link.href} className="hover:text-ink">
                {link.label}
              </ExternalLink>
            ))}
          </nav>
        </div>
        <div className="rise mx-auto w-full max-w-[260px] md:max-w-none" style={{ "--i": 3 } as React.CSSProperties}>
          <KnightsTour />
        </div>
      </section>

      {/* Now */}
      <section aria-labelledby="now-heading" className="rise rounded-2xl border border-line bg-paper-2/60 p-5 sm:p-6" style={{ "--i": 4 } as React.CSSProperties}>
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-10">
          <div className="shrink-0 sm:w-32">
            <Kicker>Now</Kicker>
            <p id="now-heading" className="mt-1 font-display text-xl italic text-ink">
              {now.label}
            </p>
          </div>
          <ul className="space-y-2.5">
            {now.items.map((item, i) => (
              <li key={item} className="flex gap-3 text-[15px] leading-relaxed text-copy">
                <span aria-hidden="true" className="mt-[3px] font-mono text-[11px] text-faint">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Cases */}
      <section id="cases" aria-labelledby="cases-heading" className="scroll-mt-20 pt-20 sm:pt-28">
        <SectionTitle
          kicker="Casebook"
          title={
            <span id="cases-heading">
              Cases, <span className="italic">annotated</span>
            </span>
          }
          aside={<p className="max-w-xs text-sm text-muted sm:text-right">Each one graded move by move, mistakes included.</p>}
        />
        <div className="py-5">
          <GlyphLegend />
        </div>
        <ol className="border-t border-line">
          {cases.map((c) => (
            <li key={c.slug} className="border-b border-line">
              <TransitionLink
                href={`/cases/${c.slug}/`}
                className="group -mx-3 grid grid-cols-[56px_1fr_auto] items-center gap-4 rounded-xl px-3 py-5 transition-colors hover:bg-paper-2 sm:grid-cols-[72px_1fr_auto] sm:gap-6 sm:py-6"
              >
                <span className="vt-name block" style={{ "--vt-name": `board-${c.slug}` } as React.CSSProperties}>
                  <CaseBoard seed={c.slug} className="w-full shadow-sm transition-transform duration-500 group-hover:rotate-[-4deg] group-hover:scale-105" />
                </span>
                <span className="min-w-0 space-y-1">
                  <span className="block font-mono text-[11px] uppercase tracking-wider text-faint">
                    {c.kind} {c.number} · {c.period}
                  </span>
                  <span
                    className="vt-name block w-fit font-display text-2xl tracking-tight text-ink transition-colors group-hover:text-accent sm:text-[1.75rem]"
                    style={{ "--vt-name": `title-${c.slug}` } as React.CSSProperties}
                  >
                    {c.title}
                  </span>
                  <span className="block text-sm leading-relaxed text-muted sm:text-[15px]">{c.dek}</span>
                  <span className="block pt-1 font-mono text-[11px] text-accent">{c.result}</span>
                </span>
                <ArrowRight
                  aria-hidden="true"
                  className="h-4 w-4 text-faint transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent"
                />
              </TransitionLink>
            </li>
          ))}
          <li className="border-b border-line">
            <div className="-mx-3 grid grid-cols-[56px_1fr] items-center gap-4 px-3 py-5 sm:grid-cols-[72px_1fr] sm:gap-6 sm:py-6">
              <CaseBoard seed="in-prep" muted className="w-full opacity-60" />
              <span className="space-y-1">
                <span className="block font-mono text-[11px] uppercase tracking-wider text-faint">
                  Game {String(cases.length + 1).padStart(2, "0")} · In preparation
                </span>
                <span className="block font-display text-2xl italic tracking-tight text-faint">Opening prep</span>
                <span className="block text-sm text-muted">The next case is being built. Business, software, or AI, probably all three.</span>
              </span>
            </div>
          </li>
        </ol>
      </section>

      {/* Experience */}
      <section aria-labelledby="experience-heading" className="pt-20 sm:pt-28">
        <SectionTitle
          kicker="Record"
          title={<span id="experience-heading">Experience</span>}
          aside={
            <TransitionLink
              href="/record/"
              className="group inline-flex items-center gap-1.5 font-mono text-xs text-muted transition-colors hover:text-ink"
            >
              Full record
              <ArrowRight aria-hidden="true" className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </TransitionLink>
          }
        />
        <div className="pt-3">
          <RoleList roles={experience} id="home-role" />
        </div>
      </section>
    </div>
  );
}
