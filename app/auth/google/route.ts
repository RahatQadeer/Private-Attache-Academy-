import { NextResponse } from "next/server";
import { getConfiguredClient, jsonError, missingConfig, requestOrigin } from "@/base/auth/http";

export async function POST(request: Request) {
  const supabase = await getConfiguredClient();
  if (!supabase) return missingConfig();

  const body = (await request.json()) as { next?: string };
  const origin = requestOrigin(request);
  const requested = body.next || "/switcher";
  const next = requested.startsWith("/onboarding") ? "/switcher" : requested;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  });

  if (error || !data.url) {
    return jsonError(error?.message || "Google sign-in is not enabled on this project.");
  }

  return NextResponse.json({ url: data.url });
}
