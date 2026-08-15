import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { siteUrl } from "@/base/auth/site";

export const dynamic = "force-dynamic";

async function startGoogle(nextPath: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const next = nextPath.startsWith("/onboarding") ? "/switcher" : nextPath || "/switcher";

  if (!url || !key) {
    const dest = new URL("/login", siteUrl());
    dest.searchParams.set("error", "Supabase is not connected yet.");
    return NextResponse.redirect(dest);
  }

  const cookieStore = await cookies();
  const staged: { name: string; value: string; options?: Record<string, unknown> }[] = [];

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
        cookiesToSet.forEach(({ name, value, options }) => {
          staged.push({ name, value, options });
          try {
            cookieStore.set(name, value, options as never);
          } catch {
            // Route handlers still receive cookies via the staged list.
          }
        });
      },
    },
  });

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

  const response = NextResponse.redirect(data.url);
  for (const cookie of staged) {
    response.cookies.set(cookie.name, cookie.value, cookie.options as never);
  }
  return response;
}

export async function GET(request: Request) {
  const next = new URL(request.url).searchParams.get("next") || "/switcher";
  return startGoogle(next);
}
