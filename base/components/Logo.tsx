import { cn } from "@/base/lib/cn";

type LogoProps = {
  size?: number;
  className?: string;
};

export function Logo({ size = 28, className }: LogoProps) {
  const radius = Math.round(size * 0.4);
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center font-bold text-white select-none",
        className,
      )}
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: "var(--ink)",
        fontSize: Math.round(size * 0.5),
        lineHeight: 1,
      }}
      aria-hidden
    >
      W
    </span>
  );
}

export function Wordmark({
  size = 15,
  trademark = false,
}: {
  size?: number;
  trademark?: boolean;
}) {
  return (
    <span
      className="font-semibold tracking-tight"
      style={{ fontSize: size, color: "var(--ink)" }}
    >
      Private Attaché{trademark ? "™" : ""}
    </span>
  );
}
