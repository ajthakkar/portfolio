import type { Metadata } from "next";
import { RoleList } from "@/components/role-list";
import { Kicker, SectionTitle } from "@/components/ui";
import { education, experience, honors, involvement, skills } from "@/lib/content";

export const metadata: Metadata = {
  title: "Record",
  description: "Experience, leadership, honors, skills, and education.",
};

const sections = ["Experience", "Leadership", "Honors", "Skills", "Education"];

export default function RecordPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
      <header className="space-y-5 pb-6 pt-12 sm:pt-20">
        <Kicker className="rise">Record</Kicker>
        <h1 className="rise font-display text-5xl font-extrabold leading-[0.9] tracking-[-0.04em] text-ink sm:text-7xl" style={{ "--i": 1 } as React.CSSProperties}>
          The <span className="text-accent">track</span> record
        </h1>
        <p className="rise max-w-xl text-base leading-relaxed text-copy sm:text-lg" style={{ "--i": 2 } as React.CSSProperties}>
          Everything from the resume, in one place. Rows open for detail.
        </p>
        <nav aria-label="Sections" className="rise flex flex-wrap gap-2 pt-2" style={{ "--i": 3 } as React.CSSProperties}>
          {sections.map((s) => (
            <a
              key={s}
              href={`#${s.toLowerCase()}`}
              className="border border-line px-3 py-1 font-mono text-[11px] text-muted transition-colors hover:border-ink/30 hover:text-ink"
            >
              {s}
            </a>
          ))}
        </nav>
      </header>

      <div className="space-y-20 pt-10 sm:space-y-24">
        <section id="experience" className="scroll-mt-20">
          <SectionTitle kicker="01" title="Experience" />
          <div className="pt-3">
            <RoleList roles={experience} id="record-role" initiallyOpen={[0, 1, 2]} />
          </div>
        </section>

        <section id="leadership" className="scroll-mt-20">
          <SectionTitle kicker="02" title="Leadership & involvement" />
          <div className="pt-3">
            <RoleList roles={involvement} id="record-involvement" />
          </div>
        </section>

        <section id="honors" className="scroll-mt-20">
          <SectionTitle kicker="03" title="Honors & awards" />
          <ul className="divide-y divide-line">
            {honors.map((h) => (
              <li key={h.title} className="grid gap-1 py-4 sm:grid-cols-[1fr_auto] sm:gap-6">
                <div>
                  <p className="text-[15px] font-semibold text-ink">{h.title}</p>
                  {h.detail && <p className="text-[13px] text-muted">{h.detail}</p>}
                </div>
                {h.date && <span className="font-mono text-[11px] text-accent sm:pt-1">{h.date}</span>}
              </li>
            ))}
          </ul>
        </section>

        <section id="skills" className="scroll-mt-20">
          <SectionTitle kicker="04" title="Skills" />
          <dl className="divide-y divide-line">
            {skills.map((g) => (
              <div key={g.label} className="grid gap-1 py-4 sm:grid-cols-[140px_1fr] sm:gap-6">
                <dt className="font-mono text-[11px] uppercase tracking-wider text-faint sm:pt-1">{g.label}</dt>
                <dd className="flex flex-wrap gap-1.5">
                  {g.items.split(/,\s*(?![^()]*\))/).map((item) => (
                    <span key={item} className="border border-line bg-paper-2/60 px-2 py-1 text-[13px] text-ink">
                      {item}
                    </span>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section id="education" className="scroll-mt-20">
          <SectionTitle kicker="05" title="Education" />
          <ul className="divide-y divide-line">
            {education.map((s) => (
              <li key={s.school} className="grid gap-1 py-5 sm:grid-cols-[1fr_auto] sm:gap-6">
                <div>
                  <p className="text-[15px] font-semibold text-ink">{s.school}</p>
                  <p className="text-[13px] text-muted">{s.degree}</p>
                  <p className="mt-1 text-[13px] text-faint">{s.note}</p>
                </div>
                <span className="font-mono text-[11px] text-accent sm:pt-1 sm:text-right">
                  {s.dates}
                  <br className="hidden sm:block" />
                  <span className="sm:hidden"> · </span>
                  {s.location}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
