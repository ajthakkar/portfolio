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
  lookingFor: "Looking for Summer 2027 internships in data, software and AI, finance, and consulting.",
  /** The general resume; each /for/ page links its own tailored version instead. */
  resume: "/resume/Aayush-Thakkar-Resume.pdf",
  links: [
    { label: "Resume", href: "/resume/Aayush-Thakkar-Resume.pdf" },
    { label: "GitHub", href: "https://github.com/ajthakkar" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/aayush--thakkar" },
    { label: "Email", href: "mailto:thakkar.186@osu.edu" },
  ],
  /** Player card "class" line. */
  playerClass: "Business Admin · Ohio State · 4.0 GPA",
  chess: {
    /** Usernames and US Chess ID live in lib/chess-accounts.json (the ratings script reads them too). */
    lichess: chessAccounts.lichess,
    chesscom: chessAccounts.chesscom,
    uscfId: chessAccounts.uscfId,
  },
  gaps: ["Check the 'Looking for' line under your name: which roles, and which summer."] as string[],
};

/** "Play me" links: open a challenge on each site. */
export const playLinks = [
  { site: "Chess.com", href: `https://www.chess.com/play/online/new?opponent=${chessAccounts.chesscom}` },
  { site: "Lichess", href: `https://lichess.org/?user=${chessAccounts.lichess}#friend` },
];

/** The scrolling strip under the home page hero. */
export const highlights = [
  "4.0 GPA · Ohio State Fisher",
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
    "Building out my Constellation Energy model as the stock moves, and picking what to build next",
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

export type Photo = { src: string; alt: string; caption: string; credit?: string; width: number; height: number };
export type PressItem = { outlet: string; title: string; href: string; date: string };

export type Case = {
  slug: string;
  /** Plain label shown on cards, e.g. "Machine learning". */
  area: string;
  /** Featured projects lead the home page; the rest are listed compactly under them. */
  featured?: boolean;
  title: string;
  /** The 30-second version: the question, what I did, what happened. */
  tldr: [string, string, string];
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
  demo?: "knights-tour" | "chess-insights" | "plays-like-me";
  /** Live version of the project, shown as the main button on its page. */
  live?: { label: string; href: string };
  photos?: Photo[];
  press?: PressItem[];
};

export const cases: Case[] = [
  {
    slug: "plays-like-me",
    area: "Machine learning",
    featured: true,
    tldr: [
      "Can a neural network learn how I play chess, and not just how anyone at my rating plays?",
      "I trained a PyTorch network on 1 million positions from my games, used my opponents as the control, and tested it on games it never saw.",
      "It predicts 39.8% of my moves, beats the control on my moves, and can tell which side was me in 81% of games.",
    ],
    title: "Plays Like Me",
    rewards: ["ml", "python", "web"],
    dek: "A neural network trained on 442,805 of my chess moves to play like me, tested against a control to show it learned me and not just my rating. You can play it in the browser.",
    period: "Nov 2026",
    role: "Solo project",
    tools: ["Python", "PyTorch", "python-chess", "NumPy", "TypeScript"],
    result: "Predicts 40% of my moves · spots me in 81% of games",
    stats: [
      { value: "39.8%", label: "of my moves predicted exactly, in games it never saw" },
      { value: "81%", label: "of unseen games where it can tell which side was me" },
      { value: "7.5% → 1.2%", label: "calibration error after temperature scaling" },
      { value: "0.9 MB", label: "network that runs in your browser, no ML library" },
    ],
    demo: "plays-like-me",
    position: [
      "Most of my chess is online, mostly bullet, and the Play me button only works when I'm on. I wanted something people could play when I'm not: a model that makes the moves I would.",
      "It also had to hold up as machine learning, not just a demo. So the question wasn't only whether it could predict my moves, but whether it learned me or just how anyone at my rating plays.",
    ],
    plan: [
      "Turn every rated game since 2017 into training examples: 1,080,539 positions, with my moves and my opponents' moves kept apart.",
      "Use my opponents as the control. They're players at my rating who aren't me, so a model of them shows what generic looks like.",
      "Train on games through May 2026 and test on my games since starting college, August to November, which no model sees.",
      "Run the network in the browser so anyone can play it.",
    ],
    moves: [
      {
        glyph: "!!",
        title: "Build the control first",
        body: "A model trained only on my opponents predicts 34.9% of my moves. Without that number, 40% would mean nothing. With it, the gap is the part that's me.",
      },
      {
        glyph: "!",
        title: "Test on the future",
        body: "A random split leaks: the same opening on the same night ends up in both training and test. Testing on later games is the honest version of asking whether it works on games it hasn't seen.",
      },
      {
        glyph: "!",
        title: "One network, one switch",
        body: "My first version used separate models: a generic one, fine-tuned on my moves (38.1%). The second trains one network on everyone, with an input that says whether the move is mine (39.8%). It learns chess from twice the data, and flipping the switch makes it play like a typical player instead.",
      },
      {
        glyph: "!?",
        title: "Make its confidence honest",
        body: "The raw network was overconfident. Temperature scaling, one number fitted on validation games, cut calibration error from 7.5% to 1.2%, so the percentages on this page mean what they say.",
      },
      {
        glyph: "!",
        title: "Check the browser against PyTorch",
        body: "The site runs the network in 170 lines of TypeScript. A test compares it with PyTorch on 79 real positions: the same top move every time, with probabilities within 0.00001.",
      },
    ],
    outcome: [
      "On 78,440 of my moves from games it never saw, it picks my exact move 39.8% of the time and has it in its top three 64.6% of the time. A random legal move gets 7.2%.",
      "It learned me, not my rating. Set to me, it wins on my moves (39.8% vs 38.6%); set to typical, it wins on my opponents' moves (38.0% vs 36.9%).",
      "Given an unseen game, it can tell which side was me 81% of the time, even against higher-rated opponents. Most of that comes from my openings: set to me, it opens 1.d4 81% of the time, exactly as often as I do.",
      "Where it differs from a typical player at my level, it pushes pawns and repositions more, and captures and checks less.",
    ],
    postGame: [
      "The most important model here is the one I'm not featuring. The generic control is what turns 40% accuracy into evidence that it learned me.",
      "It plays on instinct with no search, so it can hang a piece. Next, I'd add a small search on top that keeps my style but stops the blunders.",
    ],
    links: [{ label: "Code and full write-up on GitHub", href: "https://github.com/ajthakkar/plays-like-me" }],
    gaps: ["Read the reflection (The position, Key moves, Post-game) and rewrite anything that doesn't sound like you."],
  },
  {
    slug: "book-quiz",
    area: "LLM app",
    featured: true,
    tldr: [
      "Can AI write reading quizzes that check whether a student read the book, and not just a summary of it?",
      "I rebuilt my first version so the model works from the chapter itself and has to quote its evidence, and wrote a checker that throws out any question whose quote isn't in the book.",
      "A free quiz app for five classic books, with spoiler control, three difficulty levels, and practice that adapts to a student's weak skills.",
    ],
    title: "Book Quiz Tool",
    rewards: ["llm-apps", "web", "shipping"],
    dek: "Reading quizzes written from a book's full text. Every answer has to quote the page it came from, and a checker throws out any question whose quote isn't really there.",
    period: "Jun 2026, rebuilt Nov 2026",
    role: "Solo project",
    tools: ["TypeScript", "Next.js", "Claude API", "Zod", "Node test runner"],
    result: "73 of 73 questions backed by checked passages",
    stats: [
      { value: "73/73", label: "demo questions whose evidence was found word for word in the book" },
      { value: "5", label: "public-domain books, from grade 3 to grade 12" },
      { value: "7", label: "reading skills tracked, with quizzes weighted toward the weakest" },
      { value: "14", label: "tests on the checker, the reading-level math, and the picker" },
    ],
    live: { label: "Try the quiz", href: "https://ajthakkar.github.io/Book-Quiz-Tool/" },
    position: [
      "In June I built a tool to write comprehension questions for any book, and it didn't work well. The AI only got the title, so it repeated what reviews and other quizzes online say about the book, and its questions piled up on the same famous scenes. Someone who only read a summary could pass.",
      "Version 2 starts from the text itself: public-domain books from Project Gutenberg, where the full text is free to use.",
    ],
    plan: [
      "Give the model the actual chapter, and make it copy the passage that proves each answer.",
      "Check every passage against the book in code, so a made-up quote can't get through.",
      "Let a student say how far they've read and how hard they want it, and track which reading skills they miss.",
    ],
    moves: [
      {
        glyph: "!!",
        title: "Make it show its work, then check it",
        body: "Every question comes with one or two passages copied from the chapter. The checker searches the book for each one, and if it isn't there, in that chapter, the question is thrown out. That's the difference between trusting the model and verifying it.",
      },
      {
        glyph: "!",
        title: "Let the text decide the order",
        body: "For put-these-events-in-order questions, the right answer comes from where each passage sits in the book, not from what the model says the order is.",
      },
      {
        glyph: "!",
        title: "Catch test-taking tricks",
        body: "Students learn that the longest answer is usually the right one. The checker rejects any question where it is, and it caught 5 of my own 73 questions on the first pass.",
      },
      {
        glyph: "!?",
        title: "Reading level isn't maturity",
        body: "Flesch–Kincaid rates The Great Gatsby (grade 6.1) easier than The Wizard of Oz (6.7). So each book shows both its measured reading level and the grades it's usually taught in.",
      },
      {
        glyph: "?",
        title: "The evaluation isn't run yet",
        body: "The test that compares versions, whether a model can answer a question without the book, is written but needs an API key. The demo questions were written with Claude in Claude Code under the same rules and passed the same checker, and the README says so.",
      },
    ],
    outcome: [
      "A free app with no server: pick a grade and a book, say how far you've read, and get questions only on those chapters. After each answer it shows the passage the answer comes from.",
      "73 questions across five books, grades 3 to 12, all passing the checker, and spread through each book instead of piled on the famous scenes.",
      "Seven skills tracked over time, from key details to themes. A mixed quiz leans toward the ones a student misses.",
    ],
    postGame: [
      "Next is running the evaluation. If a model can answer a question without the book, a student who skipped it probably can too, so that number for v1 and v2 will show whether the rebuild worked.",
    ],
    links: [{ label: "Code and write-up on GitHub", href: "https://github.com/ajthakkar/Book-Quiz-Tool" }],
    gaps: [
      "Run the evaluation: set an Anthropic API key (or `ant auth login`), then `npm run evaluate -- --baseline` in Book-Quiz-Tool. It should cost a few dollars. The result goes in Result and Post-game.",
    ],
  },
  {
    slug: "chess-analytics",
    area: "Data analysis",
    featured: true,
    tldr: [
      "Do I really tilt after a loss, or play worse late at night?",
      "I put 14,547 games into one SQL table, fitted my own baseline, and used error bars that treat each night as one unit.",
      "No tilt and no fatigue. I quit after losses more often than after wins, which is how I avoid tilting.",
    ],
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
    slug: "constellation-energy",
    area: "Equity research",
    featured: true,
    tldr: [
      "Is the largest US nuclear operator undervalued, now that AI needs so much power? And when the stock fell after my pitch, was I wrong?",
      "I pitched it long in September, then built an Excel model from SEC filings: a 10-year DCF, the pitch's P/E target made explicit, comparable companies, and sensitivity tables.",
      "Earnings beat and guidance rose twice, but the stock fell 17% as the whole sector repriced. With Nvidia down 42% and the AI spending behind the thesis in doubt, my call now is to exit.",
    ],
    title: "Constellation Energy: Pitch and Model",
    rewards: ["equity-research", "valuation", "modeling", "excel"],
    dek: "A long pitch on the largest US nuclear operator, then an Excel model built from SEC filings to test it, including why the stock fell after earnings beat.",
    period: "Sep – Nov 2026",
    role: "Solo project",
    tools: ["Excel", "DCF", "Comparable companies", "SEC filings (XBRL)", "Python"],
    result: "Earnings up 5%, multiple down 21% · now an exit",
    stats: [
      { value: "23.8x → 18.8x", label: "P/E on 2026 earnings, pitch to now, while guidance rose 5.4%" },
      { value: "$276", label: "base-case 12-month target vs. a $237 price (19x 2027 EPS)" },
      { value: "15–17.5%", label: "yearly EPS growth today's price needs, vs. management's 20% target" },
      { value: "96", label: "typed-in numbers in the model, each with its source" },
    ],
    live: { label: "Download the model (Excel)", href: "/projects/constellation/CEG-valuation.xlsx" },
    position: [
      "The main constraint on AI has shifted from chips and memory toward power and cooling. US data centers used 4.4% of national electricity in 2023 and could reach 6.7–12% by 2028, and the IEA expects global data center demand to more than double by 2030.",
      "Constellation Energy (NASDAQ: CEG) is the largest nuclear operator in the US, with about 55 GW of capacity after acquiring Calpine in January 2026. In September I pitched it as a long at $285.93 with a $355 target. Ten weeks later it was at $237, and I wanted to know whether the thesis was wrong or just the price.",
    ],
    plan: [
      "The thesis: new reactors are slow and expensive (Vogtle 3 and 4 came online seven years late at $35 billion), hyperscalers are signing 20-year deals, and as an independent power producer Constellation captures rising power prices directly.",
      "The model: pull every number from SEC filings and earnings releases, value the company on management's adjusted earnings, and show how much each assumption matters.",
      "The check: split the price move since the pitch into what happened to earnings and what happened to the multiple, and test the pitch's exit triggers against what the company has reported since.",
    ],
    moves: [
      {
        glyph: "!!",
        title: "Split the price move in two",
        body: "The stock fell 17.0%. Guidance for 2026 earnings rose 5.4% and the P/E on those earnings fell 21.2%; multiplied together, that's exactly the price change. The business beat the pitch. Investors just paid less for each dollar of earnings, and Vistra and NRG fell about 21% too.",
      },
      {
        glyph: "!",
        title: "Value adjusted EPS, and say why",
        body: "GAAP results swing with hedge gains and losses (Q2 GAAP EPS was $1.42 against $2.55 adjusted), and reported operating cash flow has even been negative some years. So the DCF starts from management's adjusted EPS and turns it into cash for shareholders with an explicit, tested assumption.",
      },
      {
        glyph: "!",
        title: "Ask what the price already assumes",
        body: "A break-even table shows that at an 11.2% cost of equity, today's price holds up only if earnings grow about 15–17.5% a year through 2029. Management targets 20%, so the price assumes they fall short, but not by much.",
      },
      {
        glyph: "!?",
        title: "Comps that disagree",
        body: "On trailing GAAP numbers Constellation trades at 14.1x EV/EBITDA against a 9.5x median for Vistra, NRG, and Talen, a 49% premium. The model shows the premium instead of hiding it: that premium is the bet on long-term contracted nuclear output.",
      },
      {
        glyph: "!",
        title: "Define the exit before entering",
        body: "The pitch said to exit if a major power contract were canceled, the Crane restart slipped past 2028, or hyperscaler AI spending stalled. The first two haven't happened. The third isn't in the hyperscalers' filings yet, but since the pitch Nvidia is down 42% and chip stocks 29%: the market is pricing it in.",
      },
    ],
    outcome: [
      "Pitched long at the Sep 10, 2026 close of $285.93 with a 12-month target of $355. By Nov 20 the total return was −16.9%, against −8.7% for the S&P 500.",
      "Not because the business missed: Q3 adjusted EPS was $5.06 against $3.04 a year earlier, and 2026 guidance rose to $12.50–$12.80 from $11.50–$12.50 at the time of the pitch.",
      "The model's base case (15% growth, 11.2% cost of equity) puts the DCF value at $234 and the 12-month target at $276. At management's 20% growth, the DCF value is $345; in the bear case, $138.",
      "My call as of Nov 20, 2026: exit. The company is still executing, but the reason to own it was AI-driven power demand, and with the tech selloff and policy uncertainty after the November elections, that's the part in question.",
    ],
    postGame: [
      "I wouldn't own it anymore. My exit rules were tied to what the thesis needed: new deals, power prices, and policy. The AI side of that is shaky right now, and I'd rather get out on the risk than wait for it to show up in a filing.",
      "The pitch gave one target, and it rested on the multiple staying near 24x. Next time I'd pitch a range and say what has to be true for each end of it.",
    ],
    links: [
      { label: "The model on GitHub, with the method", href: "https://github.com/ajthakkar/constellation-model" },
      { label: "The original pitch (PDF)", href: "/projects/constellation/Constellation-Energy-pitch.pdf" },
    ],
    note: "A student stock pitch and model, not investment advice.",
    gaps: ["Check that the exit reasoning in Result and Post-game says it the way you would."],
  },
  {
    slug: "hackohio-outage-model",
    area: "Predictive modeling",
    featured: true,
    tldr: [
      "How likely is a storm to cut a customer's power, and for how long?",
      "We tested the app's risk score on storms it hadn't seen, then replaced it with a simple model measured from real storm damage.",
      "On the worst storm, ranking accuracy went from 0.39, worse than a coin flip, to 0.72.",
    ],
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
    area: "Startup",
    featured: true,
    tldr: [
      "Could three high school students turn a luggage strap into a real business?",
      "We sold handmade straps before paying for manufacturing, changed the product based on feedback, and pitched at 20+ competitions.",
      "250+ units sold, $10,000+ in pitch prizes, a top 5 national finish, and a patent-pending design.",
    ],
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
      "Roam Travel started in INCubatoredu, the year-long startup class in my high school's district. The problem: travelers juggling a backpack, a duffel, and a carry-on through an airport. As I told NCTV17 at nationals, \"You can carry multiple bags just with one suitcase, with one handle.\"",
      "The product is the Roam Link, an adjustable strap that holds bags on top of a carry-on and rolls up out of the way when it's not in use. I was CTO and CFO, so I owned both the product side and the money side.",
      "I stepped away in August 2025. The company is still running.",
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
      "Won $10,000+ across 20+ pitch competitions, including $3,000 for 1st place out of 60 teams at District 203's INCubatoredu Final Pitch Night.",
      "One of five national finalists at the 2025 INCubatoredu National Pitch in Chicago, and the first team from District 203 to get there.",
    ],
    postGame: [],
    photos: [
      {
        src: "/projects/roam/national-pitch-2025.jpg",
        alt: "About twenty students from the five finalist teams waving on stage in front of a National Pitch 2025 screen. The Roam Travel team is on the left in black Roam shirts.",
        caption: "All five finalist teams on stage at the 2025 INCubatoredu National Pitch in Chicago. Roam Travel is on the left, in black.",
        credit: "Photo: Uncharted Learning",
        width: 1600,
        height: 813,
      },
      {
        src: "/projects/roam/roam-link.jpg",
        alt: "A black Roam Link strap holding a backpack on top of a carry-on suitcase, under a palm tree.",
        caption: "The Roam Link holding a backpack on a carry-on.",
        credit: "Photo: Roam Travel",
        width: 900,
        height: 900,
      },
      {
        src: "/projects/roam/roam-link-rollup.jpg",
        alt: "The Roam Link rolled up and strapped to a suitcase handle, labeled roll-up storage.",
        caption: "When it's not in use, the strap rolls up and stays on the handle.",
        credit: "Photo: Roam Travel",
        width: 900,
        height: 1125,
      },
    ],
    press: [
      {
        outlet: "NCTV17",
        date: "Jul 15, 2025",
        title: "Naperville student entrepreneurs compete, showcase product in National Pitch Night",
        href: "https://www.nctv17.org/news/naperville-student-entrepreneurs-showcase-travel-device-during-national-pitch-night/",
      },
      {
        outlet: "Chicago Tribune · Naperville Sun",
        date: "Jul 4, 2025",
        title: "Naperville-area students bringing their new product to national pitch competition",
        href: "https://www.chicagotribune.com/2025/07/04/naperville-students-strap-luggage-product-incubatoredu/",
      },
      {
        outlet: "Uncharted Learning",
        date: "Jul 15, 2025",
        title: "INCubatoredu 2025 National Student Pitch winners announced",
        href: "https://www.unchartedlearning.org/blog/incubatoredu-2025-national-student-pitch-winners-announced",
      },
    ],
    gaps: [
      "Pick one decision you'd grade '?' (a mistake) and say what you'd do instead. That goes in 'Post-game'.",
      "The Tribune story (Jul 4, 2025) names the founders as Bremen, Noah, and Alex Liu, and doesn't mention you. NCTV17 (Jul 15) names and quotes you. Linking both is fine as company coverage, but be ready to explain when you joined the team.",
      "Photos from your LinkedIn (awards, pitches) can go here too. The built-in browser isn't signed in to LinkedIn, so send them or sign in there.",
    ],
  },
  {
    slug: "library-onboarding",
    area: "Product · client project",
    tldr: [
      "How do you get first-year students to find out what the library offers before they need it?",
      "Our BDAA team is working with Ohio State's University Libraries. We prototyped a 15-minute module built to drop into the GE Launch Seminar that almost every new student takes.",
      "A working prototype, live, with a before-and-after check of which resources students know about.",
    ],
    title: "Library Onboarding Module",
    rewards: ["discovery", "web", "shipping"],
    dek: "A 15-minute module that introduces first-year Ohio State students to University Libraries, prototyped for BDAA's product discovery project with the Libraries.",
    period: "Fall 2026",
    role: "Team member",
    team: "BDAA Product Development Track",
    tools: ["Stakeholder interviews", "HTML", "CSS", "JavaScript", "GitHub Pages"],
    result: "Working prototype, live on GitHub Pages",
    stats: [
      { value: "12", label: "library resources covered, each checked against library.osu.edu" },
      { value: "5", label: "lessons of two to three minutes, each with a quick check" },
      { value: "8", label: "question final check; a miss links back to its lesson" },
      { value: "0", label: "student data sent anywhere: progress stays in the browser" },
    ],
    live: { label: "Try the module", href: "https://ajthakkar.github.io/osu-library-onboarding/" },
    position: [
      "The Big Data & Analytics Association's Product Development Track is working with Ohio State's University Libraries on a product discovery question: how do incoming students learn about library resources, and why do so many find out late?",
      "I'm the team's main point of contact with the Libraries, and I organize our stakeholder interviews, from outreach and scheduling to follow-up.",
    ],
    plan: [
      "Meet students where they already are: the GE Launch Seminar, which nearly every new student takes.",
      "Keep it short enough to finish between classes: five lessons of two to three minutes each.",
      "Measure awareness, not just completion: ask what students have heard of before they start, and compare at the end.",
    ],
    moves: [
      {
        glyph: "!",
        title: "Build into a course students already take",
        body: "A separate orientation is easy to skip. A module sized for GE Launch reaches students in a class they're already in.",
      },
      {
        glyph: "!!",
        title: "A pre-check that doubles as data",
        body: "Before the first lesson, students mark which of 12 resources they've heard of. The last page compares that with what they've now seen: a simple before-and-after measure the Libraries could collect across sections.",
      },
      {
        glyph: "!",
        title: "Make a wrong answer useful",
        body: "Each missed question on the final check links back to the lesson that covers it, instead of just marking it wrong.",
      },
      {
        glyph: "!",
        title: "Keep content apart from code",
        body: "All lesson text, links, and quiz questions live in one file, so hours and services can be updated each semester without touching the layout.",
      },
      {
        glyph: "!?",
        title: "Look official, say it isn't",
        body: "It uses Ohio State's colors and type so it feels native, which is exactly why every page says it's a student prototype, not an official library page.",
      },
    ],
    outcome: [
      "A working prototype, live: five lessons, quick checks, an 8-question final check, a printable toolkit, and a resource hub with every resource on one page.",
      "Accessible by design: keyboard navigation, visible focus, screen-reader labels, and reduced-motion support.",
      "Ideas for the next version: embed it in Carmen for GE Launch sections, and send pre-check and quiz results to the Libraries so they can see awareness gaps across sections.",
    ],
    postGame: [],
    links: [{ label: "Code on GitHub", href: "https://github.com/ajthakkar/osu-library-onboarding" }],
    gaps: [
      "Who built the prototype: you, or the team together? The page says 'our team' for now.",
      "Where does the project stand: have the Libraries seen it, and what did interviews turn up? One line for 'Post-game'.",
    ],
  },
  {
    slug: "knights-tour",
    area: "Algorithms",
    tldr: [
      "How do you actually find a knight's tour, and how fast can it be done?",
      "I wrote three solvers in Python, proved them with tests, and benchmarked them on boards up to 40x40.",
      "Ordering the search with a rule from 1823 found all 64 tours on 8x8 with zero backtracks.",
    ],
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
    slug: "hack-for-the-world",
    area: "Game development",
    tldr: [
      "Can a game make an environmental message something you feel instead of read?",
      "Four of us built a first-person shooter in the browser in 12 hours with Three.js, starting from a requirements doc.",
      "1st place overall.",
    ],
    title: "Hack For The World",
    rewards: ["web"],
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
    area: "Web development",
    tldr: [
      "How do I show my work in a way that doesn't read like a resume?",
      "I designed it, built it in Next.js with Claude Code, and shipped a simple version first.",
      "Live on Vercel. Every push to main redeploys it.",
    ],
    title: "This site",
    rewards: ["web", "shipping", "ai-dev"],
    dek: "Designing and shipping a personal site with AI-assisted development.",
    period: "Nov 2026",
    role: "Designer & developer",
    tools: ["Next.js", "TypeScript", "Tailwind CSS", "Claude Code", "Vercel"],
    result: "Live on Vercel",
    stats: [
      { value: "3", label: "versions" },
      { value: "5", label: "short versions, one per kind of role" },
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
        body: "A title screen, a skill tree, and an XP bar give it a game feel. Chess stays in the details: piece icons, annotation marks, and a puzzle. Every heading still says plainly what it is.",
      },
      {
        glyph: "!",
        title: "One site, a short version for each role",
        body: "A data recruiter and a finance recruiter care about different projects. Pages like /for/data/ and /for/finance/ lead with the three most relevant projects in the same design, so I can link the right one in each application.",
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
  { label: "Languages", items: "Python, SQL, TypeScript, JavaScript, Java, HTML/CSS" },
  { label: "Data & ML", items: "pandas, NumPy, DuckDB, PyTorch, scikit-learn, statsmodels, matplotlib, pytest" },
  { label: "Web", items: "Next.js, React, Tailwind CSS, Three.js, Git, Vercel" },
  { label: "AI Tools", items: "Claude Code, Claude API, Cursor, Prompt Engineering, Workflow Automation" },
  { label: "Tools", items: "Excel (DCF, data tables, INDEX/MATCH, SUMIFS, NPV), Shopify, Linux" },
  { label: "Business", items: "Customer Discovery, Lean Startup Iteration, Investor Pitching, Partner Outreach" },
  { label: "Teaching", items: "Group and One-on-One Instruction, Lesson Planning, Training New Coaches" },
  { label: "Spoken", items: "English, Gujarati, Spanish" },
];

export const education = [
  {
    school: "The Ohio State University, Fisher College of Business",
    degree: "B.S. in Business Administration",
    note: "GPA 4.0/4.0 · Entered with sophomore standing via 40+ AP credit hours",
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
      { id: "modeling", name: "Financial modeling", line: "DCF, comparable companies, and sensitivity tables in Excel." },
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

export const upcoming: UpcomingQuest[] = [];

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
