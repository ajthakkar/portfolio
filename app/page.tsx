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
  "I'm a business student at Ohio State's Fisher College of Business, and I'm most interested in where business, software, and AI meet. Before college I co-founded Roam Travel, where we took a luggage strap from a handmade prototype to a patent-pending product with 250+ units sold. I've also spent years in competitive chess as a USCF Expert and have taught the game to more than 1,000 students. I grew up in Naperville, Illinois, and outside of class you'll usually find me playing poker, solving logic puzzles, playing GeoGuessr, or working out.";

type Role = {
  org: string;
  monogram?: string;
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
      "Serve as the team's main point of contact with OSU University Libraries on a product discovery project about how incoming students learn about library resources",
      "Organize stakeholder interviews end to end, from outreach and scheduling to follow-up",
      "Coordinate team tasks and keep work moving between weekly track meetings",
    ],
  },
  {
    org: "Roam Travel",
    monogram: "RT",
    role: "Co-Founder, CTO & CFO",
    dates: "Aug 2024 – Aug 2025",
    location: "Naperville, IL",
    points: [
      "Co-founded a 3-person startup through a high school incubator; took the Roam Link luggage strap from prototype to a patent-pending product",
      "Sold 250+ units and earned $2,000+ in profit, starting with 80+ handmade units to validate demand before manufacturing",
      "Ran lean startup build-measure-learn cycles, turning customer feedback into product changes",
      "Pitched to investor judges at 20+ competitions, winning $10,000+ in prize money",
      "Created the Roam Challenge, trading free units for travelers' destination photos to source ad content",
      "Helped launch the Shopify store, grew a 1,000+ person customer sign-up list, and secured partnerships through direct outreach",
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
      "Ran walk-in trial lessons and placement orientations for prospective families, turning visitors into enrolled students",
      "Covered classes on short notice and ran both groups of a 20-student camp alone while a co-coach was out",
      "Helped shape teaching methods and student-retention ideas with the owner and manager as the company grew",
      "Tracked student progress for parents and management, and trained the coach who took over my role",
    ],
  },
];

const involvement: Role[] = [
  {
    org: "Ohio State Chess Club",
    role: "Treasurer, Executive Board",
    dates: "Nov 2026 – Present",
    location: "Columbus, OH",
    points: ["Joined as a member in Aug 2026 and was elected to the executive board as Treasurer in Nov 2026"],
  },
  {
    org: "AI Club",
    role: "Member",
    dates: "Fall 2026 – Present",
    location: "Columbus, OH",
    points: [],
  },
  {
    org: "Naperville North Chess Team",
    role: "Captain (2024 – 2026)",
    dates: "2022 – 2026",
    location: "Naperville, IL",
    points: [
      "Led meetings and drafted training plans, raising the team's average rating by about 100 points",
      "Grew consistent membership 50% (20 to 30 players) and pushed players into outside rated tournaments",
      "Played Board 1 all four years as the team placed top 15 of 128 state qualifiers every year",
    ],
  },
  {
    org: "Naperville North High School",
    role: "Peer Tutor",
    dates: "2024 – 2026",
    location: "Naperville, IL",
    points: ["Tutored peers across all core subjects over three semesters"],
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

const honors = [
  { title: "Individual Gold Medal, IHSA State Chess Finals", detail: "Board 1, perfect 7/7 score", date: "Feb 2026" },
  { title: "1st Place Overall, Hack For The World", detail: "12-hour sustainability hackathon", date: "Feb 2026" },
  {
    title: "National Finalist (Top 5), INCubatoredu National Pitch Competition",
    detail: "Willis Tower, Chicago, with Roam Travel",
    date: "2025",
  },
  {
    title: "1st of 60 Teams, District 203 INCubatoredu Final Pitch Night",
    detail: "$3,000 prize, with Roam Travel",
    date: "2025",
  },
  { title: "6th Place in Illinois, DECA Entrepreneurship Series", detail: "", date: "2024" },
  {
    title: "USCF Expert (2070)",
    detail: "One class below National Master; top 1% online on Chess.com and Lichess",
    date: "",
  },
];

const skills = [
  { label: "Programming", items: "Python, Java, HTML" },
  { label: "AI Tools", items: "Claude Code, Claude, Cursor, Prompt Engineering, Workflow Automation" },
  { label: "Tools", items: "Excel (INDEX/MATCH, SUMIFS, NPV), Shopify, Linux" },
  { label: "Business", items: "Customer Discovery, Lean Startup Iteration, Investor Pitching, Partner Outreach" },
  { label: "Teaching", items: "Group and One-on-One Instruction, Lesson Planning, Training New Coaches" },
  { label: "Languages", items: "English, Gujarati, Spanish" },
];

const education = [
  {
    school: "The Ohio State University, Fisher College of Business",
    degree: "B.S. in Business Administration",
    note: "Entered with sophomore standing via 40+ AP credit hours",
    dates: "Expected May 2029",
    location: "Columbus, OH",
  },
  {
    school: "Naperville North High School",
    degree: "High School Diploma",
    note: "ACT 36 · National Merit Commended Scholar · AP Scholar",
    dates: "May 2026",
    location: "Naperville, IL",
  },
];

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

function RoleList({ title, id, roles, initiallyOpen = [] }: { title: string; id: string; roles: Role[]; initiallyOpen?: number[] }) {
  const expandable = roles.map((role, i) => (role.points.length > 0 ? i : -1)).filter((i) => i >= 0);
  const { open, toggle } = useExpandable(roles.length, initiallyOpen);
  const allOpen = expandable.length > 0 && expandable.every((i) => open.has(i));
  const toggleAll = () => expandable.forEach((i) => open.has(i) === allOpen && toggle(i));

  return (
    <section className="space-y-3.5">
      <SectionHeader title={title} action={<ExpandAll allOpen={allOpen} onClick={toggleAll} />} />
      <div className="space-y-3 pt-0.5">
        {roles.map((role, i) => {
          const isOpen = open.has(i);
          const canOpen = role.points.length > 0;
          const indent = role.monogram ? "pl-[3.375rem] sm:pl-14" : "pl-0";
          const heading = (
            <>
              <span className="flex min-w-0 items-center gap-3.5">
                {role.monogram && (
                  <span
                    aria-hidden="true"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-line bg-pill font-mono text-xs font-semibold text-accent sm:h-11 sm:w-11 dark:border-zinc-800 dark:bg-night-pill dark:text-emerald-400"
                  >
                    {role.monogram}
                  </span>
                )}
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
                {canOpen ? <Chevron open={isOpen} /> : <span aria-hidden="true" className="w-3.5" />}
              </span>
            </>
          );

          return (
            <div key={role.org} className="border-b border-line/60 pb-3 last:border-b-0 dark:border-zinc-800/60">
              {canOpen ? (
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`${id}-${i}`}
                  onClick={() => toggle(i)}
                  className="group flex w-full cursor-pointer select-none items-center justify-between gap-3 py-1 text-left transition-opacity hover:opacity-85"
                >
                  {heading}
                </button>
              ) : (
                <div className="flex w-full items-center justify-between gap-3 py-1">{heading}</div>
              )}
              {canOpen && (
                <div id={`${id}-${i}`} hidden={!isOpen} className={`space-y-2 pt-2 ${indent}`}>
                  <p className="font-mono text-[11px] text-faint dark:text-zinc-500">Location: {role.location}</p>
                  <Bullets points={role.points} className="ml-3.5" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ─────────────────────────────── Page ─────────────────────────────── */

export default function Page() {
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

        <RoleList title="Work Experience" id="role" roles={experience} initiallyOpen={[1]} />

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

        <RoleList title="Leadership & Involvement" id="involvement" roles={involvement} />

        <section className="space-y-3">
          <SectionHeader title="Honors & Awards" />
          <ul className="space-y-2.5 pt-0.5">
            {honors.map((honor) => (
              <li key={honor.title} className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-ink sm:text-sm dark:text-zinc-100">{honor.title}</p>
                  {honor.detail && <p className="text-xs text-muted dark:text-zinc-400">{honor.detail}</p>}
                </div>
                {honor.date && (
                  <span className="shrink-0 font-mono text-[11px] text-accent dark:text-emerald-400">{honor.date}</span>
                )}
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-2.5">
          <SectionHeader title="Skills" />
          <dl className="space-y-2 pt-0.5 font-mono text-xs leading-relaxed">
            {skills.map((group) => (
              <div key={group.label} className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-2">
                <dt className="w-28 shrink-0 font-medium text-muted dark:text-zinc-400">{group.label}:</dt>
                <dd className="text-ink dark:text-zinc-100">{group.items}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="space-y-3">
          <SectionHeader title="Education" />
          <div className="space-y-3 pt-0.5">
            {education.map((school) => (
              <div key={school.school} className="flex flex-col justify-between gap-1 sm:flex-row sm:items-baseline sm:gap-4">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-ink sm:text-sm dark:text-zinc-100">{school.school}</p>
                  <p className="text-xs text-muted dark:text-zinc-400">{school.degree}</p>
                  <p className="mt-0.5 text-xs text-faint dark:text-zinc-500">{school.note}</p>
                </div>
                <span className="shrink-0 font-mono text-[11px] text-accent sm:text-right dark:text-emerald-400">
                  {school.dates} · {school.location}
                </span>
              </div>
            ))}
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
