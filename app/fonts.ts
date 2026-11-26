/* The theme's typefaces. Each theme swaps this file along with app/theme.css. */
import { Inter, Inter_Tight, JetBrains_Mono } from "next/font/google";

const display = Inter_Tight({ subsets: ["latin"], variable: "--font-display" });
const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono" });

export const fontVariables = `${display.variable} ${sans.variable} ${mono.variable}`;
