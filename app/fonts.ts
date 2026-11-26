/* The theme's typefaces. Each theme swaps this file along with app/theme.css. */
import { IBM_Plex_Mono, Inter, Instrument_Serif } from "next/font/google";

const display = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-display" });
const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono" });

export const fontVariables = `${display.variable} ${sans.variable} ${mono.variable}`;
