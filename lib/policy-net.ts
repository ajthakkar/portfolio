/*
 * The "Plays Like Me" network, run in the browser with no ML library.
 * Mirrors plays_like_me/encode.py and the folded network in scripts/export_web.py
 * (github.com/ajthakkar/plays-like-me). scripts/verify-policy-net.mjs checks this file
 * against PyTorch's output on real positions.
 */
import type { Chess, Square } from "chess.js";

export type TimeClass = "bullet" | "blitz" | "rapid";
type Layer = { w: Float32Array; b: Float32Array; out: number; in: number; k: number };
export type PolicyNet = { stem: Layer; blocks: [Layer, Layer][]; headA: Layer; headB: Layer; inPlanes: number };
/** A network plus how to ask it for one player's style: the flag plane (conditional network) and a temperature. */
export type Player = { net: PolicyNet; flag: number | null; temperature: number };
export type MoveProb = { from: Square; to: Square; san: string; uci: string; prob: number };
type Role = { weights: string; flag: number | null; temperature: number };
export type ModelIndex = { version: string; me: Role; typical: Role };

const PIECE_CODE: Record<string, number> = { p: 1, n: 2, b: 3, r: 4, q: 5, k: 6 };
const TIME_CLASS_INDEX: Record<TimeClass, number> = { bullet: 0, blitz: 1, rapid: 2 };

function halfToFloat(h: number): number {
  const s = h & 0x8000 ? -1 : 1;
  const e = (h >> 10) & 0x1f;
  const f = h & 0x3ff;
  if (e === 0) return s * 2 ** -14 * (f / 1024);
  if (e === 31) return f ? NaN : s * Infinity;
  return s * 2 ** (e - 15) * (1 + f / 1024);
}

type Manifest = { blocks: number; inPlanes?: number; layers: { name: string; shape: number[]; offset: number }[] };

export function parseNet(manifest: Manifest, buffer: ArrayBuffer): PolicyNet {
  const view = new DataView(buffer);
  const arrays = new Map<string, { data: Float32Array; shape: number[] }>();
  for (const { name, shape, offset } of manifest.layers) {
    const n = shape.reduce((a, b) => a * b, 1);
    const data = new Float32Array(n);
    for (let i = 0; i < n; i++) data[i] = halfToFloat(view.getUint16(offset + 2 * i, true));
    arrays.set(name, { data, shape });
  }
  const layer = (name: string): Layer => {
    const w = arrays.get(`${name}.w`)!;
    return { w: w.data, b: arrays.get(`${name}.b`)!.data, out: w.shape[0], in: w.shape[1], k: w.shape[2] };
  };
  const blocks: [Layer, Layer][] = [];
  for (let i = 0; i < manifest.blocks; i++) blocks.push([layer(`block${i}.a`), layer(`block${i}.b`)]);
  return { stem: layer("stem"), blocks, headA: layer("head.a"), headB: layer("head.b"), inPlanes: manifest.inPlanes ?? 23 };
}

/** Loads models/index.json and the weights it names (once each, even when both roles share them). */
export async function loadPlayers(dir: string): Promise<{ me: Player; typical: Player; version: string }> {
  const index: ModelIndex = await fetch(`${dir}index.json`).then((r) => r.json());
  const names = [...new Set([index.me.weights, index.typical.weights])];
  const nets = new Map<string, PolicyNet>();
  await Promise.all(
    names.map(async (name) => {
      const [manifest, buffer] = await Promise.all([
        fetch(`${dir}${name}.json`).then((r) => r.json()),
        fetch(`${dir}${name}.bin`).then((r) => r.arrayBuffer()),
      ]);
      nets.set(name, parseNet(manifest, buffer));
    }),
  );
  const player = (r: Role): Player => ({ net: nets.get(r.weights)!, flag: r.flag, temperature: r.temperature });
  return { me: player(index.me), typical: player(index.typical), version: index.version };
}

const squareIndex = (sq: string) => (sq.charCodeAt(1) - 49) * 8 + (sq.charCodeAt(0) - 97);
const squareName = (i: number) => (String.fromCharCode(97 + (i % 8)) + String(Math.floor(i / 8) + 1)) as Square;

/** The position from the mover's side, as 23 planes of 8x8 (see encode.planes in Python),
 *  plus a 24th "whose style" plane for the conditional network. */
export function encode(game: Chess, clock: number, base: number, timeClass: TimeClass, flag: number | null = null): Float32Array {
  const x = new Float32Array((flag === null ? 23 : 24) * 64);
  const turn = game.turn();
  const flip = turn === "b" ? 56 : 0;
  for (const row of game.board()) {
    for (const cell of row) {
      if (!cell) continue;
      const code = PIECE_CODE[cell.type] + (cell.color === turn ? 0 : 6);
      x[(code - 1) * 64 + (squareIndex(cell.square) ^ flip)] = 1;
    }
  }
  const other = turn === "w" ? "b" : "w";
  const ours = game.getCastlingRights(turn);
  const theirs = game.getCastlingRights(other);
  const rights = [ours.k, ours.q, theirs.k, theirs.q];
  rights.forEach((on, i) => {
    if (on) x.fill(1, (12 + i) * 64, (13 + i) * 64);
  });
  const ep = game.moves({ verbose: true }).find((m) => m.flags.includes("e"));
  if (ep) x[16 * 64 + (squareIndex(ep.to) ^ flip)] = 1;
  x.fill(Math.min(clock, 60) / 60, 17 * 64, 18 * 64);
  x.fill(Math.min(Math.max(clock / Math.max(base, 1), 0), 1), 18 * 64, 19 * 64);
  x.fill(1, (19 + TIME_CLASS_INDEX[timeClass]) * 64, (20 + TIME_CLASS_INDEX[timeClass]) * 64);
  x.fill(1, 22 * 64, 23 * 64);
  if (flag !== null) x.fill(flag, 23 * 64, 24 * 64);
  return x;
}

function conv(input: Float32Array, l: Layer, relu: boolean, residual?: Float32Array): Float32Array {
  const out = new Float32Array(l.out * 64);
  const pad = l.k === 3 ? 1 : 0;
  for (let o = 0; o < l.out; o++) {
    const acc = out.subarray(o * 64, o * 64 + 64);
    acc.fill(l.b[o]);
    for (let i = 0; i < l.in; i++) {
      const src = input.subarray(i * 64, i * 64 + 64);
      const wBase = (o * l.in + i) * l.k * l.k;
      for (let ky = 0; ky < l.k; ky++) {
        for (let kx = 0; kx < l.k; kx++) {
          const w = l.w[wBase + ky * l.k + kx];
          if (w === 0) continue;
          const dy = ky - pad;
          const dx = kx - pad;
          const y0 = Math.max(0, -dy);
          const y1 = Math.min(8, 8 - dy);
          const x0 = Math.max(0, -dx);
          const x1 = Math.min(8, 8 - dx);
          for (let y = y0; y < y1; y++) {
            const row = y * 8;
            const srow = (y + dy) * 8 + dx;
            for (let xx = x0; xx < x1; xx++) acc[row + xx] += w * src[srow + xx];
          }
        }
      }
    }
  }
  if (residual) for (let i = 0; i < out.length; i++) out[i] += residual[i];
  if (relu) for (let i = 0; i < out.length; i++) if (out[i] < 0) out[i] = 0;
  return out;
}

/** 4096 move scores, index = from x 64 + to in the mover's frame. */
export function forward(net: PolicyNet, x: Float32Array): Float32Array {
  let h = conv(x, net.stem, true);
  for (const [a, b] of net.blocks) h = conv(conv(h, a, true), b, true, h);
  const out = conv(conv(h, net.headA, true), net.headB, false); // [to][from]
  const logits = new Float32Array(4096);
  for (let to = 0; to < 64; to++) for (let from = 0; from < 64; from++) logits[from * 64 + to] = out[to * 64 + from];
  return logits;
}

/** Every legal move with the model's probability, most likely first. Promotions are to a queen. */
export function predict(player: Player, game: Chess, clock: number, base: number, timeClass: TimeClass): MoveProb[] {
  const logits = forward(player.net, encode(game, clock, base, timeClass, player.flag));
  const flip = game.turn() === "b" ? 56 : 0;
  const moves = game.moves({ verbose: true }).filter((m) => !m.promotion || m.promotion === "q");
  // Temperature scaling (fitted on validation games) keeps the shown probabilities honest.
  const scores = moves.map((m) => logits[(squareIndex(m.from) ^ flip) * 64 + (squareIndex(m.to) ^ flip)] / player.temperature);
  const max = Math.max(...scores);
  const exps = scores.map((s) => Math.exp(s - max));
  const total = exps.reduce((a, b) => a + b, 0);
  return moves
    .map((m, i) => ({ from: m.from, to: m.to, san: m.san, uci: m.from + m.to + (m.promotion ?? ""), prob: exps[i] / total }))
    .sort((a, b) => b.prob - a.prob);
}

/** Pick a move: the most likely one, or a sample at the given temperature (1 = as the model thinks I'd play). */
export function choose(moves: MoveProb[], temperature: number, random = Math.random): MoveProb {
  if (temperature <= 0) return moves[0];
  const weights = moves.map((m) => m.prob ** (1 / temperature));
  const total = weights.reduce((a, b) => a + b, 0);
  let r = random() * total;
  for (let i = 0; i < moves.length; i++) {
    r -= weights[i];
    if (r <= 0) return moves[i];
  }
  return moves[0];
}

export { squareName };
