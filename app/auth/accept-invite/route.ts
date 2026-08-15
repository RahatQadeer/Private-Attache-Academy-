import { NextResponse } from "next/server";
import { getConfiguredClient, jsonError, missingConfig } from "@/base/auth/http";

export async function POST(request: Request) {
  const supabase = await getConfiguredClient();
  if (!supabase) return missingConfig();

  const body = (await request.json()) as {
    token?: string;
    password?: string;
    fullName?: string;
  };

  if (!body.token || !body.password) {
    return jsonError("Invitation token and password are required.");
  }

  const { data: invitation, error: inviteError } = await supabase
    .from("invitations")
    .select("*")
    .eq("token", body.token)
    .maybeSingle();

  if (inviteError || !invitation) return jsonError("This invitation is not valid.");
  if (invitation.status !== "pending") {
    return jsonError("This invitation is no longer active.");
  }
  if (invitation.expires_at && new Date(invitation.expires_at) < new Date()) {
    return jsonError("This invitation has expired.");
  }

  const { data: existing } = await supabase.auth.getUser();
  if (!existing.user) {
    const { error } = await supabase.auth.signUp({
      email: invitation.invitee_email,
      password: body.password,
      options: { data: { full_name: body.fullName } },
    });
    if (error) return jsonError(error.message);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return jsonError("Could not create the invited account.");

  if (invitation.context_type === "team_member") {
    await supabase.from("workspace_members").upsert({
      workspace_id: invitation.context_id,
      user_id: user.id,
      role: invitation.role_or_relationship || "viewer",
      status: "active",
    });
    await supabase.from("entitlements").upsert(
      {
        user_id: user.id,
        product: "whitbyos",
        workspace_id: invitation.context_id,
        status: "active",
        is_default_landing: true,
      },
      { onConflict: "user_id,product,workspace_id" },
    );
  }

  await supabase
    .from("invitations")
    .update({
      status: "accepted",
      accepted_at: new Date().toISOString(),
    })
    .eq("id", invitation.id);

  return NextResponse.json({ redirect: "/switcher" });
}
