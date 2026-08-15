import Link from "next/link";
import { Logo, Wordmark } from "@/base/components/Logo";
import { Button } from "@/base/components/Button";
import { ModuleCard } from "@/base/components/ModuleCard";
import { PRODUCTS } from "@/base/switcher/products";

const glyphs: Record<string, string> = {
  whitbyos: "W",
  client_portal: "C",
  academy: "A",
  partner_center: "P",
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-canvas">
      <header
        className="sticky top-0 z-10 flex items-center justify-between bg-canvas px-8 py-3.5 lg:px-14"
        style={{ borderBottom: "1px solid #f1f1ef" }}
      >
        <div className="flex items-center gap-2.5">
          <Logo size={26} />
          <Wordmark size={15} trademark />
        </div>
        <nav className="hidden items-center gap-7 md:flex">
          {["Platform", "Programs", "Use Cases", "Pricing"].map((item) => (
            <span
              key={item}
              className="text-[14px]"
              style={{ color: "rgba(55,53,47,.7)" }}
            >
              {item}
            </span>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-[14px] no-underline" style={{ color: "var(--ink)" }}>
            Sign in
          </Link>
          <Button href="/signup" variant="dark">
            Get Started
          </Button>
        </div>
      </header>

      <main className="px-8 py-20 lg:px-14">
        <section className="mx-auto max-w-4xl text-center">
          <p
            className="mb-4 text-[12.5px] font-semibold uppercase tracking-[0.06em]"
            style={{ color: "var(--text-tertiary)" }}
          >
            Private Attaché™
          </p>
          <h1 className="text-[52px] font-bold leading-[1.06] tracking-[-1.5px] md:text-[60px]">
            A new standard in professional coordination.
          </h1>
          <p
            className="mx-auto mt-5 max-w-2xl text-[17px] leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            Meet Whitby™ — the intelligent coordination platform inside Private Attaché.
            Run complex client work from request to follow-through.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Button href="/signup" variant="primary">
              Get Started
            </Button>
            <Button href="/login" variant="secondary">
              Sign in
            </Button>
          </div>
        </section>

        <section className="mx-auto mt-20 grid max-w-5xl gap-4 md:grid-cols-2 lg:grid-cols-4">
          {PRODUCTS.map((product) => (
            <ModuleCard
              key={product.key}
              name={product.name}
              description={product.description}
              href="/signup"
              iconBg={product.iconBg}
              iconFg={product.iconFg}
              glyph={glyphs[product.key] ?? product.name[0] ?? "P"}
            />
          ))}
        </section>
      </main>

      <footer
        className="mt-16 px-8 py-14 lg:px-14"
        style={{ background: "var(--ink)", color: "rgba(255,255,255,.65)" }}
      >
        <div className="mx-auto flex max-w-5xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-white text-[18px] font-semibold">
              Get started with Private Attaché™
            </div>
            <p className="mt-1 text-[14px]">
              One identity. Four products. One operating spine for client work.
            </p>
          </div>
          <Button href="/signup" variant="primary">
            Create account
          </Button>
        </div>
        <div
          className="mx-auto mt-10 flex max-w-5xl gap-4 text-[13px]"
          style={{ borderTop: "1px solid rgba(255,255,255,.28)", paddingTop: 18 }}
        >
          <span>Terms</span>
          <span>Privacy</span>
          <span>Accessibility</span>
          <span>Legal</span>
        </div>
      </footer>
    </div>
  );
}
