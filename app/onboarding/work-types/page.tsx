"use client";

import { useState } from "react";
import { Chip } from "@/base/components/Chip";
import { Button } from "@/base/components/Button";
import { ProgressBar } from "@/base/components/ProgressBar";
import { Callout } from "@/base/components/Callout";
import { Logo, Wordmark } from "@/base/components/Logo";

const WORK_TYPES = [
  "Family office",
  "Relocation",
  "Principal affairs",
  "Residence operations",
  "Healthcare navigation",
  "Travel and experiences",
  "Something else",
];

export default function WorkTypesPage() {
  const [selected, setSelected] = useState<string[]>([]);

  function toggle(value: string) {
    setSelected((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    );
  }

  return (
    <div className="min-h-screen bg-canvas px-6">
      <div className="mx-auto max-w-[520px] py-14">
        <div className="mb-8 flex items-center gap-2">
          <Logo size={22} />
          <Wordmark size={14} />
        </div>
        <p className="text-[12.5px] font-medium" style={{ color: "var(--text-tertiary)" }}>
          Step 2 of 4
        </p>
        <div className="my-3">
          <ProgressBar value={50} />
        </div>
        <h1 className="mb-2 text-[28px] font-bold tracking-[-0.4px]">
          What kind of work do you coordinate?
        </h1>
        <p className="mb-5 text-[14.5px]" style={{ color: "var(--text-secondary)" }}>
          Optional. Used to personalize Playbooks and Whitby’s guidance — never to split the product.
        </p>
        <div className="grid grid-cols-2 gap-2">
          {WORK_TYPES.map((type) => (
            <Chip
              key={type}
              selected={selected.includes(type)}
              onClick={() => toggle(type)}
            >
              {type}
            </Chip>
          ))}
        </div>
        <Callout className="mt-5">
          Based on family office and relocation work, Whitby can suggest a household move playbook
          after you start your first request.
        </Callout>
        <div className="mt-6 flex gap-3">
          <Button href="/onboarding/invite" variant="primary">
            Continue
          </Button>
          <Button href="/onboarding/invite" variant="ghost">
            Skip
          </Button>
        </div>
      </div>
    </div>
  );
}
