"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { prefersReducedMotion } from "./transition-link";

/** Scroll progress drawn as an XP bar along the bottom of the header. */
export function XpBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 40 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 -bottom-px h-[3px]">
      <div
        className="h-full origin-left bg-accent dark:shadow-[0_0_12px_rgb(var(--lime)/0.7)]"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}

/** Resolves once the title screen (if any) is gone. */
function afterIntro(run: () => void) {
  if (!document.documentElement.dataset.intro) {
    run();
    return () => {};
  }
  window.addEventListener("intro-done", run, { once: true });
  return () => window.removeEventListener("intro-done", run);
}

/**
 * Counts a stat up from zero the first time it scrolls into view.
 * Keeps any prefix and suffix, so "$10,000+" counts as "$" 10000 "+".
 */
export function CountUp({ value, className = "" }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [text, setText] = useState(value);

  useEffect(() => {
    const match = value.match(/^([^\d]*)(\d[\d,]*(?:\.\d+)?)(.*)$/);
    const el = ref.current;
    if (!match || !el || prefersReducedMotion()) return;
    const [, prefix, digits, suffix] = match;
    const target = Number(digits.replace(/,/g, ""));
    const decimals = digits.split(".")[1]?.length ?? 0;
    const format = (n: number) =>
      prefix +
      n.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
        useGrouping: digits.includes(","),
      }) +
      suffix;

    setText(format(0));
    let frame = 0;
    let stopIntro = () => {};
    const animate = () => {
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / 1100);
        const eased = 1 - Math.pow(1 - t, 3);
        setText(format(t < 1 ? target * eased : target));
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        stopIntro = afterIntro(animate);
      },
      { threshold: 0.6 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      stopIntro();
      cancelAnimationFrame(frame);
    };
  }, [value]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {text}
    </span>
  );
}

/* A tiny shared store for the selected skill, so the skill tree and quest log stay in sync. */
let selectedSkill: string | null = null;
const listeners = new Set<() => void>();

export function selectSkill(id: string | null) {
  selectedSkill = id;
  listeners.forEach((listener) => listener());
}

export function useSelectedSkill() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => selectedSkill,
    () => null,
  );
}
