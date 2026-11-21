"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { branches, cases, skillName, type Case } from "@/lib/content";
import { TransitionLink } from "./transition-link";
import { CaseBoard, Panel, PieceIcon } from "./ui";

/** Which skill-tree branches a project proves skills in. */
function branchesOf(c: Case) {
  return branches.filter((b) => b.skills.some((s) => c.rewards.includes(s.id))).map((b) => b.id);
}

/** All projects, filterable by the same five branches as the skill tree. The filter is kept in the URL (?area=). */
export function ProjectBrowser() {
  const [area, setArea] = useState<string>("all");

  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("area");
    if (fromUrl && branches.some((b) => b.id === fromUrl)) setArea(fromUrl);
  }, []);

  function choose(next: string) {
    setArea(next);
    const url = new URL(window.location.href);
    if (next === "all") url.searchParams.delete("area");
    else url.searchParams.set("area", next);
    window.history.replaceState(null, "", url);
  }

  const shown = cases.filter((c) => area === "all" || branchesOf(c).includes(area));
  const count = (id: string) => cases.filter((c) => branchesOf(c).includes(id)).length;

  return (
    <div className="space-y-6">
      <div role="group" aria-label="Filter projects by area" className="flex flex-wrap gap-2">
        <Chip active={area === "all"} onClick={() => choose("all")}>
          All <span className="text-faint">{cases.length}</span>
        </Chip>
        {branches.map((b) => (
          <Chip key={b.id} active={area === b.id} onClick={() => choose(b.id)}>
            <PieceIcon piece={b.piece} className="h-3.5 w-3.5" />
            {b.name} <span className="text-faint">{count(b.id)}</span>
          </Chip>
        ))}
      </div>

      <ol aria-live="polite" className="grid gap-3 md:grid-cols-2">
        {shown.map((c) => (
          <li key={c.slug}>
            <TransitionLink href={`/projects/${c.slug}/`} className="group block h-full">
              <Panel small className="h-full transition-colors duration-200 group-hover:bg-accent" inner="flex h-full flex-col gap-3 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 space-y-1.5">
                    <p className="pixel text-muted">
                      {c.area} · {c.period}
                    </p>
                    <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-ink">{c.title}</h2>
                  </div>
                  <CaseBoard seed={c.slug} className="hidden w-14 shrink-0 sm:block" />
                </div>
                <p className="text-sm leading-relaxed text-muted sm:text-[15px]">{c.dek}</p>
                <p className="font-mono text-xs text-accent">{c.result}</p>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-1">
                  <span className="flex flex-wrap gap-1.5">
                    {c.rewards.map((r) => (
                      <span key={r} className="border border-line px-1.5 py-0.5 font-mono text-[11px] text-copy">
                        {skillName(r)}
                      </span>
                    ))}
                  </span>
                  <ArrowRight aria-hidden="true" className="h-4 w-4 text-faint transition-all group-hover:translate-x-1 group-hover:text-accent" />
                </div>
              </Panel>
            </TransitionLink>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`inline-flex min-h-9 cursor-pointer items-center gap-1.5 border px-3 py-1.5 font-mono text-xs transition-colors ${
        active ? "border-accent bg-accent text-accent-ink" : "border-line text-copy hover:border-accent hover:text-accent"
      }`}
    >
      {children}
    </button>
  );
}
