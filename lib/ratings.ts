/* Build-time summaries of public/data/ratings.json (refreshed by `npm run ratings`). */
import data from "@/public/data/ratings.json";

type Point = [string, number];

export function uscfSummary(system: "regular" | "quick" | "blitz" = "regular") {
  const series = (data.uscf.series as unknown as Record<string, Point[]>)[system] ?? [];
  if (!series.length) return null;
  const current = series[series.length - 1];
  const peak = series.reduce((best, p) => (p[1] > best[1] ? p : best), series[0]);
  return { current: current[1], currentDate: current[0], peak: peak[1], peakDate: peak[0] };
}

/** US Chess class names by rating. */
export function uscfClass(rating: number) {
  if (rating >= 2400) return "Senior Master";
  if (rating >= 2200) return "National Master";
  if (rating >= 2000) return "Expert";
  if (rating >= 1800) return "Class A";
  if (rating >= 1600) return "Class B";
  return "Class C";
}
