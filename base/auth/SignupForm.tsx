"use client";

import { EmailOtpForm } from "@/base/auth/EmailOtpForm";

export function SignupForm({ nextPath }: { nextPath: string }) {
  return <EmailOtpForm mode="signup" nextPath={nextPath} />;
}
