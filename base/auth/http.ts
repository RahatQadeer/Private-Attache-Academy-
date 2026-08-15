import { NextResponse } from "next/server";
import { createClient, isSupabaseConfigured } from "@/base/lib/supabase/server";

export function missingConfig() {
  return NextResponse.json(
    {
      error:
        "Supabase is not connected yet. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to continue.",
    },
    { status: 503 },
  );
}

export async function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function getConfiguredClient() {
  if (!isSupabaseConfigured()) return null;
  return createClient();
}

export function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || "https://private-attache-dun.vercel.app";
}
