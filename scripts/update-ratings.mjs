#!/usr/bin/env node
/**
 * Builds public/data/ratings.json: all-time rating history from Chess.com, Lichess, and US Chess.
 *
 *   npm run ratings          # incremental: only fetches what's new since the last run
 *   npm run ratings -- --full
 *
 * Each series is one point per day: [YYYY-MM-DD, rating after the last game that day].
 * Only ratings are stored; no other profile data.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";

const accounts = JSON.parse(await readFile(new URL("../lib/chess-accounts.json", import.meta.url), "utf8"));
const OUT = new URL("../public/data/ratings.json", import.meta.url);
const HEADERS = { "User-Agent": "portfolio-ratings-script/1.0" };
const full = process.argv.includes("--full");

const day = (ms) => new Date(ms).toISOString().slice(0, 10);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getJson(url, tries = 4) {
  for (let i = 0; i < tries; i++) {
    const res = await fetch(url, { headers: HEADERS });
    if (res.ok) return res.json();
    if (res.status === 429 || res.status >= 500) {
      await sleep(15_000 * (i + 1));
      continue;
    }
    throw new Error(`${res.status} ${url}`);
  }
  throw new Error(`Gave up on ${url}`);
}

/** Merge day points into a series, newest value per day wins. */
function merge(series = [], points) {
  const byDay = new Map(series);
  for (const [d, r] of points) byDay.set(d, r);
  return [...byDay.entries()].sort((a, b) => a[0].localeCompare(b[0]));
}

function lastPerDay(games) {
  const byDay = new Map();
  for (const g of games.sort((a, b) => a.t - b.t)) byDay.set(day(g.t), g.r);
  return [...byDay.entries()];
}

async function chesscom(prev) {
  const user = accounts.chesscom.toLowerCase();
  const { archives } = await getJson(`https://api.chess.com/pub/player/${user}/games/archives`);
  // Incremental runs refetch only the last two months.
  const months = full || !prev?.series ? archives : archives.slice(-2);
  const games = { bullet: [], blitz: [], rapid: [] };
  for (const url of months) {
    const data = await getJson(url);
    for (const g of data.games ?? []) {
      if (g.rules !== "chess" || !g.rated || !(g.time_class in games)) continue;
      const side = g.white.username.toLowerCase() === user ? g.white : g.black;
      games[g.time_class].push({ t: g.end_time * 1000, r: side.rating });
    }
    process.stdout.write(`chess.com ${url.slice(-7)}\r`);
  }
  const series = {};
  for (const [tc, list] of Object.entries(games)) series[tc] = merge(prev?.series?.[tc], lastPerDay(list));
  return { series };
}

async function lichess(prev) {
  const since = !full && prev?.since ? `&since=${prev.since + 1}` : "";
  const url =
    `https://lichess.org/api/games/user/${accounts.lichess}?rated=true&moves=false&opening=false` +
    `&perfType=bullet,blitz,rapid,classical&sort=dateAsc${since}`;
  const res = await fetch(url, { headers: { ...HEADERS, Accept: "application/x-ndjson" } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);

  const games = { bullet: [], blitz: [], rapid: [], classical: [] };
  let latest = prev?.since ?? 0;
  let count = 0;
  let buffer = "";
  const decoder = new TextDecoder();
  // Games arrive oldest first, so if the stream drops, a rerun picks up where this one stopped.
  try {
    for await (const chunk of res.body) {
      buffer += decoder.decode(chunk, { stream: true });
      let nl;
      while ((nl = buffer.indexOf("\n")) >= 0) {
        const line = buffer.slice(0, nl).trim();
        buffer = buffer.slice(nl + 1);
        if (!line) continue;
        const g = JSON.parse(line);
        const id = accounts.lichess.toLowerCase();
        const side = g.players.white.user?.id === id ? g.players.white : g.players.black;
        if (g.perf in games && typeof side.rating === "number") {
          games[g.perf].push({ t: g.lastMoveAt, r: side.rating + (side.ratingDiff ?? 0) });
        }
        latest = Math.max(latest, g.createdAt);
        if (++count % 250 === 0) process.stdout.write(`lichess ${count} games\r`);
      }
    }
  } catch (err) {
    console.error(`\nLichess stream stopped after ${count} games (${err.stack ?? err}). Run again to continue.`);
    process.exitCode = 1;
  }
  const series = {};
  for (const [tc, list] of Object.entries(games)) series[tc] = merge(prev?.series?.[tc], lastPerDay(list));
  return { since: latest, series };
}

async function uscf() {
  const systems = { R: "regular", Q: "quick", B: "blitz", OR: "online-regular", OQ: "online-quick", OB: "online-blitz" };
  const points = Object.fromEntries(Object.values(systems).map((k) => [k, []]));
  for (let offset = 0; ; offset += 50) {
    const page = await getJson(
      `https://ratings-api.uschess.org/api/v1/members/${accounts.uscfId}/sections?Offset=${offset}&Size=50`,
    );
    for (const section of page.items ?? []) {
      for (const rec of section.ratingRecords ?? []) {
        const key = systems[rec.ratingSource];
        if (key && typeof rec.postRating === "number") points[key].push([section.endDate, rec.postRating]);
      }
    }
    if (!page.hasNextPage) break;
  }
  const series = {};
  for (const [k, list] of Object.entries(points)) series[k] = merge([], list);
  return { series };
}

let prev = {};
try {
  prev = JSON.parse(await readFile(OUT, "utf8"));
} catch {
  /* first run */
}

// --only=uscf,chesscom limits which sources refresh; the rest keep their previous data.
const only = process.argv.find((a) => a.startsWith("--only="))?.slice(7).split(",");
const run = (name, fn) =>
  only && !only.includes(name)
    ? Promise.resolve(prev[name] ?? { series: {} })
    : fn().catch((err) => {
        console.error(`
${name} failed: ${err.stack ?? err}`);
        process.exitCode = 1;
        return prev[name] ?? { series: {} };
      });

const [c, l, u] = await Promise.all([
  run("chesscom", () => chesscom(prev.chesscom)),
  run("lichess", () => lichess(prev.lichess)),
  run("uscf", () => uscf()),
]);
const out = { updated: new Date().toISOString(), chesscom: c, lichess: l, uscf: u };
await mkdir(new URL("../public/data/", import.meta.url), { recursive: true });
await writeFile(OUT, JSON.stringify(out));

const summary = (s) =>
  Object.entries(s.series)
    .filter(([, v]) => v.length)
    .map(([k, v]) => `${k} ${v.length}d`)
    .join(", ");
console.log(`\nChess.com: ${summary(c)}\nLichess: ${summary(l)}\nUS Chess: ${summary(u)}`);
