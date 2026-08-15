import { cn } from "@/base/lib/cn";

type Tone = "success" | "warning" | "danger" | "info" | "neutral" | "accent";

const tones: Record<Tone, { bg: string; fg: string }> = {
  success: { bg: "var(--success-bg)", fg: "var(--success-fg)" },
  warning: { bg: "var(--warning-bg)", fg: "var(--warning-fg)" },
  danger: { bg: "var(--danger-bg)", fg: "var(--danger-fg)" },
  info: { bg: "var(--info-bg)", fg: "var(--info-fg)" },
  neutral: { bg: "var(--surface-soft)", fg: "var(--text-secondary)" },
  accent: { bg: "var(--accent-tint)", fg: "var(--accent)" },
};

export function Pill({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  const colors = tones[tone];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-[8px] py-[2px] text-[11.5px] font-medium",
        className,
      )}
      style={{ background: colors.bg, color: colors.fg }}
    >
      {children}
    </span>
  );
}
