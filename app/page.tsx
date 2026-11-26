import type { Metadata } from "next";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";
import { ChessRating } from "@/components/chess-rating";
import { ContactCta } from "@/components/contact-cta";
import { Reveal } from "@/components/reveal";
import { RoleList } from "@/components/role-list";
import { LocalTime } from "@/components/site-chrome";
import { Skills } from "@/components/skills";
import { TransitionLink } from "@/components/transition-link";
import { ExternalLink, Gaps, Kicker, Panel, SectionTitle, Ticker } from "@/components/ui";
import { WorkList } from "@/components/work-list";
import { experience, highlights, now, profile } from "@/lib/content";
import { pageMeta, SITE_URL, siteDescription } from "@/lib/meta";
import { roleViews } from "@/lib/roles";
import { uscfClass, uscfSummary } from "@/lib/ratings";

export const metadata: Metadata = pageMeta({
  title: profile.name,
  description: siteDescription,
  path: "/",
  image: null,
  absoluteTitle: true,
});

/** Tells search engines who the site is about and which profiles are the same person. */
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  url: SITE_URL,
  email: `mailto:${profile.email}`,
  description: profile.tagline,
  affiliation: { "@type": "CollegeOrUniversity", name: "The Ohio State University, Fisher College of Business" },
  sameAs: profile.links.filter((l) => l.href.startsWith("https://")).map((l) => l.href),
};

const stagger = (i: number) => ({ "--i": i }) as React.CSSProperties;

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[76px_1fr] gap-3 py-3.5">
      <dt className="label pt-1 text-muted">{label}</dt>
      <dd className="text-sm text-ink">{children}</dd>
    </div>
  );
}

function AtAGlance() {
  const uscf = uscfSummary();
  return (
    <Panel className="rise glance" inner="p-5 sm:p-6">
      <div className="flex items-center justify-between border-b border-line pb-3">
        <p className="label text-ink">At a glance</p>
        <p className="label text-faint">Class of 2029</p>
      </div>
      <dl className="divide-y divide-line">
        <Row label="Studying">{profile.standing}</Row>
        <Row label="Chess">
          <ChessRating uscf={uscf && { current: uscf.current, peak: uscf.peak, title: uscfClass(uscf.current) }} />
          <TransitionLink
            href="/about/#ratings"
            className="mt-2 inline-flex items-center gap-1 font-mono text-[11px] text-muted transition-colors hover:text-ink"
          >
            Rating history
            <ArrowRight aria-hidden="true" className="h-3 w-3" />
          </TransitionLink>
        </Row>
        <Row label="Teaching">
          <span className="font-mono tabular-nums">1,000+</span> <span className="text-muted">chess students</span>
        </Row>
        <Row label="Now">
          <span className="text-copy">{now.items[now.items.length - 1]}</span>
        </Row>
      </dl>
    </Panel>
  );
}

export default function Home() {
  const links = profile.links.filter((l) => l.label !== "Resume");
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        {/* Hero */}
        <section className="hero grid items-center gap-12 pb-16 pt-12 sm:pt-20 lg:grid-cols-[1fr_380px] lg:gap-16 lg:pb-24">
          <div className="space-y-7">
            <p className="rise label flex flex-wrap items-center gap-2 text-muted" style={stagger(0)}>
              {profile.location} · <LocalTime />
            </p>
            <h1 className="rise hero-name text-[3.6rem] text-ink sm:text-[5.4rem] lg:text-[6.2rem]" style={stagger(1)}>
              <span className="hero-first block">{profile.firstName}</span>
              <span className="hero-last block">{profile.lastName}</span>
            </h1>
            <div className="rise max-w-xl space-y-4" style={stagger(2)}>
              <p className="text-base leading-relaxed text-copy sm:text-lg">{profile.tagline}</p>
              <p className="flex items-start gap-3 text-[15px] font-medium leading-snug text-ink">
                <span aria-hidden="true" className="status-dot mt-[6px]" />
                {profile.lookingFor}
              </p>
            </div>
            <div className="rise flex flex-wrap items-center gap-3 pt-1" style={stagger(3)}>
              <a href="#projects" className="btn btn-primary">
                See projects
                <ArrowDown aria-hidden="true" className="h-4 w-4" />
              </a>
              <a href={profile.resume} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                Resume
                <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
              </a>
            </div>
            <nav
              aria-label="Profile links"
              className="rise flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-xs text-muted"
              style={stagger(4)}
            >
              {links.map((link) => (
                <ExternalLink key={link.label} href={link.href} className="py-1 hover:text-ink">
                  {link.label}
                </ExternalLink>
              ))}
            </nav>
            <nav aria-label="Short versions by role" className="rise space-y-2.5" style={stagger(5)}>
              <p className="label text-muted">Hiring for one role? Short versions:</p>
              <ul className="flex flex-wrap gap-2">
                {roleViews.map((r) => (
                  <li key={r.slug}>
                    <TransitionLink href={`/for/${r.slug}/`} className="chip">
                      {r.label}
                    </TransitionLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <div style={stagger(3)} className="w-full max-w-md lg:max-w-none">
            <AtAGlance />
          </div>
        </section>
      </div>

      <Ticker items={highlights} />

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="pt-6">
          <Gaps items={profile.gaps} />
        </div>

        {/* Projects */}
        <section id="projects" aria-labelledby="projects-heading" className="scroll-mt-20 pt-16 sm:pt-24">
          <Reveal>
            <SectionTitle
              kicker="Selected work"
              title={<span id="projects-heading">Projects</span>}
              aside={
                <div className="max-w-xs space-y-2 sm:text-right">
                  <p className="text-sm text-muted">The strongest work first. Each project lists the skills it shows.</p>
                  <TransitionLink
                    href="/projects/"
                    className="group inline-flex items-center gap-1.5 py-1 font-mono text-xs text-accent"
                  >
                    All projects, by area
                    <ArrowRight aria-hidden="true" className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </TransitionLink>
                </div>
              }
            />
          </Reveal>
          <Reveal className="pt-6" index={1}>
            <WorkList />
          </Reveal>
        </section>

        {/* Skills */}
        <section id="skills" aria-labelledby="skills-heading" className="scroll-mt-20 pt-24 sm:pt-32">
          <Reveal>
            <SectionTitle
              kicker="Skills"
              title={<span id="skills-heading">What I can do, and where it shows</span>}
              aside={<p className="max-w-xs text-sm text-muted sm:text-right">Pick a skill to see the projects behind it.</p>}
            />
          </Reveal>
          <Reveal className="pt-8" index={1}>
            <Skills />
          </Reveal>
        </section>

        {/* Experience */}
        <section aria-labelledby="experience-heading" className="pt-24 sm:pt-32">
          <Reveal>
            <SectionTitle
              kicker="Background"
              title={<span id="experience-heading">Experience</span>}
              aside={
                <TransitionLink
                  href="/record/"
                  className="group inline-flex items-center gap-1.5 font-mono text-xs text-muted transition-colors hover:text-ink"
                >
                  Experience, honors, and education
                  <ArrowRight aria-hidden="true" className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </TransitionLink>
              }
            />
          </Reveal>
          <Reveal className="pt-3" index={1}>
            <RoleList roles={experience} id="home-role" />
          </Reveal>
        </section>

        {/* Now */}
        <section aria-labelledby="now-heading" className="pt-24 sm:pt-32">
          <Reveal>
            <Panel inner="flex flex-col gap-4 p-5 sm:flex-row sm:gap-10 sm:p-6">
              <div className="shrink-0 sm:w-40">
                <Kicker>Now</Kicker>
                <p id="now-heading" className="mt-2 font-display text-xl font-bold tracking-tight text-ink">
                  {now.label}
                </p>
              </div>
              <ul className="space-y-2.5">
                {now.items.map((item) => (
                  <li key={item} className="flex gap-3 text-[15px] leading-relaxed text-copy">
                    <span aria-hidden="true" className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </Panel>
          </Reveal>
        </section>

        <ContactCta />
      </div>
    </>
  );
}
