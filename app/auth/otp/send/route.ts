import { NextResponse } from "next/server";
import { getConfiguredClient, jsonError, missingConfig, siteUrl } from "@/base/auth/http";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const supabase = await getConfiguredClient();
  if (!supabase) return missingConfig();

  const body = (await request.json()) as { email?: string; fullName?: string };
  if (!body.email) return jsonError("Email Address is required.");

  const { error } = await supabase.auth.signInWithOtp({
    email: body.email,
    options: {
      shouldCreateUser: true,
      data: body.fullName ? { full_name: body.fullName } : undefined,
      emailRedirectTo: `${siteUrl()}/auth/callback?next=/switcher`,
    },
  });

  if (error) return jsonError(error.message);
  return NextResponse.json({ ok: true });
}
