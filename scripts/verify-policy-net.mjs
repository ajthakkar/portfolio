/*
 * Checks lib/policy-net.ts against PyTorch: same positions, same top moves, same probabilities.
 *   node scripts/verify-policy-net.mjs
 * Fixtures come from the plays-like-me repo (scripts/export_web.py).
 */
import { readFileSync } from "node:fs";
import { Chess } from "chess.js";
import { parseNet, predict } from "../lib/policy-net.ts";

const dir = new URL("../public/models/", import.meta.url);
const fixtures = JSON.parse(readFileSync(new URL("fixtures.json", dir), "utf8"));
let worst = 0;
let checked = 0;
let mismatches = 0;
const started = performance.now();
const index = JSON.parse(readFileSync(new URL("index.json", dir), "utf8"));
for (const name of Object.keys(fixtures[0].top)) {
  const role = index[name];
  const manifest = JSON.parse(readFileSync(new URL(`${role.weights}.json`, dir), "utf8"));
  const bin = readFileSync(new URL(`${role.weights}.bin`, dir));
  const net = parseNet(manifest, bin.buffer.slice(bin.byteOffset, bin.byteOffset + bin.byteLength));
  const player = { net, flag: role.flag, temperature: role.temperature };
  for (const f of fixtures) {
    const game = new Chess(f.fen);
    const moves = predict(player, game, f.clock, f.base, f.timeClass === "classical" ? "rapid" : f.timeClass);
    const byUci = new Map(moves.map((m) => [m.uci.slice(0, 4), m.prob]));
    for (const [uci, p] of f.top[name]) {
      worst = Math.max(worst, Math.abs((byUci.get(uci.slice(0, 4)) ?? -1) - p));
    }
    if (moves[0].uci.slice(0, 4) !== f.top[name][0][0].slice(0, 4)) mismatches++;
    checked++;
  }
}
const ms = (performance.now() - started) / checked;
console.log(`${checked} positions, top-move mismatches: ${mismatches}, max probability difference: ${worst.toFixed(5)}, ${ms.toFixed(1)} ms per position`);
if (mismatches > 0 || worst > 2e-3) process.exit(1);
