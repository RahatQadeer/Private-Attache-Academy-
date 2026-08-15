"use client";

import { useState } from "react";
import { Input } from "@/base/components/Input";
import { FormError, SubmitButton } from "@/base/components/AuthControls";
import { Callout } from "@/base/components/Callout";
import Link from "next/link";

export function ForgotPasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    const form = new FormData(event.currentTarget);
    const response = await fetch("/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.get("email") }),
    });
    const data = (await response.json()) as { error?: string };
    if (!response.ok) {
      setError(data.error || "Could not send reset email.");
      setPending(false);
      return;
    }
    setSent(true);
    setPending(false);
  }

  if (sent) {
    return (
      <div className="space-y-4">
        <Callout title="Check your email">
          If an account exists for that address, a reset link is on its way.
        </Callout>
        <Link href="/login" className="text-[13.5px] font-medium">
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Input label="Email Address" name="email" type="email" required />
      <FormError message={error} />
      <SubmitButton pending={pending}>Send reset link</SubmitButton>
      <p className="text-center text-[13.5px]">
        <Link href="/login">Back to sign in</Link>
      </p>
    </form>
  );
}
