import type { Metadata } from "next";
import { PuzzleLoader } from "@/components/puzzle-loader";
import { Gaps, Kicker, SectionTitle } from "@/components/ui";
import { about, profile } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description: "Naperville to Columbus, ten years of tournament chess, and what I do off the board.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
      <header className="grid gap-10 pb-6 pt-12 sm:pt-20 md:grid-cols-[1fr_240px] md:items-start md:gap-14">
        <div className="space-y-5">
          <Kicker className="rise">About</Kicker>
          <h1
            className="rise font-display text-5xl leading-none tracking-[-0.02em] text-ink sm:text-7xl"
            style={{ "--i": 1 } as React.CSSProperties}
          >
            Off the <span className="italic text-accent">board</span>
          </h1>
          <div className="rise space-y-4 pt-2 text-base leading-[1.75] text-copy sm:text-lg" style={{ "--i": 2 } as React.CSSProperties}>
            {about.story.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>

        {/* Photo slot: drop a file at public/me.jpg and swap this block for an <img>. */}
        <figure className="rise mx-auto w-full max-w-[240px] rotate-[2deg] transition-transform duration-500 hover:rotate-0" style={{ "--i": 3 } as React.CSSProperties}>
          <div className="rounded-sm border border-line bg-paper p-2.5 pb-10 shadow-[0_18px_40px_-18px_rgb(0_0_0/0.35)]">
            <div className="grid aspect-[4/5] place-items-center bg-[repeating-conic-gradient(rgb(var(--sq-light))_0_25%,rgb(var(--sq-dark))_0_50%)] bg-[length:25%_20%]">
              <span className="rounded-md bg-paper/90 px-3 py-1.5 font-display text-3xl italic text-accent">
                {profile.firstName[0]}
                {profile.lastName[0]}
              </span>
            </div>
          </div>
          <figcaption className="-mt-8 text-center font-display text-sm italic text-muted">Columbus, Ohio</figcaption>
        </figure>
      </header>

      <div className="pt-4">
        <Gaps items={about.gaps} />
      </div>

      <section aria-labelledby="interests-heading" className="pt-20 sm:pt-24">
        <SectionTitle kicker="Interests" title={<span id="interests-heading">What I do for fun</span>} />
        <ul className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line pt-px sm:grid-cols-2 lg:grid-cols-3">
          {about.interests.map((item, i) => (
            <li key={item.name} className="group bg-paper p-5 transition-colors hover:bg-paper-2 sm:p-6">
              <p className="flex items-center gap-2.5">
                <span aria-hidden="true" className="font-mono text-[11px] text-faint">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-xl tracking-tight text-ink">{item.name}</span>
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.line}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="puzzle" aria-labelledby="puzzle-heading" className="scroll-mt-20 pt-20 sm:pt-24">
        <SectionTitle
          kicker="Your move"
          title={<span id="puzzle-heading">A puzzle</span>}
          aside={<p className="max-w-xs text-sm text-muted sm:text-right">Mate in two. No engine allowed.</p>}
        />
        <div className="pt-8">
          <PuzzleLoader />
        </div>
      </section>
    </div>
  );
}
