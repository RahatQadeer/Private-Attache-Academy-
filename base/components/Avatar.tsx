import { cn } from "@/base/lib/cn";

function initialsFrom(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "PA";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0]}${parts[1]![0]}`.toUpperCase();
}

export function Avatar({
  name,
  size = 28,
  tone = "tan",
  className,
}: {
  name: string;
  size?: number;
  tone?: "tan" | "blue";
  className?: string;
}) {
  const bg = tone === "tan" ? "var(--avatar-tan-bg)" : "var(--avatar-blue-bg)";
  const fg = tone === "tan" ? "var(--avatar-tan-fg)" : "var(--avatar-blue-fg)";
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full font-semibold uppercase shrink-0",
        className,
      )}
      style={{
        width: size,
        height: size,
        background: bg,
        color: fg,
        fontSize: Math.max(10, Math.round(size * 0.36)),
      }}
      aria-hidden
    >
      {initialsFrom(name)}
    </span>
  );
}
