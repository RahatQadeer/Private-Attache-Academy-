"use client";

import { EmailOtpForm } from "@/base/auth/EmailOtpForm";

export function LoginForm({ nextPath }: { nextPath: string }) {
  return <EmailOtpForm mode="login" nextPath={nextPath} />;
}
