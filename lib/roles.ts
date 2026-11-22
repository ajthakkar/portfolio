/* Short versions of the site for one kind of role, at /for/<slug>/.
   Put the matching link on a resume or in an application, e.g. /for/data/. */

export type RoleView = {
  slug: string;
  /** Short name used in links between views. */
  label: string;
  /** What a recruiter for this role is hiring for, in their words. */
  title: string;
  pitch: string;
  /** One or two sentences for search results and link previews, under 160 characters. */
  summary: string;
  /** The "looking for" line on this page, narrowed to this kind of role. */
  lookingFor: string;
  /** Project slugs, most relevant first. The first three are shown large. */
  projects: string[];
  /** Experience and involvement to show, by org name, in order. */
  roles: string[];
  skills: string[];
  /** Honors to show, matched by the start of their title. */
  honors: string[];
  /** A one-page resume tailored to this role, built by `npm run resumes`. */
  resume: string;
};

const resume = (slug: string) => `/resume/Aayush-Thakkar-Resume-${slug[0].toUpperCase()}${slug.slice(1)}.pdf`;

export const roleViews: RoleView[] = [
  {
    slug: "software",
    resume: resume("software"),
    summary: "I build things and then try to prove they work: a neural network trained on my chess games, an LLM quiz app checked against the book, and a storm outage model.",
    lookingFor: "Looking for a Summer 2027 internship in software, ML, or AI, ideally in Chicago.",
    label: "Software & AI",
    title: "Software, ML & AI",
    pitch:
      "I build things and then try to prove they work. That means a neural network trained on a million positions from my chess games that runs in your browser, a reading-quiz app that gets its questions from the book itself, and a storm outage model built at HackOHI/O. Every project has tests and is checked on data it never saw.",
    projects: ["plays-like-me", "chapter-and-verse", "hackohio-outage-model", "knights-tour", "this-site", "hack-for-the-world"],
    roles: ["Big Data & Analytics Association (BDAA)", "Roam Travel"],
    skills: ["Python", "TypeScript", "PyTorch", "SQL", "Next.js / React", "Claude API", "pytest", "Git"],
    honors: ["1st Place Overall, Hack For The World", "US Chess Expert"],
  },
  {
    slug: "data",
    resume: resume("data"),
    summary: "I like questions that data can actually answer, and I care about getting the comparison right before trusting the answer.",
    lookingFor: "Looking for a Summer 2027 internship in data science or analytics, ideally in Chicago.",
    label: "Data & analytics",
    title: "Data & analytics",
    pitch:
      "I like questions that data can actually answer, and I care about getting the comparison right before trusting the answer. I've analyzed 14,547 of my own games in SQL and Python, tested whether 22,625 Polymarket prices mean what they say, and rebuilt a utility's outage risk score from real storm records. I report results with error bars.",
    projects: ["chess-analytics", "fair-odds", "hackohio-outage-model", "plays-like-me", "chapter-and-verse", "roam-travel"],
    roles: ["Big Data & Analytics Association (BDAA)", "Roam Travel", "Elite Chess"],
    skills: ["SQL (DuckDB)", "Python", "pandas", "statsmodels", "scikit-learn", "matplotlib", "Excel", "Experiment design"],
    honors: ["US Chess Expert", "1st Place Overall, Hack For The World"],
  },
  {
    slug: "finance",
    resume: resume("finance"),
    summary: "Fisher business student and former startup CFO. I pitched Constellation Energy as a long, then built an Excel model from SEC filings to test the call.",
    lookingFor: "Looking for a Summer 2027 internship in finance, ideally in Chicago.",
    label: "Finance",
    title: "Finance",
    pitch:
      "I'm a business student at Fisher. I was CFO of a startup I co-founded in high school. I pitched Constellation Energy as a long, then built an Excel model from SEC filings to test the call after the stock fell. I also work in SQL, Python, and statistics on real data, like testing whether prediction-market prices mean what they say.",
    projects: ["constellation-energy", "fair-odds", "roam-travel", "chess-analytics"],
    roles: ["Roam Travel", "Ohio State Chess Club", "Big Data & Analytics Association (BDAA)", "Elite Chess"],
    skills: ["Equity research", "DCF & comps", "Excel data tables & scenarios", "SEC filings", "Python", "SQL"],
    honors: ["National Finalist", "1st of 60 Teams", "6th Place in Illinois, DECA"],
  },
  {
    slug: "quant",
    resume: resume("quant"),
    summary: "US Chess Expert (peak 2075), 2600+ in online bullet, and in the habit of checking whether a pattern is real before betting on it.",
    lookingFor: "Looking for a Summer 2027 internship in quant research or trading, ideally in Chicago.",
    label: "Quant & trading",
    title: "Quant & trading",
    pitch:
      "US Chess Expert (peak 2075), 2600+ in online bullet, and in the habit of checking whether a pattern is real before betting on it. My projects are about probability done carefully: a calibration study of 22,625 prediction markets, tests on data a model never saw, and corrections for testing many things at once.",
    projects: ["fair-odds", "plays-like-me", "chess-analytics", "knights-tour", "hackohio-outage-model"],
    roles: ["Elite Chess", "Ohio State Chess Club", "Big Data & Analytics Association (BDAA)"],
    skills: ["Probability & statistics", "Python", "PyTorch", "SQL", "Algorithms", "Fast decisions under time pressure"],
    honors: ["Individual Gold Medal", "US Chess Expert", "1st Place Overall, Hack For The World"],
  },
  {
    slug: "consulting",
    resume: resume("consulting"),
    summary:
      "I've worked with real clients and customers: Ohio State's University Libraries through BDAA, buyers of the product I co-founded, and AEP at HackOHI/O.",
    lookingFor: "Looking for a Summer 2027 internship in consulting or product, ideally in Chicago.",
    label: "Consulting & product",
    title: "Consulting & product",
    pitch:
      "I've worked with real clients and customers: Ohio State's University Libraries through BDAA, buyers of the product I co-founded, and AEP's challenge at HackOHI/O. I like turning a vague problem into interviews, a prototype, and a recommendation someone can act on.",
    projects: ["library-onboarding", "roam-travel", "hackohio-outage-model", "constellation-energy"],
    roles: ["Big Data & Analytics Association (BDAA)", "Roam Travel", "Elite Chess", "Naperville North Chess Team"],
    skills: ["Stakeholder interviews", "Customer discovery", "Prototyping", "Pitching", "Excel", "Data analysis"],
    honors: ["National Finalist", "1st of 60 Teams", "6th Place in Illinois, DECA"],
  },
];
