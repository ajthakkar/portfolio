import type { Metadata } from "next";
import { ArrowDown, ArrowRight } from "lucide-react";
import { ChessRating } from "@/components/chess-rating";
import { ContactCta } from "@/components/contact-cta";
import { CountUp } from "@/components/hud";
import { QuestLog } from "@/components/quest-log";
import { RoleList } from "@/components/role-list";
import { LocalTime } from "@/components/site-chrome";
import { SkillTree } from "@/components/skill-tree";
import { TransitionLink } from "@/components/transition-link";
import { ExternalLink, Gaps, Kicker, Panel, PieceIcon, SectionTitle, Ticker } from "@/components/ui";
import { allSkills, branches, experience, highlights, now, profile, skillState, type Branch } from "@/lib/content";
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
    <div className="grid grid-cols-[64px_1fr] gap-3 py-3">
      <dt className="pixel pt-1 text-muted">{label}</dt>
      <dd className="text-sm text-ink">{children}</dd>
    </div>
  );
}

/** One row of the stat bars: a segment per skill, filled when it's unlocked. */
function BranchBar({ branch }: { branch: Branch }) {
  return (
    <div className="grid grid-cols-[16px_76px_1fr] items-center gap-2.5" title={branch.pieceNote}>
      <PieceIcon piece={branch.piece} className="h-4 w-4 text-muted" />
      <span className="text-xs text-copy">{branch.name}</span>
      <span className="flex gap-1">
        {branch.skills.map((skill) => {
          const state = skillState(skill);
          return (
            <span
              key={skill.id}
              title={`${skill.name}: ${state}`}
              className={`h-2.5 flex-1 ${state === "unlocked" ? "bg-accent" : state === "training" ? "bg-coral/70" : "bg-line"}`}
            />
          );
        })}
      </span>
    </div>
  );
}

function PlayerCard() {
  const unlocked = allSkills.filter((s) => skillState(s) === "unlocked").length;
  const uscf = uscfSummary();
  return (
    <Panel className="rise" inner="p-5 sm:p-6">
      <div className="flex items-center justify-between border-b border-line pb-3">
        <p className="pixel text-accent">Player card</p>
        <p className="pixel text-faint">Class of 2029</p>
      </div>
      <dl className="divide-y divide-line">
        <Row label="Class">{profile.playerClass}</Row>
        <Row label="Rating">
          <ChessRating uscf={uscf && { current: uscf.current, peak: uscf.peak, title: uscfClass(uscf.current) }} />
          <TransitionLink
            href="/about/#ratings"
            className="mt-2 inline-flex items-center gap-1 font-mono text-[11px] text-muted transition-colors hover:text-ink"
          >
            Rating history
            <ArrowRight aria-hidden="true" className="h-3 w-3" />
          </TransitionLink>
        </Row>
        <Row label="Taught">
          <CountUp value="1,000+" className="font-mono text-base" /> <span className="text-muted">chess students</span>
        </Row>
        <Row label="Skills">
          <CountUp value={String(unlocked)} className="font-mono text-base" />
          <span className="text-muted"> / {allSkills.length} unlocked</span>
        </Row>
      </dl>
      <div className="mt-2 space-y-2.5 border-t border-line pt-4">
        {branches.map((branch) => (
          <BranchBar key={branch.id} branch={branch} />
        ))}
      </div>
    </Panel>
  );
}

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        {/* Hero */}
        <section className="grid items-center gap-12 pb-14 pt-10 sm:pt-16 lg:grid-cols-[1fr_380px] lg:gap-16 lg:pb-20">
          <div className="space-y-7">
            <p className="rise pixel flex flex-wrap items-center gap-2 text-muted" style={stagger(0)}>
              <span aria-hidden="true" className="blink inline-block h-2 w-2 bg-accent" />
              Player 1 · {profile.location} · <LocalTime />
            </p>
            <h1
              className="rise font-display text-[3.7rem] font-extrabold leading-[0.86] tracking-[-0.045em] text-ink sm:text-[5.6rem] lg:text-[6.5rem]"
              style={stagger(1)}
            >
              {profile.firstName}
              <br />
              <span className="inline-block bg-lime px-[0.08em] pb-[0.04em] text-lime-ink">{profile.lastName}</span>
            </h1>
            <div className="rise max-w-xl space-y-3" style={stagger(2)}>
              <p className="text-base leading-relaxed text-copy sm:text-lg">{profile.tagline}</p>
              <p className="flex gap-2.5 text-[15px] font-medium leading-snug text-ink">
                <span aria-hidden="true" className="mt-[5px] h-2.5 w-2.5 shrink-0 bg-accent" />
                {profile.lookingFor}
              </p>
            </div>
            <div className="rise flex flex-wrap items-center gap-4 pt-1" style={stagger(3)}>
              <a
                href="#projects"
                className="btn-game inline-flex items-center gap-2 bg-lime px-5 py-3 font-display text-sm font-bold text-lime-ink"
              >
                See projects
                <ArrowDown aria-hidden="true" className="h-4 w-4" />
              </a>
              <a
                href="#skills"
                className="btn-game inline-flex items-center gap-2 border-2 border-ink bg-paper px-5 py-[10px] font-display text-sm font-bold text-ink"
              >
                Skill tree
              </a>
            </div>
            <nav
              aria-label="Profile links"
              className="rise flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-xs text-muted"
              style={stagger(4)}
            >
              {profile.links.map((link) => (
                <ExternalLink key={link.label} href={link.href} className="py-1 hover:text-ink">
                  {link.label}
                </ExternalLink>
              ))}
            </nav>
            <nav aria-label="Short versions by role" className="rise space-y-2" style={stagger(5)}>
              <p className="pixel text-muted">Hiring for one role? Short versions:</p>
              <ul className="flex flex-wrap gap-2">
                {roleViews.map((r) => (
                  <li key={r.slug}>
                    <TransitionLink
                      href={`/for/${r.slug}/`}
                      className="inline-flex items-center border border-line px-2.5 py-1.5 font-mono text-xs text-copy transition-colors hover:border-accent hover:text-accent"
                    >
                      {r.label}
                    </TransitionLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <div style={stagger(3)} className="w-full max-w-md lg:max-w-none">
            <PlayerCard />
          </div>
        </section>
      </div>

      <Ticker items={highlights} />

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="pt-6">
          <Gaps items={profile.gaps} />
        </div>

        {/* Projects */}
        <section id="projects" aria-labelledby="projects-heading" className="scroll-mt-20 pt-14 sm:pt-20">
          <SectionTitle
            kicker="Quest log"
            title={<span id="projects-heading">Projects</span>}
            aside={
              <div className="max-w-xs space-y-2 sm:text-right">
                <p className="text-sm text-muted">
                  The strongest work first. Each project lists the skills it proves, and the skill tree below links back.
                </p>
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
          <div className="pt-6">
            <QuestLog />
          </div>
        </section>

        {/* Skill tree */}
        <section id="skills" aria-labelledby="skills-heading" className="scroll-mt-20 pt-20 sm:pt-28">
          <SectionTitle
            kicker="Skill tree"
            title={<span id="skills-heading">What I can do, and the proof</span>}
            aside={
              <p className="max-w-xs text-sm text-muted sm:text-right">
                Pick a skill to see the projects and roles behind it. Locked ones are next on the roadmap.
              </p>
            }
          />
          <div className="pt-6">
            <SkillTree />
          </div>
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
        {/* Now */}
        <section aria-labelledby="now-heading" className="pt-20 sm:pt-28">
          <Panel inner="flex flex-col gap-4 p-5 sm:flex-row sm:gap-10 sm:p-6">
            <div className="shrink-0 sm:w-40">
              <Kicker>Current objectives</Kicker>
              <p id="now-heading" className="mt-2 font-display text-xl font-bold tracking-tight text-ink">
                {now.label}
              </p>
            </div>
            <ul className="space-y-2.5">
              {now.items.map((item) => (
                <li key={item} className="flex gap-3 text-[15px] leading-relaxed text-copy">
                  <span aria-hidden="true" className="mt-[6px] h-3 w-3 shrink-0 border-2 border-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </Panel>
        </section>

        <ContactCta />
      </div>
    </>
  );
}
