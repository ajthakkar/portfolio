"use client";

import { ArrowUpRight } from "lucide-react";
import { branchName, branches, skillProof, skillState, type Skill } from "@/lib/content";
import { selectSkill, useSelectedSkill } from "./skill-select";
import { TransitionLink } from "./transition-link";
import { PieceIcon } from "./ui";

/** Five areas of skills, each backed by projects. Picking one shows its proof and highlights the projects behind it. */
export function Skills() {
  const selected = useSelectedSkill();
  const current = branches.flatMap((b) => b.skills.map((s) => ({ skill: s, branch: b.id }))).find((x) => x.skill.id === selected);

  return (
    <div>
      <div className="grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-5">
        {branches.map((branch) => {
          const shown = branch.skills.filter((s) => skillState(s) === "unlocked");
          return (
            <div key={branch.id} className="space-y-3">
              <p className="flex items-center gap-2 border-b border-line pb-2.5" title={branch.pieceNote}>
                <PieceIcon piece={branch.piece} className="branch-icon h-4 w-4 text-muted" />
                <span className="font-display text-base font-bold tracking-tight text-ink">{branch.name}</span>
              </p>
              <ul className="flex flex-wrap gap-1.5 lg:flex-col lg:items-start">
                {shown.map((skill) => {
                  const isSelected = selected === skill.id;
                  return (
                    <li key={skill.id}>
                      <button
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => selectSkill(isSelected ? null : skill.id)}
                        className="chip cursor-pointer"
                        data-active={isSelected || undefined}
                      >
                        {skill.name}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>

      <div aria-live="polite" className="mt-6 min-h-[1.5rem]">
        {current ? (
          <SkillDetail key={current.skill.id} skill={current.skill} branch={current.branch} />
        ) : (
          <p className="label text-faint">Pick a skill to see the projects behind it</p>
        )}
      </div>
    </div>
  );
}

function SkillDetail({ skill, branch }: { skill: Skill; branch: string }) {
  const proof = skillProof(skill);

  return (
    <div className="panel animate-pop-in p-4 sm:flex sm:items-start sm:justify-between sm:gap-8 sm:p-5">
      <div className="space-y-1.5">
        <div className="flex flex-wrap items-baseline gap-2.5">
          <span className="font-display text-xl font-bold tracking-tight text-ink">{skill.name}</span>
          <span className="label text-faint">{branchName(branch)}</span>
        </div>
        <p className="text-sm text-copy">{skill.line}</p>
      </div>
      {proof.length > 0 && (
        <div className="mt-3 shrink-0 sm:mt-0 sm:text-right">
          <p className="label text-faint">Where it shows</p>
          <ul className="mt-2 flex flex-wrap gap-2 sm:justify-end">
            {proof.map((p) => (
              <li key={p.label}>
                <TransitionLink href={p.href} className="chip">
                  {p.label}
                  <ArrowUpRight aria-hidden="true" className="h-3 w-3" />
                </TransitionLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
