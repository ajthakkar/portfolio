"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, Search } from "lucide-react";
import { cases, profile } from "@/lib/content";
import { navigateWithTransition } from "./transition-link";
import { setTheme } from "./theme";

type Item = { id: string; group: string; label: string; hint?: string; run: () => void };

export function CommandMenu() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [toast, setToast] = useState("");
  const [isMac, setIsMac] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActive(0);
    returnFocus.current?.focus();
  }, []);

  const go = useCallback(
    (href: string) => {
      close();
      navigateWithTransition(href, router.push, pathname);
    },
    [close, router.push, pathname],
  );

  const items = useMemo<Item[]>(() => {
    const external = (href: string) => () => {
      close();
      window.open(href, "_blank", "noopener,noreferrer");
    };
    return [
      { id: "home", group: "Pages", label: "Home", run: () => go("/") },
      { id: "projects", group: "Pages", label: "Projects", hint: "Quest log", run: () => go("/#projects") },
      { id: "skills", group: "Pages", label: "Skill tree", hint: "Skills and their proof", run: () => go("/#skills") },
      { id: "record", group: "Pages", label: "Record", hint: "Experience, honors, education", run: () => go("/record/") },
      { id: "about", group: "Pages", label: "About", run: () => go("/about/") },
      ...cases.map((c) => ({
        id: `case-${c.slug}`,
        group: "Projects",
        label: c.title,
        hint: `${c.kind} ${c.number}`,
        run: () => go(`/projects/${c.slug}/`),
      })),
      { id: "puzzle", group: "Play", label: "Solve the chess puzzle", hint: "Mate in 2", run: () => go("/about/#puzzle") },
      ...(profile.chess.lichess
        ? [
            {
              id: "play-lichess",
              group: "Play",
              label: "Challenge me on Lichess",
              run: external(`https://lichess.org/?user=${profile.chess.lichess}#friend`),
            },
          ]
        : []),
      {
        id: "theme",
        group: "Actions",
        label: "Switch day / night",
        run: () => {
          close();
          setTheme(!document.documentElement.classList.contains("dark"));
        },
      },
      {
        id: "intro",
        group: "Actions",
        label: "Replay the title screen",
        run: () => {
          close();
          window.dispatchEvent(new Event("replay-intro"));
        },
      },
      {
        id: "copy-email",
        group: "Actions",
        label: "Copy email address",
        hint: profile.email,
        run: () => {
          navigator.clipboard?.writeText(profile.email).then(
            () => setToast("Email copied"),
            () => setToast(profile.email),
          );
          close();
        },
      },
      ...profile.links
        .filter((l) => l.href.startsWith("http"))
        .map((l) => ({ id: l.label, group: "Links", label: `Open ${l.label}`, run: external(l.href) })),
    ];
  }, [close, go]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => `${item.label} ${item.hint ?? ""} ${item.group}`.toLowerCase().includes(q));
  }, [items, query]);

  useEffect(() => {
    setIsMac(/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent));
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((o) => {
          if (!o) returnFocus.current = document.activeElement as HTMLElement | null;
          return !o;
        });
      }
    };
    const onOpen = () => {
      returnFocus.current = document.activeElement as HTMLElement | null;
      setOpen(true);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-command-menu", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-command-menu", onOpen);
    };
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => setActive(0), [query]);

  useEffect(() => {
    listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(""), 1800);
    return () => window.clearTimeout(t);
  }, [toast]);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((i) => Math.min(i + 1, filtered.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      filtered[active]?.run();
    } else if (event.key === "Tab") {
      event.preventDefault();
    }
  };

  let lastGroup = "";

  return (
    <>
      <button
        type="button"
        onClick={() => window.dispatchEvent(new Event("open-command-menu"))}
        aria-label="Open command menu"
        className="flex h-8 cursor-pointer items-center gap-2 border border-line px-2.5 font-mono text-[11px] text-muted transition-colors hover:border-accent hover:text-accent"
      >
        <Search aria-hidden="true" className="h-3.5 w-3.5" />
        <kbd className="hidden font-mono sm:inline">{isMac ? "⌘K" : "Ctrl K"}</kbd>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[14vh]" onKeyDown={onKeyDown}>
          <div className="absolute inset-0 bg-ink/20 backdrop-blur-[2px] dark:bg-black/50" onClick={close} aria-hidden="true" />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Command menu"
            className="relative w-full max-w-md animate-pop-in overflow-hidden border border-line bg-paper shadow-[6px_6px_0_0_rgb(var(--lime))]"
          >
            <div className="flex items-center gap-2.5 border-b border-line px-4">
              <Search aria-hidden="true" className="h-4 w-4 shrink-0 text-faint" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Fast travel to a page, project, or action…"
                aria-label="Search commands"
                aria-controls="command-list"
                aria-activedescendant={filtered[active] ? `cmd-${filtered[active].id}` : undefined}
                className="h-12 w-full bg-transparent text-sm text-ink outline-none placeholder:text-faint focus-visible:outline-none"
              />
              <kbd className="shrink-0 rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-faint">esc</kbd>
            </div>
            <ul ref={listRef} id="command-list" role="listbox" className="max-h-[50vh] overflow-y-auto p-1.5">
              {filtered.length === 0 && <li className="px-3 py-6 text-center text-sm text-faint">No matches. Try “projects”.</li>}
              {filtered.map((item, i) => {
                const header = item.group !== lastGroup;
                lastGroup = item.group;
                return (
                  <li key={item.id} role="presentation">
                    {header && (
                      <p className="pixel px-3 pb-1.5 pt-3 text-faint">{item.group}</p>
                    )}
                    <div
                      id={`cmd-${item.id}`}
                      role="option"
                      aria-selected={i === active}
                      data-index={i}
                      onMouseMove={() => setActive(i)}
                      onClick={() => item.run()}
                      className={`flex cursor-pointer items-center justify-between gap-3 px-3 py-2 text-sm transition-colors ${
                        i === active ? "bg-lime text-lime-ink" : "text-copy"
                      }`}
                    >
                      <span className="truncate">
                        <span aria-hidden="true" className={`mr-1.5 text-[10px] ${i === active ? "" : "invisible"}`}>
                          ▸
                        </span>
                        {item.label}
                      </span>
                      <span
                        className={`flex shrink-0 items-center gap-1 font-mono text-[11px] ${i === active ? "text-lime-ink/75" : "text-faint"}`}
                      >
                        {item.hint}
                        {item.group === "Links" && <ArrowUpRight aria-hidden="true" className="h-3 w-3" />}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}

      <div
        role="status"
        aria-live="polite"
        className={`pixel pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2 bg-lime px-4 py-2.5 text-lime-ink transition-all duration-200 ${
          toast ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
        }`}
      >
        {toast}
      </div>
    </>
  );
}
