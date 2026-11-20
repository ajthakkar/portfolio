"use client";

import dynamic from "next/dynamic";

/* The board and the network only run in the browser; a same-size placeholder holds the space. */
export const PlaysLikeMeLoader = dynamic(() => import("./plays-like-me"), {
  ssr: false,
  loading: () => (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_1fr] lg:gap-10">
      <div className="aspect-square w-full max-w-[480px] animate-pulse bg-paper-2" />
    </div>
  ),
});
