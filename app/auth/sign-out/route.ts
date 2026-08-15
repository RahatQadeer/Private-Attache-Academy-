import { NextResponse } from "next/server";
import { getConfiguredClient, missingConfig, siteUrl } from "@/base/auth/http";

export async function POST() {
  const supabase = await getConfiguredClient();
  if (!supabase) return missingConfig();
  await supabase.auth.signOut();
  return NextResponse.redirect(new URL("/login", siteUrl()), { status: 302 });
}
