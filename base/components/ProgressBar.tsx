export function ProgressBar({ value }: { value: number }) {
  const width = Math.max(0, Math.min(100, value));
  return (
    <div
      className="h-1 w-full overflow-hidden rounded-[2px]"
      style={{ background: "var(--border)" }}
    >
      <div className="h-full bg-accent" style={{ width: `${width}%` }} />
    </div>
  );
}
