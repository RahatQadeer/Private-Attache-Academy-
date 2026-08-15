import { NextResponse } from "next/server";
import { getConfiguredClient, siteUrl } from "@/base/auth/http";

export const dynamic = "force-dynamic";

async function startGoogle(_request: Request, nextPath: string) {
  const supabase = await getConfiguredClient();
  if (!supabase) {
    const dest = new URL("/login", siteUrl());
    dest.searchParams.set("error", "Supabase is not connected yet.");
    return NextResponse.redirect(dest);
  }

  const next = nextPath.startsWith("/onboarding") ? "/switcher" : nextPath || "/switcher";
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${siteUrl()}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  });

  if (error || !data.url) {
    const dest = new URL("/login", siteUrl());
    dest.searchParams.set(
      "error",
      error?.message || "Google sign-in is not enabled on this project.",
    );
    return NextResponse.redirect(dest);
  }

  return NextResponse.redirect(data.url);
}

export async function GET(request: Request) {
  const next = new URL(request.url).searchParams.get("next") || "/switcher";
  return startGoogle(request, next);
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { next?: string };
  return startGoogle(request, body.next || "/switcher");
}
