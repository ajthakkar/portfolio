"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { profile } from "@/lib/content";
import { CommandMenu } from "./command-menu";
import { XpBar } from "./hud";
import { ThemeToggle } from "./theme";
import { TransitionLink } from "./transition-link";

const nav = [
  { href: "/projects/", match: "/projects", label: "Projects" },
  { href: "/record/", match: "/record", label: "Record" },
  { href: "/about/", match: "/about", label: "About" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`vt-header sticky top-0 z-40 border-b bg-paper/85 backdrop-blur-md transition-colors duration-300 supports-[backdrop-filter]:bg-paper/70 ${
        scrolled ? "border-line" : "border-transparent"
      }`}
    >
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <TransitionLink href="/" className="group flex items-center gap-2.5" aria-label={`${profile.name}, home`}>
          <Mark />
          <span className="hidden font-display text-[17px] font-bold tracking-tight text-ink sm:inline">{profile.name}</span>
        </TransitionLink>
        <div className="flex items-center gap-1 sm:gap-2">
          <nav aria-label="Main" className="mr-1 flex items-center">
            {nav.map((item) => {
              const active = pathname.startsWith(item.match);
              return (
                <TransitionLink
                  key={item.label}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative px-2.5 py-3 text-sm font-medium transition-colors sm:px-3 ${
                    active ? "text-ink" : "text-muted hover:text-ink"
                  }`}
                >
                  {active && (
                    <span aria-hidden="true" className="absolute left-0 top-1/2 -translate-y-1/2 text-[9px] text-accent sm:left-0.5">
                      ▸
                    </span>
                  )}
                  {item.label}
                </TransitionLink>
              );
            })}
          </nav>
          <CommandMenu />
          <ThemeToggle />
        </div>
      </div>
      <XpBar />
    </header>
  );
}

/** The logo: a 2×2 corner of the same lime board as the title screen. Turns a quarter on hover. */
function Mark() {
  return (
    <span
      aria-hidden="true"
      className="grid h-7 w-7 grid-cols-2 grid-rows-2 overflow-hidden border border-ink/20 transition-transform duration-500 [transition-timing-function:cubic-bezier(.2,.7,.2,1)] group-hover:rotate-90"
    >
      <span className="bg-lime" />
      <span className="bg-sq-dark" />
      <span className="bg-sq-dark" />
      <span className="bg-lime" />
    </span>
  );
}

export function LocalTime() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const format = () =>
      setTime(
        new Intl.DateTimeFormat("en-US", {
          hour: "numeric",
          minute: "2-digit",
          timeZone: profile.timeZone,
          timeZoneName: "short",
        }).format(new Date()),
      );
    format();
    const id = window.setInterval(format, 30_000);
    return () => window.clearInterval(id);
  }, []);
  return <span suppressHydrationWarning>{time || " "}</span>;
}

export function SiteFooter() {
  const [isMac, setIsMac] = useState(false);
  useEffect(() => setIsMac(/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)), []);

  return (
    <footer className="mx-auto mt-24 w-full max-w-6xl px-4 pb-10 sm:px-6">
      <div className="flex flex-col gap-4 border-t border-line pt-6 font-mono text-[11px] text-faint sm:flex-row sm:items-center sm:justify-between">
        <p>
          {profile.name} · {profile.location} · <LocalTime />
        </p>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <a href={`mailto:${profile.email}`} className="py-1 transition-colors hover:text-ink">
            {profile.email}
          </a>
          <a href={profile.resume} target="_blank" rel="noopener noreferrer" className="py-1 transition-colors hover:text-ink">
            Resume
          </a>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event("replay-intro"))}
            className="cursor-pointer py-1 transition-colors hover:text-ink"
          >
            Replay title screen
          </button>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event("open-command-menu"))}
            className="hidden cursor-pointer transition-colors hover:text-ink sm:inline"
          >
            <kbd className="border border-line px-1 py-px">{isMac ? "⌘K" : "Ctrl K"}</kbd> to fast travel
          </button>
          <span>© 2026</span>
        </div>
      </div>
    </footer>
  );
}
