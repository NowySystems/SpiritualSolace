"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { CHURCHWORK_END_TO_END_DEMO_STEPS } from "@/lib/churchworkDemoScripts";
import {
  CHURCHWORK_TIMELINE_EVENT_DEFINITIONS,
  getTimelineEventVisibility,
  type ChurchWorkTimelineEventType
} from "@/lib/churchworkWorkflow";

type PortalKind = "requester" | "facility" | "partner";
type FieldType = "select" | "date" | "checkbox";
type Tone = "stone" | "green" | "teal" | "blue" | "gold" | "purple" | "clay";
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
  facilityVisible: boolean;
  partnerVisible: boolean;
  eventType?: ChurchWorkTimelineEventType;
};

type DemoStep = {
  scriptStepId: string;
  portal: PortalKind;
  highlight: Highlight;
  actionId?: string;
  activeField?: string;
  values?: Record<string, FormValue>;
  status?: Partial<Record<PortalKind, string>>;
  summaryDetail?: string;
  eventDetail?: string;
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

export type ChurchWorkAwesomeGuidedPortalDashboardProps = {
  portal: PortalKind;
};

const people = ["Jane Doe", "Elena Morris", "Mary Johnson", "Robert Smith"];
const requestTypes = ["Family Encouragement & Prayer Support", "Pastoral Visit", "Prayer Support", "Church Connection", "Facility Follow-up"];
const partners = ["Morning Pointe Church", "Grace Community Church", "First Assembly Care Team"];
const prayerFocuses = ["Comfort and Peace", "Strength for Family", "Hope and Reassurance", "Thankful Encouragement", "Quiet Presence"];
const portalNames: Record<PortalKind, string> = { requester: "Requester Portal", facility: "Facility Portal", partner: "Partner Portal" };

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
    nextStep: "Choose the request details, confirm the spiritual-care-only acknowledgement, and submit for facility review.",
    queueTitle: "Request Snapshot",
    queueItems: [
      { label: "Person", detail: "Jane Doe", badge: "Selected" },
      { label: "Relationship", detail: "Daughter" },
      { label: "Request type", detail: "Family Encouragement & Prayer Support" },
      { label: "Updates", detail: "Text messages" }
    ],
    cards: [
      { title: "Structured Choices", body: "Every requester input is selected from approved choices so the request stays safe and reviewable.", badge: "No Free Text" },
      { title: "Audit Trail", body: "Acknowledgements, consent decisions, sharing approvals, and care outcomes become timeline records.", badge: "Recorded" },
      { title: "Approved Updates", body: "Requester view only shows approved status updates and family-safe timeline events.", badge: "Filtered View" }
    ],
    actionsTitle: "Requester Actions",
    visibility: "Requester view shows approved status updates, consent summary, next steps, family-safe timeline entries, and the requester’s own acknowledgements.",
    actions: [
      {
        id: "submit-request",
        label: "Submit Structured Request",
        detail: "Use guided choices only",
        eventTitle: "Structured care request submitted",
        eventDetail: "Sarah submitted a structured spiritual-care request for Jane Doe.",
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
        label: "Request Approved Update",
        detail: "Choose update type",
        eventTitle: "Requester update requested",
        eventDetail: "Sarah requested an approved status update.",
        statusAfter: "Update Requested",
        submitLabel: "Request update",
        tone: "gold",
        requesterVisible: true,
        partnerVisible: false,
        fields: [{ name: "updateType", label: "What update is needed?", type: "select", options: ["Visit timing", "Consent status", "Care team status", "Contact preference"], defaultValue: "Visit timing", required: true }]
      }
    ]
  },
  facility: {
    eyebrow: "Facility access",
    title: "Facility Care Workspace",
    subtitle: "Review requests, record consent, approve partner sharing, and maintain the audit timeline.",
    accountName: "Morning Pointe Franklin",
    accountRole: "Facility Team",
    subjectMeta: "Room 104B · Assisted Living · Protestant",
    summaryDetail: "Facility users control review, consent, partner handoff, visit timing, and visibility rules.",
    status: "Awaiting Review",
    nextStep: "Review Jane Doe's request, record consent, then approve limited partner sharing.",
    queueTitle: "Facility Queue",
    queueItems: [
      { label: "Jane Doe", detail: "Room 104B · new request", badge: "New" },
      { label: "Elena Morris", detail: "Room 108A · consent pending", badge: "Review" },
      { label: "Mary Johnson", detail: "Room 112C · visit follow-up", badge: "Follow-up" }
    ],
    cards: [
      { title: "Consent & Visibility", body: "Facility decides whether each update is requester-visible, partner-visible, or facility-only.", badge: "Facility Controlled" },
      { title: "Partner Sharing", body: "Partners receive limited spiritual-care context, not medical details or unrelated resident information.", badge: "Limited Summary" },
      { title: "Audit Trail", body: "Every review, consent decision, sharing approval, and outcome is recorded on the timeline.", badge: "Traceable" }
    ],
    actionsTitle: "Facility Actions",
    visibility: "Facility view shows full workflow, consent status, partner sharing, internal notes, and the complete case timeline.",
    actions: [
      {
        id: "review-request",
        label: "Complete Facility Review",
        detail: "Move request into workflow",
        eventTitle: "Facility review completed",
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
        label: "Record Consent",
        detail: "Document sharing permissions",
        eventTitle: "Consent and visibility recorded",
        eventDetail: "Morning Pointe recorded consent and visibility for the request.",
        statusAfter: "Consent Recorded",
        submitLabel: "Record consent",
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
        label: "Approve Partner Sharing",
        detail: "Send approved context only",
        eventTitle: "Partner sharing approved",
        eventDetail: "Morning Pointe approved the limited spiritual-care summary for Morning Pointe Church.",
        statusAfter: "Partner Sharing Approved",
        submitLabel: "Approve sharing",
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
    nextStep: "Accept the assignment, select an approved prayer/care focus, and log a structured outcome.",
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
        label: "Accept Partner Assignment",
        detail: "Take responsibility for this care action",
        eventTitle: "Partner assignment accepted",
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
        label: "Select Care Focus",
        detail: "Choose an approved prayer/care category",
        eventTitle: "Prayer and care focus selected",
        eventDetail: "Morning Pointe Church selected an approved care focus.",
        statusAfter: "Care Focus Selected",
        submitLabel: "Save care focus",
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
        eventTitle: "Care outcome logged",
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

const scriptStepById = new Map(CHURCHWORK_END_TO_END_DEMO_STEPS.map((step) => [step.id, step]));

const demoSteps: DemoStep[] = [
  { scriptStepId: "requester-start", portal: "requester", highlight: "title", status: { requester: "Ready to Submit", facility: "Awaiting Review", partner: "Waiting for Assignment" }, summaryDetail: "Sarah uses preselected choices only. No open text request is needed to start a spiritual-care workflow.", eventDetail: "Demo started in the requester portal." },
  { scriptStepId: "requester-select-person", portal: "requester", highlight: "actions", actionId: "submit-request", activeField: "person", values: { person: "Jane Doe" }, eventDetail: "Requester form opened; selected person: Jane Doe." },
  { scriptStepId: "requester-relationship", portal: "requester", highlight: "actions", actionId: "submit-request", activeField: "relationship", values: { person: "Jane Doe", relationship: "Daughter" }, eventDetail: "Requester selected relationship: Daughter." },
  { scriptStepId: "requester-request-type", portal: "requester", highlight: "actions", actionId: "submit-request", activeField: "requestType", values: { person: "Jane Doe", relationship: "Daughter", requestType: "Family Encouragement & Prayer Support" }, eventDetail: "Requester selected request type: Family Encouragement & Prayer Support." },
  { scriptStepId: "requester-support-focus", portal: "requester", highlight: "actions", actionId: "submit-request", activeField: "supportFocus", values: { person: "Jane Doe", relationship: "Daughter", requestType: "Family Encouragement & Prayer Support", supportFocus: "Prayer support", contactPreference: "Text messages" }, eventDetail: "Requester selected support focus and contact preference." },
  { scriptStepId: "requester-terms-accepted", portal: "requester", highlight: "actions", actionId: "submit-request", activeField: "acknowledgeNoMedical", values: { person: "Jane Doe", relationship: "Daughter", requestType: "Family Encouragement & Prayer Support", supportFocus: "Prayer support", contactPreference: "Text messages", acknowledgeNoMedical: true }, eventDetail: "Requester accepted the spiritual-care-only and no-medical-details acknowledgement." },
  { scriptStepId: "care-request-submitted", portal: "requester", highlight: "timeline", status: { requester: "Submitted" }, eventDetail: "The structured care request was added to the shared timeline and is ready for facility review." },
  { scriptStepId: "facility-queue-received", portal: "facility", highlight: "queue", status: { facility: "Awaiting Review" }, summaryDetail: configs.facility.summaryDetail, eventDetail: "The request reached the facility queue." },
  { scriptStepId: "facility-review-completed", portal: "facility", highlight: "actions", actionId: "review-request", activeField: "facilityDisposition", values: { requestType: "Family Encouragement & Prayer Support", facilityDisposition: "Eligible for spiritual-care workflow" }, eventDetail: "Facility reviewed the request disposition." },
  { scriptStepId: "facility-review-recorded", portal: "facility", highlight: "timeline", status: { facility: "Facility Reviewed" }, eventDetail: "Facility review was added to the timeline." },
  { scriptStepId: "consent-visibility-selected", portal: "facility", highlight: "actions", actionId: "confirm-consent", activeField: "visibility", values: { consentSource: "POA / family contact", visibility: "Requester + approved partner", confirmed: true }, eventDetail: "Facility selected consent source and approved visibility." },
  { scriptStepId: "consent-recorded", portal: "facility", highlight: "timeline", status: { facility: "Consent Recorded" }, eventDetail: "Consent was added to the shared timeline." },
  { scriptStepId: "partner-sharing-approved", portal: "facility", highlight: "actions", actionId: "share-partner", activeField: "sharingLevel", values: { partner: "Morning Pointe Church", sharingLevel: "Limited spiritual-care summary", approved: true }, eventDetail: "Facility prepared approved partner sharing." },
  { scriptStepId: "partner-assignment-created", portal: "partner", highlight: "queue", status: { facility: "Partner Sharing Approved", partner: "New Assignment" }, summaryDetail: configs.partner.summaryDetail, eventDetail: "The approved assignment reached the partner portal." },
  { scriptStepId: "partner-assignment-accepted", portal: "partner", highlight: "actions", actionId: "accept-assignment", activeField: "assignmentScope", values: { assignmentScope: "Visit and prayer support", accepted: true }, eventDetail: "Partner selected assignment scope and accepted." },
  { scriptStepId: "partner-acceptance-recorded", portal: "partner", highlight: "timeline", status: { partner: "Assignment Accepted" }, eventDetail: "Partner acceptance was added to the timeline." },
  { scriptStepId: "care-focus-selected", portal: "partner", highlight: "actions", actionId: "select-prayer-focus", activeField: "prayerFocus", values: { prayerFocus: "Comfort and Peace", careApproach: "Brief visit" }, eventDetail: "Partner selected an approved prayer and care focus." },
  { scriptStepId: "care-outcome-selected", portal: "partner", highlight: "actions", actionId: "log-outcome", activeField: "outcome", values: { outcome: "Prayer support offered", nextStep: "No further action today", shareWithFacility: true }, eventDetail: "Partner selected the structured care outcome." },
  { scriptStepId: "care-outcome-recorded", portal: "partner", highlight: "timeline", status: { partner: "Outcome Logged" }, eventDetail: "Partner outcome was added to the shared timeline." },
  { scriptStepId: "requester-approved-update", portal: "requester", highlight: "timeline", status: { requester: "Care Outcome Logged" }, summaryDetail: "Sarah sees the approved care outcome and next step without facility-only notes or partner-only workflow details.", eventDetail: "Requester view now shows the approved care outcome only." }
];

const milestoneEvents: { id: string; step: number; type: ChurchWorkTimelineEventType; detail?: string; actor?: string; tone?: Tone }[] = [
  { id: "terms-accepted", step: 5, type: "requester_acknowledgement", detail: "Sarah K. accepted the spiritual-care-only acknowledgement and confirmed no medical details are included in this request.", actor: "Sarah K. (Daughter)", tone: "clay" },
  { id: "submitted", step: 6, type: "care_request_submitted", detail: "Sarah submitted: Jane Doe · Daughter · Family Encouragement & Prayer Support · Text messages.", actor: "Sarah K. (Daughter)", tone: "green" },
  { id: "reviewed", step: 8, type: "facility_review_completed", detail: "Morning Pointe confirmed the request is eligible for spiritual-care workflow.", actor: "Morning Pointe Franklin", tone: "blue" },
  { id: "consent", step: 10, type: "consent_recorded", detail: "Consent source: POA / family contact · Visibility: requester plus approved partner.", actor: "Morning Pointe Franklin", tone: "green" },
  { id: "shared", step: 12, type: "partner_sharing_approved", detail: "A limited spiritual-care summary was approved for Morning Pointe Church. Medical details were not shared.", actor: "Morning Pointe Franklin", tone: "teal" },
  { id: "assignment-created", step: 13, type: "partner_assignment_created", detail: "Morning Pointe Church received an approved partner assignment.", actor: "Morning Pointe Franklin", tone: "teal" },
  { id: "accepted", step: 14, type: "partner_assignment_accepted", detail: "Morning Pointe Church accepted visit and prayer support.", actor: "Morning Pointe Church", tone: "green" },
  { id: "focus", step: 16, type: "care_focus_selected", detail: "Prayer focus: Comfort and Peace · Care approach: Brief visit. No custom prayer text was typed.", actor: "Morning Pointe Church", tone: "teal" },
  { id: "outcome", step: 18, type: "care_outcome_logged", detail: "Outcome: prayer support offered · Next step: no further action today.", actor: "Morning Pointe Church", tone: "green" }
];

const readyEvent: TimelineEvent = { id: "ready", step: -1, title: "Demo ready", detail: "Start the guided demo, then use Next to move one step at a time.", actor: "ChurchWork", badge: "Ready", tone: "stone", requesterVisible: true, facilityVisible: true, partnerVisible: true };

function toneClasses(tone: Tone) {
  const classes: Record<Tone, string> = {
    stone: "border-[#d8d0c0] bg-[#fbf8f0] text-[#4d5d55]",
    green: "border-[#b7d1c0] bg-[#eef6f0] text-[#315f44]",
    teal: "border-[#9fc6bd] bg-[#edf7f5] text-[#275d55]",
    blue: "border-[#b5c8d4] bg-[#eef4f7] text-[#385d70]",
    gold: "border-[#e5c071] bg-[#fff7e6] text-[#76551c]",
    purple: "border-[#cbbbea] bg-[#f4effc] text-[#5b4a83]",
    clay: "border-[#e0a08f] bg-[#fff0eb] text-[#8d3f2c]"
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
  if (portal === "facility") return event.facilityVisible;
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
  const details = action.fields.filter((field) => field.type !== "checkbox").map((field) => `${field.label}: ${String(values[field.name] ?? field.defaultValue ?? "")}`);
  return `${action.eventDetail} ${details.join(" · ")}.`;
}

function getScriptStep(step: DemoStep) {
  return scriptStepById.get(step.scriptStepId);
}

function stepTitle(step: DemoStep, index: number) {
  const script = getScriptStep(step);
  return `Step ${index + 1} of ${demoSteps.length} · ${script?.title ?? step.scriptStepId}`;
}

function stepNarration(step: DemoStep) {
  return getScriptStep(step)?.narration ?? step.eventDetail ?? "Continue through the ChurchWork workflow.";
}

function workflowEvent(type: ChurchWorkTimelineEventType, event: { id: string; step: number; detail?: string; actor?: string; tone?: Tone }): TimelineEvent {
  const definition = CHURCHWORK_TIMELINE_EVENT_DEFINITIONS[type];
  const visibility = getTimelineEventVisibility(type);
  return {
    id: event.id,
    step: event.step,
    title: definition.title,
    detail: event.detail ?? definition.description,
    actor: event.actor ?? definition.defaultActorRole,
    badge: definition.category,
    tone: event.tone ?? (definition.category === "Audit Log" ? "clay" : "green"),
    requesterVisible: visibility.requesterVisible,
    facilityVisible: visibility.facilityVisible,
    partnerVisible: visibility.partnerVisible,
    eventType: type
  };
}

function stepEvent(step: DemoStep, index: number): TimelineEvent {
  const script = getScriptStep(step);
  return {
    id: `guided-step-${step.scriptStepId}`,
    step: index,
    title: `Guided step: ${script?.title ?? step.scriptStepId}`,
    detail: step.eventDetail ?? script?.narration ?? "Guided demo step completed.",
    actor: "Guided Demo",
    badge: CHURCHWORK_TIMELINE_EVENT_DEFINITIONS.guided_step.category,
    tone: "purple",
    requesterVisible: true,
    facilityVisible: true,
    partnerVisible: true,
    eventType: "guided_step"
  };
}

export function ChurchWorkAwesomeGuidedPortalDashboard({ portal }: ChurchWorkAwesomeGuidedPortalDashboardProps) {
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
    const stepEvents = demoRunning ? demoSteps.slice(0, demoIndex + 1).map(stepEvent).reverse() : [];
    const realEvents = demoRunning ? milestoneEvents.filter((event) => event.step <= demoIndex).map((event) => workflowEvent(event.type, event)).reverse() : [];
    return [...manualEvents, ...realEvents, ...stepEvents, readyEvent].filter((event) => eventVisible(event, displayPortal));
  }, [demoRunning, demoIndex, manualEvents, displayPortal]);

  function activeShell(target: Highlight) {
    return step?.highlight === target ? "churchwork-demo-active ring-[6px] ring-[#d8c5ff] ring-offset-4 ring-offset-[#f7f3ea] border-[#6f4bb4] shadow-[0_0_0_7px_rgba(203,187,234,0.35),0_24px_80px_rgba(91,74,131,0.24)] scale-[1.01]" : "";
  }

  function activeProps(target: Highlight) {
    return step?.highlight === target ? { "data-demo-active": "true" } : {};
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
    if (voiceOn && shouldSpeak) speak(stepNarration(next));
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
    const newEvent: TimelineEvent = { id: `${displayPortal}-${activeAction.id}-${Date.now()}`, step: 0, title: activeAction.eventTitle, detail: fieldDetail(activeAction, values), actor: config.accountName, badge: activeAction.label, tone: activeAction.tone, requesterVisible: activeAction.requesterVisible, facilityVisible: true, partnerVisible: activeAction.partnerVisible };
    setManualEvents((items) => [newEvent, ...items]);
    setStatus((items) => ({ ...items, [displayPortal]: activeAction.statusAfter }));
    setActiveAction(null);
  }

  function DemoControls({ compact = false }: { compact?: boolean }) {
    if (!demoRunning || !step || demoIndex === null) return null;
    return (
      <div className={`${compact ? "mt-4" : ""} rounded-2xl border border-[#cbbbea] bg-white/95 p-3 shadow-sm`}>
        <div className="mb-2 flex items-center justify-between gap-3">
          <span className="rounded-full bg-[#f4effc] px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-[#5b4a83]">Demo controls</span>
          <span className="text-xs font-black text-[#5b4a83]">{demoIndex + 1}/{demoSteps.length}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => setVoiceOn((value) => !value)} className="rounded-full border border-[#cbbbea] bg-white px-4 py-2 text-xs font-black text-[#5b4a83]">Voice {voiceOn ? "On" : "Off"}</button>
          <button type="button" onClick={() => voiceOn && speak(stepNarration(step))} className="rounded-full border border-[#cbbbea] bg-white px-4 py-2 text-xs font-black text-[#5b4a83]">Replay</button>
          <button type="button" onClick={() => moveDemo(-1)} disabled={demoIndex === 0} className="rounded-full border border-[#cbbbea] bg-white px-4 py-2 text-xs font-black text-[#5b4a83] disabled:opacity-50">Back</button>
          <button type="button" onClick={() => moveDemo(1)} disabled={demoIndex === demoSteps.length - 1} className="rounded-full bg-[#173b2d] px-6 py-2 text-xs font-black text-white disabled:opacity-50">Next</button>
          <button type="button" onClick={endDemo} className="rounded-full border border-[#d8d0c0] bg-white px-4 py-2 text-xs font-black text-[#5f4b1f]">End</button>
        </div>
      </div>
    );
  }

  function renderField(field: Field) {
    const isActive = activeField === field.name;
    const shell = isActive ? "churchwork-demo-active border-[#6f4bb4] bg-[#f4effc] ring-[6px] ring-[#d8c5ff] shadow-[0_0_0_7px_rgba(203,187,234,0.38),0_18px_45px_rgba(91,74,131,0.24)]" : "border-[#d8d0c0] bg-white";
    const dataProps = isActive ? { "data-demo-active": "true", "data-demo-field-active": "true" } : {};
    if (field.type === "checkbox") {
      return (
        <label key={field.name} {...dataProps} className={`relative flex gap-3 rounded-2xl border p-4 text-sm font-bold leading-6 text-[#5f4b1f] transition ${shell}`}>
          {isActive ? <span className="absolute -top-3 left-4 rounded-full bg-[#6f4bb4] px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-white">Current step</span> : null}
          <input type="checkbox" checked={Boolean(values[field.name])} onChange={(event) => setValues((prev) => ({ ...prev, [field.name]: event.target.checked }))} className="mt-1 h-5 w-5" />
          <span>{field.label}</span>
        </label>
      );
    }
    return (
      <label key={field.name} {...dataProps} className={`relative block rounded-2xl border p-4 text-sm font-bold text-[#173b2d] transition ${shell}`}>
        {isActive ? <span className="absolute -top-3 left-4 rounded-full bg-[#6f4bb4] px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-white">Current step</span> : null}
        {field.label}
        {field.type === "date" ? (
          <input type="date" value={String(values[field.name] ?? field.defaultValue ?? "")} onChange={(event) => setValues((prev) => ({ ...prev, [field.name]: event.target.value }))} className="mt-2 w-full rounded-xl border border-[#d8d0c0] bg-white px-4 py-3 text-sm text-[#102b3a]" />
        ) : (
          <select value={String(values[field.name] ?? field.defaultValue ?? "")} onChange={(event) => setValues((prev) => ({ ...prev, [field.name]: event.target.value }))} className="mt-2 w-full rounded-xl border border-[#d8d0c0] bg-white px-4 py-3 text-sm text-[#102b3a]">
            {(field.options ?? []).map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        )}
      </label>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f3ea] text-[#102b3a]">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0d2b3b] text-white shadow-lg shadow-[#0d2b3b]/15">
        <div className="mx-auto flex max-w-[92rem] flex-col gap-4 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
          <Link href="/" className="flex items-center gap-3" aria-label="ChurchWork home"><span className="flex h-12 w-20 items-center justify-center rounded-2xl bg-white p-2 shadow-sm"><img src="/brand/churchwork-corner-logo.png" alt="ChurchWork CW logo" className="h-full w-full object-contain" /></span><span><span className="block font-serif text-2xl font-semibold tracking-[-0.04em]">Church<span className="text-[#3f806e]">Work</span></span><span className="block text-xs font-bold text-[#d4dedc]">{portalNames[displayPortal]}</span></span></Link>
          <div className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold text-[#edf5e6]">Structured choices · role-safe timeline · audit trail</div>
          <div className="flex flex-wrap items-center gap-3 text-sm"><button type="button" onClick={startDemo} className="rounded-full bg-[#cbbbea] px-4 py-2 text-xs font-black text-[#16243a] shadow-sm hover:bg-[#d8cff1]">Start Guided Demo</button><div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-2 text-right"><p className="font-black">{config.accountName}</p><p className="text-xs font-semibold text-[#d4dedc]">{config.accountRole}</p></div></div>
        </div>
      </header>

      {demoRunning && step && demoIndex !== null ? (
        <section {...activeProps("demo")} className={`sticky top-[5.5rem] z-30 mx-auto max-w-[92rem] px-5 pt-4 ${activeShell("demo")}`} aria-live="polite">
          <div className="rounded-[1.5rem] border border-[#cbbbea] bg-[#f4effc]/95 p-5 shadow-lg shadow-[#5b4a83]/10 backdrop-blur">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"><div><p className="text-xs font-black uppercase tracking-[0.18em] text-[#5b4a83]">{stepTitle(step, demoIndex)}</p><p className="mt-2 max-w-4xl text-base font-black leading-7 text-[#16243a]">{stepNarration(step)}</p></div>{!activeAction ? <DemoControls /> : null}</div>
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-[92rem] px-5 py-6">
        <div {...activeProps("title")} className={`mb-5 flex flex-col gap-4 rounded-[1.7rem] p-2 transition lg:flex-row lg:items-end lg:justify-between ${activeShell("title")}`}>
          <div><p className="text-xs font-black uppercase tracking-[0.2em] text-[#789052]">{config.eyebrow}</p><h1 className="mt-2 font-serif text-4xl font-semibold tracking-[-0.04em] md:text-5xl">{config.title}</h1><p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-[#4d5d55]">{config.subtitle}</p></div>
          <div className="rounded-2xl border border-[#d8d0c0] bg-white/85 px-5 py-4 shadow-sm"><p className="text-xs font-black uppercase tracking-[0.16em] text-[#789052]">Current status</p><p className="mt-1 text-lg font-black text-[#102b3a]">{status[displayPortal]}</p></div>
        </div>

        <div className="grid gap-5 xl:grid-cols-[290px_minmax(0,1fr)_330px]">
          <aside className="space-y-5">
            <section {...activeProps("queue")} className={`rounded-[1.7rem] border border-[#d8d0c0] bg-white/90 p-5 shadow-sm transition ${activeShell("queue")}`}>
              <h2 className="text-sm font-black uppercase tracking-[0.18em] text-[#173b2d]">{config.queueTitle}</h2>
              <div className="mt-4 space-y-3">{config.queueItems.map((item) => <article key={`${item.label}-${item.detail}`} className="rounded-2xl border border-[#ded6c8] bg-[#fffdf9] p-4"><div className="flex items-start justify-between gap-3"><div><p className="font-black text-[#102b3a]">{item.label}</p><p className="mt-1 text-xs font-semibold leading-5 text-[#4d5d55]">{item.detail}</p></div>{item.badge ? <span className="rounded-full bg-[#f0f5e8] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-[#315f44]">{item.badge}</span> : null}</div></article>)}</div>
            </section>
            <section className="rounded-[1.7rem] border border-[#d8d0c0] bg-[#173b2d] p-5 text-white shadow-sm"><p className="text-xs font-black uppercase tracking-[0.18em] text-[#c8d9b3]">Next step</p><p className="mt-3 text-sm font-semibold leading-6 text-[#edf5e6]">{config.nextStep}</p></section>
          </aside>

          <section className="space-y-5">
            <section {...activeProps("summary")} className={`rounded-[1.8rem] border border-[#d8d0c0] bg-white/95 p-6 shadow-sm transition ${activeShell("summary")}`}>
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between"><div><div className="flex flex-wrap items-center gap-3"><span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eaf2ed] text-lg font-black text-[#173b2d]">JD</span><div><h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-[#102b3a]">Jane Doe</h2><p className="mt-1 text-sm font-bold text-[#4d5d55]">{config.subjectMeta}</p></div></div><p className="mt-5 max-w-3xl text-sm font-semibold leading-7 text-[#4d5d55]">{summaryDetail}</p></div><div className="rounded-2xl border border-[#d7cdeb] bg-[#f4effc] p-5 lg:w-80"><p className="text-xs font-black uppercase tracking-[0.16em] text-[#5b4a83]">What should happen next?</p><p className="mt-2 text-sm font-bold leading-6 text-[#102b3a]">{config.nextStep}</p></div></div>
            </section>

            <div className="grid gap-4 lg:grid-cols-3">{config.cards.map((card) => <article key={card.title} className="rounded-[1.5rem] border border-[#d8d0c0] bg-white/95 p-5 shadow-sm"><p className="text-xs font-black uppercase tracking-[0.16em] text-[#173b2d]">{card.title}</p><p className="mt-3 text-sm font-semibold leading-6 text-[#4d5d55]">{card.body}</p><span className="mt-4 inline-flex rounded-full border border-[#bdd7ca] bg-[#eef6f0] px-3 py-1 text-xs font-black text-[#315f44]">{card.badge}</span></article>)}</div>

            <section {...activeProps("timeline")} className={`rounded-[1.8rem] border border-[#d8d0c0] bg-white/95 p-6 shadow-sm transition ${activeShell("timeline")}`}>
              <details open className="group">
                <summary className="flex cursor-pointer list-none flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div><h2 className="text-sm font-black uppercase tracking-[0.18em] text-[#173b2d]">Shared Care Timeline</h2><p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-[#4d5d55]">Contained audit log: guided steps, care milestones, consent decisions, sharing approvals, and terms acknowledgements.</p></div>
                  <div className="flex items-center gap-3"><p className="text-xs font-bold text-[#789052]">Newest first · {timeline.length} visible</p><span className="rounded-full border border-[#d8d0c0] px-3 py-1 text-xs font-black text-[#4d5d55]">Collapse</span></div>
                </summary>
                {step?.highlight === "timeline" ? <DemoControls compact /> : null}
                <div className="mt-5 max-h-[34rem] space-y-4 overflow-y-auto pr-2 [scrollbar-width:thin]">
                  {timeline.map((event) => <article key={event.id} className="grid gap-4 rounded-2xl border border-[#e2dfd9] bg-white p-4 shadow-[0_10px_30px_rgba(30,41,59,0.05)] md:grid-cols-[92px_1fr]"><div><p className="text-xs font-black uppercase tracking-[0.14em] text-[#65717a]">Today</p><p className="mt-1 text-xs font-bold text-[#789052]">{event.step >= 0 ? `Step ${event.step + 1}` : "Ready"}</p></div><div className="border-l-2 border-[#d8d6d1] pl-4"><div className="flex flex-wrap items-center gap-2"><span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${toneClasses(event.tone)}`}>{event.badge}</span><span className="text-xs font-bold text-[#65717a]">{event.actor}</span></div><h3 className="mt-2 font-black text-[#102b3a]">{event.title}</h3><p className="mt-1 text-sm font-semibold leading-6 text-[#4d5d55]">{event.detail}</p></div></article>)}
                </div>
              </details>
            </section>
          </section>

          <aside className="space-y-5 xl:sticky xl:top-[8.75rem] xl:max-h-[calc(100vh-9.5rem)] xl:overflow-y-auto xl:pr-1 [scrollbar-width:thin]">
            <section {...activeProps("actions")} className={`rounded-[1.7rem] border border-[#d8d0c0] bg-white/95 p-5 shadow-sm transition ${activeShell("actions")}`}>
              <h2 className="text-sm font-black uppercase tracking-[0.18em] text-[#173b2d]">{config.actionsTitle}</h2><p className="mt-2 text-xs font-semibold leading-5 text-[#4d5d55]">Actions are structured only. The active step locks to this panel so buttons stay close.</p>
              <div className="mt-4 space-y-2">{config.actions.map((action, index) => <button key={action.id} type="button" onClick={() => openAction(action)} className={`w-full rounded-2xl border px-4 py-4 text-left transition ${index === 0 ? "border-[#173b2d] bg-[#173b2d] text-white shadow-md hover:bg-[#102b3a]" : "border-[#d8d0c0] bg-white text-[#102b3a] hover:border-[#86a45f] hover:bg-[#f8fbf8]"}`}><span className="block text-sm font-black">{action.label}</span><span className={`mt-1 block text-xs font-semibold ${index === 0 ? "text-[#edf5e6]" : "text-[#4d5d55]"}`}>{action.detail}</span></button>)}</div>
              {activeAction ? <form onSubmit={submitAction} className="mt-5 rounded-[1.4rem] border border-[#cbbbea] bg-[#fbf8f0] p-4"><div className="sticky top-0 z-20 -mx-4 -mt-4 rounded-t-[1.4rem] border-b border-[#cbbbea] bg-[#fbf8f0]/95 p-4 backdrop-blur"><p className="text-xs font-black uppercase tracking-[0.16em] text-[#5b4a83]">{demoRunning ? "Guided step form" : "Structured form"}</p><h3 className="mt-2 text-lg font-black text-[#102b3a]">{activeAction.label}</h3>{demoRunning ? <DemoControls compact /> : null}</div><div className="mt-4 max-h-[43vh] space-y-3 overflow-y-auto px-1 py-2 [scrollbar-width:thin]">{activeAction.fields.map(renderField)}</div>{demoRunning ? <p className="mt-3 rounded-xl bg-[#fff8e7] px-4 py-3 text-xs font-bold leading-5 text-[#5f4b1f]">Timeline audit entries update as you advance. The form stays contained so the controls do not run away.</p> : <button type="submit" className="mt-4 w-full rounded-xl bg-[#173b2d] px-5 py-3 text-sm font-black text-white hover:bg-[#102b3a]">{activeAction.submitLabel}</button>}</form> : null}
            </section>
            <section {...activeProps("visibility")} className={`rounded-[1.7rem] border border-[#ddb66c]/45 bg-[#fff8e7] p-5 shadow-sm transition ${activeShell("visibility")}`}><p className="text-xs font-black uppercase tracking-[0.18em] text-[#7a5b20]">Access & Visibility</p><p className="mt-2 text-sm font-bold leading-6 text-[#5f4b1f]">{config.visibility}</p></section>
          </aside>
        </div>
      </section>
    </main>
  );
}
