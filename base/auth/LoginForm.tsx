"use client";

import { useState } from "react";
import { Input } from "@/base/components/Input";
import {
  Divider,
  FormError,
  GoogleButton,
  SubmitButton,
} from "@/base/components/AuthControls";
import { Toggle } from "@/base/components/Toggle";
import Link from "next/link";

export function LoginForm({ nextPath }: { nextPath: string }) {
  const [keepSignedIn, setKeepSignedIn] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    const form = new FormData(event.currentTarget);
    const response = await fetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: form.get("email"),
        password: form.get("password"),
        keepSignedIn,
        next: nextPath,
      }),
      headers: { "Content-Type": "application/json" },
    });
    const data = (await response.json()) as { error?: string; redirect?: string };
    if (!response.ok) {
      setError(data.error || "Could not sign in.");
      setPending(false);
      return;
    }
    window.location.href = data.redirect || nextPath;
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <GoogleButton nextPath={nextPath} />
      <Divider />
      <Input
        label="Email Address"
        name="email"
        type="email"
        autoComplete="email"
        required
      />
      <Input
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
      />
      <div className="flex items-center justify-between">
        <Toggle
          checked={keepSignedIn}
          onChange={setKeepSignedIn}
          label="Keep me signed in"
        />
        <Link href="/forgot-password" className="text-[13px]">
          Forgot password
        </Link>
      </div>
      <FormError message={error} />
      <SubmitButton pending={pending}>Sign In</SubmitButton>
      <p className="text-center text-[13.5px]" style={{ color: "var(--text-secondary)" }}>
        Need an account?{" "}
        <Link href="/signup" className="font-medium">
          Create account
        </Link>
      </p>
    </form>
  );
}
