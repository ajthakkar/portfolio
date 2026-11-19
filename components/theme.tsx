"use client";

import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { Moon, Sun } from "lucide-react";
import { prefersReducedMotion } from "./transition-link";

function storeTheme(dark: boolean) {
  try {
    localStorage.setItem("theme", dark ? "dark" : "light");
  } catch {
    /* storage unavailable: the theme still switches for this visit */
  }
}

/** Switches theme with a circular reveal from (x, y) where supported. */
export function setTheme(dark: boolean, origin?: { x: number; y: number }, onApply?: () => void) {
  const root = document.documentElement;
  const apply = () => {
    root.classList.toggle("dark", dark);
    storeTheme(dark);
    onApply?.();
    window.dispatchEvent(new CustomEvent("themechange", { detail: dark }));
  };

  if (!document.startViewTransition || prefersReducedMotion()) {
    apply();
    return;
  }

  const x = origin?.x ?? window.innerWidth - 40;
  const y = origin?.y ?? 32;
  const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

  root.dataset.vt = "theme";
  const transition = document.startViewTransition(() => flushSync(apply));
  transition.ready.then(() => {
    root.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
      { duration: 520, easing: "cubic-bezier(.2,.7,.2,1)", pseudoElement: "::view-transition-new(root)" },
    );
  });
  transition.finished.finally(() => {
    if (root.dataset.vt === "theme") delete root.dataset.vt;
  });
}

export function useIsDark() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
    const onChange = (event: Event) => setDark((event as CustomEvent<boolean>).detail);
    window.addEventListener("themechange", onChange);
    return () => window.removeEventListener("themechange", onChange);
  }, []);
  return dark;
}

export function ThemeToggle() {
  const dark = useIsDark();

  return (
    <button
      type="button"
      onClick={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setTheme(!dark, { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
      }}
      aria-label={dark ? "Switch to day mode" : "Switch to night mode"}
      title={dark ? "Day" : "Night"}
      className="grid h-8 w-8 cursor-pointer place-items-center border border-line text-muted transition-colors hover:border-accent hover:text-accent"
    >
      {dark ? <Sun aria-hidden="true" className="h-3.5 w-3.5" /> : <Moon aria-hidden="true" className="h-3.5 w-3.5" />}
    </button>
  );
}
