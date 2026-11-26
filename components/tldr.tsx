const labels = ["Question", "What I did", "Result"];

/** The 30-second version of a project: the question, what I did, what happened. */
export function Tldr({
  items,
  stacked = false,
  className = "",
}: {
  items: [string, string, string];
  /** Labels above the text instead of beside it, for narrow cards. */
  stacked?: boolean;
  className?: string;
}) {
  return (
    <dl className={`space-y-2.5 ${className}`}>
      {items.map((item, i) => (
        <div key={labels[i]} className={stacked ? "grid gap-0.5" : "grid gap-0.5 sm:grid-cols-[92px_1fr] sm:gap-3"}>
          <dt className="label pt-[3px] text-muted">{labels[i]}</dt>
          <dd className={`text-[15px] leading-relaxed ${i === 2 ? "font-medium text-ink" : "text-copy"}`}>{item}</dd>
        </div>
      ))}
    </dl>
  );
}
