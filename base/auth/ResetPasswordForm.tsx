"use client";

import { useState } from "react";
import { Input } from "@/base/components/Input";
import { FormError, SubmitButton } from "@/base/components/AuthControls";

export function ResetPasswordForm() {
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
    const response = await fetch("/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = (await response.json()) as { error?: string; redirect?: string };
    if (!response.ok) {
      setError(data.error || "Could not update password.");
      setPending(false);
      return;
    }
    window.location.href = data.redirect || "/switcher";
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Input
        label="New Password"
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
      <SubmitButton pending={pending}>Set password & continue</SubmitButton>
    </form>
  );
}
