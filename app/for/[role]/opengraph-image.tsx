import { ImageResponse } from "next/og";
import { profile } from "@/lib/content";
import { OgCard, ogFonts, ogSize } from "@/lib/og";
import { roleViews } from "@/lib/roles";

export const dynamic = "force-static";
export const size = ogSize;
export const contentType = "image/png";
export const alt = "Aayush Thakkar: the short version for one kind of role";

export function generateStaticParams() {
  return roleViews.map((r) => ({ role: r.slug }));
}

export default async function Image({ params }: { params: { role: string } }) {
  const view = roleViews.find((r) => r.slug === params.role);
  return new ImageResponse(
    (
      <OgCard
        kicker={`${profile.standing} · Class of 2029`}
        title={profile.name}
        highlight={view ? view.title : undefined}
        lines={view ? [view.lookingFor] : []}
      />
    ),
    { ...size, fonts: await ogFonts() },
  );
}
