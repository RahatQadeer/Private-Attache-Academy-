import { NextResponse } from "next/server";
import { createClient, isSupabaseConfigured } from "@/base/lib/supabase/server";
import { ensureBaseAccount } from "@/base/identity/bootstrap";
import { siteUrl } from "@/base/auth/http";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") || "/switcher";
  const origin = siteUrl();

  if (!isSupabaseConfigured()) {
    return NextResponse.redirect(new URL("/login", origin));
  }

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
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
  }

  return NextResponse.redirect(new URL(next, origin));
}
