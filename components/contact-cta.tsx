import { FileText, Mail } from "lucide-react";
import { profile } from "@/lib/content";
import { ExternalLink, Kicker, Panel } from "./ui";

/** The "get in touch" block at the end of a page. Role pages pass their own tailored resume and "looking for" line. */
export function ContactCta({
  resume = profile.resume,
  lookingFor = profile.lookingFor,
  className = "pt-20 sm:pt-28",
}: {
  resume?: string;
  lookingFor?: string;
  className?: string;
}) {
  const linkedin = profile.links.find((l) => l.label === "LinkedIn");
  return (
    <section aria-labelledby="contact-heading" className={className}>
      <Panel inner="grid gap-6 p-6 sm:p-8 md:grid-cols-[1fr_auto] md:items-center md:gap-10">
        <div className="space-y-3">
          <Kicker>Contact</Kicker>
          <h2 id="contact-heading" className="font-display text-3xl font-bold tracking-[-0.02em] text-ink sm:text-4xl">
            Let&apos;s talk
          </h2>
          <p className="max-w-xl text-[15px] leading-relaxed text-copy sm:text-base">
            {lookingFor} Email is the fastest way to reach me.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <a
            href={`mailto:${profile.email}`}
            className="btn btn-primary"
          >
            <Mail aria-hidden="true" className="h-4 w-4" />
            {profile.email}
          </a>
          <a
            href={resume}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
          >
            <FileText aria-hidden="true" className="h-4 w-4" />
            Resume (PDF)
          </a>
          {linkedin && (
            <ExternalLink href={linkedin.href} className="px-1 py-2 font-mono text-xs text-muted hover:text-ink">
              LinkedIn
            </ExternalLink>
          )}
        </div>
      </Panel>
    </section>
  );
}
