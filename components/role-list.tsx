"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Role } from "@/lib/content";

export function RoleList({ roles, id, initiallyOpen = [] }: { roles: Role[]; id: string; initiallyOpen?: number[] }) {
  const [open, setOpen] = useState<Set<number>>(() => new Set(initiallyOpen));
  const expandable = roles.flatMap((role, i) => (role.points.length ? [i] : []));
  const allOpen = expandable.length > 0 && expandable.every((i) => open.has(i));

  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <div>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setOpen(allOpen ? new Set() : new Set(expandable))}
          className="cursor-pointer font-mono text-[11px] text-accent transition-opacity hover:opacity-70"
        >
          {allOpen ? "Collapse all" : "Expand all"}
        </button>
      </div>
      <ul className="divide-y divide-line">
        {roles.map((role, i) => {
          const isOpen = open.has(i);
          const canOpen = role.points.length > 0;
          const heading = (
            <>
              <span className="flex min-w-0 items-center gap-3.5">
                {role.monogram && (
                  <span
                    aria-hidden="true"
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-line bg-paper-2 font-mono text-[11px] font-semibold text-accent transition-transform duration-300 group-hover:-rotate-6"
                  >
                    {role.monogram}
                  </span>
                )}
                <span className="flex min-w-0 flex-col">
                  <span className="text-[15px] font-semibold text-ink">{role.org}</span>
                  <span className="text-[13px] text-muted">{role.role}</span>
                  <span className="mt-0.5 font-mono text-[11px] text-accent sm:hidden">{role.dates}</span>
                </span>
              </span>
              <span className="flex shrink-0 items-center gap-2.5 font-mono text-[11px] text-accent">
                <span className="hidden sm:inline">{role.dates}</span>
                {canOpen ? (
                  <ChevronDown
                    aria-hidden="true"
                    className={`h-3.5 w-3.5 text-faint transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                  />
                ) : (
                  <span aria-hidden="true" className="w-3.5" />
                )}
              </span>
            </>
          );

          return (
            <li key={role.org} className="py-3.5">
              {canOpen ? (
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`${id}-${i}`}
                  onClick={() => toggle(i)}
                  className="group flex w-full cursor-pointer items-center justify-between gap-3 text-left"
                >
                  {heading}
                </button>
              ) : (
                <div className="flex w-full items-center justify-between gap-3">{heading}</div>
              )}
              {canOpen && (
                <div
                  id={`${id}-${i}`}
                  data-open={isOpen}
                  className="collapse-grid"
                  {...(isOpen ? {} : ({ inert: "" } as Record<string, string>))}
                >
                  <div>
                    <div className={`space-y-2 pt-3 ${role.monogram ? "sm:pl-[3.375rem]" : ""}`}>
                      <p className="font-mono text-[11px] text-faint">{role.location}</p>
                      <ul className="list-outside list-disc space-y-1.5 pl-4 text-sm leading-relaxed text-copy marker:text-accent/60">
                        {role.points.map((point) => (
                          <li key={point}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
