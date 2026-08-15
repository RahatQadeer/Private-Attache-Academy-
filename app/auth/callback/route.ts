import { NextResponse } from "next/server";
import { createClient, isSupabaseConfigured } from "@/base/lib/supabase/server";
import { ensureBaseAccount } from "@/base/identity/bootstrap";
import { siteUrl } from "@/base/auth/site";
import type { EmailOtpType } from "@supabase/supabase-js";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type") as EmailOtpType | null;
  const next = url.searchParams.get("next") || "/switcher";
  const origin = siteUrl();
  const login = new URL("/login", origin);

  if (!isSupabaseConfigured()) {
    return NextResponse.redirect(login);
  }

  const supabase = await createClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      login.searchParams.set("error", error.message);
      return NextResponse.redirect(login);
    }
  } else if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
    if (error) {
      login.searchParams.set("error", error.message);
      return NextResponse.redirect(login);
    }
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    try {
      await ensureBaseAccount(supabase, user);
    } catch {
      // Account rows may already exist from a previous visit.
    }
  }

  return NextResponse.redirect(new URL(next.startsWith("/onboarding") ? "/switcher" : next, origin));
}
