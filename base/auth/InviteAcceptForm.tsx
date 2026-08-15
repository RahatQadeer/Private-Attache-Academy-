"use client";

import { useState } from "react";
import { Input } from "@/base/components/Input";
import { FormError, SubmitButton } from "@/base/components/AuthControls";
import { Callout } from "@/base/components/Callout";

export function InviteAcceptForm({
  token,
  email,
  inviteeName,
  inviterName,
  role,
}: {
  token: string;
  email: string;
  inviteeName: string | null;
  inviterName: string;
  role: string;
}) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") ?? "");
    const confirm = String(form.get("confirmPassword") ?? "");
    if (password !== confirm) {
      setError("Passwords do not match.");
      setPending(false);
      return;
    }
    const response = await fetch("/auth/accept-invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token,
        password,
        fullName: form.get("fullName") || inviteeName,
      }),
    });
    const data = (await response.json()) as { error?: string; redirect?: string };
    if (!response.ok) {
      setError(data.error || "Could not accept invitation.");
      setPending(false);
      return;
    }
    window.location.href = data.redirect || "/switcher";
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Callout>
        {inviterName} invited you as {role}.
      </Callout>
      <Input
        label="Full Name"
        name="fullName"
        defaultValue={inviteeName ?? ""}
        required
      />
      <Input label="Email Address" name="email" value={email} readOnly />
      <Input
        label="Create Password"
        name="password"
        type="password"
        autoComplete="new-password"
        required
        minLength={8}
      />
      <Input
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        autoComplete="new-password"
        required
        minLength={8}
      />
      <FormError message={error} />
      <SubmitButton pending={pending}>Set Password & Continue</SubmitButton>
    </form>
  );
}
