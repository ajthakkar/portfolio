import type { Metadata } from "next";
import { NavigationEvents } from "@/components/transition-link";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { Spotlight } from "@/components/spotlight";
import { profile } from "@/lib/content";
import { SITE_URL, siteDescription } from "@/lib/meta";
import { fontVariables } from "./fonts";
import "./globals.css";
import "./theme.css";

/* Each page sets its own canonical URL and link-preview tags through pageMeta (lib/meta.ts). */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: profile.name, template: `%s · ${profile.name}` },
  description: siteDescription,
  twitter: { card: "summary_large_image" },
};

/* Dark is the default theme; a saved "light" choice wins. */
const themeScript = `try{if(localStorage.getItem("theme")!=="light")document.documentElement.classList.add("dark")}catch(e){document.documentElement.classList.add("dark")}`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={fontVariables}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen font-sans antialiased">
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-50 focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:text-accent-ink"
        >
          Skip to content
        </a>
        <NavigationEvents />
        <Spotlight />
        <SiteHeader />
        <main id="content">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
