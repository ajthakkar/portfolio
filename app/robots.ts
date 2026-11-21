import type { MetadataRoute } from "next";

export const dynamic = "force-static";

/* Everything may be crawled. The resume PDFs (which include a phone number) are kept out of search
   results by an X-Robots-Tag: noindex header in vercel.json; blocking them here instead would stop
   crawlers from ever seeing that header. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://aayush-thakkar.vercel.app/sitemap.xml",
  };
}
