import { ImageResponse } from "next/og";
import { OgCard, ogFonts, ogSize } from "@/lib/og";

export const dynamic = "force-static";
export const alt = "Aayush Thakkar: business student at Ohio State with projects in ML, data, and finance";
export const size = ogSize;
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <OgCard
        kicker="Ohio State · Fisher College of Business"
        title="Aayush Thakkar"
        highlight="Projects in ML, data, software, and finance"
        lines={["A neural network that plays chess like me, a study of 22,625 prediction markets, a stock pitch and model, and more."]}
      />
    ),
    { ...size, fonts: await ogFonts() },
  );
}
