"use client";

import { ArrowUpRight, Check, Lock } from "lucide-react";
import { branchName, branches, skillProof, skillState, upcoming, type Skill, type SkillState } from "@/lib/content";
import { selectSkill, useSelectedSkill } from "./hud";
import { TransitionLink } from "./transition-link";
import { PieceIcon, StatusChip } from "./ui";

const nodeStyle: Record<SkillState, string> = {
  unlocked: "border-accent bg-accent text-accent-ink",
  training: "border-dashed border-coral bg-coral/10 text-coral",
  locked: "border-line bg-paper text-faint",
};

function NodeIcon({ state }: { state: SkillState }) {
  if (state === "unlocked") return <Check aria-hidden="true" className="h-4 w-4" strokeWidth={3} />;
  if (state === "training") return <span aria-hidden="true" className="blink h-2 w-2 bg-coral" />;
  return <Lock aria-hidden="true" className="h-3.5 w-3.5" />;
}

/** Five branches of skills. Picking one shows its proof and highlights the projects behind it. */
export function SkillTree() {
  const selected = useSelectedSkill();
  const current = branches.flatMap((b) => b.skills.map((s) => ({ skill: s, branch: b.id }))).find((x) => x.skill.id === selected);

  return (
    <div>
      <div className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
        {branches.map((branch) => {
          const unlocked = branch.skills.filter((s) => skillState(s) === "unlocked").length;
          return (
            <div key={branch.id} className="bg-paper p-4 sm:p-5">
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2" title={branch.pieceNote}>
                  <PieceIcon piece={branch.piece} className="h-5 w-5 text-accent" />
                  <span className="font-display text-lg font-bold tracking-tight text-ink">{branch.name}</span>
                </span>
                <span className="font-mono text-xs text-muted">
                  {unlocked}/{branch.skills.length}
                </span>
              </div>
              <ol className="mt-4 grid grid-cols-2 gap-2 sm:flex sm:flex-col sm:gap-0">
                {branch.skills.map((skill, i) => {
                  const state = skillState(skill);
                  const isSelected = selected === skill.id;
                  return (
                    <li key={skill.id}>
                      {i > 0 && (
                        <span
                          aria-hidden="true"
                          className={`ml-[17px] hidden h-3 w-0.5 sm:block ${state === "unlocked" ? "bg-accent" : "bg-line"}`}
                        />
                      )}
                      <button
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => selectSkill(isSelected ? null : skill.id)}
                        className="group flex w-full cursor-pointer items-center gap-2.5 text-left"
                      >
                        <span
                          className={`grid h-9 w-9 shrink-0 place-items-center border-2 transition-transform duration-200 ${nodeStyle[state]} ${
                            isSelected ? "scale-110 outline outline-2 outline-offset-2 outline-ink" : "group-hover:scale-105"
                          }`}
                        >
                          <NodeIcon state={state} />
                        </span>
                        <span
                          className={`text-[13px] leading-tight transition-colors ${
                            state === "locked" ? "text-faint group-hover:text-muted" : "text-ink"
                          } ${isSelected ? "font-semibold" : ""}`}
                        >
                          {skill.name}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>
          );
        })}
      </div>

      <div aria-live="polite" className="mt-4">
        {current ? (
          <SkillDetail key={current.skill.id} skill={current.skill} branch={current.branch} />
        ) : (
          <p className="pixel text-faint">▸ Pick a skill to see the proof behind it</p>
        )}
      </div>
    </div>
  );
}

function SkillDetail({ skill, branch }: { skill: Skill; branch: string }) {
  const state = skillState(skill);
  const proof = skillProof(skill);
  const quest = upcoming.find((q) => q.rewards.includes(skill.id));

  return (
    <div className="animate-pop-in border border-line bg-paper-2 p-4 sm:flex sm:items-start sm:justify-between sm:gap-8 sm:p-5">
      <div className="space-y-1.5">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="font-display text-xl font-bold tracking-tight text-ink">{skill.name}</span>
          <StatusChip state={state} />
          <span className="pixel text-faint">{branchName(branch)}</span>
        </div>
        <p className="text-sm text-copy">{skill.line}</p>
      </div>
      <div className="mt-3 shrink-0 sm:mt-0 sm:text-right">
        {proof.length > 0 && (
          <>
            <p className="pixel text-faint">Proof</p>
            <ul className="mt-1.5 flex flex-wrap gap-2 sm:justify-end">
              {proof.map((p) => (
                <li key={p.label}>
                  <TransitionLink
                    href={p.href}
                    className="inline-flex items-center gap-1 border border-accent px-2 py-1 font-mono text-xs text-accent transition-colors hover:bg-accent hover:text-accent-ink"
                  >
                    {p.label}
                    <ArrowUpRight aria-hidden="true" className="h-3 w-3" />
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </>
        )}
        {proof.length === 0 && state === "training" && quest && (
          <p className="text-sm text-coral">In progress: {quest.title}</p>
        )}
        {state === "locked" && <p className="text-sm text-muted">A project on the roadmap unlocks this.</p>}
      </div>
    </div>
  );
}
