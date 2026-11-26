"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Fades its children in the first time they scroll into view. Styling lives in globals.css (.reveal). */
export function Reveal({ children, className = "", index = 0 }: { children: ReactNode; className?: string; index?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.dataset.shown = "true";
        observer.disconnect();
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ "--i": index } as React.CSSProperties}>
      {children}
    </div>
  );
}
