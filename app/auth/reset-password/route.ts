import { NextResponse } from "next/server";
import { getConfiguredClient, jsonError, missingConfig } from "@/base/auth/http";

export async function POST(request: Request) {
  const supabase = await getConfiguredClient();
  if (!supabase) return missingConfig();

  const body = (await request.json()) as { password?: string };
  if (!body.password) return jsonError("Password is required.");

  const { error } = await supabase.auth.updateUser({ password: body.password });
  if (error) return jsonError(error.message);

  return NextResponse.json({ redirect: "/switcher" });
}
