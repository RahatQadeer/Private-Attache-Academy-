import { createClient, isSupabaseConfigured } from "@/base/lib/supabase/server";
import type { Entitlement, SessionProfile, User, Workspace } from "@/base/types";

export async function getSessionProfile(): Promise<SessionProfile | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) return null;

  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("id", authUser.id)
    .maybeSingle();

  const { data: entitlements } = await supabase
    .from("entitlements")
    .select("*")
    .eq("user_id", authUser.id)
    .in("status", ["active", "trial"]);

  const { data: memberships } = await supabase
    .from("workspace_members")
    .select("workspace_id")
    .eq("user_id", authUser.id)
    .eq("status", "active");

  const workspaceIds = (memberships ?? []).map((row) => row.workspace_id);
  let workspaces: Workspace[] = [];

  if (workspaceIds.length > 0) {
    const { data } = await supabase
      .from("workspaces")
      .select("*")
      .in("id", workspaceIds);
    workspaces = (data ?? []) as Workspace[];
  }

  const profileUser: User = (user as User | null) ?? {
    id: authUser.id,
    email: authUser.email ?? "",
    password_hash: null,
    oauth_provider: authUser.app_metadata?.provider ?? null,
    oauth_id: null,
    full_name:
      (authUser.user_metadata?.full_name as string | undefined) ||
      authUser.email?.split("@")[0] ||
      "Account",
    preferred_name: null,
    salutation: null,
    phone: null,
    avatar_url: (authUser.user_metadata?.avatar_url as string | undefined) ?? null,
    timezone: "UTC",
    status: "active",
    last_login_at: null,
    created_at: authUser.created_at,
    updated_at: authUser.created_at,
  };

  return {
    user: profileUser,
    entitlements: (entitlements ?? []) as Entitlement[],
    workspaces,
  };
}
