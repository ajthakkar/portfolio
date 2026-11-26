"use client";

import { useSyncExternalStore } from "react";

/* A tiny shared store for the selected skill, so the skills section and the project list stay in sync. */
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
