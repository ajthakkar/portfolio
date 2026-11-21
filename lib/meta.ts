import type { Metadata } from "next";
import { profile } from "./content";

export const SITE_URL = "https://aayush-thakkar.vercel.app";

/** The site-wide description, used by the home page and in link previews. Kept under 160 characters. */
export const siteDescription =
  "Business student at Ohio State. Projects in ML, data, and finance: a neural network that plays chess like me, a prediction-market study, and a stock pitch.";

/**
 * Title, description, canonical URL, and link-preview tags for one page.
 * A page that sets openGraph replaces the layout's whole openGraph object, so the shared fields are repeated here.
 * Pages with their own opengraph-image file pass `image: null`; the file adds the image itself.
 */
export function pageMeta({
  title,
  description,
  path,
  image = "/opengraph-image",
  absoluteTitle = false,
}: {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  /** Use the title as is instead of adding " · Aayush Thakkar". */
  absoluteTitle?: boolean;
}): Metadata {
  const full = absoluteTitle || title === profile.name ? title : `${title} · ${profile.name}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: profile.name,
      locale: "en_US",
      title: full,
      description,
      url: path,
      ...(image ? { images: [{ url: image, width: 1200, height: 630 }] } : {}),
    },
    twitter: { card: "summary_large_image", title: full, description },
  };
}
