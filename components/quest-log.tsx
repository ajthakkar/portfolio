"use client";

import { ArrowRight, X } from "lucide-react";
import { cases, skillName, type Case } from "@/lib/content";
import { selectSkill, useSelectedSkill } from "./hud";
import { TransitionLink } from "./transition-link";
import { CaseBoard, Panel } from "./ui";

function Reward({ id, active }: { id: string; active: boolean }) {
  return (
    <span
      className={`border px-1.5 py-0.5 font-mono text-[11px] transition-colors ${
        active ? "border-accent bg-accent text-accent-ink" : "border-line text-copy"
      }`}
    >
      +{skillName(id)}
    </span>
  );
}

function FeaturedCard({ c, selected }: { c: Case; selected: string | null }) {
  const match = !selected || c.rewards.includes(selected);
  return (
    <li className={`transition-opacity duration-300 ${match ? "" : "opacity-30"}`}>
      <TransitionLink href={`/projects/${c.slug}/`} className="group block">
        <Panel
          small
          className={`transition-colors duration-200 group-hover:bg-accent ${selected && match ? "!bg-accent" : ""}`}
          inner="grid grid-cols-[1fr_auto] items-center gap-4 p-4 sm:grid-cols-[76px_1fr_auto] sm:gap-6 sm:p-5"
        >
          <span className="vt-name hidden sm:block" style={{ "--vt-name": `board-${c.slug}` } as React.CSSProperties}>
            <CaseBoard
              seed={c.slug}
              className="w-full transition-transform duration-500 group-hover:rotate-[-4deg] group-hover:scale-105"
            />
          </span>
          <span className="min-w-0 space-y-1.5">
            <span className="pixel block text-muted">
              {c.area} · {c.period}
            </span>
            <span
              className="vt-name block w-fit font-display text-2xl font-bold tracking-[-0.02em] text-ink sm:text-[1.7rem]"
              style={{ "--vt-name": `title-${c.slug}` } as React.CSSProperties}
            >
              {c.title}
            </span>
            <span className="block text-sm leading-relaxed text-muted sm:text-[15px]">{c.dek}</span>
            <span className="block pt-1 font-mono text-xs text-accent">{c.result}</span>
            {c.rewards.length > 0 && (
              <span className="flex flex-wrap gap-1.5 pt-0.5">
                {c.rewards.map((r) => (
                  <Reward key={r} id={r} active={r === selected} />
                ))}
              </span>
            )}
          </span>
          <ArrowRight
            aria-hidden="true"
            className="h-4 w-4 text-faint transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent"
          />
        </Panel>
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
        className={`group grid grid-cols-[1fr_auto] items-center gap-4 px-1 py-3.5 transition-colors hover:bg-paper-2/70 sm:grid-cols-[minmax(0,240px)_1fr_auto] sm:gap-6 sm:px-3 ${
          selected && match ? "bg-accent/10" : ""
        }`}
      >
        <span className="min-w-0">
          <span className="block font-display text-lg font-bold tracking-tight text-ink transition-colors group-hover:text-accent">
            {c.title}
          </span>
          <span className="pixel mt-1 block text-muted">
            {c.area} · {c.period}
          </span>
        </span>
        <span className="hidden min-w-0 text-sm text-muted sm:block">{c.result}</span>
        <ArrowRight
          aria-hidden="true"
          className="h-4 w-4 text-faint transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent"
        />
      </TransitionLink>
    </li>
  );
}

/** Featured projects as cards, the rest as a compact list. A skill picked in the skill tree highlights its proof in both. */
export function QuestLog() {
  const selected = useSelectedSkill();
  const featured = cases.filter((c) => c.featured);
  const more = cases.filter((c) => !c.featured);

  return (
    <div>
      {selected && (
        <div className="mb-3 flex items-center justify-between gap-3 border border-accent/50 px-3 py-2">
          <p className="pixel text-accent">Showing projects that prove {skillName(selected)}</p>
          <button
            type="button"
            onClick={() => selectSkill(null)}
            className="pixel inline-flex cursor-pointer items-center gap-1 p-1 text-muted hover:text-ink"
          >
            Clear <X aria-hidden="true" className="h-3 w-3" />
          </button>
        </div>
      )}

      <ol className="space-y-3">
        {featured.map((c) => (
          <FeaturedCard key={c.slug} c={c} selected={selected} />
        ))}
      </ol>

      {more.length > 0 && (
        <div className="pt-10">
          <p className="pixel text-muted">More projects</p>
          <ol className="mt-2 divide-y divide-line border-y border-line">
            {more.map((c) => (
              <CompactRow key={c.slug} c={c} selected={selected} />
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
