import { NextResponse } from "next/server";
import { getConfiguredClient, jsonError, missingConfig } from "@/base/auth/http";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48);
}

export async function POST(request: Request) {
  const supabase = await getConfiguredClient();
  if (!supabase) return missingConfig();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return jsonError("Sign in to create a workspace.", 401);

  const body = (await request.json()) as {
    name?: string;
    urlSlug?: string;
    teamSize?: string;
    timezone?: string;
  };

  if (!body.name) return jsonError("Workspace name is required.");
  const urlSlug = slugify(body.urlSlug || body.name);
  if (!urlSlug) return jsonError("Workspace URL is required.");

  const { data: workspace, error } = await supabase
    .from("workspaces")
    .insert({
      name: body.name,
      url_slug: urlSlug,
      team_size: body.teamSize || null,
      timezone: body.timezone || null,
      owner_user_id: user.id,
    })
    .select("*")
    .single();

  if (error) return jsonError(error.message);

  await supabase.from("workspace_members").insert({
    workspace_id: workspace.id,
    user_id: user.id,
    role: "owner",
    status: "active",
  });

  await supabase.from("entitlements").insert({
    user_id: user.id,
    product: "whitbyos",
    workspace_id: workspace.id,
    status: "trial",
    is_default_landing: true,
  });

  return NextResponse.json({ redirect: "/onboarding/work-types" });
}
