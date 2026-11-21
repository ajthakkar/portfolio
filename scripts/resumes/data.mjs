/* Resume content, one version per role page. Edit here, then run: npm run resumes
   Shared pieces are defined once; each version picks and orders them. */

const SITE = "aayush-thakkar.vercel.app";

/** Contact line: [text, link]. Links are clickable in the PDF. */
export const contact = (slug) => {
  const site = slug === "general" ? SITE : `${SITE}/for/${slug}`;
  return [
    ["Columbus, OH"],
    ["630-210-1695", "tel:+16302101695"],
    ["thakkar.186@osu.edu", "mailto:thakkar.186@osu.edu"],
    ["linkedin.com/in/aayush--thakkar", "https://www.linkedin.com/in/aayush--thakkar"],
    ["github.com/ajthakkar", "https://github.com/ajthakkar"],
    [site, `https://${site}/`],
  ];
};

/** A project's page on the site, linked from its name in the PDF. */
const page = (slug) => `https://${SITE}/projects/${slug}/`;

const education = [
  {
    org: "The Ohio State University, Max M. Fisher College of Business",
    place: "Columbus, OH",
    title: "Bachelor of Science in Business Administration",
    date: "Expected May 2029",
    points: ["<b>GPA: 4.0/4.0</b> | Entered with sophomore standing via 40+ AP credit hours"],
  },
  {
    org: "Naperville North High School",
    place: "Naperville, IL",
    title: "High School Diploma",
    date: "May 2026",
    points: ["<b>ACT 36 (perfect composite)</b> | National Merit Commended Scholar | AP Scholar"],
  },
];

/* ── Projects ─────────────────────────────────────────────────────────────── */
const P = {
  playsLikeMe: (n = 3) => ({
    org: "Plays Like Me",
    href: page("plays-like-me"),
    place: "Python, PyTorch, TypeScript",
    title: "",
    date: "Nov 2026",
    points: [
      "Trained a residual convolutional network on 1.08M positions from my 13,879 rated online games to predict my moves, using my opponents' moves as a control",
      "Predicts 39.8% of my moves on games it never saw (64.6% in its top 3), beating the control, and identifies which side was me in 81% of unseen games",
      "Cut calibration error from 7.5% to 1.2% with temperature scaling; runs in the browser in ~170 lines of TypeScript, verified against PyTorch",
    ].slice(0, n),
  }),
  fairOdds: (n = 3) => ({
    org: "Fair Odds: Calibration Study of 22,625 Polymarket Markets",
    href: page("fair-odds"),
    place: "Python, pandas, NumPy",
    title: "",
    date: "Nov 2026",
    points: [
      "Tested whether market prices mean what they say: close to calibrated, but contracts priced 5–40% came true 3.0–3.7 points more often than priced in the final week",
      "Used event-clustered bootstrap intervals, calibration slopes, and a Brier decomposition; a correction fitted on 2024–25 data didn't beat 2026 prices",
      "Found snapshot timing that depended on the outcome in by-a-date markets; correcting it shrank the gap by about a quarter, and the result held",
    ].slice(0, n),
  }),
  bookQuiz: (n = 2) => ({
    org: "Chapter & Verse: Reading Quizzes Grounded in the Text",
    href: page("chapter-and-verse"),
    place: "TypeScript, Next.js, Claude API",
    title: "",
    date: "Jun 2026; rebuilt Nov 2026",
    points: [
      "Rebuilt an LLM quiz generator so the model works from the chapter text and must quote its evidence; a checker rejects any question whose quote isn't in the claimed chapter",
      "Added spoiler control, three difficulty levels, and per-skill tracking that weights each quiz toward a reader's weakest skills; 14 tests; live on GitHub Pages",
    ].slice(0, n),
  }),
  tilt: (n = 3) => ({
    org: "Do I Tilt? Analysis of 14,547 Online Chess Games",
    href: page("chess-analytics"),
    place: "SQL (DuckDB), Python, statsmodels",
    title: "",
    date: "Nov 2026",
    points: [
      "Built a SQL pipeline across two sites' archives; rebuilt pre-game ratings after finding one site stores post-game values",
      "Replaced the Elo formula with a fitted baseline after calibration showed it overrated rating gaps; used session-clustered errors and a multiple-testing correction across 30 openings",
      "Found no tilt after losses (−0.6 points per 100 games; 95% CI −2.4 to +1.2) but a higher chance of stopping after a loss (23% vs. 15%)",
    ].slice(0, n),
  }),
  outage: (n = 1) => ({
    org: "Storm Outage Model, HackOHI/O 2026 (team of 4, AEP challenge)",
    href: page("hackohio-outage-model"),
    place: "Python, scikit-learn",
    title: "",
    date: "Oct 2026",
    points: [
      "Our team replaced a hand-weighted outage risk score with a physics-based model fitted on 11 real storms; held-out AUC on the worst storm rose from 0.39 to 0.72",
      "Tested every option on storms the model hadn't seen; the simple model beat logistic regression (0.68 vs. 0.60 AUC on big storms) and gradient boosting",
    ].slice(0, n),
  }),
  ceg: (n = 3) => ({
    org: "Constellation Energy (CEG): Long Pitch and Valuation Model",
    href: page("constellation-energy"),
    place: "Excel, SEC filings",
    title: "",
    date: "Sep – Nov 2026",
    points: [
      "Pitched a long at $285.93 with a $355 target on AI-driven power demand, scarce new nuclear capacity, and a forward P/E below its own history",
      "Built an Excel model from SEC filings: 10-year equity DCF on adjusted EPS, P/E target, bear/base/bull scenarios, comps vs. Vistra, NRG, and Talen, and five sensitivity data tables",
      "After a 17% drop, showed it came entirely from the P/E falling (23.8x to 18.8x) while EPS guidance rose 5.4%; with AI spending and policy risk rising, recommended exiting",
    ].slice(0, n),
  }),
  knights: (n = 2) => ({
    org: "Knight's Tour Solvers",
    href: page("knights-tour"),
    place: "Python, pytest",
    title: "",
    date: "Nov 2026",
    points: [
      "Compared brute-force backtracking with Warnsdorff's heuristic; heuristic-ordered search found all 64 tours on 8x8 with zero backtracks, where brute force found none in 1M steps",
      "Benchmarked boards up to 40x40 (a 65,536-square tour in 93 ms); tests prove the impossible cases",
    ].slice(0, n),
  }),
  library: (n = 2) => ({
    org: "Library Onboarding Module, BDAA x OSU University Libraries (team)",
    href: page("library-onboarding"),
    place: "Stakeholder interviews, prototyping",
    title: "",
    date: "Fall 2026",
    points: [
      "Our team prototyped a 15-minute onboarding module built to drop into the GE Launch Seminar most first-years take, with a before-and-after check of which resources students know",
      "Live prototype with five short lessons, quizzes that link misses back to the lesson, and a resource hub; accessible by keyboard and screen reader",
    ].slice(0, n),
  }),
};

/* ── Experience ──────────────────────────────────────────────────────────── */
const E = {
  bdaa: (n = 2) => ({
    org: "Big Data & Analytics Association (BDAA)",
    place: "Columbus, OH",
    title: "Product Development Track Member",
    date: "Fall 2026 – Present",
    points: [
      "Serve as the team's main point of contact with OSU University Libraries on a product discovery project about how incoming students learn about library resources",
      "Organize stakeholder interviews end to end, from outreach and scheduling to follow-up",
    ].slice(0, n),
  }),
  roam: (order) => {
    const all = {
      founded: "Co-founded a 3-person startup; took the Roam Link luggage strap from prototype to a patent-pending product",
      sales: "Sold 250+ units and earned $2,000+ in profit, starting with 80+ handmade units to validate demand before manufacturing",
      pitch: "Pitched to investor judges at 20+ competitions, winning $10,000+ in prize money; national top 5 at INCubatoredu",
      lean: "Ran build-measure-learn cycles, turning customer feedback into product changes",
      challenge: "Created the Roam Challenge, trading free units for travelers' destination photos to source ad content",
      shopify: "Helped launch the Shopify store and grow a 1,000+ person customer sign-up list",
      press: "Earned company coverage in the Chicago Tribune and on NCTV17",
    };
    return {
      org: "Roam Travel",
      place: "Naperville, IL",
      title: "Co-Founder, CTO & CFO",
      date: "Aug 2024 – Aug 2025",
      points: order.map((k) => all[k]),
    };
  },
  chess: (n = 2) => ({
    org: "Elite Chess",
    place: "Naperville, IL",
    title: "Chess Instructor",
    date: "Sep 2023 – Oct 2024; Oct 2025 – Aug 2026",
    points: [
      "Taught 1,000+ students in group classes and private lessons, from first-time beginners to tournament players",
      "Raised students' ratings by about 100 points per year on average, and up to 300 points with focused coaching",
      "Helped shape teaching methods and student-retention ideas with the owner and manager as the company grew",
    ].slice(0, n),
  }),
};

/* ── Honors and leadership ───────────────────────────────────────────────── */
const H = {
  hftw: ["<b>1st Place Overall, Hack For The World:</b> 12-hour sustainability hackathon", "Feb 2026"],
  natl: ["<b>National Finalist (Top 5),</b> INCubatoredu National Pitch Competition, Chicago", "Jul 2025"],
  d203: ["<b>1st of 60 teams,</b> District 203 INCubatoredu Final Pitch Night ($3,000 prize)", "2025"],
  deca: ["<b>6th in Illinois,</b> DECA Entrepreneurship Series", "2024"],
  ihsa: ["<b>Individual Gold Medal, Board 1, IHSA State Chess Finals:</b> perfect 7/7 score", "Feb 2026"],
  uscf: ["<b>US Chess Expert (peak 2075),</b> one class below National Master; 2600+ in online bullet, top 1%", ""],
};
const L = {
  club: ["<b>Ohio State Chess Club</b> – Treasurer, Executive Board; <b>AI Club</b> – Member", "Fall 2026 – Present"],
  captain: ["<b>Naperville North Chess Team</b> – Captain; grew membership 50% and raised average rating ~100 points", "2022 – 2026"],
};

const interests = "Chess, poker, logic puzzles, GeoGuessr, working out";
const spoken = "English, Gujarati, Spanish";

/* ── The versions: one general, one per role page ───────────────────────── */
export const resumes = [
  {
    slug: "general",
    file: "Aayush-Thakkar-Resume.pdf",
    sections: [
      { title: "Education", entries: education },
      { title: "Projects", entries: [P.playsLikeMe(2), P.fairOdds(1), P.ceg(3)] },
      { title: "Experience", entries: [E.roam(["founded", "sales", "pitch"]), E.chess(2), E.bdaa(1)] },
      { title: "Honors & Leadership", list: [H.hftw, H.natl, H.ihsa, H.uscf, L.club] },
    ],
    skills: [
      ["Technical", "Python, SQL, TypeScript, Java, PyTorch, pandas, Excel (DCF, data tables), Git"],
      ["AI", "Claude Code, Claude API, Cursor, prompt engineering, AI-assisted development and workflow automation"],
      ["Spoken languages & interests", `${spoken} | ${interests}`],
    ],
  },
  {
    slug: "software",
    sections: [
      { title: "Education", entries: education },
      { title: "Projects", entries: [P.playsLikeMe(3), P.bookQuiz(2), P.outage(2)] },
      { title: "Experience", entries: [E.bdaa(1), E.roam(["founded", "sales", "shopify"]), E.chess(1)] },
      { title: "Honors & Leadership", list: [H.hftw, H.ihsa, H.uscf, L.club] },
    ],
    skills: [
      ["Languages", "Python, TypeScript, SQL, Java, HTML/CSS"],
      ["ML & data", "PyTorch, NumPy, pandas, scikit-learn, DuckDB, matplotlib, pytest"],
      ["Web & tools", "Next.js, React, Tailwind CSS, Three.js, Git, Vercel, Linux, Claude Code, Claude API"],
      ["Spoken languages & interests", `${spoken} | ${interests}`],
    ],
  },
  {
    slug: "data",
    sections: [
      { title: "Education", entries: education },
      { title: "Projects", entries: [P.fairOdds(3), P.tilt(3), P.outage(1)] },
      { title: "Experience", entries: [E.bdaa(2), E.roam(["founded", "sales", "lean"]), E.chess(1)] },
      { title: "Honors & Leadership", list: [H.hftw, H.uscf, L.club] },
    ],
    skills: [
      ["Data", "SQL (DuckDB), Python (pandas, statsmodels, scikit-learn, matplotlib), Excel"],
      ["Statistics", "Regression, calibration, cluster bootstrap, clustered standard errors, multiple-testing correction, held-out testing"],
      ["Also", "PyTorch, TypeScript, Git, Claude Code"],
      ["Spoken languages & interests", `${spoken} | ${interests}`],
    ],
  },
  {
    slug: "finance",
    sections: [
      { title: "Education", entries: education },
      { title: "Projects", entries: [P.ceg(3), P.fairOdds(2)] },
      { title: "Experience", entries: [E.roam(["founded", "sales", "pitch", "shopify"]), E.chess(2), E.bdaa(2)] },
      { title: "Honors & Leadership", list: [H.natl, H.d203, H.deca, H.ihsa, L.club] },
    ],
    skills: [
      ["Finance", "Equity research, DCF and comparable-company valuation, reading 10-Ks, 10-Qs, and earnings releases"],
      ["Excel", "Data tables, scenario models, INDEX/MATCH, SUMIFS, NPV"],
      ["Data", "Python (pandas), SQL, statistics (calibration, bootstrap, regression)"],
      ["Spoken languages & interests", `${spoken} | ${interests}`],
    ],
  },
  {
    slug: "quant",
    sections: [
      { title: "Education", entries: education },
      { title: "Projects", entries: [P.fairOdds(3), P.playsLikeMe(2), P.tilt(2)] },
      { title: "Honors", list: [H.ihsa, H.uscf, H.hftw, H.natl] },
      { title: "Experience", entries: [E.chess(2), E.roam(["founded", "sales"]), E.bdaa(1)] },
    ],
    skills: [
      ["Quantitative", "Probability and statistics, calibration, bootstrap, regression, hypothesis testing, algorithms"],
      ["Programming", "Python (NumPy, pandas, PyTorch), SQL, TypeScript, Java"],
      ["Games & languages", `Tournament chess (US Chess Expert), poker | ${spoken}`],
    ],
  },
  {
    slug: "consulting",
    sections: [
      { title: "Education", entries: education },
      { title: "Experience", entries: [E.bdaa(2), E.roam(["founded", "lean", "sales", "pitch", "challenge"]), E.chess(3)] },
      { title: "Projects", entries: [P.library(2), P.outage(1), P.ceg(1)] },
      { title: "Honors & Leadership", list: [H.natl, H.d203, H.hftw, H.deca, L.club, L.captain] },
    ],
    skills: [
      ["Business", "Stakeholder interviews, customer discovery, lean startup, investor pitching, partner outreach"],
      ["Analysis", "Excel (valuation, scenarios), Python, SQL, prototyping"],
      ["Spoken languages & interests", `${spoken} | ${interests}`],
    ],
  },
];
