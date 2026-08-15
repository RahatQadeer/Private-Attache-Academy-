"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/base/components/Input";
import {
  Divider,
  FormError,
  GoogleButton,
  SubmitButton,
} from "@/base/components/AuthControls";
import { createClient } from "@/base/lib/supabase/client";
import { readAuthResponse } from "@/base/auth/readResponse";

const REQUEST_MS = 20_000;

async function fetchJson(input: RequestInfo, init: RequestInit) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_MS);
  try {
    const response = await fetch(input, { ...init, signal: controller.signal });
    return { response, data: await readAuthResponse(response) };
  } catch (caught) {
    if (caught instanceof DOMException && caught.name === "AbortError") {
      throw new Error("That request timed out. Try again.");
    }
    throw caught;
  } finally {
    clearTimeout(timer);
  }
}

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
      const nextEmail = String(form.get("email") ?? "").trim();
      const nextName = String(form.get("fullName") ?? "").trim();
      const { response, data } = await fetchJson("/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: nextEmail,
          fullName: nextName || undefined,
        }),
      });
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
      const token = String(form.get("token") ?? "").replace(/\s/g, "");
      const supabase = createClient();
      const types = ["email", "magiclink", "signup"] as const;
      let lastMessage = "That code is not valid.";
      let ok = false;
      for (const type of types) {
        const { error: verifyError } = await supabase.auth.verifyOtp({
          email,
          token,
          type,
        });
        if (!verifyError) {
          ok = true;
          break;
        }
        lastMessage = verifyError.message;
      }
      if (!ok) {
        setError(lastMessage);
        return;
      }
      window.location.href = nextPath.startsWith("/onboarding")
        ? "/switcher"
        : nextPath || "/switcher";
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not verify that code.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div>
      <GoogleButton label="Continue with Google" nextPath={nextPath} />
      <Divider />
      {sentTo ? (
        <form onSubmit={verifyCode} className="space-y-4">
          <p className="text-[14px]" style={{ color: "var(--text-secondary)" }}>
            We sent a sign-in email to {sentTo}. Open it and click the link.
            If a 6-digit code is shown, you can enter it here instead.
          </p>
          <Input
            label="6-digit code"
            name="token"
            inputMode="numeric"
            autoComplete="one-time-code"
            required
            minLength={6}
            maxLength={6}
          />
          <FormError message={error} />
          <SubmitButton pending={pending} pendingLabel="Verifying…">
            Verify code
          </SubmitButton>
          <button
            type="button"
            className="block w-full text-center text-[13.5px]"
            disabled={pending}
            onClick={async () => {
              setPending(true);
              setError(null);
              try {
                const { response, data } = await fetchJson("/auth/otp/send", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    email,
                    fullName: fullName || undefined,
                  }),
                });
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
          <SubmitButton pending={pending} pendingLabel="Sending…">
            Email me a code
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
