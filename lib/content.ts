/* All site content lives here. Edit text in this file, not in components. */

import chessAccounts from "./chess-accounts.json";

export const profile = {
  name: "Aayush Thakkar",
  firstName: "Aayush",
  lastName: "Thakkar",
  email: "thakkar.186@osu.edu",
  location: "Columbus, OH",
  timeZone: "America/New_York",
  tagline:
    "Business student at Ohio State's Fisher College of Business. I like problems where business, software, and AI meet, and I've spent more than ten years playing tournament chess.",
  links: [
    { label: "GitHub", href: "https://github.com/ajthakkar" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/aayush--thakkar" },
    { label: "Email", href: "mailto:thakkar.186@osu.edu" },
  ],
  /** Player card "class" line. */
  playerClass: "Business Admin · Ohio State",
  chess: {
    /** Usernames and US Chess ID live in lib/chess-accounts.json (the ratings script reads them too). */
    lichess: chessAccounts.lichess,
    chesscom: chessAccounts.chesscom,
    uscfId: chessAccounts.uscfId,
  },
  gaps: [] as string[],
};

/** "Play me" links: open a challenge on each site. */
export const playLinks = [
  { site: "Chess.com", href: `https://www.chess.com/play/online/new?opponent=${chessAccounts.chesscom}` },
  { site: "Lichess", href: `https://lichess.org/?user=${chessAccounts.lichess}#friend` },
];

/** The scrolling strip under the home page hero. */
export const highlights = [
  "US Chess Expert · peak 2075",
  "IHSA State Finals · Board 1 gold · 7/7",
  "1,000+ chess students taught",
  "Hack For The World · 1st overall",
  "INCubatoredu · national top 5",
  "ACT 36",
  "National Merit Commended",
  "DECA · 6th in Illinois",
];

export const now = {
  label: "Fall 2026",
  items: [
    "Running stakeholder interviews for BDAA's product discovery project with OSU University Libraries",
    "Treasurer on the Ohio State Chess Club executive board",
    "Picking my next project: a finance model or a machine learning build",
  ],
};

/* ─────────────────────────────── Projects ─────────────────────────────── */

export type GlyphMark = "!!" | "!" | "!?" | "?!" | "?";

export const glyphMeaning: Record<GlyphMark, string> = {
  "!!": "Brilliant: the move that made it",
  "!": "Good: would do it again",
  "!?": "Interesting: a risk that paid off",
  "?!": "Dubious: worked, but I'd rethink it",
  "?": "Mistake: what I'd change",
};

export type Move = { glyph: GlyphMark; title: string; body: string };

export type Case = {
  slug: string;
  number: string;
  kind: "Main quest" | "Side quest";
  title: string;
  /** Skill ids (see `branches` below) this project proves. */
  rewards: string[];
  dek: string;
  period: string;
  role: string;
  team?: string;
  tools: string[];
  result: string;
  stats: { value: string; label: string }[];
  position: string[];
  plan: string[];
  moves: Move[];
  outcome: string[];
  postGame: string[];
  links?: { label: string; href: string }[];
  note?: string;
  /** Questions for Aayush. Shown only in `npm run dev`, never on the live site. */
  gaps?: string[];
  /** An interactive demo shown on the project page. */
  demo?: "knights-tour" | "chess-insights";
};

export const cases: Case[] = [
  {
    slug: "chess-analytics",
    number: "06",
    kind: "Main quest",
    title: "Do I Tilt?",
    rewards: ["sql", "statistics", "dataviz", "python"],
    dek: "What 14,547 of my rated online games say about tilt, fatigue, time of day, the clock, and openings, tested with honest error bars.",
    period: "Nov 2026",
    role: "Solo project",
    tools: ["Python", "SQL (DuckDB)", "pandas", "statsmodels", "matplotlib", "pytest"],
    result: "No tilt, but I quit after losses",
    stats: [
      { value: "14,547", label: "rated games from Chess.com and Lichess, 2017–2026" },
      { value: "−0.6", label: "points per 100 games after a loss vs. a win: no tilt" },
      { value: "23% vs 15%", label: "chance I stop for the night after a loss vs. a win" },
      { value: "+12.6", label: "net bullet games per 100 won on time" },
    ],
    demo: "chess-insights",
    position: [
      "I've played more than 14,000 rated games online since 2017, mostly bullet. Like most players, I had a story about myself: I tilt after losses, and I play worse late at night.",
      "Those are testable claims, and my own games are a dataset I understand better than anyone. So I pulled every rated game from Chess.com and Lichess and checked.",
    ],
    plan: [
      "Put both sites into one clean table: one row per game, with pre-game ratings, the result, how it ended, the clocks, the opening, and which session it belonged to.",
      "Judge every game against what I usually score in that situation, so a night of tough opponents doesn't look like a bad night.",
      "Use error bars that respect how the data was made: games from the same night move together, and testing 30 openings means some will look special by luck.",
    ],
    moves: [
      {
        glyph: "!!",
        title: "Check the yardstick first",
        body: "The Elo formula was the obvious baseline, but a calibration chart showed it overrates big rating gaps in my games. After a win my next opponent averaged 39 points below me; after a loss, 15. That alone would have made losses look harmless, so I fitted my own baseline from all 14,547 games.",
      },
      {
        glyph: "!",
        title: "Fix the data before trusting it",
        body: "Chess.com's archive stores each rating after the game, not before. I checked: the rating change matches that game's result 91–93% of the time. So every pre-game rating is rebuilt from the game before it.",
      },
      {
        glyph: "!",
        title: "Cluster by session",
        body: "One bad night drags down several games at once. Treating 14,547 games as independent would make every interval too narrow, so the error bars are computed session by session, in SQL.",
      },
      {
        glyph: "?",
        title: "Openings that only looked good",
        body: "My first pass said the Queen's Gambit Declined and the Slav were my best openings. They were White's first-move advantage in disguise. Measured against my usual White results and corrected for testing 30 openings, no opening stands out.",
      },
      {
        glyph: "!",
        title: "One model for everything",
        body: "Late-night games are also games deep into long sessions. A regression with previous result, session depth, and time of day together keeps one effect from passing for another.",
      },
    ],
    outcome: [
      "No tilt. After a loss I score 0.6 points per 100 games lower than after a win, with a 95% interval of −2.4 to +1.2: indistinguishable from zero, and it rules out a hit bigger than about 17 rating points.",
      "What a loss changes is whether I keep playing: I stop for the night after 23% of losses and 15% of wins. That's deliberate. Stopping after a loss is how I keep from tilting, and the first result says it works.",
      "No fatigue, even 20+ games into a session. My weakest hours are 5–9 PM and my strongest are 3–6 AM, worth about 50 rating points. That's about who I tend to play at that hour, not playing better tired.",
      "In bullet I win 12.6 more games per 100 on time than I lose, and more than half my bullet wins come on the clock.",
      "SQL queries for every comparison, 17 tests, and a README with every chart.",
    ],
    postGame: [
      "The first answers were wrong twice, and both times the mistake was in what I compared against, not in the effect I was looking for. Checking the baseline is most of the work.",
      "I don't tilt because I stop when a loss gets to me, and now I have numbers that say the habit works. Next, I'd run an engine over a sample of games to measure move quality instead of just results.",
    ],
    links: [{ label: "Code and full write-up on GitHub", href: "https://github.com/ajthakkar/chess-analytics" }],
    gaps: [
      "Read the reflection (The position, Key moves, Post-game) and rewrite anything that doesn't sound like you.",
    ],
  },
  {
    slug: "knights-tour",
    number: "05",
    kind: "Main quest",
    title: "Knight's Tour",
    rewards: ["algorithms", "python"],
    dek: "Three ways to send a knight across every square of the board once, tested, measured, and raced in the browser.",
    period: "Nov 2026",
    role: "Solo project",
    tools: ["Python", "pytest", "matplotlib", "TypeScript", "React"],
    result: "64/64 tours on 8x8 with zero backtracks",
    stats: [
      { value: "64/64", label: "8x8 tours found with Warnsdorff order" },
      { value: "0/64", label: "found by brute force within 1,000,000 steps" },
      { value: "96.7%", label: "worst greedy success rate, 8x8 to 40x40" },
      { value: "93 ms", label: "for a 65,536-square tour in pure Python" },
    ],
    demo: "knights-tour",
    position: [
      "The knight's tour is a puzzle more than a thousand years old: move a knight so it lands on every square of the board exactly once. An animated one used to sit on my homepage as decoration.",
      "I wanted to understand how a tour is actually found, and to show I can take an algorithm from an idea to tested, measured code instead of just describing it.",
    ],
    plan: [
      "Write three solvers in Python: brute-force backtracking, H. C. Warnsdorff's greedy rule from 1823 (always move to the square with the fewest onward moves), and a backtracking search that tries moves in Warnsdorff order.",
      "Prove the answers are right with tests instead of eyeballing them, including the cases where no tour can exist.",
      "Run every start square on boards up to 8x8, and the greedy rule on boards up to 40x40, then chart where each method breaks.",
    ],
    moves: [
      {
        glyph: "!!",
        title: "Let the heuristic order the search",
        body: "Warnsdorff's rule alone is fast but greedy, so it can walk into a dead end. Using it only to decide which move to try first kept the speed and made the search complete: on 8x8 it found a tour from all 64 squares without a single backtrack.",
      },
      {
        glyph: "!",
        title: "Measure work, not just time",
        body: "I counted every square the knight stepped onto, retreats included, instead of only timing runs. That made the comparison fair on any computer and showed exactly where brute force falls apart.",
      },
      {
        glyph: "!",
        title: "Test the impossible cases",
        body: "The tests prove that no tour exists on 3x3 or 4x4, and that on 5x5 a tour can only start on the 13 squares of one color. A bug that always 'finds' something would fail them.",
      },
      {
        glyph: "!?",
        title: "Compare tie-breaks, not just methods",
        body: "When two squares tie under Warnsdorff's rule, the choice matters. Picking the square farthest from the center finished at least 96.7% of starts on every board from 8x8 to 40x40. Picking at random fell to 65%.",
      },
      {
        glyph: "?!",
        title: "Pure Python",
        body: "Easy to read and test, but slow. I chose clarity first; a compiled version is the obvious next step.",
      },
    ],
    outcome: [
      "On 8x8, brute force didn't finish a single tour within a million steps. The Warnsdorff-ordered search finished all 64 in exactly 64 steps each.",
      "The greedy rule scales in a straight line: a 256x256 tour, 65,536 squares, takes about 93 ms.",
      "The one surprise was 7x7: it trips every tie-break rule, and it's the only board where even the Warnsdorff-ordered search hit the cap once.",
      "12 tests, a command-line tool, and a benchmark script that regenerates every number and chart on this page.",
    ],
    postGame: [
      "A good heuristic beats raw speed. No computer makes brute force practical on 8x8, but one sentence of insight from 1823 makes the problem easy.",
      "Next, I'd port the inner loop to a compiled language and measure the speedup on the same benchmarks, then build huge tours by stitching small closed tours together, a known way to get linear time with no failures.",
    ],
    links: [{ label: "Code on GitHub", href: "https://github.com/ajthakkar/knights-tour" }],
    gaps: ["Read the reflection (The position, Key moves, Post-game) and rewrite anything that doesn't sound like you."],
  },
  {
    slug: "hackohio-outage-model",
    number: "07",
    kind: "Main quest",
    title: "Storm Outage Model",
    rewards: ["ml", "statistics", "python"],
    dek: "HackOHI/O 2026, AEP's challenge: tell a customer how likely a storm is to knock out their power, and for how long. We replaced a guessed risk score with one measured from real storms.",
    period: "Oct 2026",
    role: "Team member",
    team: "4 students, no fixed roles",
    tools: ["Python", "pandas", "scikit-learn", "SciPy", "C# / WPF", "Claude Code"],
    result: "Held-out accuracy 0.39 → 0.72 on the worst storm",
    stats: [
      { value: "0.72", label: "AUC on the Feb 2025 ice storm, unseen in training (old score: 0.39)" },
      { value: "11", label: "real storms, each held out in turn" },
      { value: "0.68 vs 0.60", label: "simple model vs. logistic regression on unseen big storms" },
      { value: "0", label: "hand-picked multipliers left" },
    ],
    position: [
      "HackOHI/O is Ohio State's annual hackathon. AEP, the power company, asked for an outage concierge: before and during a storm, tell a customer how likely they are to lose power, how long it could last, and how to prepare, using AEP's anonymized grid map and damage records from real storms.",
      "Our first build was a web app with three services and a 14-feature model. Late on the first night we dropped it for a teammate's simpler desktop app, L.A.R.P. Its risk score still ran on hand-picked weights, so we rebuilt it.",
      "None of us had a fixed role. All four of us worked on whatever needed doing and brainstormed prompt engineering ideas together.",
    ],
    plan: [
      "Answer two questions with numbers that trace back to the data: will I lose power, and how long until it's back?",
      "Judge every option the same way: train on 10 storms, score on the 11th, and repeat for all 11.",
      "Keep it simple enough to explain to judges who aren't data scientists.",
    ],
    moves: [
      {
        glyph: "?",
        title: "Starting too big",
        body: "Our first version spread a complex model across three services. We spent most of the night wiring it together instead of checking whether the numbers made sense. Next time: one question, one model, tested, then the app.",
      },
      {
        glyph: "!!",
        title: "Test it before trusting it",
        body: "On storms it had never seen, the app's original score ranked homes backwards in the biggest storms: an AUC of 0.39, worse than a coin flip at 0.5. Dense neighborhoods had the most past damage nearby, but big storms hit long rural lines.",
      },
      {
        glyph: "!",
        title: "Model the physics",
        body: "Storms break overhead lines, so the expected damage on a home's power path is the storm's damage rate times the kilometers of overhead line between the home and its substation. The chance of an outage is 1 − e^(−expected), a standard Poisson model. The storm rates are measured from the real storms, not chosen.",
      },
      {
        glyph: "!",
        title: "Give machine learning a fair shot",
        body: "A logistic regression and a gradient-boosted model got every feature we had. On unseen storms both did worse than the three-part physical model: with only 11 storms, more features meant memorizing past storms instead of learning what carries over.",
      },
      {
        glyph: "!?",
        title: "Shrink noisy history",
        body: "Each line section's damage history counts, but pulled toward average when there's little data (empirical Bayes). The amount of pull was chosen by the held-out test, not by feel.",
      },
    ],
    outcome: [
      "On the three biggest storms, held-out AUC rose from 0.44 to 0.68 on average, and from 0.39 to 0.72 on the February 2025 ice storm.",
      "Restoration time follows AEP's own guide: damage is placed on the real network 200 times per storm type, each repair is priced from AEP's labor tables, and crews are scheduled to restore the most customers first.",
      "The model shipped in L.A.R.P., our submission, with a write-up of every method we compared and why it lost, plus plain-English answers to the questions we expected from the judges.",
    ],
    postGame: [
      "The simplest model was the most accurate and the easiest to explain. Testing on storms the model hadn't seen is what proved it, and what showed the original score was worse than guessing.",
    ],
    links: [{ label: "L.A.R.P. on GitHub", href: "https://github.com/rlin122006/HackOHIO-2026-larp" }],
    gaps: ["Your teammates' names, if you want to credit them."],
  },
  {
    slug: "roam-travel",
    number: "01",
    kind: "Main quest",
    title: "Roam Travel",
    rewards: ["startups", "pitching", "startup-finance"],
    dek: "Taking a luggage strap from a handmade prototype to a patent-pending product, as a high school co-founder.",
    period: "Aug 2024 – Aug 2025",
    role: "Co-Founder, CTO & CFO",
    team: "3 co-founders",
    tools: ["Shopify", "Lean startup", "Customer discovery", "Investor pitching"],
    result: "250+ units sold · patent pending",
    stats: [
      { value: "250+", label: "units sold" },
      { value: "$2,000+", label: "profit" },
      { value: "$10,000+", label: "in pitch prizes" },
      { value: "1,000+", label: "customer sign-ups" },
    ],
    position: [
      "Roam Travel started in INCubatoredu, the startup incubator program in my high school's district. Three of us set out to build and sell a travel accessory: the Roam Link luggage strap.",
      "I was CTO and CFO, so I owned both the product side and the money side.",
    ],
    plan: [
      "Prove demand before spending on production, then iterate on what customers actually said.",
      "Get the product in front of as many people as possible: an online store, a sign-up list, partners, and 20+ pitch competitions.",
    ],
    moves: [
      {
        glyph: "!",
        title: "Sell by hand before manufacturing",
        body: "We made the first 80+ straps by hand and sold them before paying for manufacturing. Demand was proven before money was on the line.",
      },
      {
        glyph: "!",
        title: "Build, measure, learn",
        body: "We ran lean startup cycles: gather customer feedback, change the product, and test again.",
      },
      {
        glyph: "!?",
        title: "The Roam Challenge",
        body: "We traded free units for travelers' destination photos and used those photos as our ad content.",
      },
      {
        glyph: "!",
        title: "Pitch everywhere",
        body: "We pitched to investor judges at 20+ competitions, placed 1st of 60 teams at District 203's Final Pitch Night, and reached the top 5 at the national competition at Willis Tower.",
      },
      {
        glyph: "!",
        title: "Protect the design",
        body: "We took the Roam Link from prototype to a patent-pending product.",
      },
    ],
    outcome: [
      "Sold 250+ units and earned $2,000+ in profit, with a Shopify store and a 1,000+ person sign-up list.",
      "Won $10,000+ across 20+ pitch competitions, including $3,000 for 1st place at District 203's INCubatoredu Final Pitch Night.",
      "Covered by the Chicago Tribune and NCTV17.",
    ],
    postGame: [],
    links: [{ label: "roamtravel.us", href: "https://roamtravel.us" }],
    gaps: [
      "What problem does the Roam Link solve for travelers? One or two sentences for 'The position'.",
      "Pick one decision you'd grade '?' (a mistake) and say what you'd do instead. That goes in 'Post-game'.",
      "Photos: the strap, the handmade batch, a pitch on stage, the Tribune clip.",
      "Links to the Chicago Tribune and NCTV17 stories.",
    ],
  },
  {
    slug: "constellation-energy",
    number: "02",
    kind: "Main quest",
    title: "Long Constellation Energy",
    rewards: ["equity-research", "valuation"],
    dek: "A stock pitch arguing that AI's power problem makes the largest US nuclear operator undervalued.",
    period: "Sep 2026",
    role: "Solo stock pitch",
    tools: ["Equity research", "Valuation multiples", "Earnings reports", "SEC filings"],
    result: "Long at $285.93 · $355 target",
    stats: [
      { value: "$355", label: "12-month target" },
      { value: "~24%", label: "upside" },
      { value: "~24x", label: "forward P/E vs. 27–30x in 2024–25" },
      { value: "12–36 mo", label: "holding period" },
    ],
    position: [
      "The main constraint on AI has shifted from chips and memory toward power and cooling. US data centers used 4.4% of national electricity in 2023 and could reach 6.7–12% by 2028, and the IEA expects global data center demand to more than double by 2030.",
      "Constellation Energy (NASDAQ: CEG) is the largest nuclear operator in the US, with about 55 GW of capacity after acquiring Calpine, and its fleet ran at about a 93% capacity factor in the second quarter.",
    ],
    plan: [
      "Moat: new reactors are slow and expensive. Vogtle 3 and 4, the only new US reactors in three decades, came online seven years late at a cost of $35 billion.",
      "Demand: hyperscalers are signing 20-year deals, including Microsoft for the Crane restart and Meta for Clinton's 1,121 MW plant.",
      "Upside: as an independent power producer, Constellation sells into competitive markets and captures rising power prices directly.",
    ],
    moves: [
      {
        glyph: "!",
        title: "Anchor on valuation",
        body: "CEG traded near 24x forward earnings, below its own 27–30x in 2024–25, even as estimates rose. That gap is the opportunity.",
      },
      {
        glyph: "!",
        title: "Read past the GAAP number",
        body: "Q2 GAAP EPS was $1.42 against $2.55 adjusted. The gap is mostly an unrealized mark-to-market loss on hedges, which is relatively standard.",
      },
      {
        glyph: "!?",
        title: "Lean on policy tailwinds",
        body: "May 2025 executive orders target 400 GW of US nuclear capacity by 2050, about four times today's fleet. Existing plants benefit first, since restarts and uprates come online years before new reactors.",
      },
      {
        glyph: "!",
        title: "Define the exit before entering",
        body: "I'd exit if a major PPA is canceled, the NRC delays Crane past 2028, or hyperscaler capex stalls noticeably.",
      },
    ],
    outcome: [
      "Recommended a long position at the Sep 10, 2026 close of $285.93, with a 12-month target of $355 (about 24% upside) and a 12–36 month holding period.",
      "Downside cushions: roughly 30% of clean baseload output is already contracted with investment-grade buyers, and the 45U credit floors nuclear revenue at up to $15/MWh through 2032.",
    ],
    postGame: [
      "The habit I'd keep: every number in the pitch is tied to a filing or an earnings release, and anything I couldn't verify is flagged instead of guessed.",
    ],
    note: "A student stock pitch, not investment advice.",
    gaps: ["Want the full pitch PDF linked from this page?"],
  },
  {
    slug: "hack-for-the-world",
    number: "03",
    kind: "Side quest",
    title: "Hack For The World",
    rewards: [],
    dek: "A first-person shooter in the browser: fight off oil zombies and repair a failing oil rig before it spills. First place overall.",
    period: "Feb 2026",
    role: "Team member",
    team: "4 students, no fixed roles",
    tools: ["JavaScript", "Three.js", "Vite", "WebGL", "GitHub"],
    result: "1st place overall",
    stats: [
      { value: "1st", label: "place overall" },
      { value: "12 hrs", label: "to build it" },
      { value: "54", label: "JavaScript modules" },
      { value: "~6,000", label: "lines of code" },
    ],
    position: [
      "Hack For The World was a 12-hour sustainability hackathon at Naperville North, with high school teams from across Chicagoland.",
      "Instead of another dashboard, we built a game. An offshore oil rig is about to fail, oil zombies have overrun the deck, and you have to fight your way to the drill shaft and repair it before the timer runs out and the spill hits the ocean.",
      "There were no fixed roles. We brainstormed together, tried building on one computer and on separate ones, and submitted our best final version.",
    ],
    plan: [
      "Make the sustainability message something you feel instead of read: if you lose, the rig fails.",
      "Write the requirements before any code, so four people could build in parallel without stepping on each other.",
      "Pick a stack we could finish in 12 hours and that judges could open with no install.",
    ],
    moves: [
      {
        glyph: "!",
        title: "Browser over Unity",
        body: "We considered Unity, but chose Three.js in the browser: no install for judges, instant reloads while building, and one link anyone can open.",
      },
      {
        glyph: "!",
        title: "Requirements first",
        body: "A requirements doc set the core loop, controls, enemy behavior, win and lose states, and a 60 FPS target before anyone wrote code. A structure doc split the game into input, combat, enemies, objective, and UI.",
      },
      {
        glyph: "!",
        title: "Systems that don't know about each other",
        body: "Modules talk through an event bus, and one state machine owns the menu, play, pause, win, and lose screens. That kept late changes from breaking unrelated parts.",
      },
      {
        glyph: "!?",
        title: "A real-looking rig",
        body: "Rusted metal and concrete textures and 3D barrels, tanks, and crates made the rig feel like a place, which mattered for a game whose point is what happens if it fails.",
      },
    ],
    outcome: [
      "Won 1st place overall.",
      "A playable first-person shooter: pointer-lock mouse look, raycast shooting, zombie AI with wave spawning, a rig-failure timer, a hold-to-repair objective, and a live HUD.",
    ],
    postGame: [
      "Four people, no fixed roles, 12 hours. We switched between crowding around one computer and splitting up across several, and the requirements doc is what let us split up without breaking each other's work.",
    ],
    links: [{ label: "Code on GitHub", href: "https://github.com/mmbar08/HACK26repo" }],
    gaps: ["Check the Post-game line.", "Want a playable build hosted and linked from this page?"],
  },
  {
    slug: "this-site",
    number: "04",
    kind: "Side quest",
    title: "This site",
    rewards: ["web", "shipping", "ai-dev"],
    dek: "Designing and shipping a personal site with AI-assisted development.",
    period: "Nov 2026",
    role: "Designer & developer",
    tools: ["Next.js", "TypeScript", "Tailwind CSS", "Claude Code", "Vercel"],
    result: "Live on Vercel",
    stats: [
      { value: "3", label: "versions" },
      { value: "20", label: "skills on the tree" },
    ],
    position: [
      "I wanted one place to show my work that doesn't read like a resume.",
    ],
    plan: [
      "Study student and designer portfolios, pick a direction, and build it with Claude Code as my pair programmer.",
    ],
    moves: [
      {
        glyph: "!",
        title: "Ship the simple version first",
        body: "Version 1 went live as a single page before any design work, so there was always something real at the URL.",
      },
      {
        glyph: "!",
        title: "Make the work the point",
        body: "The strongest portfolios I studied led with proof, so every skill on the tree links to the project that backs it, and locked skills show what's next.",
      },
      {
        glyph: "!?",
        title: "Play like a game, read like a resume",
        body: "A title screen, a skill tree, a quest log, and an XP bar give it a game feel. Chess stays in the details: piece icons, annotation marks, and a puzzle. Every heading still says plainly what it is.",
      },
    ],
    outcome: ["A static Next.js site on Vercel. Every push to main redeploys it."],
    postGame: [],
  },
];

/* ─────────────────────────────── Record ─────────────────────────────── */

export type Role = {
  org: string;
  monogram?: string;
  role: string;
  dates: string;
  location: string;
  points: string[];
};

export const experience: Role[] = [
  {
    org: "Big Data & Analytics Association (BDAA)",
    monogram: "BD",
    role: "Product Development Track Member",
    dates: "Fall 2026 – Present",
    location: "Columbus, OH",
    points: [
      "Serve as the team's main point of contact with OSU University Libraries on a product discovery project about how incoming students learn about library resources",
      "Organize stakeholder interviews end to end, from outreach and scheduling to follow-up",
      "Coordinate team tasks and keep work moving between weekly track meetings",
    ],
  },
  {
    org: "Roam Travel",
    monogram: "RT",
    role: "Co-Founder, CTO & CFO",
    dates: "Aug 2024 – Aug 2025",
    location: "Naperville, IL",
    points: [
      "Co-founded a 3-person startup through a high school incubator; took the Roam Link luggage strap from prototype to a patent-pending product",
      "Sold 250+ units and earned $2,000+ in profit, starting with 80+ handmade units to validate demand before manufacturing",
      "Ran lean startup build-measure-learn cycles, turning customer feedback into product changes",
      "Pitched to investor judges at 20+ competitions, winning $10,000+ in prize money",
      "Created the Roam Challenge, trading free units for travelers' destination photos to source ad content",
      "Helped launch the Shopify store, grew a 1,000+ person customer sign-up list, and secured partnerships through direct outreach",
      "Earned company coverage in the Chicago Tribune and on NCTV17",
    ],
  },
  {
    org: "Elite Chess",
    monogram: "EC",
    role: "Chess Instructor",
    dates: "Sep 2023 – Aug 2026",
    location: "Naperville, IL · Sep 2023 – Oct 2024, Oct 2025 – Aug 2026",
    points: [
      "Taught 1,000+ students in group classes and private lessons, from first-time beginners to tournament players",
      "Raised students' ratings by about 100 points per year on average, and up to 300 points with focused coaching",
      "Ran walk-in trial lessons and placement orientations for prospective families, turning visitors into enrolled students",
      "Covered classes on short notice and ran both groups of a 20-student camp alone while a co-coach was out",
      "Helped shape teaching methods and student-retention ideas with the owner and manager as the company grew",
      "Tracked student progress for parents and management, and trained the coach who took over my role",
    ],
  },
];

export const involvement: Role[] = [
  {
    org: "Ohio State Chess Club",
    role: "Treasurer, Executive Board",
    dates: "Nov 2026 – Present",
    location: "Columbus, OH",
    points: ["Joined as a member in Aug 2026 and was elected to the executive board as Treasurer in Nov 2026"],
  },
  {
    org: "AI Club",
    role: "Member",
    dates: "Fall 2026 – Present",
    location: "Columbus, OH",
    points: [],
  },
  {
    org: "Naperville North Chess Team",
    role: "Captain (2024 – 2026)",
    dates: "2022 – 2026",
    location: "Naperville, IL",
    points: [
      "Led meetings and drafted training plans, raising the team's average rating by about 100 points",
      "Grew consistent membership 50% (20 to 30 players) and pushed players into outside rated tournaments",
      "Played Board 1 all four years as the team placed top 15 of 128 state qualifiers every year",
    ],
  },
  {
    org: "Naperville North High School",
    role: "Peer Tutor",
    dates: "2024 – 2026",
    location: "Naperville, IL",
    points: ["Tutored peers across all core subjects over three semesters"],
  },
];

export const honors = [
  { title: "Individual Gold Medal, IHSA State Chess Finals", detail: "Board 1, perfect 7/7 score", date: "Feb 2026" },
  { title: "1st Place Overall, Hack For The World", detail: "12-hour sustainability hackathon", date: "Feb 2026" },
  {
    title: "National Finalist (Top 5), INCubatoredu National Pitch Competition",
    detail: "Willis Tower, Chicago, with Roam Travel",
    date: "2025",
  },
  {
    title: "1st of 60 Teams, District 203 INCubatoredu Final Pitch Night",
    detail: "$3,000 prize, with Roam Travel",
    date: "2025",
  },
  { title: "6th Place in Illinois, DECA Entrepreneurship Series", detail: "", date: "2024" },
  {
    title: "US Chess Expert (peak 2075)",
    detail: "One class below National Master; top 1% online on Chess.com and Lichess",
    date: "",
  },
];

export const skills = [
  { label: "Programming", items: "Python, Java, HTML" },
  { label: "AI Tools", items: "Claude Code, Claude, Cursor, Prompt Engineering, Workflow Automation" },
  { label: "Tools", items: "Excel (INDEX/MATCH, SUMIFS, NPV), Shopify, Linux" },
  { label: "Business", items: "Customer Discovery, Lean Startup Iteration, Investor Pitching, Partner Outreach" },
  { label: "Teaching", items: "Group and One-on-One Instruction, Lesson Planning, Training New Coaches" },
  { label: "Languages", items: "English, Gujarati, Spanish" },
];

export const education = [
  {
    school: "The Ohio State University, Fisher College of Business",
    degree: "B.S. in Business Administration",
    note: "Entered with sophomore standing via 40+ AP credit hours",
    dates: "Expected May 2029",
    location: "Columbus, OH",
  },
  {
    school: "Naperville North High School",
    degree: "High School Diploma",
    note: "ACT 36 · National Merit Commended Scholar · AP Scholar",
    dates: "May 2026",
    location: "Naperville, IL",
  },
];

/* ─────────────────────────────── About ─────────────────────────────── */

export const about = {
  story: [
    "I grew up in Naperville, Illinois, and I'm now a business student at Ohio State's Fisher College of Business.",
    "Chess has been the constant. I've studied it for more than ten years and played 70+ rated tournaments, each a multi-day event with 4–5 hour classical games. I'm a US Chess Expert (peak 2075, August 2026), one class below National Master, and in February 2026 I won the individual gold medal on Board 1 at the IHSA State Finals with a perfect 7/7.",
    "I've also spent a lot of time teaching it: 1,000+ students at Elite Chess, from first-time beginners to tournament players. As captain at Naperville North, I helped grow the team from 20 to 30 regular players.",
    "In high school I co-founded Roam Travel, a travel accessory startup that sold 250+ units. Now I'm looking for problems where business, software, and AI meet.",
  ],
  interests: [
    {
      name: "Chess",
      line: "US Chess Expert (peak 2075). Online peaks: 2661 bullet on Lichess, and 2605 bullet and 2548 blitz on Chess.com.",
    },
    {
      name: "Poker",
      line: "Chess with hidden information and more luck. A good decision can still lose a hand, which is a useful thing to make peace with.",
    },
    { name: "Logic puzzles", line: "The kind with one right answer. The knight's tour became a project." },
    { name: "Languages", line: "English, Gujarati, and Spanish." },
  ],
  gaps: ["A fuller photo, if you want one (swap public/me.jpg)."],
};

/** From one of my Lichess bullet games (August 2023), lichess.org/ab25lFak. White mates in 2.
 *  Checked with python-chess: Qg8+ is the only first move that forces mate in 2, and there's no mate in 1. */
export const puzzle = {
  fen: "r1r4k/p3R1bp/3pQ1pN/2p2n2/1p6/7P/P1P2P2/1n4K1 w - - 6 33",
  // Alternating moves: White, Black reply, White.
  solution: ["e6g8", "c8g8", "h6f7"],
  sanLine: "33. Qg8+!! Rxg8 34. Nf7#",
  title: "White to play, mate in 2",
  source: "From one of my own Lichess bullet games, August 2023. I'm White, with 7 seconds left on my clock.",
  hint: "The king is boxed in by its own pieces. Make it worse.",
};

/* ─────────────────────────────── Skill tree ─────────────────────────────── */

export type Piece = "king" | "queen" | "rook" | "bishop" | "knight";
export type Proof = { label: string; href: string };
export type Skill = {
  id: string;
  name: string;
  line: string;
  /** Proof from jobs or roles. Projects add themselves through their `rewards`. */
  proof?: Proof[];
};
export type Branch = { id: string; name: string; piece: Piece; pieceNote: string; skills: Skill[] };

const job = (label: string): Proof => ({ label, href: "/record/#experience" });

export const branches: Branch[] = [
  {
    id: "business",
    name: "Business",
    piece: "king",
    pieceNote: "The king: everything else exists to protect it.",
    skills: [
      { id: "startups", name: "Startups", line: "Taking a product from prototype to paying customers." },
      { id: "pitching", name: "Pitching", line: "Selling an idea to judges, investors, and customers." },
      {
        id: "discovery",
        name: "Product discovery",
        line: "Interviews and research that decide what gets built.",
        proof: [job("BDAA")],
      },
      {
        id: "teaching",
        name: "Teaching",
        line: "Explaining hard things simply, 1,000+ students in.",
        proof: [job("Elite Chess")],
      },
    ],
  },
  {
    id: "finance",
    name: "Finance",
    piece: "queen",
    pieceNote: "The queen: the most valuable piece on the board.",
    skills: [
      { id: "equity-research", name: "Equity research", line: "A thesis built from filings, earnings, and industry data." },
      { id: "valuation", name: "Valuation", line: "Multiples, price targets, and exit criteria." },
      { id: "startup-finance", name: "Startup finance", line: "Owning a small company's money as CFO." },
      { id: "modeling", name: "Financial modeling", line: "Three-statement and DCF models in Excel." },
    ],
  },
  {
    id: "analytics",
    name: "Analytics",
    piece: "bishop",
    pieceNote: "The bishop: sees the whole diagonal at once.",
    skills: [
      { id: "excel", name: "Excel", line: "Lookups, pivots, and models that other people can use." },
      { id: "sql", name: "SQL", line: "Asking questions of real databases." },
      { id: "dataviz", name: "Data visualization", line: "Charts and dashboards that make the point fast." },
      { id: "statistics", name: "Statistics", line: "Knowing when a pattern is real." },
    ],
  },
  {
    id: "software",
    name: "Software",
    piece: "rook",
    pieceNote: "The rook: straight lines and solid structure.",
    skills: [
      { id: "web", name: "Web development", line: "Next.js, React, TypeScript, and Tailwind." },
      { id: "shipping", name: "Shipping", line: "Git, Vercel, and getting real things live." },
      { id: "algorithms", name: "Algorithms", line: "Search, heuristics, and how fast they run." },
      { id: "python", name: "Python", line: "Scripts, data work, and the language most ML runs on." },
    ],
  },
  {
    id: "ai",
    name: "ML & AI",
    piece: "knight",
    pieceNote: "The knight: the only piece that jumps.",
    skills: [
      { id: "ai-dev", name: "AI-assisted dev", line: "Building with Claude Code and Cursor as pair programmers." },
      { id: "automation", name: "Automation", line: "Workflows that run themselves." },
      { id: "llm-apps", name: "LLM apps", line: "Products built on model APIs, with real evaluation." },
      { id: "ml", name: "Machine learning", line: "Models trained, tested, and explained." },
    ],
  },
];

/** Projects that are underway or not started. They show in the quest log but have no page yet. */
export type UpcomingQuest = {
  title: string;
  branch: string;
  state: "training" | "locked";
  dek: string;
  rewards: string[];
};

export const upcoming: UpcomingQuest[] = [
  { title: "???", branch: "finance", state: "locked", dek: "Locked. Coming soon.", rewards: [] },
  { title: "???", branch: "ai", state: "locked", dek: "Locked. Coming soon.", rewards: [] },
];

export type SkillState = "unlocked" | "training" | "locked";

export function skillProof(skill: Skill): Proof[] {
  const fromProjects = cases
    .filter((c) => c.rewards.includes(skill.id))
    .map((c) => ({ label: c.title, href: `/projects/${c.slug}/` }));
  return [...fromProjects, ...(skill.proof ?? [])];
}

export function skillState(skill: Skill): SkillState {
  if (skillProof(skill).length > 0) return "unlocked";
  if (upcoming.some((q) => q.state === "training" && q.rewards.includes(skill.id))) return "training";
  return "locked";
}

export const allSkills = branches.flatMap((b) => b.skills);
export const skillName = (id: string) => allSkills.find((s) => s.id === id)?.name ?? id;
export const branchName = (id: string) => branches.find((b) => b.id === id)?.name ?? id;
