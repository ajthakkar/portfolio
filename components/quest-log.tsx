"use client";

import { ArrowRight, Lock, X } from "lucide-react";
import { branchName, cases, skillName, upcoming } from "@/lib/content";
import { selectSkill, useSelectedSkill } from "./hud";
import { TransitionLink } from "./transition-link";
import { CaseBoard, Panel, StatusChip } from "./ui";

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

/** Projects as quests. When a skill is picked in the skill tree, the quests that prove it stay lit. */
export function QuestLog() {
  const selected = useSelectedSkill();

  return (
    <div>
      {selected && (
        <div className="mb-3 flex items-center justify-between gap-3 border border-accent/50 px-3 py-2">
          <p className="pixel text-accent">Showing quests that prove {skillName(selected)}</p>
          <button
            type="button"
            onClick={() => selectSkill(null)}
            className="pixel inline-flex cursor-pointer items-center gap-1 text-muted hover:text-ink"
          >
            Clear <X aria-hidden="true" className="h-3 w-3" />
          </button>
        </div>
      )}

      <ol className="space-y-3">
        {cases.map((c) => {
          const match = !selected || c.rewards.includes(selected);
          return (
            <li key={c.slug} className={`transition-opacity duration-300 ${match ? "" : "opacity-30"}`}>
              <TransitionLink href={`/projects/${c.slug}/`} className="group block">
                <Panel
                  small
                  className={`transition-colors duration-200 group-hover:bg-accent ${selected && match ? "!bg-accent" : ""}`}
                  inner="grid grid-cols-[52px_1fr_auto] items-center gap-4 p-4 sm:grid-cols-[76px_1fr_auto] sm:gap-6 sm:p-5"
                >
                  <span className="vt-name block" style={{ "--vt-name": `board-${c.slug}` } as React.CSSProperties}>
                    <CaseBoard
                      seed={c.slug}
                      className="w-full transition-transform duration-500 group-hover:rotate-[-4deg] group-hover:scale-105"
                    />
                  </span>
                  <span className="min-w-0 space-y-1.5">
                    <span className="flex flex-wrap items-center gap-2">
                      <StatusChip state="complete" />
                      <span className="pixel text-faint">
                        {c.kind} {c.number} · {c.period}
                      </span>
                    </span>
                    <span
                      className="vt-name block w-fit font-display text-2xl font-bold tracking-[-0.02em] text-ink sm:text-[1.7rem]"
                      style={{ "--vt-name": `title-${c.slug}` } as React.CSSProperties}
                    >
                      {c.title}
                    </span>
                    <span className="block text-sm leading-relaxed text-muted sm:text-[15px]">{c.dek}</span>
                    <span className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="font-mono text-[11px] text-accent">{c.result}</span>
                      {c.rewards.length > 0 && <span aria-hidden="true" className="px-1 text-faint">·</span>}
                      {c.rewards.map((r) => (
                        <Reward key={r} id={r} active={r === selected} />
                      ))}
                    </span>
                  </span>
                  <ArrowRight
                    aria-hidden="true"
                    className="h-4 w-4 text-faint transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent"
                  />
                </Panel>
              </TransitionLink>
            </li>
          );
        })}

        {upcoming.map((q, i) => {
          const match = !selected || q.rewards.includes(selected);
          return (
            <li key={`${q.title}-${i}`} className={`transition-opacity duration-300 ${match ? "" : "opacity-30"}`}>
              <div className="grid grid-cols-[52px_1fr] items-center gap-4 border border-dashed border-line p-4 sm:grid-cols-[76px_1fr] sm:gap-6 sm:p-5">
                <span className="relative block">
                  <CaseBoard seed={`upcoming-${i}`} muted className="w-full opacity-50" />
                  {q.state === "locked" && (
                    <span className="absolute inset-0 grid place-items-center">
                      <Lock aria-hidden="true" className="h-5 w-5 text-faint" />
                    </span>
                  )}
                </span>
                <span className="min-w-0 space-y-1.5">
                  <span className="flex flex-wrap items-center gap-2">
                    <StatusChip state={q.state} />
                    <span className="pixel text-faint">{branchName(q.branch)} quest</span>
                  </span>
                  <span
                    className={`block font-display text-2xl font-bold tracking-[-0.02em] sm:text-[1.7rem] ${
                      q.state === "locked" ? "text-faint" : "text-ink"
                    }`}
                  >
                    {q.title}
                  </span>
                  <span className="block text-sm leading-relaxed text-muted sm:text-[15px]">{q.dek}</span>
                  {q.rewards.length > 0 && (
                    <span className="flex flex-wrap gap-1.5 pt-1">
                      {q.rewards.map((r) => (
                        <Reward key={r} id={r} active={r === selected} />
                      ))}
                    </span>
                  )}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
