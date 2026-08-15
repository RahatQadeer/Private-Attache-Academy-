import { Logo, Wordmark } from "@/base/components/Logo";
import { StepRow } from "@/base/components/StepRow";
import { Pill } from "@/base/components/Pill";

export function AuthLayout({
  eyebrow,
  title,
  children,
  footer,
}: {
  eyebrow?: string;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <section
        className="hidden lg:flex flex-col justify-between px-12 py-10"
        style={{ background: "var(--surface-soft)", borderRight: "1px solid var(--border)" }}
      >
        <div className="flex items-center gap-2.5">
          <Logo size={28} />
          <Wordmark size={16} trademark />
        </div>
        <div className="max-w-[420px]">
          <p
            className="mb-2 text-[12.5px] font-semibold uppercase tracking-[0.06em]"
            style={{ color: "var(--text-tertiary)" }}
          >
            Whitby in action
          </p>
          <h2 className="text-[32px] font-bold leading-[1.08] tracking-[-0.04em]">
            One request, a clear plan, the next action.
          </h2>
          <div
            className="mt-8 rounded-card bg-surface p-4 shadow-card"
            style={{ border: "1px solid var(--border)" }}
          >
            <div className="mb-3 text-[13.5px] font-medium">
              Relocate the household to Greenwich
            </div>
            <StepRow index={1} title="Confirm school shortlist" done />
            <StepRow
              index={2}
              title="Compare housing options"
              detail="Waiting on preferred neighborhoods"
              active
              trailing={<Pill tone="warning">Waiting on you</Pill>}
            />
            <StepRow index={3} title="Brief travel and arrival" />
          </div>
        </div>
        <p className="text-[13px]" style={{ color: "var(--text-tertiary)" }}>
          Private Attaché™ — a new standard in professional coordination.
        </p>
      </section>
      <section className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-[380px]">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <Logo size={24} />
            <Wordmark size={15} trademark />
          </div>
          {eyebrow ? (
            <p
              className="mb-2 text-[12.5px] font-semibold uppercase tracking-[0.06em]"
              style={{ color: "var(--text-tertiary)" }}
            >
              {eyebrow}
            </p>
          ) : null}
          <h1 className="mb-8 text-[30px] font-bold tracking-[-0.45px] leading-[1.1]">
            {title}
          </h1>
          {children}
          {footer ? <div className="mt-6">{footer}</div> : null}
        </div>
      </section>
    </div>
  );
}
