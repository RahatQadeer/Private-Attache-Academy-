import { AppShell } from "@/base/components/AppShell";
import { Callout } from "@/base/components/Callout";
import { getSessionProfile } from "@/base/identity/session";
import type { NavItem } from "@/base/components/Sidebar";
import type { ProductKey } from "@/base/types";
import { getProduct } from "@/base/switcher/products";

const NAV: Record<ProductKey, NavItem[]> = {
  whitbyos: [
    { href: "/modules/whitbyos", label: "Home" },
    { href: "/modules/whitbyos", label: "Clients" },
    { href: "/modules/whitbyos", label: "Contacts" },
    { href: "/modules/whitbyos", label: "Providers" },
    { href: "/modules/whitbyos", label: "Requests" },
    { href: "/modules/whitbyos", label: "Playbooks" },
    { href: "/modules/whitbyos", label: "Tasks" },
    { href: "/modules/whitbyos", label: "Calendar" },
    { href: "/modules/whitbyos", label: "Messages" },
    { href: "/modules/whitbyos", label: "Updates" },
    { href: "/modules/whitbyos", label: "Forms" },
    { href: "/modules/whitbyos", label: "Documents" },
    { href: "/modules/whitbyos", label: "Knowledge" },
    { href: "/modules/whitbyos", label: "Insights" },
    { href: "/modules/whitbyos", label: "Reports" },
    { href: "/modules/whitbyos", label: "Integrations" },
    { href: "/modules/whitbyos", label: "Settings" },
  ],
  client_portal: [
    { href: "/modules/client-portal", label: "Home" },
    { href: "/modules/client-portal", label: "Requests" },
    { href: "/modules/client-portal", label: "Calendar" },
    { href: "/modules/client-portal", label: "Messages" },
    { href: "/modules/client-portal", label: "Updates" },
    { href: "/modules/client-portal", label: "Forms" },
    { href: "/modules/client-portal", label: "Documents" },
    { href: "/modules/client-portal", label: "Billing" },
    { href: "/modules/client-portal", label: "Integrations" },
  ],
  academy: [
    { href: "/modules/academy", label: "Dashboard" },
    { href: "/modules/academy", label: "My Learning" },
    { href: "/modules/academy", label: "Explore" },
    { href: "/modules/academy", label: "Certificates & Credentials" },
    { href: "/modules/academy", label: "Resources" },
  ],
  partner_center: [
    { href: "/modules/partner-center", label: "Home" },
    { href: "/modules/partner-center", label: "Referrals" },
    { href: "/modules/partner-center", label: "Opportunities" },
    { href: "/modules/partner-center", label: "Earnings" },
    { href: "/modules/partner-center", label: "Links & Codes" },
    { href: "/modules/partner-center", label: "Company & Team" },
    { href: "/modules/partner-center", label: "Documents" },
    { href: "/modules/partner-center", label: "Messages" },
  ],
};

function portalBrand(workspaceName?: string) {
  return workspaceName ? `${workspaceName} Client Portal` : "Client Portal";
}

export async function ModulePlaceholder({
  product,
}: {
  product: ProductKey;
}) {
  const meta = getProduct(product);
  const profile = await getSessionProfile();
  const workspaceName = profile?.workspaces[0]?.name;
  const productName =
    product === "client_portal"
      ? portalBrand(workspaceName)
      : product === "partner_center"
        ? "Partner Center"
        : meta.name;

  return (
    <AppShell
      productName={productName}
      productHref="/switcher"
      workspaceName={product === "whitbyos" ? workspaceName : undefined}
      items={NAV[product]}
      currentPath={meta.href}
      userName={profile?.user.preferred_name || profile?.user.full_name || "You"}
      userEmail={profile?.user.email}
    >
      <div className="px-8 py-10">
        <p
          className="mb-2 text-[12.5px] font-semibold uppercase tracking-[0.06em]"
          style={{ color: "var(--text-tertiary)" }}
        >
          {product === "partner_center" ? "Private Attaché / Partner Center" : productName}
        </p>
        <h1 className="text-[28px] font-bold tracking-[-0.4px]">{meta.comingSoon}</h1>
        <p className="mt-2 max-w-xl text-[15px]" style={{ color: "var(--text-secondary)" }}>
          {meta.description} This route is the module entry point. Build inside your assigned
          folder — do not fork shared identity, documents, or the design system.
        </p>
        <div className="mt-6 max-w-xl">
          <Callout>
            Ask Whitby, Build with Whitby, and Draft with Whitby are named actions inside this
            shell. Private Attaché remains the app brand in the upper left.
          </Callout>
        </div>
      </div>
    </AppShell>
  );
}
