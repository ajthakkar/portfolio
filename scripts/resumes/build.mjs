/* Build one-page PDF resumes for each role page into public/resume/.
   Writes an HTML page per version, then prints it to PDF with headless Microsoft Edge (Windows).
   Run: npm run resumes */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { contact, resumes } from "./data.mjs";

const EDGE = [
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
].find(existsSync);
if (!EDGE) throw new Error("Microsoft Edge not found; it's used to print the resumes to PDF.");

const outDir = resolve("public/resume");
const work = join(tmpdir(), "resume-build");
mkdirSync(outDir, { recursive: true });
mkdirSync(work, { recursive: true });

const css = `
@page { size: letter; margin: 0.42in 0.55in; }
* { box-sizing: border-box; }
body { font-family: "Times New Roman", Times, serif; font-size: 10.2pt; line-height: 1.18; color: #000; margin: 0; }
h1 { font-size: 19pt; letter-spacing: 0.04em; text-align: center; margin: 0 0 2pt; }
.contact { text-align: center; font-size: 9pt; margin-bottom: 5pt; white-space: nowrap; }
.contact span + span::before { content: " | "; }
h2 { font-size: 10.8pt; text-transform: uppercase; border-bottom: 0.9pt solid #000; margin: 6pt 0 3pt; padding-bottom: 1pt; }
.entry { margin-bottom: 3.5pt; break-inside: avoid; }
.row { display: flex; justify-content: space-between; gap: 12pt; }
.org { font-weight: bold; }
.place { font-style: normal; }
.title { font-style: italic; }
a { color: inherit; text-decoration: none; }
.date { font-style: italic; white-space: nowrap; }
ul { margin: 1pt 0 0; padding-left: 12pt; }
li { margin: 0.6pt 0; }
.list .row { margin: 0.8pt 0; }
.list .row span:first-child::before { content: "• "; }
.skills div { margin: 1pt 0; }
`;

const esc = (s) => s.replace(/&(?!amp;)/g, "&amp;");

function entry(e) {
  // Jobs: org | place, then title | dates. Projects without a subtitle: name | dates, then the tools in italics.
  // A project's name links to its page on the site.
  const org = e.href ? `<a href="${e.href}">${esc(e.org)}</a>` : esc(e.org);
  const rows = e.title
    ? `<div class="row"><span class="org">${org}</span><span class="place">${esc(e.place)}</span></div>
  <div class="row"><span class="title">${esc(e.title)}</span><span class="date">${esc(e.date)}</span></div>`
    : `<div class="row"><span class="org">${org}</span><span class="date">${esc(e.date)}</span></div>
  <div class="row"><span class="title">${esc(e.place)}</span></div>`;
  return `<div class="entry">
  ${rows}
  ${e.points?.length ? `<ul>${e.points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>` : ""}
</div>`;
}

function page(r) {
  const body = r.sections
    .map((s) => {
      const inner = s.entries
        ? s.entries.map(entry).join("")
        : `<div class="list">${s.list.map(([a, b]) => `<div class="row"><span>${esc(a)}</span><span class="date">${esc(b)}</span></div>`).join("")}</div>`;
      return `<h2>${s.title}</h2>${inner}`;
    })
    .join("");
  const skills = `<h2>Skills & Interests</h2><div class="skills">${r.skills
    .map(([k, v]) => `<div><b>${esc(k)}:</b> ${esc(v)}</div>`)
    .join("")}</div>`;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Aayush Thakkar, Resume</title><style>${css}</style></head>
<body><h1>AAYUSH THAKKAR</h1><div class="contact">${contact(r.slug)
    .map(([text, href]) => `<span>${href ? `<a href="${href}">${text}</a>` : text}</span>`)
    .join("")}</div>${body}${skills}</body></html>`;
}

for (const r of resumes) {
  const html = join(work, `${r.slug}.html`);
  writeFileSync(html, page(r));
  const name = r.file ?? `Aayush-Thakkar-Resume-${r.slug[0].toUpperCase()}${r.slug.slice(1)}.pdf`;
  const pdf = join(outDir, name);
  if (existsSync(pdf)) rmSync(pdf);
  // Edge sometimes exits before the PDF lands; wait for it, and try a second time if needed.
  for (let attempt = 1; attempt <= 2 && !existsSync(pdf); attempt++) {
    execFileSync(EDGE, [
      "--headless=new",
      "--disable-gpu",
      "--no-pdf-header-footer",
      `--user-data-dir=${join(work, `edge-profile-${r.slug}-${attempt}`)}`,
      "--no-first-run",
      `--print-to-pdf=${pdf}`,
      pathToFileURL(html).href,
    ]);
    for (let i = 0; i < 40 && !existsSync(pdf); i++) await new Promise((ok) => setTimeout(ok, 250));
  }
  if (!existsSync(pdf)) throw new Error(`Edge didn't produce ${name}`);
  console.log(`wrote public/resume/${name}`);
}
try {
  rmSync(work, { recursive: true, force: true });
} catch {
  // Edge can hold its profile folder for a moment; the temp folder is safe to leave.
}
