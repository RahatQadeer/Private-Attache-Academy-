"use client";

import { useState } from "react";
import { Input } from "@/base/components/Input";
import {
  Divider,
  FormError,
  GoogleButton,
  SubmitButton,
} from "@/base/components/AuthControls";
import { readAuthResponse } from "@/base/auth/readResponse";
import Link from "next/link";

export function EmailOtpForm({
  mode,
  nextPath,
}: {
  mode: "login" | "signup";
  nextPath: string;
}) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [sentTo, setSentTo] = useState<string | null>(null);

  async function sendCode(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    try {
      const form = new FormData(event.currentTarget);
      const nextEmail = String(form.get("email") ?? "");
      const nextName = String(form.get("fullName") ?? "");
      const response = await fetch("/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: nextEmail,
          fullName: nextName || undefined,
        }),
      });
      const data = await readAuthResponse(response);
      if (!response.ok) {
        setError(data.error || "Could not send a sign-in code.");
        return;
      }
      setEmail(nextEmail);
      setFullName(nextName);
      setSentTo(nextEmail);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not send a sign-in code.");
    } finally {
      setPending(false);
    }
  }

  async function verifyCode(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    try {
      const form = new FormData(event.currentTarget);
      const response = await fetch("/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          token: form.get("token"),
          fullName,
        }),
      });
      const data = await readAuthResponse(response);
      if (!response.ok) {
        setError(data.error || "That code is not valid.");
        return;
      }
      window.location.href = data.redirect || nextPath;
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not verify that code.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div>
      <GoogleButton
        label="Continue with Google"
        nextPath={nextPath}
      />
      <Divider />
      {sentTo ? (
        <form onSubmit={verifyCode} className="space-y-4">
          <p className="text-[14px]" style={{ color: "var(--text-secondary)" }}>
            We emailed {sentTo}. Open that message and click the sign-in link,
            or enter the 6-digit code if one is shown.
          </p>
          <Input
            label="Sign-in code"
            name="token"
            inputMode="numeric"
            autoComplete="one-time-code"
            required
            minLength={6}
            maxLength={8}
          />
          <FormError message={error} />
          <SubmitButton pending={pending}>Verify code</SubmitButton>
          <button
            type="button"
            className="block w-full text-center text-[13.5px]"
            disabled={pending}
            onClick={async () => {
              setPending(true);
              setError(null);
              try {
                const response = await fetch("/auth/otp/send", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ email, fullName: fullName || undefined }),
                });
                const data = await readAuthResponse(response);
                if (!response.ok) {
                  setError(data.error || "Could not resend the code.");
                }
              } catch (caught) {
                setError(
                  caught instanceof Error ? caught.message : "Could not resend the code.",
                );
              } finally {
                setPending(false);
              }
            }}
          >
            Resend code
          </button>
          <button
            type="button"
            className="block w-full text-center text-[13.5px]"
            onClick={() => {
              setSentTo(null);
              setError(null);
            }}
          >
            Use a different email
          </button>
        </form>
      ) : (
        <form onSubmit={sendCode} className="space-y-4">
          {mode === "signup" ? (
            <Input
              label="Full Name"
              name="fullName"
              type="text"
              autoComplete="name"
              required
            />
          ) : null}
          <Input
            label="Email Address"
            name="email"
            type="email"
            autoComplete="email"
            required
          />
          <FormError message={error} />
          <SubmitButton pending={pending}>
            {mode === "signup" ? "Send sign-in code" : "Email me a code"}
          </SubmitButton>
          <p
            className="text-center text-[13.5px]"
            style={{ color: "var(--text-secondary)" }}
          >
            {mode === "signup" ? (
              <>
                Already have an account?{" "}
                <Link href="/login" className="font-medium">
                  Sign in
                </Link>
              </>
            ) : (
              <>
                Need an account?{" "}
                <Link href="/signup" className="font-medium">
                  Create account
                </Link>
              </>
            )}
          </p>
        </form>
      )}
    </div>
  );
}
