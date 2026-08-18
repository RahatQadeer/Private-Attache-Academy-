"use client";

import Link from "next/link";
import { useState, type CSSProperties, type ReactNode } from "react";
import { Logo, Wordmark } from "@/base/components/Logo";
import { cn } from "@/base/lib/cn";
import {
  CLOSER_ROLES,
  CREDENTIAL_STAGES,
  easeOutCubic,
  FAQS,
  HERO_CHIPS,
  LANDING_AUTH,
  LOGO_CASES,
  MODULES,
  PROGRAMS,
  PROMPT_TEXTS,
  REFERRAL_STAGES,
  STATS,
  TALK_TOPICS,
} from "./content";
import { Playground } from "./Playground";
import { scrollToId, useLandingDemo } from "./useLandingDemo";
import type { TabKey } from "./content";

function riseStyle(ms: number) {
  return { ["--rise-delay"]: `${ms}ms` } as CSSProperties;
}

export function LandingPage() {
  const demo = useLandingDemo();
  const logos = [...LOGO_CASES, ...LOGO_CASES];
  const statsEase = easeOutCubic(demo.statsProgress);
  const credential = CREDENTIAL_STAGES[demo.credentialIndex];
  const specialty = PROGRAMS[demo.specialtyIndex];
  const [activeLogo, setActiveLogo] = useState<number | null>(null);
  const [expandedStat, setExpandedStat] = useState<number | null>(null);
  const [faqQuery, setFaqQuery] = useState("");
  const [hoveredModule, setHoveredModule] = useState<TabKey | null>(null);

  const activeLogoCase = activeLogo === null ? null : LOGO_CASES[activeLogo % LOGO_CASES.length];
  const faqNeedle = faqQuery.trim().toLowerCase();
  const visibleFaqs = FAQS.map((item, index) => ({ ...item, index })).filter((item) => {
    if (!faqNeedle) return true;
    return item.q.toLowerCase().includes(faqNeedle) || item.a.toLowerCase().includes(faqNeedle);
  });

  return (
    <div className="pa-landing min-h-screen overflow-x-clip bg-canvas text-ink">
      <header
        className={cn(
          "sticky top-0 z-50 border-b bg-[rgba(241,241,239,.9)] backdrop-blur-[8px] transition-[border-color,box-shadow] duration-300",
          demo.scrollY > 8
            ? "border-line shadow-[0_8px_24px_rgba(15,15,15,.04)]"
            : "border-transparent",
        )}
      >
        <div className="mx-auto flex h-16 max-w-[1180px] items-center justify-between gap-4 px-8">
          <Link href="/" className="flex shrink-0 items-center gap-2.5 whitespace-nowrap no-underline">
            <Logo size={26} />
            <Wordmark size={14.5} />
          </Link>
          <nav className="hidden min-w-0 items-center gap-5 lg:flex">
            <NavLink href="#ecosystem">Ecosystem</NavLink>
            <button type="button" className={navLinkClass} onClick={() => demo.openDemo("whitby")}>
              Whitby
            </button>
            <button type="button" className={navLinkClass} onClick={() => demo.openDemo("portal")}>
              Client Portal
            </button>
            <NavLink href="#academy">Academy</NavLink>
            <NavLink href="#partner">Partner Center</NavLink>
          </nav>
          <div className="flex shrink-0 items-center gap-3.5 whitespace-nowrap">
            <Link
              href={LANDING_AUTH.signIn}
              className="text-[13.5px] font-medium no-underline transition-colors duration-200"
              style={{ color: "rgba(55,53,47,.7)" }}
            >
              Sign in
            </Link>
            <Link
              href={LANDING_AUTH.getStarted}
              className="pa-btn rounded-control bg-ink px-4 py-[9px] text-[13.5px] font-medium text-white no-underline hover:text-white"
            >
              Get started
            </Link>
          </div>
        </div>
        <div className="h-0.5">
          <div className="h-full bg-accent pa-scroll-bar" style={{ width: `${demo.scrollProgress * 100}%` }} />
        </div>
      </header>

      <section className="mx-auto flex max-w-[1180px] flex-col gap-11 px-8 pb-16 pt-24 lg:px-14">
        <div className="max-w-[780px]">
          <div className="pa-hero-in mb-4 text-[12.5px] font-semibold uppercase tracking-[0.06em] text-accent">
            The Private Attaché ecosystem
          </div>
          <h1
            className="pa-hero-in mb-[22px] text-[40px] font-bold leading-[1.06] tracking-[-1.6px] md:text-[60px]"
            style={{ animationDelay: "70ms" }}
          >
            Every private-client engagement, coordinated in one place.
          </h1>
          <span className="pa-seam pa-seam-now" />
          <p
            className="pa-hero-in mb-8 mt-[18px] max-w-[640px] text-[18px] leading-[1.6]"
            style={{ color: "var(--text-secondary)", animationDelay: "140ms" }}
          >
            Whitby drafts and runs the work. Client Portal keeps principals informed. Academy certifies the specialists who do it. Partner Center brings in the referrals that grow it.
          </p>
          <div className="pa-hero-in mb-[26px] flex flex-wrap gap-3" style={{ animationDelay: "210ms" }}>
            <button
              type="button"
              onClick={() => demo.openDemo("whitby")}
              className="pa-btn rounded-control bg-accent px-[22px] py-[11px] text-[15px] font-medium text-white hover:bg-accent-hover hover:text-white"
            >
              Try Whitby live
            </button>
            <a
              href="#partner"
              className="pa-btn rounded-control border border-line-strong px-[22px] py-[11px] text-[15px] font-medium text-ink no-underline hover:bg-surface hover:text-ink"
            >
              Become a partner
            </a>
          </div>
          <div className="pa-hero-in max-w-[560px]" style={{ animationDelay: "280ms" }}>
            <div
              className="mb-2.5 text-[12px] font-semibold uppercase tracking-[0.05em]"
              style={{ color: "rgba(55,53,47,.45)" }}
            >
              Or type a request and watch Whitby plan it
            </div>
            <div className="flex flex-wrap items-stretch gap-2">
              <input
                type="text"
                value={demo.heroDraft}
                onChange={(e) => demo.setHeroDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") demo.onHeroSubmit();
                }}
                placeholder="e.g. Open the Lisbon apartment for a two-week stay"
                className="min-w-[280px] flex-1 rounded-control border border-line-strong bg-surface px-[13px] py-2.5 text-[14px] text-ink transition-[border-color,box-shadow] duration-200 focus:border-accent"
              />
              <button
                type="button"
                onClick={demo.onHeroSubmit}
                className="pa-btn whitespace-nowrap rounded-control bg-ink px-[18px] py-[11px] text-[14px] font-medium text-white hover:bg-[#201f1d] hover:text-white"
              >
                Draft it
              </button>
            </div>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {HERO_CHIPS.map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  onClick={() => {
                    demo.setHeroDraft(PROMPT_TEXTS[chip.promptIndex]);
                    demo.pickPrompt(chip.promptIndex);
                    demo.openDemo("whitby");
                  }}
                  className="rounded-control border border-line-strong bg-surface px-3 py-1.5 text-[12.5px] font-medium text-[rgba(55,53,47,.7)] transition-colors duration-200 hover:border-accent hover:text-accent"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div
          style={{
            transform: `translateY(${Math.min(demo.scrollY * 0.08, 28)}px)`,
            transition: "transform 0.2s linear",
            willChange: "transform",
          }}
        >
          <div className="pa-hero-mock-in">
            <div className="pa-float">
              <HeroMock onOpen={() => demo.openDemo("whitby")} />
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-line py-7 pb-14">
        <div
          data-rise="1"
          className="mb-6 text-center text-[12.5px] font-medium"
          style={{ color: "rgba(55,53,47,.45)" }}
        >
          Coordinating work for teams like these (illustrative)
        </div>
        <div
          className="overflow-hidden"
          style={{
            WebkitMaskImage: "linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)",
            maskImage: "linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)",
          }}
        >
          <div className="pa-marquee flex w-max gap-16">
            {logos.map((logo, i) => {
              const selected = activeLogo !== null && i % LOGO_CASES.length === activeLogo;
              return (
                <button
                  key={`${logo.name}-${i}`}
                  type="button"
                  onClick={() =>
                    setActiveLogo((current) =>
                      current === i % LOGO_CASES.length ? null : i % LOGO_CASES.length,
                    )
                  }
                  className="whitespace-nowrap bg-transparent p-0 text-[17px] font-semibold transition-colors duration-200"
                  style={{ color: selected ? "#2383e2" : "rgba(55,53,47,.28)" }}
                >
                  {logo.name}
                </button>
              );
            })}
          </div>
        </div>
        {activeLogoCase ? (
          <div className="mx-auto mt-5 max-w-[640px] rounded-card border border-line bg-surface px-4 py-3 text-center text-[13.5px] leading-[1.55]" style={{ color: "var(--text-secondary)" }}>
            <span className="font-semibold text-ink">{activeLogoCase.name}.</span> {activeLogoCase.note}
          </div>
        ) : null}
      </section>

      <section id="ecosystem" className="mx-auto max-w-[1180px] scroll-mt-16 px-8 py-[72px] lg:px-14">
        <div data-rise="1" className="mb-10 max-w-[660px]">
          <h2 className="mb-3.5 text-[36px] font-bold tracking-[-0.8px]">
            Four surfaces, one coordination layer.
          </h2>
          <span className="pa-seam mb-3.5" />
          <p className="m-0 text-[16px] leading-[1.6]" style={{ color: "var(--text-secondary)" }}>
            Each module does one job well. Pick one to open it below and use it.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {MODULES.map((m, i) => {
            const active = demo.tab === m.key || hoveredModule === m.key;
            return (
            <button
              key={m.key}
              type="button"
              data-rise="1"
              onClick={() => demo.openDemo(m.key)}
              onMouseEnter={() => setHoveredModule(m.key)}
              onMouseLeave={() => setHoveredModule(null)}
              className="pa-card rounded-card border bg-surface px-5 py-6 text-left no-underline"
              style={{
                ...riseStyle(i * 90),
                border: `1px solid ${active ? "#2383e2" : "#ececea"}`,
                background: active ? "#fbfdff" : "#fff",
              }}
            >
              <div
                className="mb-4 flex h-9 w-9 items-center justify-center rounded-swatch text-[14px] font-bold"
                style={{ background: m.bg, color: m.fg }}
              >
                {m.initial}
              </div>
              <div className="mb-2 text-[15.5px] font-semibold text-ink">{m.title}</div>
              <div className="text-[13.5px] leading-[1.55]" style={{ color: "var(--text-secondary)" }}>
                {m.desc}
              </div>
              <div
                className="overflow-hidden text-[12.5px] leading-[1.5] transition-[max-height,opacity,margin] duration-300"
                style={{
                  color: "#2383e2",
                  maxHeight: active ? 48 : 0,
                  opacity: active ? 1 : 0,
                  marginTop: active ? 10 : 0,
                }}
              >
                {m.preview}
              </div>
              <div className="mt-3.5 text-[12.5px] font-medium text-accent">Open demo →</div>
            </button>
            );
          })}
        </div>
      </section>

      <Playground demo={demo} />

      <section className="bg-canvas">
        <div
          data-stats="1"
          className="mx-auto grid max-w-[1180px] gap-6 px-8 py-[72px] sm:grid-cols-2 lg:grid-cols-4 lg:px-14"
        >
          {STATS.map((s, i) => {
            const open = expandedStat === i;
            return (
            <button
              key={s.label}
              type="button"
              data-rise="scale"
              onClick={() => setExpandedStat(open ? null : i)}
              className="rounded-card border bg-transparent p-3 text-left transition-colors duration-200"
              style={{
                ...riseStyle(i * 90),
                border: `1px solid ${open ? "#2383e2" : "transparent"}`,
                background: open ? "#fbfdff" : "transparent",
              }}
            >
              <div className="mb-1.5 text-[40px] font-bold tracking-[-1px]">
                {(s.prefix ?? "") + Math.round(s.target * statsEase).toLocaleString() + (s.suffix ?? "")}
              </div>
              <div className="text-[13.5px] leading-[1.5]" style={{ color: "var(--text-secondary)" }}>
                {s.label}
              </div>
              <div
                className="overflow-hidden text-[12.5px] leading-[1.55] transition-[max-height,opacity,margin] duration-300"
                style={{
                  color: "var(--text-secondary)",
                  maxHeight: open ? 72 : 0,
                  opacity: open ? 1 : 0,
                  marginTop: open ? 8 : 0,
                }}
              >
                {s.detail}{" "}
                <span
                  className="font-medium text-accent"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (s.jump === "ecosystem") scrollToId("ecosystem");
                    else if (s.jump === "academy") scrollToId("academy");
                    else demo.openDemo(s.jump);
                  }}
                >
                  See it →
                </span>
              </div>
            </button>
            );
          })}
        </div>
      </section>

      <section id="partner" className="scroll-mt-16 border-y border-line bg-surface">
        <div className="mx-auto max-w-[1180px] px-8 py-20 lg:px-14">
          <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
            <div data-rise="left">
              <div className="mb-3.5 text-[12.5px] font-semibold uppercase tracking-[0.06em] text-accent">
                Partner Center
              </div>
              <h2 className="mb-[18px] text-[36px] font-bold leading-[1.15] tracking-[-0.8px]">
                Refer once, earn on every renewal.
              </h2>
              <span className="pa-seam mb-4" />
              <p
                className="mb-6 mt-4 text-[16px] leading-[1.65]"
                style={{ color: "var(--text-secondary)" }}
              >
                Submit a referral or an enterprise opportunity, track it through to conversion, and get paid on a fixed schedule — with a protection window so a submitted opportunity stays yours while it&apos;s worked.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={LANDING_AUTH.partnerApply}
                  className="pa-btn rounded-control bg-accent px-[22px] py-[11px] text-[15px] font-medium text-white no-underline hover:bg-accent-hover hover:text-white"
                >
                  Apply to the partner program
                </Link>
                <button
                  type="button"
                  onClick={() => demo.openDemo("partner")}
                  className="pa-btn rounded-control border border-line-strong px-[22px] py-[11px] text-[15px] font-medium text-ink hover:bg-canvas"
                >
                  Estimate commission
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (demo.partnerPlaying) demo.stopReferralPlay();
                    else demo.playReferralFlow();
                  }}
                  className="pa-btn rounded-control border border-line-strong px-[22px] py-[11px] text-[15px] font-medium text-ink hover:bg-canvas"
                >
                  {demo.partnerPlaying ? "Pause the flow" : "Play the flow"}
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-2.5">
              {REFERRAL_STAGES.map((st, i) => {
                const open = demo.referralStage === i;
                return (
                  <button
                    key={st.title}
                    type="button"
                    data-rise="right"
                    onClick={() => {
                      demo.stopReferralPlay();
                      demo.setReferralStage(i);
                    }}
                    className="pa-card w-full rounded-card px-[18px] py-4 text-left"
                    style={{
                      ...riseStyle(i * 80),
                      border: `1px solid ${open ? "#2383e2" : "#ececea"}`,
                      background: open ? "#fbfdff" : "#fff",
                    }}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-lg text-[12.5px] font-bold transition-colors duration-200"
                        style={{
                          background: open ? "#e7f1fb" : "#f1f1ef",
                          color: open ? "#2383e2" : "rgba(55,53,47,.55)",
                        }}
                      >
                        {st.n}
                      </div>
                      <span className="flex-1 text-left text-[14.5px] font-semibold">{st.title}</span>
                      <span className="text-[11.5px]" style={{ color: "rgba(55,53,47,.45)" }}>
                        {st.hint}
                      </span>
                    </div>
                    <div
                      className="overflow-hidden pl-11 text-[13px] leading-[1.6] transition-[max-height,opacity,margin] duration-300 ease-out"
                      style={{
                        color: "var(--text-secondary)",
                        maxHeight: open ? 80 : 0,
                        opacity: open ? 1 : 0,
                        marginTop: open ? 10 : 0,
                      }}
                    >
                      {st.body}
                    </div>
                  </button>
                );
              })}
              <div className="mt-1 flex gap-2">
                <button
                  type="button"
                  className="pa-btn rounded-control border border-line-strong px-3 py-1.5 text-[12.5px] font-medium"
                  onClick={() => {
                    demo.stopReferralPlay();
                    demo.setReferralStage(Math.max(0, demo.referralStage - 1));
                  }}
                >
                  Previous
                </button>
                <button
                  type="button"
                  className="pa-btn rounded-control border border-line-strong px-3 py-1.5 text-[12.5px] font-medium"
                  onClick={() => {
                    demo.stopReferralPlay();
                    demo.setReferralStage(Math.min(REFERRAL_STAGES.length - 1, demo.referralStage + 1));
                  }}
                >
                  Next stage
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="academy" className="mx-auto max-w-[1180px] scroll-mt-16 px-8 py-20 lg:px-14">
        <div data-rise="1" className="mb-9 max-w-[660px]">
          <div className="mb-3.5 text-[12.5px] font-semibold uppercase tracking-[0.06em]" style={{ color: "#6b4fa8" }}>
            Academy
          </div>
          <h2 className="mb-3.5 text-[36px] font-bold tracking-[-0.8px]">
            Eight specialty endorsements, one credential path.
          </h2>
          <span className="pa-seam mb-3.5" />
          <p className="m-0 text-[16px] leading-[1.6]" style={{ color: "var(--text-secondary)" }}>
            Required learning, applied work, and a final assessment — reviewed and awarded on a 3-year term. Click a stage to see what it involves.
          </p>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          {CREDENTIAL_STAGES.map((cs, i) => {
            const active = demo.credentialIndex === i;
            return (
              <button
                key={cs.label}
                type="button"
                onClick={() => demo.setCredentialIndex(i)}
                className="pa-btn rounded-control px-4 py-[9px] text-[13px]"
                style={{
                  border: `1px solid ${active ? "#6b4fa8" : "#ececea"}`,
                  background: active ? "#f7f5fb" : "#fff",
                  color: active ? "#6b4fa8" : "rgba(55,53,47,.65)",
                  fontWeight: active ? 600 : 500,
                }}
              >
                {cs.label}
              </button>
            );
          })}
          <button
            type="button"
            className="pa-btn rounded-control border border-line-strong px-3 py-[9px] text-[13px] font-medium"
            onClick={() => demo.setCredentialIndex(Math.max(0, demo.credentialIndex - 1))}
          >
            Previous
          </button>
          <button
            type="button"
            className="pa-btn rounded-control border border-line-strong px-3 py-[9px] text-[13px] font-medium"
            onClick={() =>
              demo.setCredentialIndex(Math.min(CREDENTIAL_STAGES.length - 1, demo.credentialIndex + 1))
            }
          >
            Next stage
          </button>
        </div>
        <div data-rise="1" className="mb-11 grid items-start gap-8 rounded-card border border-line bg-surface px-[26px] py-6 md:grid-cols-[1fr_220px]">
          <div key={credential.title} className="pa-tab-in">
            <div className="mb-2.5 text-[18px] font-bold tracking-[-0.3px]">{credential.title}</div>
            <p className="m-0 text-[14.5px] leading-[1.65]" style={{ color: "var(--text-secondary)" }}>
              {credential.body}
            </p>
          </div>
          <div key={`${credential.title}-meta`} className="pa-tab-in border-line md:border-l md:pl-6">
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.05em]" style={{ color: "var(--text-tertiary)" }}>
              Typical duration
            </div>
            <div className="text-[15px] font-semibold">{credential.duration}</div>
            <div className="mb-2 mt-[18px] text-[11px] font-semibold uppercase tracking-[0.05em]" style={{ color: "var(--text-tertiary)" }}>
              Reviewed by
            </div>
            <div className="text-[15px] font-semibold">{credential.reviewer}</div>
            <button
              type="button"
              onClick={() => demo.openDemo("academy")}
              className="pa-btn mt-5 rounded-control border border-line-strong px-3 py-1.5 text-[12.5px] font-medium"
            >
              Try this in the demo
            </button>
          </div>
        </div>

        <div className="mb-5 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
          {PROGRAMS.map((p, i) => {
            const active = demo.specialtyIndex === i;
            return (
              <button
                key={p.title}
                type="button"
                data-rise="1"
                onClick={() => demo.setSpecialtyIndex(i)}
                className="pa-card w-full rounded-card px-4 py-[18px] text-left"
                style={{
                  ...riseStyle(i * 55),
                  border: `1px solid ${active ? "#6b4fa8" : "#ececea"}`,
                  background: active ? "#f7f5fb" : "#fff",
                }}
              >
                <div
                  className="mb-3 flex h-[30px] w-[30px] items-center justify-center rounded-lg text-[12.5px] font-bold"
                  style={{ background: active ? "#ddd4ee" : "#e9e4f3", color: "#6b4fa8" }}
                >
                  {p.title[0]}
                </div>
                <div className="text-left text-[13.5px] font-semibold leading-[1.35]">{p.title}</div>
              </button>
            );
          })}
        </div>
        <div data-rise="1" className="grid items-start gap-8 rounded-card border border-line bg-surface px-[26px] py-[22px] md:grid-cols-2">
          <div key={`${specialty.title}-copy`} className="pa-tab-in">
            <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.05em]" style={{ color: "#6b4fa8" }}>
              Specialty endorsement
            </div>
            <div className="mb-2 text-[18px] font-bold tracking-[-0.3px]">{specialty.title}</div>
            <p className="m-0 text-[14px] leading-[1.6]" style={{ color: "var(--text-secondary)" }}>
              {specialty.desc}
            </p>
          </div>
          <div key={`${specialty.title}-mods`} className="pa-tab-in">
            <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.05em]" style={{ color: "var(--text-tertiary)" }}>
              Sample modules
            </div>
            <div className="flex flex-col gap-2">
              {specialty.modules.map((sm) => (
                <div key={sm} className="flex items-center gap-2.5 text-[13.5px]">
                  <div className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "#6b4fa8" }} />
                  <span>{sm}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-surface">
        <div className="mx-auto max-w-[1180px] px-8 py-20 lg:px-14">
          <div data-rise="1" className="mb-9 max-w-[820px]">
            <h2 className="mb-3.5 text-[36px] font-bold tracking-[-0.8px]">Common questions.</h2>
            <span className="pa-seam mb-5" />
            <input
              type="search"
              value={faqQuery}
              onChange={(e) => setFaqQuery(e.target.value)}
              placeholder="Search questions…"
              className="mt-5 w-full max-w-[420px] rounded-control border border-line-strong bg-surface px-[13px] py-2.5 text-[14px] text-ink transition-[border-color] duration-200 focus:border-accent"
            />
          </div>
          <div className="flex max-w-[820px] flex-col gap-2">
            {visibleFaqs.map((f) => {
              const open = demo.faqOpen === f.index;
              return (
                <button
                  key={f.q}
                  type="button"
                  data-rise="1"
                  onClick={() => demo.setFaqOpen(open ? null : f.index)}
                  className="pa-card w-full rounded-card px-5 py-[18px] text-left"
                  style={{
                    ...riseStyle(f.index * 70),
                    border: `1px solid ${open ? "#2383e2" : "#ececea"}`,
                    background: open ? "#fbfdff" : "#fff",
                  }}
                >
                  <div className="flex items-center gap-4">
                    <span className="flex-1 text-left text-[15px] font-semibold">{f.q}</span>
                    <span
                      className="text-[18px] transition-transform duration-200"
                      style={{
                        color: "rgba(55,53,47,.4)",
                        transform: open ? "rotate(45deg)" : "rotate(0deg)",
                      }}
                    >
                      +
                    </span>
                  </div>
                  <div
                    className="overflow-hidden pr-10 text-[14px] leading-[1.65] transition-[max-height,opacity,margin] duration-300 ease-out"
                    style={{
                      color: "var(--text-secondary)",
                      maxHeight: open ? 160 : 0,
                      opacity: open ? 1 : 0,
                      marginTop: open ? 12 : 0,
                    }}
                  >
                    {f.a}
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="text-[12.5px]" style={{ color: "var(--text-tertiary)" }}>
                        Still curious?
                      </span>
                      <span
                        className="text-[12.5px] font-medium text-accent"
                        onClick={(e) => {
                          e.stopPropagation();
                          scrollToId("start");
                        }}
                      >
                        Ask in the closer →
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
            {visibleFaqs.length === 0 ? (
              <div className="rounded-card border border-line px-5 py-4 text-[14px]" style={{ color: "var(--text-secondary)" }}>
                No matches.{" "}
                <button
                  type="button"
                  className="bg-transparent p-0 font-medium text-accent"
                  onClick={() => scrollToId("start")}
                >
                  Ask us below →
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <footer className="bg-ink text-white">
        <div className="mx-auto max-w-[1180px] px-8 pb-14 pt-[88px] lg:px-14">
          <CloserSection onOpenDemo={demo.openDemo} />
          <div className="grid gap-6 border-t border-[rgba(255,255,255,.28)] pt-10 sm:grid-cols-2 lg:grid-cols-4">
            <div data-rise="1" style={riseStyle(0)}>
              <FooterCol title="Product">
                <button type="button" className={footerLinkClass} onClick={() => demo.openDemo("whitby")}>
                  Whitby
                </button>
                <button type="button" className={footerLinkClass} onClick={() => demo.openDemo("portal")}>
                  Client Portal
                </button>
                <a href="#academy" className={footerLinkClass}>
                  Academy
                </a>
                <a href="#partner" className={footerLinkClass}>
                  Partner Center
                </a>
              </FooterCol>
            </div>
            <div data-rise="1" style={riseStyle(80)}>
              <FooterCol title="Company">
                <span className={footerMutedClass}>About</span>
                <span className={footerMutedClass}>Careers</span>
                <button type="button" className={footerLinkClass} onClick={() => scrollToId("start")}>
                  Contact
                </button>
              </FooterCol>
            </div>
            <div data-rise="1" style={riseStyle(160)}>
              <FooterCol title="Resources">
                <span className={footerMutedClass}>Help Center</span>
                <a href="#academy" className={footerLinkClass}>
                  Academy Catalog
                </a>
                <a href="#partner" className={footerLinkClass}>
                  Partner Guide
                </a>
              </FooterCol>
            </div>
            <div data-rise="1" style={riseStyle(240)}>
              <FooterCol title="Legal">
                <span className={footerMutedClass}>Privacy</span>
                <span className={footerMutedClass}>Terms</span>
              </FooterCol>
            </div>
          </div>
          <div className="mt-10 text-[12px]" style={{ color: "rgba(255,255,255,.4)" }}>
            © 2026 Private Attaché.
          </div>
        </div>
      </footer>
    </div>
  );
}

const navLinkClass =
  "shrink-0 cursor-pointer whitespace-nowrap bg-transparent p-0 text-[13.5px] font-medium text-[rgba(55,53,47,.7)] no-underline transition-colors duration-200 hover:text-accent-hover";

const footerLinkClass =
  "cursor-pointer bg-transparent p-0 text-left text-[13.5px] text-[rgba(255,255,255,.75)] no-underline transition-colors duration-200 hover:text-white";

const footerMutedClass = "text-[13.5px]";

function NavLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className={navLinkClass}
      style={{ color: "rgba(55,53,47,.7)" }}
      onClick={(e) => {
        const id = href.replace("#", "");
        if (!id) return;
        e.preventDefault();
        scrollToId(id);
      }}
    >
      {children}
    </a>
  );
}

function FooterCol({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <div
        className="mb-3.5 text-[12px] font-semibold uppercase tracking-[0.05em]"
        style={{ color: "rgba(255,255,255,.45)" }}
      >
        {title}
      </div>
      <div className="flex flex-col gap-2.5" style={{ color: "rgba(255,255,255,.75)" }}>
        {children}
      </div>
    </div>
  );
}

function CloserSection({ onOpenDemo }: { onOpenDemo: (key: TabKey) => void }) {
  const [roleKey, setRoleKey] = useState<TabKey>("whitby");
  const [talkOpen, setTalkOpen] = useState(false);
  const [talkTopic, setTalkTopic] = useState<TabKey>("whitby");
  const [talkNote, setTalkNote] = useState("");
  const [talkReady, setTalkReady] = useState(false);
  const role = CLOSER_ROLES.find((item) => item.key === roleKey) ?? CLOSER_ROLES[0];
  const talkHref = CLOSER_ROLES.find((item) => item.key === talkTopic)?.href ?? LANDING_AUTH.getStarted;

  return (
    <div id="start" className="mb-14 scroll-mt-16">
      <div className="grid items-start gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
        <div data-rise="left">
          <div className="mb-3.5 text-[12.5px] font-semibold uppercase tracking-[0.06em] text-accent">
            Start here
          </div>
          <h2
            key={role.headline}
            className="pa-tab-in mb-[18px] text-[38px] font-bold leading-[1.15] tracking-[-0.8px] text-white"
          >
            {role.headline}
          </h2>
          <span className="pa-seam mb-5" />
          <p
            key={role.body}
            className="pa-tab-in mb-5 mt-4 text-[16px] leading-[1.65]"
            style={{ color: "rgba(255,255,255,.65)" }}
          >
            {role.body}
          </p>
          <ul className="mb-7 flex flex-col gap-2 p-0" style={{ listStyle: "none" }}>
            {role.bullets.map((bullet) => (
              <li key={bullet} className="flex items-start gap-2.5 text-[13.5px]" style={{ color: "rgba(255,255,255,.75)" }}>
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                {bullet}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3">
            <Link
              href={role.href}
              className="pa-btn rounded-control bg-accent px-[22px] py-[11px] text-[15px] font-medium text-white no-underline hover:bg-accent-hover hover:text-white"
            >
              {role.cta}
            </Link>
            <button
              type="button"
              onClick={() => onOpenDemo(role.key)}
              className="pa-btn rounded-control border border-[rgba(255,255,255,.28)] px-[22px] py-[11px] text-[15px] font-medium text-white"
            >
              Try {role.product} live
            </button>
            <button
              type="button"
              onClick={() => {
                setTalkOpen((open) => !open);
                setTalkTopic(role.key);
                setTalkReady(false);
              }}
              className="pa-btn rounded-control border border-[rgba(255,255,255,.28)] px-[22px] py-[11px] text-[15px] font-medium text-white"
            >
              Talk to us
            </button>
          </div>
          {talkOpen ? (
            <div className="pa-tab-in mt-5 rounded-[10px] border border-[rgba(255,255,255,.28)] p-5">
              <div className="mb-3 text-[12px] font-semibold uppercase tracking-[0.05em]" style={{ color: "rgba(255,255,255,.45)" }}>
                What do you want to talk about?
              </div>
              <div className="mb-4 flex flex-wrap gap-2">
                {TALK_TOPICS.map((topic) => {
                  const active = talkTopic === topic.key;
                  return (
                    <button
                      key={topic.key}
                      type="button"
                      onClick={() => {
                        setTalkTopic(topic.key);
                        setTalkReady(false);
                      }}
                      className="rounded-control px-3 py-1.5 text-[12.5px] font-medium"
                      style={{
                        border: `1px solid ${active ? "#2383e2" : "rgba(255,255,255,.28)"}`,
                        background: active ? "rgba(35,131,226,.18)" : "transparent",
                        color: "#fff",
                      }}
                    >
                      {topic.label}
                    </button>
                  );
                })}
              </div>
              <textarea
                value={talkNote}
                onChange={(e) => setTalkNote(e.target.value)}
                rows={3}
                placeholder="Optional note — we’ll take you into the matching account flow."
                className="mb-4 w-full resize-none rounded-control border border-[rgba(255,255,255,.28)] bg-transparent px-3 py-2.5 text-[13.5px] text-white placeholder:text-[rgba(255,255,255,.4)]"
              />
              {talkReady ? (
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-[13.5px]" style={{ color: "rgba(255,255,255,.75)" }}>
                    Continue with your Private Attaché account — that’s how the team picks this up.
                  </span>
                  <Link
                    href={talkHref}
                    className="pa-btn rounded-control bg-accent px-4 py-2 text-[13.5px] font-medium text-white no-underline hover:text-white"
                  >
                    Continue
                  </Link>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setTalkReady(true)}
                  className="pa-btn rounded-control bg-white px-4 py-2 text-[13.5px] font-medium text-ink hover:text-ink"
                >
                  Continue
                </button>
              )}
            </div>
          ) : null}
        </div>

        <div data-rise="right" className="flex flex-col gap-2.5">
          <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.05em]" style={{ color: "rgba(255,255,255,.45)" }}>
            Who are you in the engagement?
          </div>
          {CLOSER_ROLES.map((item) => {
            const active = roleKey === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => {
                  setRoleKey(item.key);
                  setTalkTopic(item.key);
                }}
                className="w-full rounded-[10px] px-4 py-[14px] text-left transition-[border-color,background,transform] duration-200 hover:-translate-y-0.5"
                style={{
                  border: `1px solid ${active ? "#2383e2" : "rgba(255,255,255,.28)"}`,
                  background: active ? "rgba(35,131,226,.16)" : "transparent",
                }}
              >
                <div className="text-[12.5px] font-medium" style={{ color: active ? "#8bb8e8" : "rgba(255,255,255,.5)" }}>
                  {item.role}
                </div>
                <div className="mt-1 text-[15px] font-semibold text-white">{item.product}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function HeroMock({ onOpen }: { onOpen: () => void }) {
  const [active, setActive] = useState(1);
  const steps = [
    { title: "Draft relocation timeline", kind: "Auto", done: true },
    { title: "Confirm tax residency triggers", kind: "Approval" },
    { title: "Schedule shipping & customs", kind: "Auto", muted: true },
  ];

  return (
    <button
      type="button"
      onClick={onOpen}
      className="w-full cursor-pointer overflow-hidden rounded-card border border-line bg-surface text-left shadow-hero transition-shadow duration-500 hover:shadow-[0_16px_48px_rgba(15,15,15,.1)]"
    >
      <div className="flex h-11 items-center gap-2 border-b border-line bg-surface-soft px-4">
        <div className="h-[9px] w-[9px] rounded-full bg-line-dashed" />
        <div className="h-[9px] w-[9px] rounded-full bg-line-dashed" />
        <div className="h-[9px] w-[9px] rounded-full bg-line-dashed" />
        <span className="ml-2.5 text-[12px] font-medium" style={{ color: "rgba(55,53,47,.45)" }}>
          Whitby — Hastings relocation, Zurich → Austin
        </span>
        <span className="ml-auto text-[11.5px] font-medium text-accent">Open live demo →</span>
      </div>
      <div className="flex flex-col md:flex-row">
        <div className="w-full shrink-0 border-b border-line bg-surface-soft px-4 py-[18px] md:w-[230px] md:border-b-0 md:border-r">
          <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.05em]" style={{ color: "var(--text-tertiary)" }}>
            Run progress
          </div>
          <div className="mb-4 h-1 overflow-hidden rounded-sm bg-line">
            <div className="h-full w-[64%] origin-left rounded-sm bg-accent" style={{ animation: "pa-seam 1.2s cubic-bezier(0.22, 0.61, 0.36, 1) 0.6s both" }} />
          </div>
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.05em]" style={{ color: "var(--text-tertiary)" }}>
            Context
          </div>
          <div className="text-[12.5px] leading-[1.6]" style={{ color: "var(--text-secondary)" }}>
            Move date Nov 3. Two dependents. Existing tax residency in CH.
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-[9px] px-[22px] py-5">
          {steps.map((step, i) => (
            <div
              key={step.title}
              onClick={(e) => {
                e.stopPropagation();
                setActive(i);
                onOpen();
              }}
            >
              <MockStep
                title={step.title}
                kind={step.kind}
                done={step.done}
                active={active === i && !step.done}
                muted={step.muted && active !== i}
              />
            </div>
          ))}
        </div>
      </div>
    </button>
  );
}

function MockStep({
  title,
  kind,
  done,
  active,
  muted,
}: {
  title: string;
  kind: string;
  done?: boolean;
  active?: boolean;
  muted?: boolean;
}) {
  return (
    <div
      className={cn("flex items-center gap-2.5 rounded-md px-2.5 py-[9px]", active && "bg-[#fdf7ee]")}
    >
      <div
        className="h-[17px] w-[17px] shrink-0 rounded-full"
        style={
          done
            ? { background: "#1c7a52" }
            : active
              ? { border: "2px solid #7a5a2e" }
              : { border: "2px solid #d9d9d6" }
        }
      />
      <span
        className="flex-1 text-[13.5px] font-medium"
        style={{ color: muted ? "rgba(55,53,47,.5)" : undefined }}
      >
        {title}
      </span>
      <span
        className="rounded px-2 py-0.5 text-[10.5px] font-medium"
        style={
          done
            ? { background: "#d6ecd8", color: "#1c7a52" }
            : active
              ? { background: "#f2e2ca", color: "#7a5a2e" }
              : { background: "#f1f1ef", color: "rgba(55,53,47,.5)" }
        }
      >
        {kind}
      </span>
    </div>
  );
}
