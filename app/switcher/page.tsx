import Link from "next/link";
import { redirect } from "next/navigation";
import { Logo, Wordmark } from "@/base/components/Logo";
import { ModuleCard } from "@/base/components/ModuleCard";
import { Callout } from "@/base/components/Callout";
import { getSessionProfile } from "@/base/identity/session";
import { productState, visibleProducts } from "@/base/identity/entitlements";
import { isSupabaseConfigured } from "@/base/lib/supabase/server";
import { PRODUCTS, SWITCHER_UNENTITLED } from "@/base/switcher/products";
import type { Entitlement } from "@/base/types";

const glyphs: Record<string, string> = {
  whitbyos: "W",
  client_portal: "C",
  academy: "A",
  partner_center: "P",
};

const DEV_ENTITLEMENTS: Entitlement[] = PRODUCTS.map((product) => ({
  id: product.key,
  user_id: "dev",
  product: product.key,
  workspace_id: product.key === "whitbyos" ? "dev-workspace" : null,
  status: "active",
  is_default_landing: false,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}));

export default async function SwitcherPage() {
  const configured = isSupabaseConfigured();
  const profile = configured ? await getSessionProfile() : null;

  if (configured && !profile) {
    redirect("/login");
  }

  const entitlements = profile?.entitlements ?? (configured ? [] : DEV_ENTITLEMENTS);
  const products = visibleProducts(entitlements);

  return (
    <div className="min-h-screen bg-canvas px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Logo size={26} />
            <Wordmark size={16} trademark />
          </div>
          <form action="/auth/sign-out" method="post">
            <button className="text-[13px]" style={{ color: "var(--text-tertiary)" }}>
              Sign out
            </button>
          </form>
        </div>

        <p
          className="mb-2 text-[12.5px] font-semibold uppercase tracking-[0.06em]"
          style={{ color: "var(--text-tertiary)" }}
        >
          Welcome
          {profile?.user.preferred_name || profile?.user.full_name
            ? ` ${profile.user.preferred_name || profile.user.full_name}`
            : ""}
        </p>
        <h1 className="text-[32px] font-bold tracking-[-0.45px]">
          Choose where to continue
        </h1>
        <p className="mt-2 max-w-xl text-[15px]" style={{ color: "var(--text-secondary)" }}>
          Private Attaché is the app shell. Pick a module to open its placeholder. Sabahat, Rohail,
          Rahat, and Zara replace these pages in their own folders.
        </p>

        {!configured ? (
          <Callout className="mt-5" tone="warning" title="Supabase is not connected">
            The switcher is in preview mode with all four products available.
          </Callout>
        ) : null}

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {products.map((product) => {
            const state = productState(product.key, entitlements);
            const entitled = state === "available";
            return (
              <ModuleCard
                key={product.key}
                name={product.name}
                description={product.description}
                href={entitled ? product.href : product.applyHref || product.href}
                iconBg={product.iconBg}
                iconFg={product.iconFg}
                glyph={glyphs[product.key] ?? product.name[0] ?? "P"}
                state={entitled ? "available" : "inactive"}
                actionLabel={entitled ? "Open" : product.exploreLabel}
              />
            );
          })}
        </div>

        {SWITCHER_UNENTITLED === "hide" ? (
          <p className="mt-6 text-[12.5px]" style={{ color: "var(--text-tertiary)" }}>
            Products without entitlement are hidden.
          </p>
        ) : null}

        <Link href="/" className="mt-6 inline-block text-[13.5px]">
          Back to site
        </Link>
      </div>
    </div>
  );
}
