import type { Metadata } from "next";
import { Bricolage_Grotesque, Instrument_Sans, JetBrains_Mono, Silkscreen } from "next/font/google";
import { NavigationEvents } from "@/components/transition-link";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { TitleScreen } from "@/components/title-screen";
import "./globals.css";

const display = Bricolage_Grotesque({ subsets: ["latin"], axes: ["opsz", "wdth"], variable: "--font-display" });
const sans = Instrument_Sans({ subsets: ["latin"], axes: ["wdth"], variable: "--font-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-mono" });
const pixel = Silkscreen({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-pixel" });

const description =
  "Business student at Ohio State building ML, data, and software projects: a neural network trained on my chess games, a storm outage model, a startup, and more.";

export const metadata: Metadata = {
  metadataBase: new URL("https://aayush-thakkar.vercel.app"),
  title: { default: "Aayush Thakkar", template: "%s · Aayush Thakkar" },
  description,
  openGraph: {
    type: "website",
    siteName: "Aayush Thakkar",
    title: "Aayush Thakkar",
    description,
    url: "/",
    locale: "en_US",
  },
  twitter: { card: "summary_large_image" },
};

/* Night is the default theme; a saved "light" choice wins. */
const themeScript = `try{if(localStorage.getItem("theme")!=="light")document.documentElement.classList.add("dark")}catch(e){document.documentElement.classList.add("dark")}`;
/* Title screen: home page, once per session, not when linked to a section, never with reduced motion. */
const introScript = `try{if(location.pathname==="/"&&!location.hash&&!sessionStorage.getItem("intro-seen")&&!matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.dataset.intro="on"}catch(e){}`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${display.variable} ${sans.variable} ${mono.variable} ${pixel.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript + introScript }} />
      </head>
      <body className="min-h-screen font-sans antialiased">
        <TitleScreen />
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-50 focus:bg-lime focus:px-4 focus:py-2 focus:text-sm focus:text-lime-ink"
        >
          Skip to content
        </a>
        <NavigationEvents />
        <SiteHeader />
        <main id="content">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
