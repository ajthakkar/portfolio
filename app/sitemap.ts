import type { MetadataRoute } from "next";
import { cases } from "@/lib/content";
import { roleViews } from "@/lib/roles";

export const dynamic = "force-static";

const BASE = "https://aayush-thakkar.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    "/projects/",
    "/record/",
    "/about/",
    ...cases.map((c) => `/projects/${c.slug}/`),
    ...roleViews.map((r) => `/for/${r.slug}/`),
  ];
  return paths.map((p) => ({ url: `${BASE}${p}` }));
}
