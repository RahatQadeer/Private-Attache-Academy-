"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ENGAGEMENTS,
  LESSONS,
  planFor,
  REFERRAL_STAGES,
  type TabKey,
} from "./content";

export function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function useLandingDemo() {
  const [tab, setTab] = useState<TabKey>("whitby");
  const [promptIndex, setPromptIndex] = useState(0);
  const [planStep, setPlanStep] = useState(6);
  const [planRunning, setPlanRunning] = useState(false);
  const [approved, setApproved] = useState(true);
  const [awaitingApproval, setAwaitingApproval] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");
  const [heroDraft, setHeroDraft] = useState("");

  const [engagementIndex, setEngagementIndex] = useState(0);
  const [portalDraft, setPortalDraft] = useState("");
  const [portalSent, setPortalSent] = useState<Record<number, { text: string }[]>>({});

  const [lessonIndex, setLessonIndex] = useState(0);
  const [quizPick, setQuizPick] = useState<number | null>(null);

  const [calcReferrals, setCalcReferrals] = useState(6);
  const [tierIndex, setTierIndex] = useState(1);

  const [referralStage, setReferralStage] = useState(0);
  const [credentialIndex, setCredentialIndex] = useState(0);
  const [specialtyIndex, setSpecialtyIndex] = useState(0);
  const [faqOpen, setFaqOpen] = useState<number | null>(0);
  const [partnerPlaying, setPartnerPlaying] = useState(false);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [statsProgress, setStatsProgress] = useState(0);

  const planIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const referralIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const approvedRef = useRef(approved);
  const statsStartedRef = useRef(false);
  const statsRafRef = useRef<number>(0);

  approvedRef.current = approved;

  const stopPlan = useCallback(() => {
    if (planIntervalRef.current) {
      clearInterval(planIntervalRef.current);
      planIntervalRef.current = null;
    }
  }, []);

  const runPlan = useCallback(
    (from?: number, index?: number) => {
      stopPlan();
      const plan = planFor(index ?? promptIndex);
      let step = typeof from === "number" ? from : 0;
      setPlanStep(step);
      setPlanRunning(true);
      setAwaitingApproval(false);
      if (typeof from !== "number") {
        setApproved(false);
        approvedRef.current = false;
      }

      planIntervalRef.current = setInterval(() => {
        const approvalIndex = plan.findIndex((s) => s.kind === "Approval");
        if (step === approvalIndex && !approvedRef.current) {
          stopPlan();
          setPlanRunning(false);
          setAwaitingApproval(true);
          return;
        }
        step += 1;
        setPlanStep(step);
        if (step >= plan.length) {
          stopPlan();
          setPlanRunning(false);
        }
      }, 520);
    },
    [promptIndex, stopPlan],
  );

  const onApprove = useCallback(() => {
    approvedRef.current = true;
    setApproved(true);
    setAwaitingApproval(false);
    runPlan(planStep);
  }, [planStep, runPlan]);

  const pickPrompt = useCallback(
    (i: number) => {
      stopPlan();
      setPromptIndex(i);
      setCustomPrompt("");
      setPlanStep(0);
      setPlanRunning(false);
      setApproved(false);
      approvedRef.current = false;
      setAwaitingApproval(false);
      runPlan(0, i);
    },
    [runPlan, stopPlan],
  );

  const stopReferralPlay = useCallback(() => {
    if (referralIntervalRef.current) {
      clearInterval(referralIntervalRef.current);
      referralIntervalRef.current = null;
    }
    setPartnerPlaying(false);
  }, []);

  const playReferralFlow = useCallback(() => {
    stopReferralPlay();
    setReferralStage(0);
    setPartnerPlaying(true);
    let step = 0;
    referralIntervalRef.current = setInterval(() => {
      step += 1;
      if (step >= REFERRAL_STAGES.length) {
        stopReferralPlay();
        return;
      }
      setReferralStage(step);
    }, 1400);
  }, [stopReferralPlay]);

  const openDemo = useCallback((key: TabKey) => {
    setTab(key);
    scrollToId("playground");
  }, []);

  const onHeroSubmit = useCallback(() => {
    const text = heroDraft.trim();
    setTab("whitby");
    if (!text) {
      scrollToId("playground");
      return;
    }
    stopPlan();
    setCustomPrompt(text);
    setPromptIndex(3);
    setPlanStep(0);
    setApproved(false);
    approvedRef.current = false;
    setAwaitingApproval(false);
    scrollToId("playground");
    runPlan(0, 3);
  }, [heroDraft, runPlan, stopPlan]);

  const onPortalSend = useCallback(() => {
    const text = portalDraft.trim();
    if (!text) return;
    setPortalSent((prev) => {
      const existing = prev[engagementIndex] ?? [];
      return { ...prev, [engagementIndex]: existing.concat([{ text }]) };
    });
    setPortalDraft("");
  }, [engagementIndex, portalDraft]);

  const startStatsCount = useCallback(() => {
    if (statsStartedRef.current) return;
    statsStartedRef.current = true;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 1300);
      setStatsProgress(p);
      if (p < 1) statsRafRef.current = requestAnimationFrame(tick);
    };
    statsRafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const d = document.documentElement;
      const max = d.scrollHeight - d.clientHeight;
      setScrollProgress(max > 0 ? Math.min(1, d.scrollTop / max) : 0);
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          if (entry.target.hasAttribute("data-rise")) {
            entry.target.classList.add("pa-visible");
          }
          if (entry.target.getAttribute("data-stats") === "1") startStatsCount();
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    document.querySelectorAll<HTMLElement>("[data-rise], [data-stats]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [startStatsCount]);

  useEffect(() => () => {
    stopPlan();
    stopReferralPlay();
    cancelAnimationFrame(statsRafRef.current);
  }, [stopPlan, stopReferralPlay]);

  const plan = planFor(promptIndex);
  const engagement = ENGAGEMENTS[engagementIndex];
  const lesson = LESSONS[lessonIndex];

  return {
    tab,
    setTab,
    openDemo,
    promptIndex,
    pickPrompt,
    plan,
    planStep,
    planRunning,
    approved,
    awaitingApproval,
    onApprove,
    runPlan,
    customPrompt,
    heroDraft,
    setHeroDraft,
    onHeroSubmit,
    engagementIndex,
    setEngagementIndex,
    engagement,
    portalDraft,
    setPortalDraft,
    onPortalSend,
    portalMessages: portalSent[engagementIndex] ?? [],
    lessonIndex,
    setLessonIndex,
    setQuizPick,
    quizPick,
    lesson,
    calcReferrals,
    setCalcReferrals,
    tierIndex,
    setTierIndex,
    referralStage,
    setReferralStage,
    partnerPlaying,
    playReferralFlow,
    stopReferralPlay,
    credentialIndex,
    setCredentialIndex,
    specialtyIndex,
    setSpecialtyIndex,
    faqOpen,
    setFaqOpen,
    scrollProgress,
    scrollY,
    statsProgress,
  };
}

export type LandingDemo = ReturnType<typeof useLandingDemo>;
