"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

type PortalKind = "requester" | "facility" | "partner";
type FieldType = "select" | "date" | "checkbox";
type Tone = "stone" | "green" | "teal" | "blue" | "gold";
type Highlight = "title" | "queue" | "summary" | "timeline" | "actions" | "visibility" | "demo" | null;
type FormValue = string | boolean;

type Field = {
  name: string;
  label: string;
  type: FieldType;
  options?: string[];
  defaultValue?: string;
  required?: boolean;
};

type Action = {
  id: string;
  label: string;
  detail: string;
  eventTitle: string;
  eventDetail: string;
  statusAfter: string;
  submitLabel: string;
  tone: Tone;
  requesterVisible: boolean;
  partnerVisible: boolean;
  fields: Field[];
};

type TimelineEvent = {
  id: string;
  step: number;
  title: string;
  detail: string;
  actor: string;
  badge: string;
  tone: Tone;
  requesterVisible: boolean;
  partnerVisible: boolean;
};

type DemoStep = {
  portal: PortalKind;
  label: string;
  narration: string;
  highlight: Highlight;
  actionId?: string;
  activeField?: string;
  values?: Record<string, FormValue>;
  status?: Partial<Record<PortalKind, string>>;
  summaryDetail?: string;
};

type PortalConfig = {
  title: string;
  eyebrow: string;
  subtitle: string;
  accountName: string;
  accountRole: string;
  subjectMeta: string;
  summaryDetail: string;
  status: string;
  nextStep: string;
  queueTitle: string;
  queueItems: { label: string; detail: string; badge?: string }[];
  cards: { title: string; body: string; badge: string }[];
  actionsTitle: string;
  visibility: string;
  actions: Action[];
};

export type ChurchWorkGuidedPortalDashboardProps = {
  portal: PortalKind;
};

const people = ["Jane Doe", "Elena Morris", "Mary Johnson", "Robert Smith"];
const requestTypes = ["Family Encouragement & Prayer Support", "Pastoral Visit", "Prayer Support", "Church Connection", "Facility Follow-up"];
const partners = ["Morning Pointe Church", "Grace Community Church", "First Assembly Care Team"];
const prayerFocuses = ["Comfort and Peace", "Strength for Family", "Hope and Reassurance", "Thankful Encouragement", "Quiet Presence"];

const portalNames: Record<PortalKind, string> = {
  requester: "Requester Portal",
  facility: "Facility Portal",
  partner: "Partner Portal"
};

const configs: Record<PortalKind, PortalConfig> = {
  requester: {
    eyebrow: "Requester access",
    title: "My Care Request Workspace",
    subtitle: "Submit care requests with guided choices and see approved updates only.",
    accountName: "Sarah K. (Daughter)",
    accountRole: "Requester",
    subjectMeta: "Room 104B · Family Encouragement & Prayer Support",
    summaryDetail: "Requesters use structured choices only. No open-ended medical notes, prayer text, or freeform request boxes are needed.",
    status: "Ready to Submit",
    nextStep: "Choose the request details, confirm the safe-boundary checkbox, and submit for facility review.",
    queueTitle: "Request Snapshot",
    queueItems: [
      { label: "Person", detail: "Jane Doe", badge: "Selected" },
      { label: "Relationship", detail: "Daughter" },
      { label: "Request type", detail: "Family Encouragement & Prayer Support" },
      { label: "Updates", detail: "Text messages" }
    ],
    cards: [
      { title: "Structured Choices", body: "Every requester input is selected from approved choices so the request stays safe and reviewable.", badge: "No Free Text" },
      { title: "Facility Review", body: "The facility reviews consent and decides what can safely be shared with a care partner.", badge: "Human Reviewed" },
      { title: "Approved Updates", body: "Requester view only shows approved status updates and family-safe timeline events.", badge: "Filtered View" }
    ],
    actionsTitle: "Requester Actions",
    visibility: "Requester view shows approved status updates, consent summary, next steps, and family-safe timeline entries only.",
    actions: [
      {
        id: "submit-request",
        label: "Submit Care Request",
        detail: "Use guided choices only",
        eventTitle: "Care request submitted",
        eventDetail: "Sarah submitted a structured care request for Jane Doe.",
        statusAfter: "Submitted",
        submitLabel: "Submit request",
        tone: "green",
        requesterVisible: true,
        partnerVisible: false,
        fields: [
          { name: "person", label: "Who is this request for?", type: "select", options: people, defaultValue: "Jane Doe", required: true },
          { name: "relationship", label: "Relationship", type: "select", options: ["Daughter", "Son", "Spouse", "Resident", "Facility contact"], defaultValue: "Daughter", required: true },
          { name: "requestType", label: "Request type", type: "select", options: requestTypes, defaultValue: "Family Encouragement & Prayer Support", required: true },
          { name: "supportFocus", label: "Support focus", type: "select", options: ["Prayer support", "Family encouragement", "Short visit", "Church check-in"], defaultValue: "Prayer support", required: true },
          { name: "contactPreference", label: "Contact preference", type: "select", options: ["Text messages", "Phone call", "Email"], defaultValue: "Text messages", required: true },
          { name: "acknowledgeNoMedical", label: "I understand this is spiritual-care coordination only and does not include medical details.", type: "checkbox", required: true }
        ]
      },
      {
        id: "request-update",
        label: "Request Update",
        detail: "Choose update type",
        eventTitle: "Requester update requested",
        eventDetail: "Sarah requested an approved status update.",
        statusAfter: "Update Requested",
        submitLabel: "Request update",
        tone: "gold",
        requesterVisible: true,
        partnerVisible: false,
        fields: [
          { name: "updateType", label: "What update is needed?", type: "select", options: ["Visit timing", "Consent status", "Care team status", "Contact preference"], defaultValue: "Visit timing", required: true }
        ]
      }
    ]
  },
  facility: {
    eyebrow: "Facility access",
    title: "Facility Care Workspace",
    subtitle: "Review requests, confirm consent, share approved context, and update the shared timeline.",
    accountName: "Morning Pointe Franklin",
    accountRole: "Facility Team",
    subjectMeta: "Room 104B · Assisted Living · Protestant",
    summaryDetail: "Facility users control review, consent, partner handoff, visit timing, and visibility rules.",
    status: "Awaiting Review",
    nextStep: "Review Jane Doe's request, confirm consent, then share approved context with the partner.",
    queueTitle: "Facility Queue",
    queueItems: [
      { label: "Jane Doe", detail: "Room 104B · new request", badge: "New" },
      { label: "Elena Morris", detail: "Room 108A · consent pending", badge: "Review" },
      { label: "Mary Johnson", detail: "Room 112C · visit follow-up", badge: "Follow-up" }
    ],
    cards: [
      { title: "Consent & Visibility", body: "Facility decides whether each update is requester-visible, partner-visible, or facility-only.", badge: "Facility Controlled" },
      { title: "Partner Sharing", body: "Partners receive limited spiritual-care context, not medical details or unrelated resident information.", badge: "Limited Summary" },
      { title: "Visit Planning", body: "Once sharing is approved, the facility can confirm timing and location.", badge: "Coordinated" }
    ],
    actionsTitle: "Facility Actions",
    visibility: "Facility view shows full workflow, consent status, partner sharing, internal notes, and the complete case timeline.",
    actions: [
      {
        id: "review-request",
        label: "Review Request",
        detail: "Move request into workflow",
        eventTitle: "Request reviewed by facility",
        eventDetail: "Morning Pointe reviewed Jane Doe's request and opened the facility workflow.",
        statusAfter: "Facility Reviewed",
        submitLabel: "Complete review",
        tone: "blue",
        requesterVisible: true,
        partnerVisible: false,
        fields: [
          { name: "requestType", label: "Confirmed request type", type: "select", options: requestTypes, defaultValue: "Family Encouragement & Prayer Support", required: true },
          { name: "facilityDisposition", label: "Facility disposition", type: "select", options: ["Eligible for spiritual-care workflow", "Needs consent review", "Needs family clarification"], defaultValue: "Eligible for spiritual-care workflow", required: true }
        ]
      },
      {
        id: "confirm-consent",
        label: "Confirm Consent",
        detail: "Document sharing permissions",
        eventTitle: "Consent confirmed by facility",
        eventDetail: "Morning Pointe confirmed consent and visibility for the request.",
        statusAfter: "Consent Confirmed",
        submitLabel: "Confirm consent",
        tone: "green",
        requesterVisible: true,
        partnerVisible: true,
        fields: [
          { name: "consentSource", label: "Consent source", type: "select", options: ["Resident", "POA / family contact", "Facility reviewer"], defaultValue: "POA / family contact", required: true },
          { name: "visibility", label: "Approved visibility", type: "select", options: ["Requester + approved partner", "Requester only", "Facility only"], defaultValue: "Requester + approved partner", required: true },
          { name: "confirmed", label: "Consent was reviewed before sharing.", type: "checkbox", required: true }
        ]
      },
      {
        id: "share-partner",
        label: "Share With Partner",
        detail: "Send approved context only",
        eventTitle: "Request shared with partner",
        eventDetail: "Morning Pointe shared the approved spiritual-care summary with Morning Pointe Church.",
        statusAfter: "Shared With Partner",
        submitLabel: "Share approved summary",
        tone: "teal",
        requesterVisible: true,
        partnerVisible: true,
        fields: [
          { name: "partner", label: "Approved partner", type: "select", options: partners, defaultValue: "Morning Pointe Church", required: true },
          { name: "sharingLevel", label: "Sharing level", type: "select", options: ["Limited spiritual-care summary", "Visit details only", "Prayer request only"], defaultValue: "Limited spiritual-care summary", required: true },
          { name: "approved", label: "I confirm this sharing level is approved for this partner.", type: "checkbox", required: true }
        ]
      }
    ]
  },
  partner: {
    eyebrow: "Partner access",
    title: "Partner Care Workspace",
    subtitle: "Accept approved assignments, choose care actions, and report structured outcomes.",
    accountName: "Morning Pointe Church",
    accountRole: "Partner Team",
    subjectMeta: "Room 104B · Prayer Support · Family Encouragement",
    summaryDetail: "Partners see approved context only. Prayer focus and care outcomes use structured options, not custom prayer text.",
    status: "New Assignment",
    nextStep: "Accept the assignment, select an approved prayer focus, and log a structured outcome.",
    queueTitle: "My Assignments",
    queueItems: [
      { label: "Jane Doe", detail: "Prayer support · assigned today", badge: "New" },
      { label: "Elena Morris", detail: "Weekly visit · follow-up due", badge: "Follow-up" },
      { label: "Mary Johnson", detail: "Scripture reading · scheduled", badge: "Visit" }
    ],
    cards: [
      { title: "Approved Need", body: "The approved request is for prayer support, family encouragement, and a short visit.", badge: "Approved Summary" },
      { title: "Prayer Options", body: "The partner selects prayer focus and care approach from structured choices.", badge: "No Custom Prayer Text" },
      { title: "Report Back", body: "Completed care outcomes are sent back to the facility as structured updates.", badge: "Facility Routed" }
    ],
    actionsTitle: "Partner Actions",
    visibility: "Partner view shows approved assignments, approved request details, partner-visible timeline entries, and report-back actions only.",
    actions: [
      {
        id: "accept-assignment",
        label: "Accept Assignment",
        detail: "Take responsibility for this care action",
        eventTitle: "Assignment accepted",
        eventDetail: "Morning Pointe Church accepted the approved care assignment.",
        statusAfter: "Assignment Accepted",
        submitLabel: "Accept assignment",
        tone: "green",
        requesterVisible: false,
        partnerVisible: true,
        fields: [
          { name: "assignmentScope", label: "Assignment scope", type: "select", options: ["Prayer support", "Visit and prayer support", "Family encouragement", "Church connection"], defaultValue: "Visit and prayer support", required: true },
          { name: "accepted", label: "I accept this assignment for the partner team.", type: "checkbox", required: true }
        ]
      },
      {
        id: "select-prayer-focus",
        label: "Select Prayer Focus",
        detail: "Choose an approved prayer category",
        eventTitle: "Prayer focus selected",
        eventDetail: "Morning Pointe Church selected an approved prayer focus.",
        statusAfter: "Prayer Focus Selected",
        submitLabel: "Save prayer focus",
        tone: "teal",
        requesterVisible: false,
        partnerVisible: true,
        fields: [
          { name: "prayerFocus", label: "Prayer focus", type: "select", options: prayerFocuses, defaultValue: "Comfort and Peace", required: true },
          { name: "careApproach", label: "Care approach", type: "select", options: ["Brief visit", "Quiet prayer", "Encouragement note", "Family encouragement"], defaultValue: "Brief visit", required: true }
        ]
      },
      {
        id: "log-outcome",
        label: "Log Care Outcome",
        detail: "Report a structured outcome",
        eventTitle: "Partner care outcome logged",
        eventDetail: "Morning Pointe Church logged a structured care outcome back to the facility.",
        statusAfter: "Outcome Logged",
        submitLabel: "Log outcome",
        tone: "green",
        requesterVisible: true,
        partnerVisible: true,
        fields: [
          { name: "outcome", label: "Care outcome", type: "select", options: ["Prayer support offered", "Visit completed", "Follow-up requested", "Facility update needed"], defaultValue: "Prayer support offered", required: true },
          { name: "nextStep", label: "Next step", type: "select", options: ["No further action today", "Facility follow-up", "Schedule another visit", "Family update recommended"], defaultValue: "No further action today", required: true },
          { name: "shareWithFacility", label: "Share this completed outcome with the facility.", type: "checkbox", required: true }
        ]
      }
    ]
  }
};

const demoSteps: DemoStep[] = [
  { portal: "requester", label: "Step 1 of 20 · Start", narration: "We start in the requester portal. Sarah will use controlled choices only.", highlight: "title", status: { requester: "Ready to Submit", facility: "Awaiting Review", partner: "Waiting for Assignment" }, summaryDetail: "Sarah uses preselected choices only. No open text request is needed to start a spiritual-care workflow." },
  { portal: "requester", label: "Step 2 of 20 · Select person", narration: "The form opens inline. Sarah selects Jane Doe from the approved list.", highlight: "actions", actionId: "submit-request", activeField: "person", values: { person: "Jane Doe" } },
  { portal: "requester", label: "Step 3 of 20 · Relationship", narration: "Sarah chooses Daughter from a fixed dropdown.", highlight: "actions", actionId: "submit-request", activeField: "relationship", values: { person: "Jane Doe", relationship: "Daughter" } },
  { portal: "requester", label: "Step 4 of 20 · Request type", narration: "Sarah selects Family Encouragement and Prayer Support.", highlight: "actions", actionId: "submit-request", activeField: "requestType", values: { person: "Jane Doe", relationship: "Daughter", requestType: "Family Encouragement & Prayer Support" } },
  { portal: "requester", label: "Step 5 of 20 · Support focus", narration: "Sarah selects Prayer support and text messages for updates.", highlight: "actions", actionId: "submit-request", activeField: "supportFocus", values: { person: "Jane Doe", relationship: "Daughter", requestType: "Family Encouragement & Prayer Support", supportFocus: "Prayer support", contactPreference: "Text messages" } },
  { portal: "requester", label: "Step 6 of 20 · Safe boundary", narration: "Sarah confirms this is spiritual-care coordination only, not medical communication.", highlight: "actions", actionId: "submit-request", activeField: "acknowledgeNoMedical", values: { person: "Jane Doe", relationship: "Daughter", requestType: "Family Encouragement & Prayer Support", supportFocus: "Prayer support", contactPreference: "Text messages", acknowledgeNoMedical: true } },
  { portal: "requester", label: "Step 7 of 20 · Timeline update", narration: "The structured request is now recorded on the requester timeline.", highlight: "timeline", status: { requester: "Submitted" } },
  { portal: "facility", label: "Step 8 of 20 · Facility queue", narration: "The facility receives Jane Doe's request in its queue for review.", highlight: "queue", status: { facility: "Awaiting Review" }, summaryDetail: configs.facility.summaryDetail },
  { portal: "facility", label: "Step 9 of 20 · Facility review", narration: "Morning Pointe reviews the request and confirms it is eligible for spiritual-care workflow.", highlight: "actions", actionId: "review-request", activeField: "facilityDisposition", values: { requestType: "Family Encouragement & Prayer Support", facilityDisposition: "Eligible for spiritual-care workflow" } },
  { portal: "facility", label: "Step 10 of 20 · Review recorded", narration: "The review is now recorded on the shared timeline.", highlight: "timeline", status: { facility: "Facility Reviewed" } },
  { portal: "facility", label: "Step 11 of 20 · Consent", narration: "The facility confirms consent and chooses requester plus approved partner visibility.", highlight: "actions", actionId: "confirm-consent", activeField: "visibility", values: { consentSource: "POA / family contact", visibility: "Requester + approved partner", confirmed: true } },
  { portal: "facility", label: "Step 12 of 20 · Consent recorded", narration: "Consent is documented before any partner receives information.", highlight: "timeline", status: { facility: "Consent Confirmed" } },
  { portal: "facility", label: "Step 13 of 20 · Share approved context", narration: "The facility shares only a limited spiritual-care summary with Morning Pointe Church.", highlight: "actions", actionId: "share-partner", activeField: "sharingLevel", values: { partner: "Morning Pointe Church", sharingLevel: "Limited spiritual-care summary", approved: true } },
  { portal: "partner", label: "Step 14 of 20 · Partner assignment", narration: "The partner receives the approved assignment and sees only approved context.", highlight: "queue", status: { facility: "Shared With Partner", partner: "New Assignment" }, summaryDetail: configs.partner.summaryDetail },
  { portal: "partner", label: "Step 15 of 20 · Accept", narration: "The partner accepts responsibility for visit and prayer support.", highlight: "actions", actionId: "accept-assignment", activeField: "assignmentScope", values: { assignmentScope: "Visit and prayer support", accepted: true } },
  { portal: "partner", label: "Step 16 of 20 · Accepted recorded", narration: "The accepted assignment is recorded for the partner and facility.", highlight: "timeline", status: { partner: "Assignment Accepted" } },
  { portal: "partner", label: "Step 17 of 20 · Prayer focus", narration: "The partner does not type a custom prayer. The partner selects Comfort and Peace.", highlight: "actions", actionId: "select-prayer-focus", activeField: "prayerFocus", values: { prayerFocus: "Comfort and Peace", careApproach: "Brief visit" } },
  { portal: "partner", label: "Step 18 of 20 · Outcome", narration: "The partner logs a structured outcome: prayer support offered and no further action today.", highlight: "actions", actionId: "log-outcome", activeField: "outcome", values: { outcome: "Prayer support offered", nextStep: "No further action today", shareWithFacility: true } },
  { portal: "partner", label: "Step 19 of 20 · Outcome recorded", narration: "The structured outcome is recorded and shared back to the facility.", highlight: "timeline", status: { partner: "Outcome Logged" } },
  { portal: "requester", label: "Step 20 of 20 · Requester update", narration: "Sarah sees approved updates only. Internal facility and partner workflow details remain hidden.", highlight: "timeline", status: { requester: "Care Outcome Logged" }, summaryDetail: "Sarah sees the approved care outcome and next step without facility-only notes or partner-only workflow details." }
];

const demoEvents: TimelineEvent[] = [
  { id: "submitted", step: 6, title: "Care request submitted", detail: "Sarah submitted: Jane Doe · Daughter · Family Encouragement & Prayer Support · Text messages.", actor: "Sarah K. (Daughter)", badge: "Submitted", tone: "green", requesterVisible: true, partnerVisible: false },
  { id: "reviewed", step: 8, title: "Request reviewed by facility", detail: "Morning Pointe confirmed the request is eligible for spiritual-care workflow.", actor: "Morning Pointe Franklin", badge: "Reviewed", tone: "blue", requesterVisible: true, partnerVisible: false },
  { id: "consent", step: 10, title: "Consent confirmed", detail: "Consent source: POA / family contact · Visibility: requester plus approved partner.", actor: "Morning Pointe Franklin", badge: "Consent", tone: "green", requesterVisible: true, partnerVisible: true },
  { id: "shared", step: 12, title: "Shared with partner", detail: "A limited spiritual-care summary was shared with Morning Pointe Church.", actor: "Morning Pointe Franklin", badge: "Shared", tone: "teal", requesterVisible: true, partnerVisible: true },
  { id: "accepted", step: 14, title: "Assignment accepted", detail: "Morning Pointe Church accepted visit and prayer support.", actor: "Morning Pointe Church", badge: "Accepted", tone: "green", requesterVisible: false, partnerVisible: true },
  { id: "focus", step: 16, title: "Prayer focus selected", detail: "Prayer focus: Comfort and Peace · Care approach: Brief visit. No custom prayer text was typed.", actor: "Morning Pointe Church", badge: "Prayer Focus", tone: "teal", requesterVisible: false, partnerVisible: true },
  { id: "outcome", step: 18, title: "Partner care outcome logged", detail: "Outcome: prayer support offered · Next step: no further action today.", actor: "Morning Pointe Church", badge: "Outcome", tone: "green", requesterVisible: true, partnerVisible: true }
];

const readyEvent: TimelineEvent = {
  id: "ready",
  step: -1,
  title: "Demo ready",
  detail: "Start the guided demo, then use Next to move one step at a time.",
  actor: "ChurchWork",
  badge: "Ready",
  tone: "stone",
  requesterVisible: true,
  partnerVisible: true
};

function toneClasses(tone: Tone) {
  const classes: Record<Tone, string> = {
    stone: "border-[#d8d0c0] bg-[#fbf8f0] text-[#4d5d55]",
    green: "border-[#b7d1c0] bg-[#eef6f0] text-[#315f44]",
    teal: "border-[#9fc6bd] bg-[#edf7f5] text-[#275d55]",
    blue: "border-[#b5c8d4] bg-[#eef4f7] text-[#385d70]",
    gold: "border-[#e5c071] bg-[#fff7e6] text-[#76551c]"
  };
  return classes[tone];
}

function defaultValues(action: Action) {
  return action.fields.reduce<Record<string, FormValue>>((values, field) => {
    values[field.name] = field.type === "checkbox" ? false : field.defaultValue ?? field.options?.[0] ?? "";
    return values;
  }, {});
}

function actionFor(portal: PortalKind, actionId?: string) {
  if (!actionId) return null;
  return configs[portal].actions.find((action) => action.id === actionId) ?? null;
}

function eventVisible(event: TimelineEvent, portal: PortalKind) {
  if (portal === "facility") return true;
  if (portal === "partner") return event.partnerVisible;
  return event.requesterVisible;
}

function chooseVoice() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return undefined;
  const voices = window.speechSynthesis.getVoices().filter((voice) => voice.lang.toLowerCase().startsWith("en"));
  return voices.find((voice) => /samantha|ava|jenny|aria|emma|natural|female|warm/i.test(`${voice.name} ${voice.voiceURI}`)) ?? voices.find((voice) => voice.lang.toLowerCase().startsWith("en-us")) ?? voices[0];
}

function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.94;
  utterance.pitch = 1.02;
  utterance.volume = 0.86;
  const voice = chooseVoice();
  if (voice) utterance.voice = voice;
  window.speechSynthesis.speak(utterance);
}

function fieldDetail(action: Action, values: Record<string, FormValue>) {
  const details = action.fields
    .filter((field) => field.type !== "checkbox")
    .map((field) => `${field.label}: ${String(values[field.name] ?? field.defaultValue ?? "")}`);
  return `${action.eventDetail} ${details.join(" · ")}.`;
}

export function ChurchWorkGuidedPortalDashboard({ portal }: ChurchWorkGuidedPortalDashboardProps) {
  const [displayPortal, setDisplayPortal] = useState<PortalKind>(portal);
  const [demoIndex, setDemoIndex] = useState<number | null>(null);
  const [voiceOn, setVoiceOn] = useState(true);
  const [manualEvents, setManualEvents] = useState<TimelineEvent[]>([]);
  const [activeAction, setActiveAction] = useState<Action | null>(null);
  const [values, setValues] = useState<Record<string, FormValue>>({});
  const [activeField, setActiveField] = useState<string | null>(null);
  const [status, setStatus] = useState<Record<PortalKind, string>>({ requester: configs.requester.status, facility: configs.facility.status, partner: configs.partner.status });
  const [summaryDetail, setSummaryDetail] = useState(configs[portal].summaryDetail);

  const demoRunning = demoIndex !== null;
  const step = demoRunning ? demoSteps[demoIndex] : null;
  const config = configs[displayPortal];
  const timeline = useMemo(() => {
    const guidedEvents = demoRunning ? demoEvents.filter((event) => event.step <= demoIndex) : [];
    return [...manualEvents, ...guidedEvents, readyEvent].filter((event) => eventVisible(event, displayPortal));
  }, [demoRunning, demoIndex, manualEvents, displayPortal]);

  function ring(target: Highlight) {
    return step?.highlight === target ? "ring-4 ring-[#cbbbea] ring-offset-4 ring-offset-[#f7f3ea]" : "";
  }

  function applyStep(index: number, shouldSpeak = true) {
    const next = demoSteps[index];
    const nextAction = actionFor(next.portal, next.actionId);
    const statusFromSteps = demoSteps.slice(0, index + 1).reduce<Partial<Record<PortalKind, string>>>((acc, item) => ({ ...acc, ...item.status }), {});

    setDemoIndex(index);
    setDisplayPortal(next.portal);
    setStatus({ requester: configs.requester.status, facility: configs.facility.status, partner: configs.partner.status, ...statusFromSteps });
    setSummaryDetail(next.summaryDetail ?? configs[next.portal].summaryDetail);
    setActiveField(next.activeField ?? null);

    if (nextAction) {
      setActiveAction(nextAction);
      setValues({ ...defaultValues(nextAction), ...(next.values ?? {}) });
    } else {
      setActiveAction(null);
      setValues({});
    }

    if (voiceOn && shouldSpeak) speak(next.narration);
  }

  function startDemo() {
    setManualEvents([]);
    setDisplayPortal("requester");
    applyStep(0);
  }

  function endDemo() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
    setDemoIndex(null);
    setActiveAction(null);
    setActiveField(null);
    setDisplayPortal(portal);
    setSummaryDetail(configs[portal].summaryDetail);
  }

  function moveDemo(delta: number) {
    if (demoIndex === null) return;
    applyStep(Math.max(0, Math.min(demoSteps.length - 1, demoIndex + delta)));
  }

  function openAction(action: Action) {
    if (demoRunning) return;
    setActiveAction(action);
    setActiveField(null);
    setValues(defaultValues(action));
  }

  function submitAction(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!activeAction) return;
    const newEvent: TimelineEvent = {
      id: `${displayPortal}-${activeAction.id}-${Date.now()}`,
      step: 0,
      title: activeAction.eventTitle,
      detail: fieldDetail(activeAction, values),
      actor: config.accountName,
      badge: activeAction.label,
      tone: activeAction.tone,
      requesterVisible: activeAction.requesterVisible,
      partnerVisible: activeAction.partnerVisible
    };
    setManualEvents((items) => [newEvent, ...items]);
    setStatus((items) => ({ ...items, [displayPortal]: activeAction.statusAfter }));
    setActiveAction(null);
  }

  function renderField(field: Field) {
    const isActive = activeField === field.name;
    const shell = isActive ? "border-[#8f7bb8] bg-[#f4effc] ring-4 ring-[#cbbbea]" : "border-[#d8d0c0] bg-white";
    if (field.type === "checkbox") {
      return (
        <label key={field.name} className={`flex gap-3 rounded-2xl border p-4 text-sm font-bold leading-6 text-[#5f4b1f] transition ${shell}`}>
          <input type="checkbox" checked={Boolean(values[field.name])} onChange={(event) => setValues((prev) => ({ ...prev, [field.name]: event.target.checked }))} className="mt-1 h-5 w-5" />
          <span>{field.label}</span>
        </label>
      );
    }
    if (field.type === "date") {
      return (
        <label key={field.name} className={`block rounded-2xl border p-4 text-sm font-bold text-[#173b2d] transition ${shell}`}>
          {field.label}
          <input type="date" value={String(values[field.name] ?? field.defaultValue ?? "")} onChange={(event) => setValues((prev) => ({ ...prev, [field.name]: event.target.value }))} className="mt-2 w-full rounded-xl border border-[#d8d0c0] bg-white px-4 py-3 text-sm text-[#102b3a]" />
        </label>
      );
    }
    return (
      <label key={field.name} className={`block rounded-2xl border p-4 text-sm font-bold text-[#173b2d] transition ${shell}`}>
        {field.label}
        <select value={String(values[field.name] ?? field.defaultValue ?? "")} onChange={(event) => setValues((prev) => ({ ...prev, [field.name]: event.target.value }))} className="mt-2 w-full rounded-xl border border-[#d8d0c0] bg-white px-4 py-3 text-sm text-[#102b3a]">
          {(field.options ?? []).map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
      </label>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f3ea] text-[#102b3a]">
      <header className="border-b border-white/10 bg-[#0d2b3b] text-white shadow-lg shadow-[#0d2b3b]/15">
        <div className="mx-auto flex max-w-[92rem] flex-col gap-4 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
          <Link href="/" className="flex items-center gap-3" aria-label="ChurchWork home">
            <span className="flex h-12 w-20 items-center justify-center rounded-2xl bg-white p-2 shadow-sm">
              <img src="/brand/churchwork-corner-logo.png" alt="ChurchWork CW logo" className="h-full w-full object-contain" />
            </span>
            <span>
              <span className="block font-serif text-2xl font-semibold tracking-[-0.04em]">Church<span className="text-[#3f806e]">Work</span></span>
              <span className="block text-xs font-bold text-[#d4dedc]">{portalNames[displayPortal]}</span>
            </span>
          </Link>
          <div className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold text-[#edf5e6]">Structured choices · role-safe timeline · step-by-step demo</div>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <button type="button" onClick={startDemo} className="rounded-full bg-[#cbbbea] px-4 py-2 text-xs font-black text-[#16243a] shadow-sm hover:bg-[#d8cff1]">Start Guided Demo</button>
            <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-2 text-right">
              <p className="font-black">{config.accountName}</p>
              <p className="text-xs font-semibold text-[#d4dedc]">{config.accountRole}</p>
            </div>
          </div>
        </div>
      </header>

      {demoRunning && step ? (
        <section className={`mx-auto mt-5 max-w-[92rem] px-5 ${ring("demo")}`} aria-live="polite">
          <div className="rounded-[1.5rem] border border-[#cbbbea] bg-[#f4effc] p-5 shadow-lg shadow-[#5b4a83]/10">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#5b4a83]">{step.label}</p>
                <p className="mt-2 max-w-4xl text-base font-black leading-7 text-[#16243a]">{step.narration}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button type="button" onClick={() => setVoiceOn((value) => !value)} className="rounded-full border border-[#cbbbea] bg-white px-4 py-2 text-xs font-black text-[#5b4a83]">Voice {voiceOn ? "On" : "Off"}</button>
                <button type="button" onClick={() => voiceOn && speak(step.narration)} className="rounded-full border border-[#cbbbea] bg-white px-4 py-2 text-xs font-black text-[#5b4a83]">Replay Voice</button>
                <button type="button" onClick={() => moveDemo(-1)} disabled={demoIndex === 0} className="rounded-full border border-[#cbbbea] bg-white px-4 py-2 text-xs font-black text-[#5b4a83] disabled:opacity-50">Back</button>
                <button type="button" onClick={() => moveDemo(1)} disabled={demoIndex === demoSteps.length - 1} className="rounded-full bg-[#173b2d] px-4 py-2 text-xs font-black text-white disabled:opacity-50">Next</button>
                <button type="button" onClick={endDemo} className="rounded-full border border-[#d8d0c0] bg-white px-4 py-2 text-xs font-black text-[#5f4b1f]">End</button>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-[92rem] px-5 py-6">
        <div className={`mb-5 flex flex-col gap-4 rounded-[1.7rem] p-1 transition lg:flex-row lg:items-end lg:justify-between ${ring("title")}`}>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#789052]">{config.eyebrow}</p>
            <h1 className="mt-2 font-serif text-4xl font-semibold tracking-[-0.04em] md:text-5xl">{config.title}</h1>
            <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-[#4d5d55]">{config.subtitle}</p>
          </div>
          <div className="rounded-2xl border border-[#d8d0c0] bg-white/85 px-5 py-4 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#789052]">Current status</p>
            <p className="mt-1 text-lg font-black text-[#102b3a]">{status[displayPortal]}</p>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-[310px_minmax(0,1fr)_320px]">
          <aside className="space-y-5">
            <section className={`rounded-[1.7rem] border border-[#d8d0c0] bg-white/90 p-5 shadow-sm transition ${ring("queue")}`}>
              <h2 className="text-sm font-black uppercase tracking-[0.18em] text-[#173b2d]">{config.queueTitle}</h2>
              <div className="mt-4 space-y-3">
                {config.queueItems.map((item) => (
                  <article key={`${item.label}-${item.detail}`} className="rounded-2xl border border-[#ded6c8] bg-[#fffdf9] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-black text-[#102b3a]">{item.label}</p>
                        <p className="mt-1 text-xs font-semibold leading-5 text-[#4d5d55]">{item.detail}</p>
                      </div>
                      {item.badge ? <span className="rounded-full bg-[#f0f5e8] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-[#315f44]">{item.badge}</span> : null}
                    </div>
                  </article>
                ))}
              </div>
            </section>
            <section className="rounded-[1.7rem] border border-[#d8d0c0] bg-[#173b2d] p-5 text-white shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#c8d9b3]">Next step</p>
              <p className="mt-3 text-sm font-semibold leading-6 text-[#edf5e6]">{config.nextStep}</p>
            </section>
          </aside>

          <section className="space-y-5">
            <section className={`rounded-[1.8rem] border border-[#d8d0c0] bg-white/95 p-6 shadow-sm transition ${ring("summary")}`}>
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eaf2ed] text-lg font-black text-[#173b2d]">JD</span>
                    <div>
                      <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-[#102b3a]">Jane Doe</h2>
                      <p className="mt-1 text-sm font-bold text-[#4d5d55]">{config.subjectMeta}</p>
                    </div>
                  </div>
                  <p className="mt-5 max-w-3xl text-sm font-semibold leading-7 text-[#4d5d55]">{summaryDetail}</p>
                </div>
                <div className="rounded-2xl border border-[#d7cdeb] bg-[#f4effc] p-5 lg:w-80">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#5b4a83]">What should happen next?</p>
                  <p className="mt-2 text-sm font-bold leading-6 text-[#102b3a]">{config.nextStep}</p>
                </div>
              </div>
            </section>

            <div className="grid gap-4 lg:grid-cols-3">
              {config.cards.map((card) => (
                <article key={card.title} className="rounded-[1.5rem] border border-[#d8d0c0] bg-white/95 p-5 shadow-sm">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#173b2d]">{card.title}</p>
                  <p className="mt-3 text-sm font-semibold leading-6 text-[#4d5d55]">{card.body}</p>
                  <span className="mt-4 inline-flex rounded-full border border-[#bdd7ca] bg-[#eef6f0] px-3 py-1 text-xs font-black text-[#315f44]">{card.badge}</span>
                </article>
              ))}
            </div>

            <section className={`rounded-[1.8rem] border border-[#d8d0c0] bg-white/95 p-6 shadow-sm transition ${ring("timeline")}`}>
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h2 className="text-sm font-black uppercase tracking-[0.18em] text-[#173b2d]">Shared Care Timeline</h2>
                  <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-[#4d5d55]">One care story, filtered by this portal.</p>
                </div>
                <p className="text-xs font-bold text-[#789052]">Newest first · {timeline.length} visible</p>
              </div>
              <div className="mt-6 space-y-4">
                {timeline.map((event) => (
                  <article key={event.id} className="grid gap-4 rounded-2xl border border-[#e2dfd9] bg-white p-4 shadow-[0_10px_30px_rgba(30,41,59,0.05)] md:grid-cols-[92px_1fr]">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.14em] text-[#65717a]">Today</p>
                      <p className="mt-1 text-xs font-bold text-[#789052]">{event.step >= 0 ? `Step ${event.step + 1}` : "Ready"}</p>
                    </div>
                    <div className="border-l-2 border-[#d8d6d1] pl-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${toneClasses(event.tone)}`}>{event.badge}</span>
                        <span className="text-xs font-bold text-[#65717a]">{event.actor}</span>
                      </div>
                      <h3 className="mt-2 font-black text-[#102b3a]">{event.title}</h3>
                      <p className="mt-1 text-sm font-semibold leading-6 text-[#4d5d55]">{event.detail}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </section>

          <aside className="space-y-5">
            <section className={`rounded-[1.7rem] border border-[#d8d0c0] bg-white/95 p-5 shadow-sm transition ${ring("actions")}`}>
              <h2 className="text-sm font-black uppercase tracking-[0.18em] text-[#173b2d]">{config.actionsTitle}</h2>
              <p className="mt-2 text-xs font-semibold leading-5 text-[#4d5d55]">Actions are structured only. During the demo, the active form appears here inline so Next stays available.</p>
              <div className="mt-4 space-y-2">
                {config.actions.map((action, index) => (
                  <button key={action.id} type="button" onClick={() => openAction(action)} className={`w-full rounded-2xl border px-4 py-4 text-left transition ${index === 0 ? "border-[#173b2d] bg-[#173b2d] text-white shadow-md hover:bg-[#102b3a]" : "border-[#d8d0c0] bg-white text-[#102b3a] hover:border-[#86a45f] hover:bg-[#f8fbf8]"}`}>
                    <span className="block text-sm font-black">{action.label}</span>
                    <span className={`mt-1 block text-xs font-semibold ${index === 0 ? "text-[#edf5e6]" : "text-[#4d5d55]"}`}>{action.detail}</span>
                  </button>
                ))}
              </div>

              {activeAction ? (
                <form onSubmit={submitAction} className="mt-5 rounded-[1.4rem] border border-[#cbbbea] bg-[#fbf8f0] p-4">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#5b4a83]">{demoRunning ? "Guided step form" : "Structured form"}</p>
                  <h3 className="mt-2 text-lg font-black text-[#102b3a]">{activeAction.label}</h3>
                  <div className="mt-4 space-y-3">{activeAction.fields.map(renderField)}</div>
                  {demoRunning ? (
                    <p className="mt-4 rounded-xl bg-[#fff8e7] px-4 py-3 text-xs font-bold leading-5 text-[#5f4b1f]">Demo mode: use the Next button above to continue. No pop-up needs to be closed.</p>
                  ) : (
                    <button type="submit" className="mt-4 w-full rounded-xl bg-[#173b2d] px-5 py-3 text-sm font-black text-white hover:bg-[#102b3a]">{activeAction.submitLabel}</button>
                  )}
                </form>
              ) : null}
            </section>

            <section className={`rounded-[1.7rem] border border-[#ddb66c]/45 bg-[#fff8e7] p-5 shadow-sm transition ${ring("visibility")}`}>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#7a5b20]">Access & Visibility</p>
              <p className="mt-2 text-sm font-bold leading-6 text-[#5f4b1f]">{config.visibility}</p>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}
