import { NextResponse } from "next/server";
import { getConfiguredClient, jsonError, missingConfig } from "@/base/auth/http";
import { ensureBaseAccount } from "@/base/identity/bootstrap";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const supabase = await getConfiguredClient();
  if (!supabase) return missingConfig();

  const body = (await request.json()) as {
    email?: string;
    token?: string;
    fullName?: string;
  };

  if (!body.email || !body.token) {
    return jsonError("Email Address and code are required.");
  }

  const token = body.token.replace(/\s/g, "");
  let { data, error } = await supabase.auth.verifyOtp({
    email: body.email,
    token,
    type: "email",
  });

  if (error) {
    const retry = await supabase.auth.verifyOtp({
      email: body.email,
      token,
      type: "magiclink",
    });
    data = retry.data;
    error = retry.error;
  }

  if (error) return jsonError(error.message);
  if (!data.user) return jsonError("Could not verify that code.");

  if (data.user.email) {
    await supabase
      .from("users")
      .update({ last_login_at: new Date().toISOString() })
      .eq("email", data.user.email);
  }

  try {
    await ensureBaseAccount(supabase, {
      id: data.user.id,
      email: data.user.email,
      user_metadata: {
        full_name:
          body.fullName ||
          (data.user.user_metadata?.full_name as string | undefined),
      },
    });
  } catch {
    // Workspace may already exist.
  }

  return NextResponse.json({ redirect: "/switcher" });
}
