import { cn } from "@/base/lib/cn";
import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
};

export function Input({ label, hint, id, className, ...props }: InputProps) {
  const inputId = id ?? props.name;
  return (
    <label className="block" htmlFor={inputId}>
      <span
        className="block mb-1.5 text-[12.5px] font-medium uppercase tracking-[0.05em]"
        style={{ color: "var(--text-tertiary)" }}
      >
        {label}
      </span>
      <input
        id={inputId}
        className={cn(
          "w-full rounded-control border border-line-strong bg-surface px-3 py-[9px] text-[14.5px] text-ink placeholder:text-[rgba(55,53,47,0.35)]",
          className,
        )}
        {...props}
      />
      {hint ? (
        <span
          className="mt-1 block text-[12px]"
          style={{ color: "var(--text-tertiary)" }}
        >
          {hint}
        </span>
      ) : null}
    </label>
  );
}
