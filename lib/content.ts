/* All site content lives here. Edit text in this file, not in components. */

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
};

export const now = {
  label: "Fall 2026",
  items: [
    "Running stakeholder interviews for BDAA's product discovery project with OSU University Libraries",
    "Treasurer on the Ohio State Chess Club executive board",
    "Building the projects for my next case",
  ],
};

/* ─────────────────────────────── Cases ─────────────────────────────── */

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
  kind: "Game" | "Miniature";
  title: string;
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
};

export const cases: Case[] = [
  {
    slug: "roam-travel",
    number: "01",
    kind: "Game",
    title: "Roam Travel",
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
    kind: "Game",
    title: "Long Constellation Energy",
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
    postGame: [],
    note: "A student stock pitch, not investment advice.",
    gaps: [
      "What is BCI, and who did you pitch to?",
      "How did it go: feedback, a vote, or what the stock has done since?",
      "Want the full pitch PDF linked from this page?",
    ],
  },
  {
    slug: "hack-for-the-world",
    number: "03",
    kind: "Miniature",
    title: "Hack For The World",
    dek: "First place overall at a 12-hour sustainability hackathon.",
    period: "Feb 2026",
    role: "Team member",
    tools: [],
    result: "1st place overall",
    stats: [
      { value: "1st", label: "place overall" },
      { value: "12 hrs", label: "to build" },
    ],
    position: [
      "A 12-hour sustainability hackathon at Naperville North, with teams from high schools across Chicagoland.",
    ],
    plan: ["Build a sustainability product with a team in 12 hours."],
    moves: [],
    outcome: ["Placed 1st overall."],
    postGame: [],
    gaps: [
      "What did your team build, and what was your part?",
      "Tools or languages used, and a screenshot or demo link if you have one.",
    ],
  },
  {
    slug: "this-site",
    number: "04",
    kind: "Miniature",
    title: "This site",
    dek: "Designing and shipping a personal site with AI-assisted development.",
    period: "Nov 2026",
    role: "Designer & developer",
    tools: ["Next.js", "TypeScript", "Tailwind CSS", "Claude Code", "Vercel"],
    result: "Live on Vercel",
    stats: [
      { value: "2", label: "versions shipped" },
      { value: "0", label: "loading screens" },
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
        body: "The strongest portfolios I studied led with proof, so this version is built around case studies instead of a list of roles.",
      },
      {
        glyph: "!?",
        title: "Chess as a signature, not a theme",
        body: "Annotation marks and a knight's tour carry the personality. The content stays plain and fast.",
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
    title: "USCF Expert (2070)",
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
    "Chess has been the constant. I've studied it for more than ten years and played 70+ rated tournaments, each a multi-day event with 4–5 hour classical games. I'm a USCF Expert (2070), one class below National Master, and in February 2026 I won the individual gold medal on Board 1 at the IHSA State Finals with a perfect 7/7.",
    "I've also spent a lot of time teaching it: 1,000+ students at Elite Chess, from first-time beginners to tournament players. As captain at Naperville North, I helped grow the team from 20 to 30 regular players.",
    "In high school I co-founded Roam Travel, a travel accessory startup that sold 250+ units. Now I'm looking for problems where business, software, and AI meet.",
  ],
  interests: [
    {
      name: "Chess",
      line: "USCF Expert (2070). Peak 2650 bullet on Lichess, 2500+ blitz and rapid on Lichess and Chess.com.",
    },
    { name: "Poker", line: "Chess with hidden information, and a lot more luck." },
    { name: "Logic puzzles", line: "The knight's tour on the home page is one: 64 squares, each visited once." },
    { name: "GeoGuessr", line: "Dropped somewhere random on Earth. Figure out where." },
    { name: "Working out", line: "The one hobby that doesn't involve sitting still." },
    { name: "Languages", line: "English, Gujarati, and Spanish." },
  ],
  gaps: [
    "A photo of you for the About page (portrait or candid).",
    "One personal line or stat for poker, GeoGuessr, and working out.",
    "Your Lichess or Chess.com username, if you'd like it linked.",
    "A position from one of your own games for the puzzle (I can swap it in).",
  ],
};

/** "Opera Game", Morphy vs. Duke Karl and Count Isouard, Paris 1858. White mates in 2. */
export const puzzle = {
  fen: "4kb1r/p2n1ppp/4q3/4p1B1/4P3/1Q6/PPP2PPP/2KR4 w k - 0 16",
  // Alternating moves: White, Black reply, White. Checked with chess.js.
  solution: ["b3b8", "d7b8", "d1d8"],
  sanLine: "16. Qb8+!! Nxb8 17. Rd8#",
  title: "White to play, mate in 2",
  source: "The finish of Paul Morphy's Opera Game, Paris 1858.",
  hint: "The queen is worth less than the mate. Look at the d-file.",
};
