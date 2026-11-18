"use client";

import { Fragment, useEffect, useState, type ReactNode } from "react";
import { ChevronDown, Moon, Sun } from "lucide-react";

/* ───────────────────────────── Content ───────────────────────────── */

const name = "Aayush Thakkar";

const links = [
  { label: "GitHub", href: "https://github.com/ajthakkar" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/aayush--thakkar" },
  { label: "Email", href: "mailto:thakkar.186@osu.edu" },
];

const bio =
  "I'm an Information Systems student at Ohio State's Fisher College of Business, and I'm most interested in where business, software, and AI meet. Before college I co-founded Roam Travel, where we took a luggage strap from a handmade prototype to a patent-pending product with 250+ units sold. I've also spent years in competitive chess as a USCF Expert and have taught the game to more than 1,000 students. I grew up in Naperville, Illinois, and outside of class you'll usually find me playing poker, solving logic puzzles, playing GeoGuessr, or working out.";

type Role = {
  org: string;
  monogram: string;
  role: string;
  dates: string;
  location: string;
  points: string[];
};

const experience: Role[] = [
  {
    org: "Big Data & Analytics Association (BDAA)",
    monogram: "BD",
    role: "Product Development Track Member",
    dates: "Fall 2026 – Present",
    location: "Columbus, OH",
    points: [
      "Lead outreach to OSU University Libraries and organize stakeholder interviews for a team discovery project",
    ],
  },
  {
    org: "Roam Travel",
    monogram: "RT",
    role: "Co-Founder, CTO & CFO",
    dates: "Aug 2024 – Aug 2025",
    location: "Naperville, IL",
    points: [
      "Co-founded a 3-person startup; took the Roam Link luggage strap from prototype to a patent-pending product",
      "Sold 250+ units and earned $2,000+ in profit, starting with 80+ handmade units to validate demand",
      "Pitched to investor judges at 20+ competitions, winning $10,000+ in prize money",
      "Created the Roam Challenge, trading free units for travelers' destination photos to source ad content",
      "Helped launch the Shopify store and grow a 1,000+ person customer sign-up list",
      "Earned company coverage in the Chicago Tribune and on NCTV17",
    ],
  },
  {
    org: "Elite Chess",
    monogram: "EC",
    role: "Chess Instructor",
    dates: "Sep 2023 – Aug 2026",
    location: "Naperville, IL · Sep 2023 – Oct 2024, Oct 2025 – Aug 2026",
    points: [
      "Taught 1,000+ students in group classes and private lessons, from first-time beginners to tournament players",
      "Raised students' ratings by about 100 points per year on average, and up to 300 points with focused coaching",
      "Helped shape teaching methods and student-retention ideas with the owner and manager as the company grew",
    ],
  },
];

type Project = {
  name: string;
  date: string;
  stack: string;
  live?: string;
  source?: string;
  points: string[];
};

// Add projects here. The "Selected Projects" section appears once this list has an entry.
const projects: Project[] = [];

const skills = [
  { label: "Languages", items: "Python, Java, HTML" },
  { label: "AI Tools", items: "Claude Code, Claude, Cursor, Prompt Engineering, Workflow Automation" },
  { label: "Developer Tools", items: "Excel, Linux" },
];

const education = {
  school: "The Ohio State University",
  degree: "B.S. in Business Administration, Information Systems",
  meta: "Expected May 2029 · Columbus, OH",
};

/* ──────────────────────────── Components ──────────────────────────── */

function useExpandable(count: number, initiallyOpen: number[] = []) {
  const [open, setOpen] = useState<Set<number>>(() => new Set(initiallyOpen));
  const allOpen = count > 0 && open.size === count;
  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  const toggleAll = () => setOpen(allOpen ? new Set() : new Set(Array.from({ length: count }, (_, i) => i)));
  return { open, allOpen, toggle, toggleAll };
}

function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      /* storage unavailable: theme still switches for this visit */
    }
    setDark(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      title="Toggle beige and dark mode"
      aria-label={dark ? "Switch to beige mode" : "Switch to dark mode"}
      className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-line bg-pill px-3 py-1.5 font-mono text-xs transition-colors hover:bg-pill-hover dark:border-zinc-800 dark:bg-night-pill dark:hover:bg-night-hover"
    >
      {dark ? (
        <Sun aria-hidden="true" className="h-3.5 w-3.5 text-zinc-300" />
      ) : (
        <Moon aria-hidden="true" className="h-3.5 w-3.5 text-accent" />
      )}
      <span className="hidden text-xs font-medium text-accent sm:inline dark:text-zinc-300">{dark ? "Dark" : "Beige"}</span>
    </button>
  );
}

function SectionHeader({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-line pb-1.5 dark:border-zinc-800">
      <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-accent dark:text-emerald-400">{title}</h2>
      {action}
    </div>
  );
}

function ExpandAll({ allOpen, onClick }: { allOpen: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="cursor-pointer font-mono text-[11px] text-accent transition-colors hover:underline dark:text-emerald-400"
    >
      {allOpen ? "Collapse all" : "Expand all"}
    </button>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <ChevronDown
      aria-hidden="true"
      className={`h-3.5 w-3.5 text-faint transition-transform duration-200 dark:text-zinc-400 ${open ? "rotate-180" : ""}`}
    />
  );
}

function Bullets({ points, className = "" }: { points: string[]; className?: string }) {
  return (
    <ul
      className={`list-outside list-disc space-y-1.5 text-xs leading-relaxed text-copy marker:text-accent dark:text-zinc-400 dark:marker:text-zinc-700 ${className}`}
    >
      {points.map((point) => (
        <li key={point}>{point}</li>
      ))}
    </ul>
  );
}

function ExternalLink({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  const external = !href.startsWith("mailto:");
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`underline-offset-4 transition-colors hover:underline ${className}`}
    >
      {children} ↗
    </a>
  );
}

/* ─────────────────────────────── Page ─────────────────────────────── */

export default function Page() {
  const exp = useExpandable(experience.length, [1]);
  const proj = useExpandable(projects.length);

  return (
    <>
      <main className="mx-auto w-full max-w-2xl space-y-9 px-6 py-12 sm:space-y-10 sm:py-16">
        <header className="space-y-2.5">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl dark:text-zinc-100">{name}</h1>
            <ThemeToggle />
          </div>
          <nav
            aria-label="Profile links"
            className="flex flex-wrap items-center gap-x-2.5 gap-y-1 pt-0.5 font-mono text-xs text-muted dark:text-zinc-400"
          >
            {links.map((link, i) => (
              <Fragment key={link.label}>
                {i > 0 && (
                  <span aria-hidden="true" className="text-dot dark:text-zinc-800">
                    ·
                  </span>
                )}
                <ExternalLink href={link.href} className="hover:text-accent dark:hover:text-zinc-100">
                  {link.label}
                </ExternalLink>
              </Fragment>
            ))}
          </nav>
        </header>

        <section className="py-0.5">
          <p className="text-sm leading-relaxed text-copy sm:text-[15px] dark:text-zinc-300">{bio}</p>
        </section>

        <section className="space-y-3.5">
          <SectionHeader title="Work Experience" action={<ExpandAll allOpen={exp.allOpen} onClick={exp.toggleAll} />} />
          <div className="space-y-3 pt-0.5">
            {experience.map((role, i) => {
              const isOpen = exp.open.has(i);
              return (
                <div key={role.org} className="border-b border-line/60 pb-3 last:border-b-0 dark:border-zinc-800/60">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`role-${i}`}
                    onClick={() => exp.toggle(i)}
                    className="group flex w-full cursor-pointer select-none items-center justify-between gap-3 py-1 text-left transition-opacity hover:opacity-85"
                  >
                    <span className="flex min-w-0 items-center gap-3.5">
                      <span
                        aria-hidden="true"
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-line bg-pill font-mono text-xs font-semibold text-accent sm:h-11 sm:w-11 dark:border-zinc-800 dark:bg-night-pill dark:text-emerald-400"
                      >
                        {role.monogram}
                      </span>
                      <span className="flex min-w-0 flex-col">
                        <span className="text-sm font-semibold text-ink transition-colors group-hover:text-accent dark:text-zinc-100 dark:group-hover:text-emerald-400">
                          {role.org}
                        </span>
                        <span className="text-xs text-muted dark:text-zinc-400">{role.role}</span>
                        <span className="mt-0.5 font-mono text-[11px] text-accent sm:hidden dark:text-emerald-400">{role.dates}</span>
                      </span>
                    </span>
                    <span className="flex shrink-0 items-center gap-2 font-mono text-[11px] text-accent dark:text-emerald-400">
                      <span className="hidden sm:inline">{role.dates}</span>
                      <Chevron open={isOpen} />
                    </span>
                  </button>
                  <div id={`role-${i}`} hidden={!isOpen} className="space-y-2 pl-[3.375rem] pt-2 sm:pl-14">
                    <p className="font-mono text-[11px] text-faint dark:text-zinc-500">Location: {role.location}</p>
                    <Bullets points={role.points} className="ml-3.5" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {projects.length > 0 && (
          <section className="space-y-3.5">
            <SectionHeader title="Selected Projects" action={<ExpandAll allOpen={proj.allOpen} onClick={proj.toggleAll} />} />
            <div className="space-y-3 pt-0.5">
              {projects.map((project, i) => {
                const isOpen = proj.open.has(i);
                return (
                  <div key={project.name} className="border-b border-line/60 pb-3 last:border-b-0 dark:border-zinc-800/60">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`project-${i}`}
                      onClick={() => proj.toggle(i)}
                      className="group flex w-full cursor-pointer select-none items-center justify-between gap-3 py-1 text-left transition-opacity hover:opacity-85"
                    >
                      <span className="text-sm font-semibold text-ink transition-colors group-hover:text-accent dark:text-zinc-100 dark:group-hover:text-emerald-400">
                        {project.name}
                      </span>
                      <span className="flex shrink-0 items-center gap-2 font-mono text-[11px] text-muted dark:text-zinc-400">
                        <span>{project.date}</span>
                        <Chevron open={isOpen} />
                      </span>
                    </button>
                    <div id={`project-${i}`} hidden={!isOpen} className="space-y-2.5 pl-1 pt-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-mono text-[11px] text-accent dark:text-emerald-400">{project.stack}</p>
                        <div className="flex items-center gap-2 font-mono text-xs">
                          {project.live && (
                            <ExternalLink href={project.live} className="text-accent dark:text-zinc-100">
                              Live Site
                            </ExternalLink>
                          )}
                          {project.live && project.source && <span className="text-dot dark:text-zinc-800">·</span>}
                          {project.source && (
                            <ExternalLink href={project.source} className="text-muted dark:text-zinc-400">
                              Source Code
                            </ExternalLink>
                          )}
                        </div>
                      </div>
                      <Bullets points={project.points} className="ml-4" />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        <section className="space-y-2.5">
          <SectionHeader title="Technical Skills" />
          <dl className="space-y-2 pt-0.5 font-mono text-xs leading-relaxed">
            {skills.map((group) => (
              <div key={group.label} className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-2">
                <dt className="w-36 shrink-0 font-medium text-muted dark:text-zinc-400">{group.label}:</dt>
                <dd className="text-ink dark:text-zinc-100">{group.items}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="space-y-1.5">
          <SectionHeader title="Education" />
          <div className="flex flex-col justify-between gap-1 pt-0.5 sm:flex-row sm:items-baseline">
            <div>
              <p className="text-xs font-semibold text-ink sm:text-sm dark:text-zinc-100">{education.school}</p>
              <p className="text-xs text-muted dark:text-zinc-400">{education.degree}</p>
            </div>
            <span className="shrink-0 font-mono text-xs text-accent dark:text-emerald-400">{education.meta}</span>
          </div>
        </section>
      </main>

      <footer className="mx-auto flex w-full max-w-2xl items-center justify-between border-t border-line px-6 pb-12 pt-6 font-mono text-xs text-faint dark:border-zinc-800/60 dark:text-zinc-500">
        <span>{name}</span>
        <span>© 2026</span>
      </footer>
    </>
  );
}
