/* Short versions of the site for one kind of role, at /for/<slug>/.
   Put the matching link on a resume or in an application, e.g. /for/data/. */

export type RoleView = {
  slug: string;
  /** Short name used in links between views. */
  label: string;
  /** What a recruiter for this role is hiring for, in their words. */
  title: string;
  pitch: string;
  /** Project slugs, most relevant first. The first three are shown large. */
  projects: string[];
  /** Experience and involvement to show, by org name, in order. */
  roles: string[];
  skills: string[];
  /** Honors to show, matched by the start of their title. */
  honors: string[];
};

export const roleViews: RoleView[] = [
  {
    slug: "software",
    label: "Software & AI",
    title: "Software, ML & AI",
    pitch:
      "I build things and then try to prove they work. That means a neural network trained on a million positions from my chess games that runs in your browser, a reading-quiz app that gets its questions from the book itself, and a storm outage model built at HackOHI/O. Every project has tests and is checked on data it never saw.",
    projects: ["plays-like-me", "book-quiz", "hackohio-outage-model", "knights-tour", "this-site", "hack-for-the-world"],
    roles: ["Big Data & Analytics Association (BDAA)", "Roam Travel"],
    skills: ["Python", "TypeScript", "PyTorch", "SQL", "Next.js / React", "Claude API", "pytest", "Git"],
    honors: ["1st Place Overall, Hack For The World", "US Chess Expert"],
  },
  {
    slug: "data",
    label: "Data & analytics",
    title: "Data & analytics",
    pitch:
      "I like questions that data can actually answer, and I care about getting the comparison right before trusting the answer. I've analyzed 14,547 of my own games in SQL and Python, rebuilt a utility's outage risk score from real storm records, and I report results with error bars.",
    projects: ["chess-analytics", "hackohio-outage-model", "plays-like-me", "book-quiz", "roam-travel"],
    roles: ["Big Data & Analytics Association (BDAA)", "Roam Travel", "Elite Chess"],
    skills: ["SQL (DuckDB)", "Python", "pandas", "statsmodels", "scikit-learn", "matplotlib", "Excel", "Experiment design"],
    honors: ["US Chess Expert", "1st Place Overall, Hack For The World"],
  },
  {
    slug: "finance",
    label: "Finance",
    title: "Finance",
    pitch:
      "I'm a business student at Fisher. I was CFO of a startup I co-founded in high school, and I've written a long pitch on Constellation Energy. I'm also strong on the analytical side: SQL, Python, and statistics on real data.",
    projects: ["constellation-energy", "roam-travel", "chess-analytics", "hackohio-outage-model"],
    roles: ["Roam Travel", "Ohio State Chess Club", "Big Data & Analytics Association (BDAA)", "Elite Chess"],
    skills: ["Equity research", "Valuation multiples", "Excel (INDEX/MATCH, SUMIFS, NPV)", "SEC filings", "Python", "SQL"],
    honors: ["National Finalist", "1st of 60 Teams", "6th Place in Illinois, DECA"],
  },
  {
    slug: "quant",
    label: "Quant & trading",
    title: "Quant & trading",
    pitch:
      "US Chess Expert (peak 2075), 2600+ in online bullet, and in the habit of checking whether a pattern is real before betting on it. My projects are about probability done carefully: calibrated predictions, tests on data the model never saw, and corrections for testing many things at once.",
    projects: ["plays-like-me", "chess-analytics", "knights-tour", "hackohio-outage-model"],
    roles: ["Elite Chess", "Ohio State Chess Club", "Big Data & Analytics Association (BDAA)"],
    skills: ["Probability & statistics", "Python", "PyTorch", "SQL", "Algorithms", "Fast decisions under time pressure"],
    honors: ["Individual Gold Medal", "US Chess Expert", "1st Place Overall, Hack For The World"],
  },
  {
    slug: "consulting",
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
