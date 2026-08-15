import { NextResponse } from "next/server";
import { getConfiguredClient, jsonError, missingConfig } from "@/base/auth/http";
import { ensureBaseAccount } from "@/base/identity/bootstrap";

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
    },
  });

  if (error) return jsonError(error.message);

  if (!data.session || !data.user) {
    return NextResponse.json({
      redirect: `/login?notice=check-email`,
    });
  }

  try {
    await ensureBaseAccount(supabase, {
      id: data.user.id,
      email: data.user.email,
      user_metadata: { full_name: body.fullName },
    });
  } catch {
    // Continue to the switcher even if a workspace already exists.
  }

  return NextResponse.json({ redirect: body.next || "/switcher" });
}
