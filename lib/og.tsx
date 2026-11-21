/* Link-preview images (Open Graph), drawn at build time. */

export const ogSize = { width: 1200, height: 630 };

const colors = { paper: "#110e17", panel: "#1c1725", ink: "#f3eee4", muted: "#a69eb0", lime: "#c7f74a", line: "#322b3e" };

/** Fetch a Google font as TTF for the image renderer. Falls back to the built-in font if offline. */
async function font(family: string, weight: number) {
  try {
    const css = await (
      await fetch(`https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}:wght@${weight}`)
    ).text();
    const url = css.match(/src: url\((.+?)\) format\('(?:truetype|opentype)'\)/)?.[1];
    if (!url) return null;
    return await (await fetch(url)).arrayBuffer();
  } catch {
    return null;
  }
}

export async function ogFonts() {
  const [display, sans] = await Promise.all([font("Bricolage Grotesque", 800), font("Instrument Sans", 500)]);
  return [
    ...(display ? [{ name: "Display", data: display, weight: 800 as const, style: "normal" as const }] : []),
    ...(sans ? [{ name: "Sans", data: sans, weight: 500 as const, style: "normal" as const }] : []),
  ];
}

function Corner() {
  const squares = [];
  for (let y = 0; y < 4; y++)
    for (let x = 0; x < 4; x++)
      squares.push(
        <div
          key={`${x}-${y}`}
          style={{ width: 34, height: 34, background: (x + y) % 2 === 0 ? colors.lime : colors.panel }}
        />,
      );
  return <div style={{ display: "flex", flexWrap: "wrap", width: 136, height: 136 }}>{squares}</div>;
}

export function OgCard({ kicker, title, lines, highlight }: { kicker: string; title: string; lines: string[]; highlight?: string }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: colors.paper,
        padding: "64px 72px",
        fontFamily: "Sans",
        borderBottom: `10px solid ${colors.lime}`,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", fontSize: 26, color: colors.lime, letterSpacing: 2, textTransform: "uppercase" }}>{kicker}</div>
        <Corner />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        <div
          style={{
            display: "flex",
            fontFamily: "Display",
            fontSize: title.length > 22 ? 84 : 108,
            lineHeight: 0.95,
            letterSpacing: -3,
            color: colors.ink,
            maxWidth: 1000,
          }}
        >
          {title}
        </div>
        {highlight && (
          <div style={{ display: "flex" }}>
            <div
              style={{
                display: "flex",
                background: colors.lime,
                color: colors.paper,
                fontFamily: "Display",
                fontSize: 34,
                padding: "6px 16px",
              }}
            >
              {highlight}
            </div>
          </div>
        )}
        {lines.map((line) => (
          <div key={line} style={{ display: "flex", fontSize: 32, color: colors.muted, maxWidth: 1000, lineHeight: 1.3 }}>
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}
