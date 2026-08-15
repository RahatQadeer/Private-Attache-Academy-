"use client";

import { useState } from "react";
import { Input } from "@/base/components/Input";
import {
  Divider,
  FormError,
  GoogleButton,
  SubmitButton,
} from "@/base/components/AuthControls";
import Link from "next/link";
import { readAuthResponse } from "@/base/auth/readResponse";

export function SignupForm({ nextPath }: { nextPath: string }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    try {
      const form = new FormData(event.currentTarget);
      const password = String(form.get("password") ?? "");
      const confirm = String(form.get("confirmPassword") ?? "");
      if (password !== confirm) {
        setError("Passwords do not match.");
        return;
      }
      const response = await fetch("/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.get("fullName"),
          email: form.get("email"),
          password,
          next: nextPath,
        }),
      });
      const data = await readAuthResponse(response);
      if (!response.ok) {
        setError(data.error || "Could not create account.");
        return;
      }
      window.location.href = data.redirect || nextPath;
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not create account.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <GoogleButton label="Continue with Google" nextPath={nextPath} />
      <Divider />
      <Input label="Full Name" name="fullName" type="text" autoComplete="name" required />
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
      <SubmitButton pending={pending}>Create Account</SubmitButton>
      <p className="text-center text-[13.5px]" style={{ color: "var(--text-secondary)" }}>
        Already have an account?{" "}
        <Link href="/login" className="font-medium">
          Sign in
        </Link>
      </p>
    </form>
  );
}
