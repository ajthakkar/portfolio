"use client";

import dynamic from "next/dynamic";

/* The board only renders in the browser; a same-size placeholder holds its space. */
export const PuzzleLoader = dynamic(() => import("./puzzle"), {
  ssr: false,
  loading: () => (
    <div className="grid gap-6 sm:grid-cols-[minmax(0,360px)_1fr] sm:gap-10">
      <div className="aspect-square w-full animate-pulse bg-paper-2" />
    </div>
  ),
});
