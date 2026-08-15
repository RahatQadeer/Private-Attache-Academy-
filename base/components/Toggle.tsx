"use client";

import { cn } from "@/base/lib/cn";

type ToggleProps = {
  checked: boolean;
  onChange: (next: boolean) => void;
  label?: string;
  id?: string;
};

export function Toggle({ checked, onChange, label, id }: ToggleProps) {
  return (
    <label htmlFor={id} className="inline-flex items-center gap-2 cursor-pointer select-none">
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-5 w-[34px] rounded-[10px] transition-colors",
          checked ? "bg-accent" : "bg-[#e0e0dd]",
        )}
      >
        <span
          className={cn(
            "absolute top-[2px] h-4 w-4 rounded-full bg-white transition-transform",
            checked ? "translate-x-[16px]" : "translate-x-[2px]",
          )}
        />
      </button>
      {label ? (
        <span className="text-[14px]" style={{ color: "var(--text-secondary)" }}>
          {label}
        </span>
      ) : null}
    </label>
  );
}
