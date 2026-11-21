// Next 14's bundled @vercel/og finds its font and wasm files with path.join on a
// file:// URL, which breaks on Windows ("Invalid URL") and stops link-preview images
// from building. This rewrites those three lines to use new URL(), which works on
// every OS. It runs after npm install and does nothing if the file is already fixed.
import { existsSync, readFileSync, writeFileSync } from "node:fs";

const file = "node_modules/next/dist/compiled/@vercel/og/index.node.js";
if (existsSync(file)) {
  const src = readFileSync(file, "utf8");
  const fixed = src.replace(
    /fileURLToPath\(join\(import\.meta\.url, "\.\.\/([^"]+)"\)\)/g,
    'fileURLToPath(new URL("./$1", import.meta.url))',
  );
  if (fixed !== src) {
    writeFileSync(file, fixed);
    console.log("fix-og-windows: patched", file);
  }
}
