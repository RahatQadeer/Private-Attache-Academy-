import { Sidebar, type NavItem } from "@/base/components/Sidebar";

export function AppShell({
  productName,
  productHref,
  workspaceName,
  items,
  currentPath,
  userName,
  userEmail,
  children,
}: {
  productName: string;
  productHref?: string;
  workspaceName?: string;
  items: NavItem[];
  currentPath: string;
  userName: string;
  userEmail?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-canvas">
      <Sidebar
        productName={productName}
        productHref={productHref}
        workspaceName={workspaceName}
        items={items}
        currentPath={currentPath}
        userName={userName}
        userEmail={userEmail}
      />
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
