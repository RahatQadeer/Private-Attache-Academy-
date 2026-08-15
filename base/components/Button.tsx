import { cn } from "@/base/lib/cn";
import Link from "next/link";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "dark" | "secondary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  fullWidth?: boolean;
  href?: string;
};

const variants: Record<Variant, string> = {
  primary: "bg-accent text-white hover:bg-accent-hover hover:text-white",
  dark: "bg-ink text-white hover:opacity-90 hover:text-white",
  secondary:
    "bg-transparent text-ink border border-line-strong hover:bg-surface-soft hover:text-ink",
  ghost: "bg-transparent text-ink hover:bg-surface-soft hover:text-ink",
};

export function Button({
  variant = "primary",
  fullWidth,
  className,
  type = "button",
  href,
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center rounded-control text-[14.5px] font-medium px-[18px] py-[10px] disabled:opacity-40 disabled:cursor-not-allowed transition-colors no-underline",
    variants[variant],
    fullWidth && "w-full",
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {props.children}
      </Link>
    );
  }

  return <button type={type} className={classes} {...props} />;
}
