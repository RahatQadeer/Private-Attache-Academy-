import { NextResponse } from "next/server";
import { getConfiguredClient, jsonError, missingConfig } from "@/base/auth/http";

export async function POST(request: Request) {
  const supabase = await getConfiguredClient();
  if (!supabase) return missingConfig();

  const body = (await request.json()) as {
    email?: string;
    password?: string;
    next?: string;
  };

  if (!body.email || !body.password) {
    return jsonError("Email Address and password are required.");
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: body.email,
    password: body.password,
  });

  if (error) return jsonError(error.message, 401);

  await supabase
    .from("users")
    .update({ last_login_at: new Date().toISOString() })
    .eq("email", body.email);

  return NextResponse.json({ redirect: body.next || "/switcher" });
}
