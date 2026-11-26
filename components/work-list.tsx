"use client";

import { ArrowRight, X } from "lucide-react";
import { cases, skillName, type Case } from "@/lib/content";
import { selectSkill, useSelectedSkill } from "./skill-select";
import { TransitionLink } from "./transition-link";
import { Card, Chip } from "./ui";

function FeaturedCard({ c, index, selected }: { c: Case; index: number; selected: string | null }) {
  const match = !selected || c.rewards.includes(selected);
  return (
    <li className={`transition-opacity duration-300 ${match ? "" : "opacity-30"}`}>
      <TransitionLink href={`/projects/${c.slug}/`} className="group block">
        <Card
          active={Boolean(selected && match)}
          className="grid grid-cols-[1fr_auto] items-start gap-4 p-5 sm:grid-cols-[56px_1fr_auto] sm:gap-6 sm:p-6"
        >
          <span aria-hidden="true" className="card-index hidden pt-1 font-mono text-sm text-faint sm:block">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="min-w-0 space-y-2">
            <span className="label block text-muted">
              {c.area} · {c.period}
            </span>
            <span
              className="card-title vt-name block w-fit font-display text-2xl font-bold tracking-[-0.02em] text-ink sm:text-[1.75rem]"
              style={{ "--vt-name": `title-${c.slug}` } as React.CSSProperties}
            >
              {c.title}
            </span>
            <span className="block max-w-3xl text-sm leading-relaxed text-muted sm:text-[15px]">{c.dek}</span>
            <span className="card-result block pt-0.5 font-mono text-xs text-accent">{c.result}</span>
            {c.rewards.length > 0 && (
              <span className="flex flex-wrap gap-1.5 pt-1">
                {c.rewards.map((r) => (
                  <Chip key={r} active={r === selected}>
                    {skillName(r)}
                  </Chip>
                ))}
              </span>
            )}
          </span>
          <ArrowRight
            aria-hidden="true"
            className="mt-1 h-4 w-4 text-faint transition-all duration-300 group-hover:translate-x-1 group-hover:text-ink"
          />
        </Card>
      </TransitionLink>
    </li>
  );
}

function CompactRow({ c, selected }: { c: Case; selected: string | null }) {
  const match = !selected || c.rewards.includes(selected);
  return (
    <li className={`transition-opacity duration-300 ${match ? "" : "opacity-30"}`}>
      <TransitionLink
        href={`/projects/${c.slug}/`}
        className={`row-link group grid grid-cols-[1fr_auto] items-center gap-4 px-1 py-4 sm:grid-cols-[minmax(0,260px)_1fr_auto] sm:gap-6 sm:px-3 ${
          selected && match ? "bg-accent/10" : ""
        }`}
      >
        <span className="min-w-0">
          <span className="block font-display text-lg font-bold tracking-tight text-ink">{c.title}</span>
          <span className="label mt-1 block text-muted">
            {c.area} · {c.period}
          </span>
        </span>
        <span className="hidden min-w-0 text-sm text-muted sm:block">{c.result}</span>
        <ArrowRight
          aria-hidden="true"
          className="h-4 w-4 text-faint transition-all duration-300 group-hover:translate-x-1 group-hover:text-ink"
        />
      </TransitionLink>
    </li>
  );
}

/** Featured projects as cards, the rest as a compact list. A skill picked in the skills section highlights its proof in both. */
export function WorkList() {
  const selected = useSelectedSkill();
  const featured = cases.filter((c) => c.featured);
  const more = cases.filter((c) => !c.featured);

  return (
    <div>
      {selected && (
        <div className="panel mb-3 flex items-center justify-between gap-3 px-4 py-2.5">
          <p className="label text-accent">Projects that show {skillName(selected)}</p>
          <button
            type="button"
            onClick={() => selectSkill(null)}
            className="label inline-flex cursor-pointer items-center gap-1 p-1 text-muted hover:text-ink"
          >
            Clear <X aria-hidden="true" className="h-3 w-3" />
          </button>
        </div>
      )}

      <ol className="space-y-3">
        {featured.map((c, i) => (
          <FeaturedCard key={c.slug} c={c} index={i} selected={selected} />
        ))}
      </ol>

      {more.length > 0 && (
        <div className="pt-12">
          <p className="label text-muted">More projects</p>
          <ol className="mt-3 divide-y divide-line border-y border-line">
            {more.map((c) => (
              <CompactRow key={c.slug} c={c} selected={selected} />
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
