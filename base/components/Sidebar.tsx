import Link from "next/link";
import { Logo, Wordmark } from "@/base/components/Logo";
import { Avatar } from "@/base/components/Avatar";
import { cn } from "@/base/lib/cn";

export type NavItem = {
  href: string;
  label: string;
  icon?: React.ReactNode;
};

type SidebarProps = {
  productName: string;
  productHref?: string;
  workspaceName?: string;
  items: NavItem[];
  currentPath: string;
  userName: string;
  userEmail?: string;
  signOutAction?: () => Promise<void>;
};

export function Sidebar({
  productName,
  productHref = "/switcher",
  workspaceName,
  items,
  currentPath,
  userName,
  userEmail,
}: SidebarProps) {
  return (
    <aside
      className="flex h-full w-[210px] shrink-0 flex-col border-r border-line"
      style={{ background: "var(--surface-soft)" }}
    >
      <Link
        href={productHref}
        className="flex items-center gap-2 px-3.5 py-3.5 no-underline"
        style={{ color: "var(--ink)" }}
      >
        <Logo size={22} />
        <div className="min-w-0">
          <Wordmark size={13} />
          <div
            className="truncate text-[11.5px] font-medium"
            style={{ color: "var(--text-tertiary)" }}
          >
            {productName}
          </div>
        </div>
      </Link>

      {workspaceName ? (
        <div className="px-3.5 pb-2">
          <div
            className="text-[11.5px] font-semibold"
            style={{ color: "var(--text-tertiary)" }}
          >
            Workspace
          </div>
          <div className="truncate text-[13px] font-medium">{workspaceName}</div>
        </div>
      ) : null}

      <nav className="flex-1 overflow-y-auto px-2 py-1">
        {items.map((item) => {
          const active =
            currentPath === item.href || currentPath.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "mb-0.5 flex items-center rounded-[6px] px-2.5 py-[7px] text-[13.5px] no-underline",
                active ? "font-semibold" : "font-normal",
              )}
              style={{
                background: active ? "#efefed" : "transparent",
                color: "var(--ink)",
              }}
            >
              <span
                className="mr-2 inline-flex h-[15px] w-[15px] items-center justify-center text-[11px]"
                style={{ color: "rgba(55,53,47,.65)" }}
              >
                {item.icon ?? "·"}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-line px-3 py-3">
        <div className="flex items-center gap-2">
          <Avatar name={userName} size={26} />
          <div className="min-w-0">
            <div className="truncate text-[13px] font-medium">{userName}</div>
            {userEmail ? (
              <div
                className="truncate text-[11.5px]"
                style={{ color: "var(--text-tertiary)" }}
              >
                {userEmail}
              </div>
            ) : null}
          </div>
        </div>
        <form action="/auth/sign-out" method="post">
          <button
            type="submit"
            className="mt-2 text-[12.5px]"
            style={{ color: "var(--text-tertiary)" }}
          >
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
