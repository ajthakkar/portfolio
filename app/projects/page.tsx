import type { Metadata } from "next";
import { ProjectBrowser } from "@/components/project-browser";
import { Kicker } from "@/components/ui";
import { cases } from "@/lib/content";
import { pageMeta } from "@/lib/meta";

export const metadata: Metadata = pageMeta({
  title: "Projects",
  description: "Everything I've built: machine learning, data analysis, an equity research model, a startup, and software, each with what I'd do differently.",
  path: "/projects/",
});

export default function ProjectsPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
      <header className="space-y-5 pb-8 pt-12 sm:pt-20">
        <Kicker className="rise">Projects</Kicker>
        <h1
          className="rise font-display text-5xl font-extrabold leading-[0.9] tracking-[-0.04em] text-ink sm:text-7xl"
          style={{ "--i": 1 } as React.CSSProperties}
        >
          Everything I&apos;ve <span className="text-accent">built</span>
        </h1>
        <p className="rise max-w-2xl text-base leading-relaxed text-copy sm:text-lg" style={{ "--i": 2 } as React.CSSProperties}>
          {cases.length} projects, strongest first. Filter by the same five areas as the skill tree. Every page opens with a
          30-second summary, then the decisions behind it and what I&apos;d change.
        </p>
      </header>
      <ProjectBrowser />
    </div>
  );
}
