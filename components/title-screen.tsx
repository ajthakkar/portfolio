"use client";

import { useCallback, useEffect, useRef } from "react";
import { profile } from "@/lib/content";
import { prefersReducedMotion } from "./transition-link";

/**
 * Shown on the first visit to the home page in a session. A script in the
 * layout sets html[data-intro="on"] before paint, so there is no flash.
 * Any key, click, tap, or scroll starts the game.
 */
export function TitleScreen() {
  const startRef = useRef<HTMLButtonElement>(null);
  const leaving = useRef(false);

  const finish = useCallback(() => {
    delete document.documentElement.dataset.intro;
    leaving.current = false;
    try {
      sessionStorage.setItem("intro-seen", "1");
    } catch {
      /* storage unavailable: the intro may show again next visit */
    }
    window.dispatchEvent(new Event("intro-done"));
  }, []);

  const start = useCallback(() => {
    const root = document.documentElement;
    if (root.dataset.intro !== "on" || leaving.current) return;
    leaving.current = true;
    if (prefersReducedMotion()) {
      finish();
      return;
    }
    root.dataset.intro = "leaving";
    window.setTimeout(finish, 650);
  }, [finish]);

  useEffect(() => {
    const root = document.documentElement;
    if (root.dataset.intro === "on") startRef.current?.focus({ preventScroll: true });

    const onKey = (event: KeyboardEvent) => {
      if (root.dataset.intro !== "on") return;
      if (!event.metaKey && !event.ctrlKey && !event.altKey) event.preventDefault();
      start();
    };
    const onReplay = () => {
      window.scrollTo({ top: 0 });
      root.dataset.intro = "on";
      leaving.current = false;
      startRef.current?.focus({ preventScroll: true });
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener("wheel", start, { passive: true });
    window.addEventListener("touchmove", start, { passive: true });
    window.addEventListener("replay-intro", onReplay);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("wheel", start);
      window.removeEventListener("touchmove", start);
      window.removeEventListener("replay-intro", onReplay);
    };
  }, [start]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Title screen"
      onPointerDown={start}
      className="title-screen fixed inset-0 z-[60] cursor-pointer select-none flex-col items-center justify-center overflow-hidden border-b-[3px] border-accent bg-paper px-4"
    >
      <div aria-hidden="true" className="absolute inset-x-[-50%] bottom-0 h-[78%]">
        <div className="board-floor h-full w-full" />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(42%_34%_at_50%_44%,rgb(var(--paper)/0.85),transparent_75%)]"
      />

      <div className="relative flex flex-col items-center text-center">
        <p className="pixel text-accent">Player 1 · {profile.location}</p>
        <h2 className="mt-5 font-display text-[clamp(3.2rem,13vw,9.5rem)] font-extrabold uppercase leading-[0.86] tracking-[-0.04em] text-ink [font-stretch:80%]">
          {profile.firstName}
          <br />
          <span className="mt-[0.06em] inline-block bg-lime px-[0.12em] pb-[0.02em] pt-[0.06em] leading-[0.9] text-lime-ink">
            {profile.lastName}
          </span>
        </h2>
        <p className="mt-6 font-mono text-xs uppercase tracking-[0.2em] text-muted">Business · Finance · Data · AI</p>
        <button
          ref={startRef}
          type="button"
          onClick={start}
          className="pixel blink mt-12 cursor-pointer px-3 py-2 text-[12px] text-ink outline-offset-4"
        >
          <span className="[@media(hover:none)]:hidden">Press any key</span>
          <span className="hidden [@media(hover:none)]:inline">Tap to start</span>
        </button>
      </div>

      <p className="pixel absolute bottom-5 text-faint">© 2026 {profile.name}</p>
    </div>
  );
}
