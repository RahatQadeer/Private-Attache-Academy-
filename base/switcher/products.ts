import type { ProductKey } from "@/base/types";

export type ProductMeta = {
  key: ProductKey;
  name: string;
  href: string;
  description: string;
  comingSoon: string;
  iconBg: string;
  iconFg: string;
  applyHref?: string;
  exploreLabel: string;
};

export const PRODUCTS: ProductMeta[] = [
  {
    key: "whitbyos",
    name: "Whitby",
    href: "/modules/whitbyos",
    description: "Coordinate complex client work from request to follow-through.",
    comingSoon: "Whitby — coming soon",
    iconBg: "var(--module-whitby-bg)",
    iconFg: "var(--module-whitby-fg)",
    exploreLabel: "Explore Whitby",
  },
  {
    key: "client_portal",
    name: "Client Portal",
    href: "/modules/client-portal",
    description: "Give clients one place to respond, approve, and stay informed.",
    comingSoon: "Client Portal — coming soon",
    iconBg: "var(--module-portal-bg)",
    iconFg: "var(--module-portal-fg)",
    exploreLabel: "Explore portal",
  },
  {
    key: "academy",
    name: "Academy",
    href: "/modules/academy",
    description: "Professional education for intelligent coordination.",
    comingSoon: "Academy — coming soon",
    iconBg: "var(--module-academy-bg)",
    iconFg: "var(--module-academy-fg)",
    exploreLabel: "Explore Academy",
  },
  {
    key: "partner_center",
    name: "Partner Center",
    href: "/modules/partner-center",
    description: "Referrals, introductions, and partnership administration.",
    comingSoon: "Partner Center — coming soon",
    iconBg: "var(--module-partner-bg)",
    iconFg: "var(--module-partner-fg)",
    applyHref: "/modules/partner-center",
    exploreLabel: "Apply",
  },
];

export function getProduct(key: ProductKey) {
  const product = PRODUCTS.find((item) => item.key === key);
  if (!product) {
    throw new Error(`Unknown product: ${key}`);
  }
  return product;
}

export const SWITCHER_UNENTITLED =
  process.env.NEXT_PUBLIC_SWITCHER_UNENTITLED === "hide" ? "hide" : "grey";
