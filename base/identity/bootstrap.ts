import type { SupabaseClient } from "@supabase/supabase-js";
import type { ProductKey } from "@/base/types";

function slugify(value: string) {
  return (
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 32) || "workspace"
  );
}

const PRODUCTS: ProductKey[] = [
  "whitbyos",
  "client_portal",
  "academy",
  "partner_center",
];

export async function ensureBaseAccount(
  supabase: SupabaseClient,
  user: {
    id: string;
    email?: string | null;
    user_metadata?: Record<string, unknown>;
  },
) {
  const fullName =
    (user.user_metadata?.full_name as string | undefined) ||
    user.email?.split("@")[0] ||
    "Workspace";

  const { data: memberships } = await supabase
    .from("workspace_members")
    .select("workspace_id")
    .eq("user_id", user.id)
    .limit(1);

  let workspaceId = memberships?.[0]?.workspace_id as string | undefined;

  if (!workspaceId) {
    const { data: workspace, error } = await supabase
      .from("workspaces")
      .insert({
        name: `${fullName}'s workspace`,
        url_slug: `${slugify(fullName)}-${user.id.slice(0, 8)}`,
        owner_user_id: user.id,
      })
      .select("id")
      .single();

    if (error) throw error;
    workspaceId = workspace.id;

    await supabase.from("workspace_members").insert({
      workspace_id: workspaceId,
      user_id: user.id,
      role: "owner",
      status: "active",
    });
  }

  const { data: existing } = await supabase
    .from("entitlements")
    .select("product")
    .eq("user_id", user.id);

  const have = new Set((existing ?? []).map((row) => row.product));

  const rows = PRODUCTS.filter((product) => !have.has(product)).map((product) => ({
    user_id: user.id,
    product,
    workspace_id:
      product === "academy" || product === "partner_center" ? null : workspaceId,
    status: "trial" as const,
    is_default_landing: false,
  }));

  if (rows.length > 0) {
    await supabase.from("entitlements").insert(rows);
  }
}
