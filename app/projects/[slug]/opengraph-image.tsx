import { ImageResponse } from "next/og";
import { cases } from "@/lib/content";
import { OgCard, ogFonts, ogSize } from "@/lib/og";

export const dynamic = "force-static";
export const size = ogSize;
export const contentType = "image/png";
export const alt = "Project by Aayush Thakkar";

export function generateStaticParams() {
  return cases.map((c) => ({ slug: c.slug }));
}

export default async function Image({ params }: { params: { slug: string } }) {
  const c = cases.find((x) => x.slug === params.slug);
  return new ImageResponse(
    (
      <OgCard
        kicker={c ? `${c.area} · Aayush Thakkar` : "Aayush Thakkar"}
        title={c?.title ?? "Project"}
        highlight={c?.result}
        lines={c ? [c.tldr[0]] : []}
      />
    ),
    { ...size, fonts: await ogFonts() },
  );
}
