import { NextResponse } from "next/server";
import { getConfiguredClient, jsonError, missingConfig, requestOrigin } from "@/base/auth/http";

export async function POST(request: Request) {
  const supabase = await getConfiguredClient();
  if (!supabase) return missingConfig();

  const body = (await request.json()) as {
    fullName?: string;
    email?: string;
    password?: string;
    next?: string;
  };

  if (!body.fullName || !body.email || !body.password) {
    return jsonError("Full Name, Email Address, and Password are required.");
  }

  const { data, error } = await supabase.auth.signUp({
    email: body.email,
    password: body.password,
    options: {
      data: { full_name: body.fullName },
      emailRedirectTo: `${requestOrigin(request)}/auth/callback?next=/onboarding/workspace`,
    },
  });

  if (error) return jsonError(error.message);

  if (!data.session) {
    return NextResponse.json({
      redirect: `/login?notice=check-email`,
    });
  }

  return NextResponse.json({ redirect: "/onboarding/workspace" });
}
