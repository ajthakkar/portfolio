import type { Metadata } from "next";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { ContactCta } from "@/components/contact-cta";
import { PuzzleLoader } from "@/components/puzzle-loader";
import { TransitionLink } from "@/components/transition-link";
import { RatingHistory } from "@/components/rating-history";
import { Gaps, Kicker, SectionTitle } from "@/components/ui";
import { about, playLinks, profile } from "@/lib/content";
import { pageMeta } from "@/lib/meta";

export const metadata: Metadata = pageMeta({
  title: "About",
  description: "Naperville to Columbus, ten years of tournament chess, and what I do off the board.",
  path: "/about/",
});

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
      <header className="grid gap-10 pb-6 pt-12 sm:pt-20 md:grid-cols-[1fr_240px] md:items-start md:gap-14">
        <div className="space-y-5">
          <Kicker className="rise">About</Kicker>
          <h1
            className="rise font-display text-5xl font-extrabold leading-[0.9] tracking-[-0.04em] text-ink sm:text-7xl"
            style={{ "--i": 1 } as React.CSSProperties}
          >
            Off the <span className="text-accent">board</span>
          </h1>
          <div className="rise space-y-4 pt-2 text-base leading-[1.75] text-copy sm:text-lg" style={{ "--i": 2 } as React.CSSProperties}>
            {about.story.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>

        {/* Character portrait. Swap public/me.jpg for a new photo any time. */}
        <figure className="rise group mx-auto w-full max-w-[240px]" style={{ "--i": 3 } as React.CSSProperties}>
          <div className="notch bg-accent p-[3px] transition-transform duration-300 group-hover:-translate-y-1">
            <div className="notch overflow-hidden bg-paper-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/me.jpg"
                alt={`${profile.name}, smiling, in a suit and light blue shirt`}
                width={640}
                height={640}
                className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </div>
          </div>
          <figcaption className="mt-3 flex items-center justify-between">
            <span className="pixel text-accent">Player 1</span>
            <span className="pixel text-faint">{profile.location}</span>
          </figcaption>
        </figure>
      </header>

      <div className="pt-4">
        <Gaps items={about.gaps} />
      </div>

      <section aria-labelledby="interests-heading" className="pt-20 sm:pt-24">
        <SectionTitle kicker="Interests" title={<span id="interests-heading">What I do for fun</span>} />
        <ul className="grid gap-px overflow-hidden border border-line bg-line pt-px sm:grid-cols-2 lg:grid-cols-3">
          {about.interests.map((item, i) => (
            <li key={item.name} className="group bg-paper p-5 transition-colors hover:bg-paper-2 sm:p-6">
              <p className="flex items-center gap-2.5">
                <span aria-hidden="true" className="font-mono text-[11px] text-faint">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-xl font-bold tracking-tight text-ink">{item.name}</span>
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.line}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="ratings" aria-labelledby="ratings-heading" className="scroll-mt-20 pt-20 sm:pt-24">
        <SectionTitle
          kicker="Rating history"
          title={<span id="ratings-heading">Every rated game, charted</span>}
          aside={
            <div className="flex flex-wrap gap-3 sm:justify-end">
              {playLinks.map((p) => (
                <a
                  key={p.site}
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-game inline-flex items-center gap-1.5 bg-lime px-3.5 py-2 font-display text-sm font-bold text-lime-ink"
                >
                  Play me on {p.site}
                  <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
                </a>
              ))}
              <TransitionLink
                href="/projects/plays-like-me/"
                className="inline-flex items-center gap-1.5 border border-line px-3.5 py-2 font-display text-sm font-bold text-ink transition-colors hover:border-accent hover:text-accent"
              >
                Or play the AI trained on my games
                <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
              </TransitionLink>
            </div>
          }
        />
        <div className="pt-6">
          <RatingHistory />
        </div>
      </section>

      <section id="puzzle" aria-labelledby="puzzle-heading" className="scroll-mt-20 pt-20 sm:pt-24">
        <SectionTitle
          kicker="Your move"
          title={<span id="puzzle-heading">A puzzle from my games</span>}
          aside={<p className="max-w-xs text-sm text-muted sm:text-right">I found it with seconds on the clock. You have all the time you want.</p>}
        />
        <div className="pt-8">
          <PuzzleLoader />
        </div>
      </section>

      <ContactCta />
    </div>
  );
}
