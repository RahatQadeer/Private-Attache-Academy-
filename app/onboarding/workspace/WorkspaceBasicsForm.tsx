"use client";

import { useState } from "react";
import { Input } from "@/base/components/Input";
import { FormError, SubmitButton } from "@/base/components/AuthControls";
import { ProgressBar } from "@/base/components/ProgressBar";
import { Logo, Wordmark } from "@/base/components/Logo";

export function WorkspaceBasicsForm() {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/onboarding/workspace", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        urlSlug: form.get("urlSlug"),
        teamSize: form.get("teamSize"),
        timezone: form.get("timezone") || Intl.DateTimeFormat().resolvedOptions().timeZone,
      }),
    });
    const data = (await response.json()) as { error?: string; redirect?: string };
    if (!response.ok) {
      setError(data.error || "Could not create workspace.");
      setPending(false);
      return;
    }
    window.location.href = data.redirect || "/onboarding/work-types";
  }

  return (
    <div className="mx-auto max-w-[440px] py-14">
      <div className="mb-8 flex items-center gap-2">
        <Logo size={22} />
        <Wordmark size={14} />
      </div>
      <p className="text-[12.5px] font-medium" style={{ color: "var(--text-tertiary)" }}>
        Step 1 of 4
      </p>
      <div className="my-3">
        <ProgressBar value={25} />
      </div>
      <h1 className="mb-6 text-[28px] font-bold tracking-[-0.4px]">
        Create your workspace
      </h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <Input label="Workspace name" name="name" required />
        <Input
          label="Workspace URL"
          name="urlSlug"
          placeholder="your-practice"
          hint="Letters, numbers, and hyphens only."
          required
        />
        <Input label="Team size" name="teamSize" placeholder="1–5, 6–20, 21+" />
        <Input
          label="Time zone"
          name="timezone"
          defaultValue={
            typeof Intl !== "undefined"
              ? Intl.DateTimeFormat().resolvedOptions().timeZone
              : "America/New_York"
          }
        />
        <FormError message={error} />
        <SubmitButton pending={pending}>Continue</SubmitButton>
      </form>
    </div>
  );
}
