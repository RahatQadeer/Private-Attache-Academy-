"use client";

import { cn } from "@/base/lib/cn";
import {
  ENGAGEMENTS,
  LESSONS,
  money,
  PROMPT_TEXTS,
  QUIZ_OPTIONS,
  QUIZ_QUESTION,
  TABS,
  TIER_OPTIONS,
} from "./content";
import type { LandingDemo } from "./useLandingDemo";

export function Playground({ demo }: { demo: LandingDemo }) {
  return (
    <section
      id="playground"
      className="scroll-mt-16 border-y border-line bg-surface"
    >
      <div className="mx-auto max-w-[1180px] px-8 py-[72px] lg:px-14">
        <div data-rise="1" className="mb-7 max-w-[660px]">
          <div className="mb-3.5 text-[12.5px] font-semibold uppercase tracking-[0.06em] text-accent">
            Live demo
          </div>
          <h2 className="mb-3.5 text-[36px] font-bold tracking-[-0.8px]">
            Use each module right here.
          </h2>
          <span className="pa-seam mb-3.5" />
          <p className="m-0 text-[16px] leading-[1.6]" style={{ color: "var(--text-secondary)" }}>
            Not a screenshot tour. Pick a prompt, switch a tab, answer a question, move a slider — the mock responds.
          </p>
        </div>

        <div
          data-rise="1"
          className="mb-6 flex flex-wrap gap-2 border-b border-line"
          style={{ transitionDelay: "90ms" }}
        >
          {TABS.map((t) => {
            const active = demo.tab === t.key;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => demo.setTab(t.key)}
                className={cn(
                  "appearance-none border-0 border-b-2 bg-transparent px-3.5 pb-3 pt-2.5 text-[14px] transition-colors",
                  active
                    ? "border-accent font-semibold text-ink"
                    : "border-transparent font-medium text-[rgba(55,53,47,.55)]",
                )}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        <div className="pa-tab-in" key={demo.tab}>
          {demo.tab === "whitby" ? <WhitbyDemo demo={demo} /> : null}
          {demo.tab === "portal" ? <PortalDemo demo={demo} /> : null}
          {demo.tab === "academy" ? <AcademyDemo demo={demo} /> : null}
          {demo.tab === "partner" ? <PartnerDemo demo={demo} /> : null}
        </div>
      </div>
    </section>
  );
}

function WhitbyDemo({ demo }: { demo: LandingDemo }) {
  const activeText =
    demo.promptIndex === 3 ? demo.customPrompt : PROMPT_TEXTS[demo.promptIndex];
  const approvalStep = demo.plan.find((s) => s.kind === "Approval");
  const approvalIndex = demo.plan.findIndex((s) => s.kind === "Approval");
  const showApproval =
    demo.awaitingApproval || demo.planStep > approvalIndex;

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[1fr_1.15fr]">
      <div>
        <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.05em]" style={{ color: "var(--text-tertiary)" }}>
          1. Pick a request
        </div>
        <div className="mb-5 flex flex-col gap-2">
          {PROMPT_TEXTS.map((text, i) => {
            const active = demo.promptIndex === i;
            return (
              <button
                key={text}
                type="button"
                onClick={() => demo.pickPrompt(i)}
                className="rounded-lg px-[13px] py-[11px] text-left text-[13px] leading-[1.5] transition-[border-color,background,color,transform] duration-200 hover:-translate-y-0.5"
                style={{
                  border: `1px solid ${active ? "#2383e2" : "#ececea"}`,
                  background: active ? "#f4f9fe" : "#fff",
                  color: active ? "#1a6bbd" : "rgba(55,53,47,.7)",
                }}
              >
                {text}
              </button>
            );
          })}
        </div>
        <div className="mb-3.5 rounded-lg border border-line-strong bg-surface-soft px-3.5 py-3 text-[13.5px] leading-[1.55] text-ink">
          {activeText}
          <span className="pa-blink ml-0.5 inline-block h-3.5 w-px align-[-2px] bg-accent" />
        </div>
        <button
          type="button"
          onClick={() => demo.runPlan()}
          className="pa-btn rounded-control px-5 py-[11px] text-[14px] font-medium text-white"
          style={{ background: demo.planRunning ? "#1a6bbd" : "#2383e2" }}
        >
          {demo.planRunning ? "Drafting…" : demo.planStep > 0 ? "Draft again" : "Draft the plan"}
        </button>
        <div className="mt-3 text-[12.5px] leading-[1.5]" style={{ color: "var(--text-tertiary)" }}>
          Whitby stops on Approval steps. Nothing client-facing goes out without a decision.
        </div>
      </div>

      <div className="overflow-hidden rounded-card border border-line shadow-float">
        <div className="flex items-center gap-2.5 border-b border-line bg-surface-soft px-5 py-3.5">
          <div className="flex h-5 w-5 items-center justify-center rounded-[7px] bg-accent text-[10px] font-bold text-white">
            W
          </div>
          <span className="flex-1 text-[13px] font-semibold">Drafted plan</span>
          <span className="text-[11.5px]" style={{ color: "var(--text-tertiary)" }}>
            {demo.planStep} of {demo.plan.length} steps
          </span>
        </div>
        <div className="flex min-h-[330px] flex-col gap-2 px-5 py-4">
          {demo.plan.map((step, i) => {
            const done = demo.planStep > i;
            const active = demo.planStep === i && demo.planRunning;
            return (
              <div
                key={step.title}
                className="flex items-center gap-3 rounded-md px-2.5 py-2 transition-all duration-300"
                style={{
                  background: done ? "#fbfdff" : "transparent",
                  opacity: done || active ? 1 : 0.55,
                }}
              >
                <div
                  className="flex h-[19px] w-[19px] shrink-0 items-center justify-center rounded-full text-[11px] text-white"
                  style={
                    done
                      ? { background: "#1c7a52" }
                      : active
                        ? { border: "2px solid #2383e2" }
                        : { border: "2px solid #d9d9d6" }
                  }
                >
                  {done ? "✓" : ""}
                </div>
                <span
                  className="flex-1 text-[13.5px] font-medium"
                  style={{ color: done ? "#37352f" : "rgba(55,53,47,.5)" }}
                >
                  {step.title}
                </span>
                <span
                  className="rounded px-2 py-0.5 text-[10.5px] font-medium"
                  style={{
                    background: done
                      ? step.kind === "Auto"
                        ? "#d6ecd8"
                        : "#f2e2ca"
                      : "#f1f1ef",
                    color: done
                      ? step.kind === "Auto"
                        ? "#1c7a52"
                        : "#7a5a2e"
                      : "rgba(55,53,47,.5)",
                  }}
                >
                  {step.kind}
                </span>
              </div>
            );
          })}
          <div
            className="mt-1.5 flex items-center gap-3 rounded-lg px-3.5 py-3 transition-all duration-300"
            style={{
              border: `1px solid ${demo.awaitingApproval ? "#f2e2ca" : "#d6ecd8"}`,
              background: demo.awaitingApproval ? "#fdf7ee" : "#f4fbf5",
              opacity: showApproval ? 1 : 0,
            }}
          >
            <span
              className="flex-1 text-[12.5px]"
              style={{ color: demo.awaitingApproval ? "#7a5a2e" : "#1c7a52" }}
            >
              {demo.awaitingApproval
                ? `Waiting on you — ${approvalStep?.title.toLowerCase() ?? ""} before Whitby proceeds.`
                : `Approved — ${approvalStep?.title.toLowerCase() ?? ""} cleared, run completed.`}
            </span>
            {demo.awaitingApproval ? (
              <button
                type="button"
                onClick={demo.onApprove}
                className="whitespace-nowrap rounded-control px-[13px] py-[7px] text-[12px] font-medium text-white"
                style={{ background: "#7a5a2e" }}
              >
                Approve & continue
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function PortalDemo({ demo }: { demo: LandingDemo }) {
  return (
    <div className="grid items-start gap-6 lg:grid-cols-[320px_1fr]">
      <div>
        <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.05em]" style={{ color: "var(--text-tertiary)" }}>
          Principal&apos;s engagements
        </div>
        <div className="flex flex-col gap-2">
          {ENGAGEMENTS.map((e, i) => {
            const active = demo.engagementIndex === i;
            return (
              <button
                key={e.name}
                type="button"
                onClick={() => demo.setEngagementIndex(i)}
                className="w-full rounded-[10px] px-4 py-3.5 text-left transition-[border-color,background,transform] duration-200 hover:-translate-y-0.5"
                style={{
                  border: `1px solid ${active ? "#2383e2" : "#ececea"}`,
                  background: active ? "#f4f9fe" : "#fff",
                }}
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex-1 text-[13.5px] font-semibold">{e.name}</span>
                  <span
                    className="rounded px-2 py-0.5 text-[10.5px] font-medium"
                    style={{ background: e.pillBg, color: e.pillFg }}
                  >
                    {e.status}
                  </span>
                </div>
                <div className="mt-1 text-[12.5px]" style={{ color: "rgba(55,53,47,.55)" }}>
                  {e.meta}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-card border border-line px-[26px] py-6 shadow-float">
        <div className="mb-1 text-[19px] font-bold tracking-[-0.3px]">{demo.engagement.name}</div>
        <div className="mb-[22px] text-[13px]" style={{ color: "rgba(55,53,47,.55)" }}>
          {demo.engagement.meta} · Coordinated by {demo.engagement.owner}
        </div>
        <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.05em]" style={{ color: "var(--text-tertiary)" }}>
          Timeline
        </div>
        <div className="mb-6 flex flex-col gap-2.5">
          {demo.engagement.timeline.map((t) => (
            <div key={t.label} className="flex items-start gap-3">
              <div
                className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ background: t.dot }}
              />
              <div className="flex-1">
                <div className="text-[13.5px] font-medium">{t.label}</div>
                <div className="mt-0.5 text-[12px]" style={{ color: "var(--text-tertiary)" }}>
                  {t.when}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.05em]" style={{ color: "var(--text-tertiary)" }}>
          Shared documents
        </div>
        <div className="mb-6 flex flex-col gap-2">
          {demo.engagement.docs.map((d) => (
            <div
              key={d.name}
              className="flex cursor-pointer items-center gap-3 rounded-lg border border-line px-3.5 py-3 transition-[border-color,background,transform] duration-200 hover:-translate-y-0.5 hover:border-accent hover:bg-[#fbfdff]"
            >
              <div
                className="flex h-[26px] w-[26px] items-center justify-center rounded-[7px] text-[10px] font-bold"
                style={{ background: "#f1e9db", color: "#8a6f3e" }}
              >
                PDF
              </div>
              <span className="flex-1 text-[13.5px] font-medium">{d.name}</span>
              <span className="text-[12px]" style={{ color: "var(--text-tertiary)" }}>
                {d.when}
              </span>
            </div>
          ))}
        </div>
        <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.05em]" style={{ color: "var(--text-tertiary)" }}>
          Ask your coordinator
        </div>
        <div className="mb-3 flex flex-col gap-2">
          {demo.portalMessages.map((msg, i) => (
            <div
              key={`${msg.text}-${i}`}
              className="max-w-[80%] self-end rounded-lg border px-[13px] py-2.5 text-[13px]"
              style={{ background: "#e7f1fb", borderColor: "#d3e5ef", color: "#183347" }}
            >
              {msg.text}
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            value={demo.portalDraft}
            onChange={(e) => demo.setPortalDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") demo.onPortalSend();
            }}
            placeholder="Ask about this engagement…"
            className="min-w-[220px] flex-1 rounded-control border border-line-strong px-[13px] py-2.5 text-[13.5px] text-ink"
          />
          <button
            type="button"
            onClick={demo.onPortalSend}
            className="pa-btn rounded-control bg-accent px-[18px] py-2.5 text-[13.5px] font-medium text-white hover:bg-accent-hover"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

function AcademyDemo({ demo }: { demo: LandingDemo }) {
  const picked = demo.quizPick === null ? null : QUIZ_OPTIONS[demo.quizPick];
  const progress = Math.round(((demo.lessonIndex + 1) / LESSONS.length) * 100);

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[300px_1fr]">
      <div>
        <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.05em]" style={{ color: "var(--text-tertiary)" }}>
          Certified Private Attaché
        </div>
        <div className="flex flex-col gap-1.5">
          {LESSONS.map((l, i) => {
            const active = demo.lessonIndex === i;
            return (
              <button
                key={l.title}
                type="button"
                onClick={() => {
                  demo.setLessonIndex(i);
                  demo.setQuizPick(null);
                }}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-[11px] transition-[border-color,background,transform] duration-200 hover:-translate-y-0.5"
                style={{
                  border: `1px solid ${active ? "#6b4fa8" : "#ececea"}`,
                  background: active ? "#f7f5fb" : "#fff",
                }}
              >
                <span className="flex-1 text-left text-[13.5px] font-medium">{l.title}</span>
                <span
                  className="rounded px-[7px] py-0.5 text-[10.5px] font-medium"
                  style={{ background: "#f1f1ef", color: "rgba(55,53,47,.55)" }}
                >
                  {l.kind}
                </span>
              </button>
            );
          })}
        </div>
        <div className="mt-4 text-[12px]" style={{ color: "var(--text-tertiary)" }}>
          Module progress
        </div>
        <div className="mt-2 h-1 rounded-sm bg-line">
          <div
            className="h-full rounded-sm transition-[width] duration-300"
            style={{ background: "#6b4fa8", width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="rounded-card border border-line px-7 py-[26px] shadow-float">
        <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.05em]" style={{ color: "#6b4fa8" }}>
          {demo.lesson.kind}
        </div>
        <div className="mb-3 text-[21px] font-bold tracking-[-0.4px]">{demo.lesson.title}</div>
        <p className="mb-[22px] mt-0 text-[14.5px] leading-[1.65]" style={{ color: "var(--text-secondary)" }}>
          {demo.lesson.body}
        </p>
        {demo.lesson.kind === "Assessment" ? (
          <div>
            <div className="mb-3.5 text-[14.5px] font-semibold">{QUIZ_QUESTION}</div>
            <div className="flex flex-col gap-2">
              {QUIZ_OPTIONS.map((q, i) => {
                const selected = demo.quizPick === i;
                let border = "#ececea";
                let bg = "#fff";
                let color = "rgba(55,53,47,.75)";
                if (selected && q.correct) {
                  border = "#1c7a52";
                  bg = "#d6ecd8";
                  color = "#1c7a52";
                }
                if (selected && !q.correct) {
                  border = "#5d1715";
                  bg = "#ffe2dd";
                  color = "#5d1715";
                }
                return (
                  <button
                    key={q.label}
                    type="button"
                    onClick={() => demo.setQuizPick(i)}
                    className="rounded-lg px-3.5 py-3 text-left text-[13.5px] leading-[1.5] transition-[border-color,background,color,transform] duration-200 hover:-translate-y-0.5"
                    style={{ border: `1px solid ${border}`, background: bg, color }}
                  >
                    {q.label}
                  </button>
                );
              })}
            </div>
            <div
              className="mt-3.5 min-h-5 text-[13px]"
              style={{
                color: picked
                  ? picked.correct
                    ? "#1c7a52"
                    : "#5d1715"
                  : "rgba(55,53,47,.45)",
              }}
            >
              {picked ? picked.note : "Pick an answer."}
            </div>
          </div>
        ) : null}
        {demo.lesson.whitby ? (
          <div
            className="flex items-center gap-3 rounded-lg border px-4 py-3.5"
            style={{ borderColor: "#d3e5ef", background: "#e7f1fb" }}
          >
            <div className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-md bg-accent text-[11px] font-bold text-white">
              W
            </div>
            <span className="flex-1 text-[13px]" style={{ color: "#183347" }}>
              Ask Whitby about this lesson — it explains concepts, never answers graded work.
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function PartnerDemo({ demo }: { demo: LandingDemo }) {
  const tierValue = TIER_OPTIONS[demo.tierIndex].value;
  const gross = tierValue * demo.calcReferrals;

  return (
    <div className="grid items-start gap-6 md:grid-cols-2">
      <div className="rounded-card border border-line px-[26px] py-6">
        <div className="mb-[18px] text-[11px] font-semibold uppercase tracking-[0.05em]" style={{ color: "var(--text-tertiary)" }}>
          Estimate your commission
        </div>
        <div className="mb-2 text-[13px] font-medium">
          Referrals converted per year: <span className="font-bold">{demo.calcReferrals}</span>
        </div>
        <input
          type="range"
          min={1}
          max={24}
          value={demo.calcReferrals}
          onChange={(e) => demo.setCalcReferrals(Number(e.target.value))}
          className="mb-[22px] w-full"
          aria-label="Referrals converted per year"
        />
        <div className="mb-2.5 text-[13px] font-medium">Average engagement value</div>
        <div className="mb-[22px] flex flex-wrap gap-2">
          {TIER_OPTIONS.map((tier, i) => {
            const active = demo.tierIndex === i;
            return (
              <button
                key={tier.label}
                type="button"
                onClick={() => demo.setTierIndex(i)}
                className="pa-btn rounded-control px-[18px] py-[9px] text-[13.5px] font-medium"
                style={{
                  border: `1px solid ${active ? "#2383e2" : "#d9d9d6"}`,
                  background: active ? "#f4f9fe" : "#fff",
                  color: active ? "#1a6bbd" : "rgba(55,53,47,.7)",
                }}
              >
                {tier.label}
              </button>
            );
          })}
        </div>
        <div className="text-[12.5px] leading-[1.55]" style={{ color: "var(--text-tertiary)" }}>
          Illustrative at a 15% commission rate. Actual rate, attribution window, and payment terms live in your Program Terms.
        </div>
      </div>
      <div className="rounded-card border border-line px-[26px] py-6" style={{ background: "#fbfdff" }}>
        <div className="mb-5 text-[11px] font-semibold uppercase tracking-[0.05em]" style={{ color: "var(--text-tertiary)" }}>
          Projected earnings
        </div>
        <div className="mb-1 text-[40px] font-bold tracking-[-1px]">{money(gross * 0.15)}</div>
        <div className="mb-6 text-[13.5px]" style={{ color: "var(--text-secondary)" }}>
          first-year commission
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex justify-between border-b border-line pb-3 text-[13.5px]">
            <span style={{ color: "var(--text-secondary)" }}>Referred engagement value</span>
            <span className="font-semibold">{money(gross)}</span>
          </div>
          <div className="flex justify-between border-b border-line pb-3 text-[13.5px]">
            <span style={{ color: "var(--text-secondary)" }}>Commission rate</span>
            <span className="font-semibold">15%</span>
          </div>
          <div className="flex justify-between text-[13.5px]">
            <span style={{ color: "var(--text-secondary)" }}>Per converted referral</span>
            <span className="font-semibold">{money(tierValue * 0.15)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
