"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { branches, cases, skillName, type Case } from "@/lib/content";
import { TransitionLink } from "./transition-link";
import { Card, Chip, PieceIcon } from "./ui";

/** Which skill areas a project shows. */
function branchesOf(c: Case) {
  return branches.filter((b) => b.skills.some((s) => c.rewards.includes(s.id))).map((b) => b.id);
}

/** All projects, filterable by the same five areas as the skills section. The filter is kept in the URL (?area=). */
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
        <FilterChip active={area === "all"} onClick={() => choose("all")}>
          All <span className="opacity-60">{cases.length}</span>
        </FilterChip>
        {branches.map((b) => (
          <FilterChip key={b.id} active={area === b.id} onClick={() => choose(b.id)}>
            <PieceIcon piece={b.piece} className="h-3.5 w-3.5" />
            {b.name} <span className="opacity-60">{count(b.id)}</span>
          </FilterChip>
        ))}
      </div>

      <ol aria-live="polite" className="grid gap-3 md:grid-cols-2">
        {shown.map((c) => (
          <li key={c.slug}>
            <TransitionLink href={`/projects/${c.slug}/`} className="group block h-full">
              <Card className="flex h-full flex-col gap-3 p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 space-y-1.5">
                    <p className="label text-muted">
                      {c.area} · {c.period}
                    </p>
                    <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-ink">{c.title}</h2>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-muted sm:text-[15px]">{c.dek}</p>
                <p className="font-mono text-xs text-accent">{c.result}</p>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-1">
                  <span className="flex flex-wrap gap-1.5">
                    {c.rewards.map((r) => (
                      <Chip key={r}>{skillName(r)}</Chip>
                    ))}
                  </span>
                  <ArrowRight aria-hidden="true" className="h-4 w-4 text-faint transition-all group-hover:translate-x-1 group-hover:text-ink" />
                </div>
              </Card>
            </TransitionLink>
          </li>
        ))}
      </ol>
    </div>
  );
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      data-active={active || undefined}
      className="chip min-h-9 cursor-pointer gap-1.5 px-3 py-1.5 text-xs"
    >
      {children}
    </button>
  );
}
