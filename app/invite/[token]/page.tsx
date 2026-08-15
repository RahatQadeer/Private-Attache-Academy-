import { AuthLayout } from "@/base/components/AuthLayout";
import { InviteAcceptForm } from "@/base/auth/InviteAcceptForm";
import { createClient, isSupabaseConfigured } from "@/base/lib/supabase/server";
import { Callout } from "@/base/components/Callout";

export default async function InvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  if (!isSupabaseConfigured()) {
    return (
      <AuthLayout title="Invitation">
        <Callout tone="warning">
          Connect Supabase to load invitations. Token: {token}
        </Callout>
      </AuthLayout>
    );
  }

  const supabase = await createClient();
  const { data: invitation } = await supabase
    .from("invitations")
    .select("*")
    .eq("token", token)
    .maybeSingle();

  if (!invitation) {
    return (
      <AuthLayout title="Invitation">
        <Callout tone="danger">This invitation is not valid.</Callout>
      </AuthLayout>
    );
  }

  const { data: inviter } = await supabase
    .from("users")
    .select("full_name")
    .eq("id", invitation.inviter_user_id)
    .maybeSingle();

  const eyebrow =
    invitation.context_type === "partner_team"
      ? "Private Attaché / Partner Center"
      : invitation.context_type.startsWith("client_")
        ? "Client Portal"
        : "Private Attaché";

  return (
    <AuthLayout eyebrow={eyebrow} title="Accept invitation">
      <InviteAcceptForm
        token={token}
        email={invitation.invitee_email}
        inviteeName={invitation.invitee_name}
        inviterName={inviter?.full_name || "A teammate"}
        role={invitation.role_or_relationship || "team member"}
      />
    </AuthLayout>
  );
}
