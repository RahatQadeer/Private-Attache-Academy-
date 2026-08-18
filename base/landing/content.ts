export type TabKey = "whitby" | "portal" | "academy" | "partner";
export type StepKind = "Auto" | "Approval";

/** Existing auth entry paths — landing CTAs reuse these, they are not new routes. */
export const LANDING_AUTH = {
  signIn: "/login",
  getStarted: "/signup",
  academy: "/login?brand=academy&next=/academy",
  partnerApply: "/partner-center/apply",
} as const;

export const PROMPT_TEXTS = [
  "Coordinate a relocation for the Hastings family — Zurich to Austin, move date Nov 3.",
  "Prepare the Q3 board packet for the Lindqvist family office.",
  "Staff and open the Aspen residence for the winter season.",
] as const;

export const PLANS: { title: string; kind: StepKind }[][] = [
  [
    { title: "Draft relocation timeline", kind: "Auto" },
    { title: "Confirm tax residency triggers", kind: "Approval" },
    { title: "Schedule shipping & customs", kind: "Auto" },
    { title: "Draft school enrollment brief", kind: "Auto" },
    { title: "Compile visa & immigration checklist", kind: "Approval" },
    { title: "Assemble move-day itinerary", kind: "Auto" },
  ],
  [
    { title: "Pull Q2 statements from custodians", kind: "Auto" },
    { title: "Reconcile entity ledgers", kind: "Auto" },
    { title: "Draft performance summary", kind: "Auto" },
    { title: "Confirm distribution figures", kind: "Approval" },
    { title: "Assemble packet & agenda", kind: "Auto" },
    { title: "Schedule board review", kind: "Auto" },
  ],
  [
    { title: "Confirm opening date & occupancy", kind: "Auto" },
    { title: "Draft staffing plan — 4 roles", kind: "Auto" },
    { title: "Verify vendor insurance certificates", kind: "Approval" },
    { title: "Schedule pre-arrival inspection", kind: "Auto" },
    { title: "Order provisioning list", kind: "Auto" },
    { title: "Brief the house manager", kind: "Auto" },
  ],
  [
    { title: "Interpret the request and scope it", kind: "Auto" },
    { title: "Confirm scope with the engagement owner", kind: "Approval" },
    { title: "Draft the working plan", kind: "Auto" },
    { title: "Assign steps and owners", kind: "Auto" },
    { title: "Compile deliverables", kind: "Auto" },
    { title: "Schedule the review", kind: "Auto" },
  ],
];

export function planFor(index: number) {
  return PLANS[index] ?? PLANS[3];
}

export const MODULES = [
  {
    key: "whitby" as const,
    initial: "W",
    bg: "var(--module-whitby-bg)",
    fg: "var(--module-whitby-fg)",
    title: "Whitby",
    desc: "Turns a request into a plan, runs it, and asks for approval only where it matters.",
    preview: "Try it: pick a request, draft a plan, stop on Approval.",
  },
  {
    key: "portal" as const,
    initial: "CP",
    bg: "var(--module-portal-bg)",
    fg: "var(--module-portal-fg)",
    title: "Client Portal",
    desc: "Where principals see status, documents, and next steps without emailing you for updates.",
    preview: "Try it: switch engagements, open a document, send a note.",
  },
  {
    key: "academy" as const,
    initial: "A",
    bg: "var(--module-academy-bg)",
    fg: "var(--module-academy-fg)",
    title: "Academy",
    desc: "Certifies specialists across eight endorsement tracks, from Family Office Operations to Global Mobility.",
    preview: "Try it: open a lesson, take the assessment, see Whitby stay out of graded work.",
  },
  {
    key: "partner" as const,
    initial: "PC",
    bg: "var(--module-partner-bg)",
    fg: "var(--module-partner-fg)",
    title: "Partner Center",
    desc: "Where referral partners submit opportunities, track earnings, and get paid.",
    preview: "Try it: move the slider and estimate first-year commission.",
  },
];

export const TABS: { key: TabKey; label: string }[] = [
  { key: "whitby", label: "Whitby" },
  { key: "portal", label: "Client Portal" },
  { key: "academy", label: "Academy" },
  { key: "partner", label: "Partner Center" },
];

export const ENGAGEMENTS = [
  {
    name: "Zurich → Austin relocation",
    status: "On track",
    pillBg: "#d6ecd8",
    pillFg: "#1c7a52",
    meta: "Move date Nov 3",
    owner: "M. Pierce",
    timeline: [
      { label: "Relocation timeline approved", when: "Aug 4", dot: "#1c7a52" },
      { label: "Tax residency review returned", when: "Aug 9", dot: "#1c7a52" },
      { label: "Shipping & customs booked", when: "Aug 14", dot: "#2383e2" },
      { label: "School enrollment brief", when: "Due Aug 22", dot: "#e3e3e0" },
    ],
    docs: [
      { name: "Relocation timeline v3", when: "Aug 14" },
      { name: "Residency advisory memo", when: "Aug 9" },
      { name: "Shipping inventory", when: "Aug 14" },
    ],
  },
  {
    name: "Q3 board packet",
    status: "Waiting on you",
    pillBg: "#f2e2ca",
    pillFg: "#7a5a2e",
    meta: "Board review Sep 12",
    owner: "A. Okafor",
    timeline: [
      { label: "Custodian statements collected", when: "Aug 2", dot: "#1c7a52" },
      { label: "Entity ledgers reconciled", when: "Aug 8", dot: "#1c7a52" },
      { label: "Distribution figures need your sign-off", when: "Waiting", dot: "#7a5a2e" },
      { label: "Packet assembly", when: "Blocked", dot: "#e3e3e0" },
    ],
    docs: [
      { name: "Draft performance summary", when: "Aug 8" },
      { name: "Distribution schedule", when: "Aug 8" },
    ],
  },
  {
    name: "Aspen residence opening",
    status: "In progress",
    pillBg: "#d3e5ef",
    pillFg: "#183347",
    meta: "Season opens Dec 1",
    owner: "R. Chandra",
    timeline: [
      { label: "Occupancy dates confirmed", when: "Jul 28", dot: "#1c7a52" },
      { label: "Staffing plan drafted — 4 roles", when: "Aug 6", dot: "#1c7a52" },
      { label: "Vendor insurance verification", when: "In review", dot: "#2383e2" },
      { label: "Pre-arrival inspection", when: "Nov 18", dot: "#e3e3e0" },
    ],
    docs: [
      { name: "Staffing plan — winter", when: "Aug 6" },
      { name: "Vendor certificate pack", when: "Aug 12" },
      { name: "Provisioning list", when: "Aug 15" },
    ],
  },
];

export const LESSONS = [
  {
    title: "The attaché mandate",
    kind: "Video",
    body: "What a principal is actually delegating, where discretion begins, and the three standing obligations that hold across every engagement type.",
    whitby: true,
  },
  {
    title: "Intake and scoping",
    kind: "Reading",
    body: "How to convert a vague request into a scoped engagement: the questions asked first, the ones deferred, and what gets confirmed in writing before work starts.",
    whitby: true,
  },
  {
    title: "Household budget scenario",
    kind: "Scenario",
    body: "An ungraded practice case. A principal asks for a staffing change mid-quarter with no budget headroom. Draft the options memo and compare against the model answer.",
    whitby: true,
  },
  {
    title: "Discretion & confidentiality",
    kind: "Reading",
    body: "Information boundaries between household staff, advisors, and family members — and the escalation path when those boundaries conflict.",
    whitby: true,
  },
  {
    title: "Module assessment",
    kind: "Assessment",
    body: "Graded. Whitby will not answer assessment questions — support is available for concepts only.",
    whitby: false,
  },
];

export const QUIZ_OPTIONS = [
  {
    label: "Escalate to the principal immediately",
    correct: false,
    note: "Too early — the escalation path starts with the engagement owner unless there is a compliance trigger.",
  },
  {
    label: "Document the conflict and raise it with the engagement owner",
    correct: true,
    note: "Correct. Document first, raise through the engagement owner, and escalate only if unresolved or compliance-triggering.",
  },
  {
    label: "Share only what the requesting party already knows",
    correct: false,
    note: "Not sufficient — an information boundary conflict has to be recorded, not worked around.",
  },
];

export const QUIZ_QUESTION =
  "A household staff member shares budget detail with a family member outside the engagement. What do you do first?";

export const TIER_OPTIONS = [
  { label: "$25k", value: 25000 },
  { label: "$60k", value: 60000 },
  { label: "$120k", value: 120000 },
];

export const REFERRAL_STAGES = [
  {
    n: "1",
    title: "Submit",
    hint: "minutes",
    body: "A referral or an enterprise opportunity, with the market and product context Whitby needs to route it.",
  },
  {
    n: "2",
    title: "Protect",
    hint: "attribution window",
    body: "A submitted opportunity stays attributed to you for the full window while it is worked, visible on the opportunity detail.",
  },
  {
    n: "3",
    title: "Track",
    hint: "live status",
    body: "Status, timeline, and the earning basis in one view — In Progress, Converted, or Not Converted, with the reason.",
  },
  {
    n: "4",
    title: "Get paid",
    hint: "fixed schedule",
    body: "Pending becomes Payable once collected, then paid out through Stripe on the schedule in your Program Terms.",
  },
];

export const CREDENTIAL_STAGES = [
  {
    label: "Required learning",
    title: "Required learning",
    body: "Core modules for the credential — video, reading, and ungraded practice scenarios, taken at your own pace with Whitby available for concept questions.",
    duration: "20–30 hours",
    reviewer: "Auto-tracked",
  },
  {
    label: "Applied work",
    title: "Applied work",
    body: "Real case submissions against a published rubric. An instructor reviews each one and either approves it or returns it with specific revisions.",
    duration: "2–4 weeks",
    reviewer: "Instructor",
  },
  {
    label: "Final assessment",
    title: "Final assessment",
    body: "A proctored graded assessment drawn from the program question bank. Whitby is unavailable for graded content by design.",
    duration: "90 minutes",
    reviewer: "Proctored",
  },
  {
    label: "Credential review",
    title: "Credential review",
    body: "Academy staff verify learning, applied work, and assessment records together before anything is awarded.",
    duration: "5 business days",
    reviewer: "Academy admin",
  },
  {
    label: "Awarded",
    title: "Awarded",
    body: "The credential is issued with a verifiable certificate and a 3-year term, and appears on your Private Attaché profile across the ecosystem.",
    duration: "3-year term",
    reviewer: "Academy",
  },
];

export const PROGRAMS = [
  {
    title: "Principal Affairs",
    desc: "Standing coordination for a principal: calendar authority, correspondence handling, and the decision log that keeps delegation clean.",
    modules: ["Delegation and standing authority", "Correspondence protocols", "Decision logs and handover"],
  },
  {
    title: "Family Office Operations",
    desc: "Working alongside a family office: entity structures, reporting cycles, and the board packet calendar.",
    modules: ["Entity map and reporting cycles", "Board packet assembly", "Vendor and advisor coordination"],
  },
  {
    title: "Private Residence Operations",
    desc: "Opening, running, and closing residences — staffing, vendors, provisioning, and seasonal cycles.",
    modules: ["Seasonal opening and closing", "Staffing plans and rotas", "Vendor certification and access"],
  },
  {
    title: "Estate & Legacy Operations",
    desc: "Coordinating estate administration work with counsel and trustees without stepping into advice.",
    modules: ["Trustee and counsel coordination", "Inventory and appraisal tracking", "Succession document handling"],
  },
  {
    title: "Health & Medical Coordination",
    desc: "Care coordination under strict information boundaries, from scheduling to travel-adjacent care.",
    modules: ["Consent and information boundaries", "Specialist scheduling", "Care while travelling"],
  },
  {
    title: "Travel & Global Mobility",
    desc: "Relocation and multi-country moves, including tax residency triggers and cross-border logistics.",
    modules: ["Residency triggers and timelines", "Shipping, customs, and pets", "Schooling and settling-in"],
  },
  {
    title: "Security & Risk Management",
    desc: "Working with security teams: travel risk, residence protocols, and incident escalation.",
    modules: ["Travel risk assessment", "Residence security protocols", "Incident escalation paths"],
  },
  {
    title: "Household & Staffing Operations",
    desc: "Hiring, onboarding, and managing household staff, including payroll and review cycles.",
    modules: ["Role design and hiring", "Onboarding and training", "Payroll and review cycles"],
  },
];

export const FAQS = [
  {
    q: "Does Whitby act on its own?",
    a: "It drafts and runs Auto steps, and stops at every Approval step. Nothing client-facing is sent, and no graded Academy content is answered, without a person deciding.",
  },
  {
    q: "Do the four modules share one login?",
    a: "Yes. One Private Attaché identity carries across Whitby, Client Portal, Academy, and Partner Center, with access scoped per module and per role.",
  },
  {
    q: "Who can join the partner program?",
    a: "Firms and advisors who refer private-client work. Applications go through a short review, then an agreement, then onboarding — company profile, tax profile, and payout setup.",
  },
  {
    q: "How is Academy credentialing verified?",
    a: "Required learning, applied work reviewed by an instructor, and a proctored assessment are checked together in credential review before a credential is awarded on a 3-year term.",
  },
  {
    q: "What do principals see in Client Portal?",
    a: "Engagement status, the timeline of what has happened, shared documents, and next steps — plus a direct line to their coordinator.",
  },
];

export const HERO_CHIPS = [
  { label: "Zurich → Austin move", promptIndex: 0 },
  { label: "Q3 board packet", promptIndex: 1 },
  { label: "Aspen opening", promptIndex: 2 },
];

export const LOGO_CASES = [
  { name: "Kessler Family Office", note: "Board packets and entity reporting, on a quarterly cycle." },
  { name: "Ardent Group", note: "Multi-residence openings across Aspen, London, and Lisbon." },
  { name: "Solstice Partners", note: "Cross-border relocations with tax-residency checkpoints." },
  { name: "Northgate Advisory", note: "Principal affairs with a standing decision log." },
  { name: "Vantage Point Capital", note: "Family-office operations alongside outside counsel." },
  { name: "Marlowe & Reyes", note: "Household staffing plans and seasonal vendor certification." },
];

export const LOGOS = LOGO_CASES.map((item) => item.name);

export const STATS = [
  {
    target: 1204,
    label: "certified specialists in Academy",
    detail: "Across eight endorsement tracks, each on a 3-year term after credential review.",
    jump: "academy" as const,
  },
  {
    target: 82,
    suffix: "%",
    label: "of Whitby runs need zero manual edits",
    detail: "Auto steps complete on their own. Approval steps are the only place a person has to decide.",
    jump: "whitby" as const,
  },
  {
    target: 2,
    prefix: "9 → ",
    label: "days to a confirmed plan, down from 9",
    detail: "A scoped request becomes a drafted plan the same day, then waits on the first Approval.",
    jump: "whitby" as const,
  },
  {
    target: 4,
    label: "modules on one shared identity",
    detail: "Whitby, Client Portal, Academy, and Partner Center — one login, access scoped per role.",
    jump: "ecosystem" as const,
  },
];

export const CLOSER_ROLES = [
  {
    key: "whitby" as const,
    role: "I'm coordinating the work",
    product: "Whitby",
    headline: "Run every engagement from request to follow-through.",
    body: "Draft the plan, let Auto steps move, and stop only where a person has to approve.",
    bullets: ["Scoped requests become runnable plans", "Approval steps never skip", "One workspace for the team"],
    cta: "Start in Whitby",
    href: LANDING_AUTH.getStarted,
  },
  {
    key: "portal" as const,
    role: "I'm the principal",
    product: "Client Portal",
    headline: "See status, documents, and next steps — without chasing email.",
    body: "Your coordinator keeps the engagement visible. You approve when it matters.",
    bullets: ["Live timeline per engagement", "Shared documents in one place", "A direct line to your coordinator"],
    cta: "Enter Client Portal",
    href: LANDING_AUTH.getStarted,
  },
  {
    key: "academy" as const,
    role: "I'm getting certified",
    product: "Academy",
    headline: "Earn the credential, then specialize.",
    body: "Required learning, applied work, and a proctored assessment — reviewed on a 3-year term.",
    bullets: ["Eight specialty endorsements", "Whitby helps with concepts, never graded work", "Verifiable certificate on your profile"],
    cta: "Go to Academy",
    href: LANDING_AUTH.academy,
  },
  {
    key: "partner" as const,
    role: "I refer private-client work",
    product: "Partner Center",
    headline: "Refer once, earn on every renewal.",
    body: "Submit the opportunity, keep attribution while it's worked, and get paid on a fixed schedule.",
    bullets: ["Protection window on submitted work", "Status through to conversion", "Payout on Program Terms"],
    cta: "Apply as a partner",
    href: LANDING_AUTH.partnerApply,
  },
];

export const TALK_TOPICS = [
  { key: "whitby", label: "Using Whitby" },
  { key: "portal", label: "Client Portal" },
  { key: "academy", label: "Academy credential" },
  { key: "partner", label: "Partner program" },
] as const;

export function money(n: number) {
  return "$" + Math.round(n).toLocaleString();
}

export function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}
