import { ImageResponse } from "next/og";
import { OgCard, ogFonts, ogSize } from "@/lib/og";

export const dynamic = "force-static";
export const alt = "Aayush Thakkar: business student at Ohio State building ML, data, and software projects";
export const size = ogSize;
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <OgCard
        kicker="Ohio State · Fisher College of Business"
        title="Aayush Thakkar"
        highlight="Projects in ML, data, software, and finance"
        lines={["A neural network trained on my chess games, a storm outage model, a startup, and more."]}
      />
    ),
    { ...size, fonts: await ogFonts() },
  );
}
