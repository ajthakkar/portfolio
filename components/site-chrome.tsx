"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { profile } from "@/lib/content";
import { CommandMenu } from "./command-menu";
import { ThemeToggle } from "./theme";
import { TransitionLink } from "./transition-link";

const nav = [
  { href: "/#cases", match: "/cases", label: "Cases" },
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
      className={`vt-header sticky top-0 z-40 border-b bg-paper/90 backdrop-blur-sm transition-colors duration-300 supports-[backdrop-filter]:bg-paper/75 ${
        scrolled ? "border-line" : "border-transparent"
      }`}
    >
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between gap-3 px-4 sm:px-6">
        <TransitionLink href="/" className="group flex items-center gap-2.5" aria-label={`${profile.name}, home`}>
          <Mark />
          <span className="hidden font-display text-[17px] tracking-tight text-ink sm:inline">
            {profile.firstName} <span className="italic">{profile.lastName}</span>
          </span>
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
                  className={`relative rounded-full px-2.5 py-1.5 text-[13px] transition-colors sm:px-3 ${
                    active ? "text-ink" : "text-muted hover:text-ink"
                  }`}
                >
                  {item.label}
                  {active && <span aria-hidden="true" className="absolute inset-x-3 -bottom-0.5 h-px bg-accent" />}
                </TransitionLink>
              );
            })}
          </nav>
          <CommandMenu />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

/** A 2×2 board fragment that turns a quarter when hovered. */
function Mark() {
  return (
    <span
      aria-hidden="true"
      className="grid h-7 w-7 grid-cols-2 grid-rows-2 overflow-hidden rounded-[7px] border border-ink/15 transition-transform duration-500 [transition-timing-function:cubic-bezier(.2,.7,.2,1)] group-hover:rotate-90"
    >
      <span className="bg-sq-light" />
      <span className="bg-accent" />
      <span className="bg-ink" />
      <span className="bg-sq-light" />
    </span>
  );
}

export function LocalTime() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const format = () =>
      setTime(
        new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone: profile.timeZone }).format(new Date()),
      );
    format();
    const id = window.setInterval(format, 30_000);
    return () => window.clearInterval(id);
  }, []);
  return <span suppressHydrationWarning>{time || " "}</span>;
}

export function SiteFooter() {
  const [isMac, setIsMac] = useState(false);
  useEffect(() => setIsMac(/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)), []);

  return (
    <footer className="mx-auto mt-24 w-full max-w-5xl px-4 pb-10 sm:px-6">
      <div className="flex flex-col gap-4 border-t border-line pt-6 font-mono text-[11px] text-faint sm:flex-row sm:items-center sm:justify-between">
        <p>
          {profile.name} · {profile.location} · <LocalTime />
        </p>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event("open-command-menu"))}
            className="hidden cursor-pointer transition-colors hover:text-ink sm:inline"
          >
            Press <kbd className="rounded border border-line px-1 py-px">{isMac ? "⌘K" : "Ctrl K"}</kbd> to jump anywhere
          </button>
          <span>© 2026</span>
        </div>
      </div>
    </footer>
  );
}
