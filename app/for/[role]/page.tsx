import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, FileText } from "lucide-react";
import { ContactCta } from "@/components/contact-cta";
import { Tldr } from "@/components/tldr";
import { TransitionLink } from "@/components/transition-link";
import { ExternalLink, Kicker, Panel } from "@/components/ui";
import { cases, experience, honors, involvement, profile, skillName, type Case } from "@/lib/content";
import { roleViews } from "@/lib/roles";

type Params = { params: { role: string } };

export function generateStaticParams() {
  return roleViews.map((r) => ({ role: r.slug }));
}

export function generateMetadata({ params }: Params): Metadata {
  const view = roleViews.find((r) => r.slug === params.role);
  if (!view) return {};
  const title = `${profile.name} · ${view.title}`;
  // Link previews cut off around 160 characters, so use the pitch's first sentence.
  const description = view.pitch.split(/(?<=\.)\s/)[0];
  return {
    title: { absolute: title },
    description,
    openGraph: {
      title,
      description,
      url: `/for/${view.slug}/`,
      images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
    },
  };
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4 pt-14">
      <h2 className="border-b border-line pb-3 font-display text-2xl font-bold tracking-[-0.02em] text-ink">{title}</h2>
      {children}
    </section>
  );
}

function LeadProject({ c }: { c: Case }) {
  return (
    <li>
      <TransitionLink href={`/projects/${c.slug}/`} className="group block h-full">
        <Panel small className="h-full transition-colors duration-200 group-hover:bg-accent" inner="flex h-full flex-col gap-4 p-5 sm:p-6">
          <div className="space-y-1.5">
            <p className="pixel text-muted">
              {c.area} · {c.period}
            </p>
            <h3 className="font-display text-2xl font-bold tracking-[-0.02em] text-ink">{c.title}</h3>
          </div>
          <Tldr items={c.tldr} stacked />
          <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-1">
            <span className="flex flex-wrap gap-1.5">
              {c.rewards.map((r) => (
                <span key={r} className="border border-line px-1.5 py-0.5 font-mono text-[11px] text-copy">
                  {skillName(r)}
                </span>
              ))}
            </span>
            <span className="inline-flex items-center gap-1 font-mono text-xs text-accent">
              Read it
              <ArrowRight aria-hidden="true" className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </Panel>
      </TransitionLink>
    </li>
  );
}

export default function RolePage({ params }: Params) {
  const view = roleViews.find((r) => r.slug === params.role);
  if (!view) notFound();

  const projects = view.projects.map((slug) => cases.find((c) => c.slug === slug)).filter((c): c is Case => !!c);
  const lead = projects.slice(0, 3);
  const rest = projects.slice(3);
  const allRoles = [...experience, ...involvement];
  const roles = view.roles.map((org) => allRoles.find((r) => r.org === org)).filter((r) => !!r);
  const shownHonors = view.honors.map((h) => honors.find((x) => x.title.startsWith(h))).filter((h) => !!h);
  const others = roleViews.filter((r) => r.slug !== view.slug);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
      <header className="space-y-5 pb-2 pt-10 sm:pt-16">
        <Kicker className="rise">Short version · {view.title}</Kicker>
        <h1
          className="rise font-display text-5xl font-extrabold leading-[0.9] tracking-[-0.04em] text-ink sm:text-7xl"
          style={{ "--i": 1 } as React.CSSProperties}
        >
          {profile.name}
        </h1>
        <p className="rise text-sm font-medium text-muted" style={{ "--i": 1 } as React.CSSProperties}>
          {profile.playerClass} · Class of 2029 · {profile.location}
        </p>
        <p className="rise max-w-3xl text-base leading-relaxed text-copy sm:text-lg" style={{ "--i": 2 } as React.CSSProperties}>
          {view.pitch}
        </p>
        <p className="rise flex max-w-3xl gap-2.5 text-[15px] font-medium leading-snug text-ink" style={{ "--i": 2 } as React.CSSProperties}>
          <span aria-hidden="true" className="mt-[5px] h-2.5 w-2.5 shrink-0 bg-accent" />
          {profile.lookingFor}
        </p>
        <nav
          aria-label="Profile links"
          className="rise flex flex-wrap items-center gap-x-5 gap-y-3 font-mono text-xs text-muted"
          style={{ "--i": 3 } as React.CSSProperties}
        >
          <a
            href={view.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-game inline-flex items-center gap-2 bg-lime px-4 py-2.5 font-display text-sm font-bold text-lime-ink"
          >
            <FileText aria-hidden="true" className="h-4 w-4" />
            Resume (PDF)
          </a>
          {profile.links
            .filter((link) => link.href !== profile.resume)
            .map((link) => (
            <ExternalLink key={link.label} href={link.href} className="py-1 hover:text-ink">
              {link.label}
            </ExternalLink>
          ))}
          <TransitionLink href="/" className="link-underline inline-flex items-center gap-1 py-1 text-accent">
            Full site
            <ArrowRight aria-hidden="true" className="h-3 w-3" />
          </TransitionLink>
        </nav>
      </header>

      <Section title="Most relevant projects">
        <ol className="grid gap-3 lg:grid-cols-3">
          {lead.map((c) => (
            <LeadProject key={c.slug} c={c} />
          ))}
        </ol>
        {rest.length > 0 && (
          <ol className="divide-y divide-line border-y border-line">
            {rest.map((c) => (
              <li key={c.slug}>
                <TransitionLink
                  href={`/projects/${c.slug}/`}
                  className="group grid grid-cols-[1fr_auto] items-center gap-4 px-1 py-3.5 transition-colors hover:bg-paper-2/70 sm:grid-cols-[minmax(0,240px)_1fr_auto] sm:gap-6 sm:px-3"
                >
                  <span>
                    <span className="block font-display text-lg font-bold tracking-tight text-ink group-hover:text-accent">
                      {c.title}
                    </span>
                    <span className="pixel mt-1 block text-muted">{c.area}</span>
                  </span>
                  <span className="hidden text-sm text-muted sm:block">{c.tldr[2]}</span>
                  <ArrowRight aria-hidden="true" className="h-4 w-4 text-faint group-hover:text-accent" />
                </TransitionLink>
              </li>
            ))}
          </ol>
        )}
      </Section>

      <div className="grid gap-x-12 lg:grid-cols-[1fr_320px]">
        <Section title="Experience">
          <ul className="space-y-6">
            {roles.map((r) => (
              <li key={r.org} className="space-y-1.5">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <p className="text-[15px] font-semibold text-ink">
                    {r.role} · <span className="font-normal text-copy">{r.org}</span>
                  </p>
                  <p className="font-mono text-[11px] text-muted">{r.dates}</p>
                </div>
                {r.points.length > 0 && (
                  <ul className="space-y-1">
                    {r.points.slice(0, 2).map((p) => (
                      <li key={p} className="flex gap-2.5 text-sm leading-relaxed text-copy">
                        <span aria-hidden="true" className="mt-[0.6em] h-1 w-1 shrink-0 bg-accent" />
                        {p}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
          <TransitionLink href="/record/" className="link-underline inline-flex items-center gap-1 font-mono text-xs text-muted hover:text-ink">
            Full record
            <ArrowRight aria-hidden="true" className="h-3 w-3" />
          </TransitionLink>
        </Section>

        <div>
          <Section title="Skills">
            <ul className="flex flex-wrap gap-1.5">
              {view.skills.map((s) => (
                <li key={s} className="border border-line bg-paper-2/60 px-2 py-1 text-[13px] text-ink">
                  {s}
                </li>
              ))}
            </ul>
          </Section>
          <Section title="Honors">
            <ul className="space-y-3">
              {shownHonors.map((h) => (
                <li key={h.title}>
                  <p className="text-sm font-semibold text-ink">{h.title}</p>
                  {h.detail && <p className="text-[13px] text-muted">{h.detail}</p>}
                </li>
              ))}
            </ul>
          </Section>
        </div>
      </div>

      <ContactCta resume={view.resume} className="pt-16" />

      <nav aria-label="Other short versions" className="mt-16 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
          <span className="pixel">Other versions</span>
          {others.map((r) => (
            <TransitionLink key={r.slug} href={`/for/${r.slug}/`} className="link-underline py-1 hover:text-ink">
              {r.label}
            </TransitionLink>
          ))}
        </p>
        <TransitionLink href="/" className="inline-flex items-center gap-1.5 font-display text-sm font-bold text-accent">
          Everything, on the full site
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </TransitionLink>
      </nav>
    </div>
  );
}
