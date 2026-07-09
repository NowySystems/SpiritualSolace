"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { playChurchWorkDemoNarration, stopChurchWorkDemoNarration } from "@/lib/churchworkDemoAudioClient";
import { CHURCHWORK_END_TO_END_DEMO_STEPS } from "@/lib/churchworkDemoScripts";
import {
  CHURCHWORK_TIMELINE_EVENT_DEFINITIONS,
  getTimelineEventVisibility,
  type ChurchWorkTimelineEventType
} from "@/lib/churchworkWorkflow";

type PortalKind = "requester" | "facility" | "partner";
type FieldType = "select" | "checkbox";
type Tone = "stone" | "green" | "teal" | "blue" | "gold" | "purple" | "clay";
type Highlight = "identity" | "casefile" | "queue" | "ledger" | "checklist" | "form" | "visibility" | null;
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
  eyebrow: string;
  title: string;
  subtitle: string;
  roleName: string;
  accountName: string;
  status: string;
  nextStep: string;
  caseLabel: string;
  subjectMeta: string;
  summaryDetail: string;
  workspaceNote: string;
  visibility: string;
  queueTitle: string;
  queueItems: { label: string; detail: string; badge?: string }[];
  actionsTitle: string;
  actionsIntro: string;
  actions: Action[];
};

export type ChurchWorkCareLedgerDashboardProps = {
  portal: PortalKind;
};

const people = ["Jane Doe", "Elena Morris", "Mary Johnson", "Robert Smith"];
const requestTypes = ["Family Encouragement & Prayer Support", "Pastoral Visit", "Prayer Support", "Church Connection", "Facility Follow-up"];
const partners = ["Morning Pointe Church", "Grace Community Church", "First Assembly Care Team"];
const prayerFocuses = ["Comfort and Peace", "Strength for Family", "Hope and Reassurance", "Thankful Encouragement", "Quiet Presence"];

const portalNames: Record<PortalKind, string> = {
  requester: "Requester",
  facility: "Facility",
  partner: "Partner"
};

const configs: Record<PortalKind, PortalConfig> = {
  requester: {
    eyebrow: "Requester portal",
    title: "A guided care request, not another form.",
    subtitle: "Family and resident requesters choose approved options, accept the spiritual-care-only acknowledgement, and see only approved updates.",
    roleName: "Requester view",
    accountName: "Sarah K. · Daughter",
    status: "Ready to Submit",
    nextStep: "Choose the request details, accept the acknowledgement, and submit for facility review.",
    caseLabel: "Family care request",
    subjectMeta: "Jane Doe · Room 104B · Family Encouragement & Prayer Support",
    summaryDetail: "This request starts with structured choices only. No medical notes, no open-ended prayer text, and no unreviewed details are exposed.",
    workspaceNote: "Requester workspace shows the request, acknowledgement, and family-safe updates.",
    visibility: "Requester sees their own acknowledgement, submitted request, approved consent summary, and approved care outcomes only.",
    queueTitle: "Request snapshot",
    queueItems: [
      { label: "Person", detail: "Jane Doe", badge: "Selected" },
      { label: "Relationship", detail: "Daughter" },
      { label: "Request", detail: "Family encouragement and prayer support" },
      { label: "Updates", detail: "Text messages" }
    ],
    actionsTitle: "Guided request checklist",
    actionsIntro: "Structured choices keep the request safe, clear, and reviewable.",
    actions: [
      {
        id: "submit-request",
        label: "Submit Structured Request",
        detail: "Guided choices only",
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
    eyebrow: "Facility portal",
    title: "Review, consent, sharing, and audit in one calm workspace.",
    subtitle: "Facility staff control review, consent, partner sharing, and what each role can see.",
    roleName: "Facility view",
    accountName: "Morning Pointe Franklin",
    status: "Awaiting Review",
    nextStep: "Review Jane Doe’s request, record consent, then approve limited partner sharing.",
    caseLabel: "Facility care coordination file",
    subjectMeta: "Jane Doe · Room 104B · Assisted Living · Protestant",
    summaryDetail: "Facility is the control point for review, consent, visibility, partner sharing, and the complete audit timeline.",
    workspaceNote: "Facility workspace shows the complete case ledger and full workflow controls.",
    visibility: "Facility sees full workflow, consent status, partner sharing, internal review, and all timeline events.",
    queueTitle: "Facility queue",
    queueItems: [
      { label: "Jane Doe", detail: "Room 104B · new request", badge: "New" },
      { label: "Elena Morris", detail: "Room 108A · consent pending", badge: "Review" },
      { label: "Mary Johnson", detail: "Room 112C · visit follow-up", badge: "Follow-up" }
    ],
    actionsTitle: "Facility checklist",
    actionsIntro: "Each action creates a traceable record and applies role visibility rules.",
    actions: [
      {
        id: "review-request",
        label: "Complete Facility Review",
        detail: "Open the care workflow",
        eventTitle: "Facility review completed",
        eventDetail: "Morning Pointe reviewed Jane Doe’s request and opened the facility workflow.",
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
        detail: "Set visibility permissions",
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
        detail: "Approved context only",
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
    eyebrow: "Partner portal",
    title: "Simple assignments for volunteer care teams.",
    subtitle: "Partners accept approved assignments, choose care focus, and report structured outcomes back to the facility.",
    roleName: "Partner view",
    accountName: "Morning Pointe Church",
    status: "New Assignment",
    nextStep: "Accept the assignment, choose an approved care focus, and log a structured outcome.",
    caseLabel: "Approved partner assignment",
    subjectMeta: "Jane Doe · Prayer Support · Family Encouragement",
    summaryDetail: "Partner sees approved context only. Prayer focus and outcomes use structured choices, not custom prayer text.",
    workspaceNote: "Partner workspace shows approved assignments and partner-visible ledger entries only.",
    visibility: "Partner sees approved assignments, approved context, partner-visible timeline, and report-back actions only.",
    queueTitle: "My assignments",
    queueItems: [
      { label: "Jane Doe", detail: "Prayer support · assigned today", badge: "New" },
      { label: "Elena Morris", detail: "Weekly visit · follow-up due", badge: "Follow-up" },
      { label: "Mary Johnson", detail: "Scripture reading · scheduled", badge: "Visit" }
    ],
    actionsTitle: "Partner checklist",
    actionsIntro: "Keep partner work simple: accept, select focus, report outcome.",
    actions: [
      {
        id: "accept-assignment",
        label: "Accept Partner Assignment",
        detail: "Take responsibility",
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
        detail: "Choose approved focus",
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
        detail: "Structured report-back",
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

const demoScriptId = "churchwork-end-to-end-v1";
const scriptStepById = new Map(CHURCHWORK_END_TO_END_DEMO_STEPS.map((step) => [step.id, step]));

const demoSteps: DemoStep[] = [
  { scriptStepId: "requester-start", portal: "requester", highlight: "identity", status: { requester: "Ready to Submit", facility: "Awaiting Review", partner: "Waiting for Assignment" }, summaryDetail: configs.requester.summaryDetail, eventDetail: "Demo started in the requester portal." },
  { scriptStepId: "requester-select-person", portal: "requester", highlight: "form", actionId: "submit-request", activeField: "person", values: { person: "Jane Doe" }, eventDetail: "Requester form opened; selected person: Jane Doe." },
  { scriptStepId: "requester-relationship", portal: "requester", highlight: "form", actionId: "submit-request", activeField: "relationship", values: { person: "Jane Doe", relationship: "Daughter" }, eventDetail: "Requester selected relationship: Daughter." },
  { scriptStepId: "requester-request-type", portal: "requester", highlight: "form", actionId: "submit-request", activeField: "requestType", values: { person: "Jane Doe", relationship: "Daughter", requestType: "Family Encouragement & Prayer Support" }, eventDetail: "Requester selected request type: Family Encouragement & Prayer Support." },
  { scriptStepId: "requester-support-focus", portal: "requester", highlight: "form", actionId: "submit-request", activeField: "supportFocus", values: { person: "Jane Doe", relationship: "Daughter", requestType: "Family Encouragement & Prayer Support", supportFocus: "Prayer support", contactPreference: "Text messages" }, eventDetail: "Requester selected support focus and contact preference." },
  { scriptStepId: "requester-terms-accepted", portal: "requester", highlight: "form", actionId: "submit-request", activeField: "acknowledgeNoMedical", values: { person: "Jane Doe", relationship: "Daughter", requestType: "Family Encouragement & Prayer Support", supportFocus: "Prayer support", contactPreference: "Text messages", acknowledgeNoMedical: true }, eventDetail: "Requester accepted the spiritual-care-only and no-medical-details acknowledgement." },
  { scriptStepId: "care-request-submitted", portal: "requester", highlight: "ledger", status: { requester: "Submitted" }, eventDetail: "The structured care request was added to the shared ledger and is ready for facility review." },
  { scriptStepId: "facility-queue-received", portal: "facility", highlight: "queue", status: { facility: "Awaiting Review" }, summaryDetail: configs.facility.summaryDetail, eventDetail: "The request reached the facility queue." },
  { scriptStepId: "facility-review-completed", portal: "facility", highlight: "form", actionId: "review-request", activeField: "facilityDisposition", values: { requestType: "Family Encouragement & Prayer Support", facilityDisposition: "Eligible for spiritual-care workflow" }, eventDetail: "Facility reviewed the request disposition." },
  { scriptStepId: "facility-review-recorded", portal: "facility", highlight: "ledger", status: { facility: "Facility Reviewed" }, eventDetail: "Facility review was added to the ledger." },
  { scriptStepId: "consent-visibility-selected", portal: "facility", highlight: "form", actionId: "confirm-consent", activeField: "visibility", values: { consentSource: "POA / family contact", visibility: "Requester + approved partner", confirmed: true }, eventDetail: "Facility selected consent source and approved visibility." },
  { scriptStepId: "consent-recorded", portal: "facility", highlight: "ledger", status: { facility: "Consent Recorded" }, eventDetail: "Consent was added to the shared ledger." },
  { scriptStepId: "partner-sharing-approved", portal: "facility", highlight: "form", actionId: "share-partner", activeField: "sharingLevel", values: { partner: "Morning Pointe Church", sharingLevel: "Limited spiritual-care summary", approved: true }, eventDetail: "Facility prepared approved partner sharing." },
  { scriptStepId: "partner-assignment-created", portal: "partner", highlight: "queue", status: { facility: "Partner Sharing Approved", partner: "New Assignment" }, summaryDetail: configs.partner.summaryDetail, eventDetail: "The approved assignment reached the partner portal." },
  { scriptStepId: "partner-assignment-accepted", portal: "partner", highlight: "form", actionId: "accept-assignment", activeField: "assignmentScope", values: { assignmentScope: "Visit and prayer support", accepted: true }, eventDetail: "Partner selected assignment scope and accepted." },
  { scriptStepId: "partner-acceptance-recorded", portal: "partner", highlight: "ledger", status: { partner: "Assignment Accepted" }, eventDetail: "Partner acceptance was added to the ledger." },
  { scriptStepId: "care-focus-selected", portal: "partner", highlight: "form", actionId: "select-prayer-focus", activeField: "prayerFocus", values: { prayerFocus: "Comfort and Peace", careApproach: "Brief visit" }, eventDetail: "Partner selected an approved prayer and care focus." },
  { scriptStepId: "care-outcome-selected", portal: "partner", highlight: "form", actionId: "log-outcome", activeField: "outcome", values: { outcome: "Prayer support offered", nextStep: "No further action today", shareWithFacility: true }, eventDetail: "Partner selected the structured care outcome." },
  { scriptStepId: "care-outcome-recorded", portal: "partner", highlight: "ledger", status: { partner: "Outcome Logged" }, eventDetail: "Partner outcome was added to the shared ledger." },
  { scriptStepId: "requester-approved-update", portal: "requester", highlight: "ledger", status: { requester: "Care Outcome Logged" }, summaryDetail: "Sarah sees the approved care outcome and next step without facility-only notes or partner-only workflow details.", eventDetail: "Requester view now shows the approved care outcome only." }
];

const milestoneEvents: { id: string; step: number; type: ChurchWorkTimelineEventType; detail?: string; actor?: string; tone?: Tone }[] = [
  { id: "terms-accepted", step: 5, type: "requester_acknowledgement", detail: "Sarah K. accepted the spiritual-care-only acknowledgement and confirmed no medical details are included in this request.", actor: "Sarah K. · Daughter", tone: "clay" },
  { id: "submitted", step: 6, type: "care_request_submitted", detail: "Sarah submitted Jane Doe’s structured family encouragement and prayer support request.", actor: "Sarah K. · Daughter", tone: "green" },
  { id: "reviewed", step: 8, type: "facility_review_completed", detail: "Morning Pointe confirmed the request is eligible for the spiritual-care workflow.", actor: "Morning Pointe Franklin", tone: "blue" },
  { id: "consent", step: 10, type: "consent_recorded", detail: "Consent source: POA / family contact · Visibility: requester plus approved partner.", actor: "Morning Pointe Franklin", tone: "green" },
  { id: "shared", step: 12, type: "partner_sharing_approved", detail: "Limited spiritual-care summary approved for Morning Pointe Church. Medical details were not shared.", actor: "Morning Pointe Franklin", tone: "teal" },
  { id: "assignment-created", step: 13, type: "partner_assignment_created", detail: "Morning Pointe Church received an approved partner assignment.", actor: "Morning Pointe Franklin", tone: "teal" },
  { id: "accepted", step: 14, type: "partner_assignment_accepted", detail: "Morning Pointe Church accepted visit and prayer support.", actor: "Morning Pointe Church", tone: "green" },
  { id: "focus", step: 16, type: "care_focus_selected", detail: "Prayer focus: Comfort and Peace · Care approach: Brief visit. No custom prayer text was typed.", actor: "Morning Pointe Church", tone: "teal" },
  { id: "outcome", step: 18, type: "care_outcome_logged", detail: "Outcome: prayer support offered · Next step: no further action today.", actor: "Morning Pointe Church", tone: "green" }
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
  facilityVisible: true,
  partnerVisible: true
};

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

function getScriptStep(step: DemoStep) {
  return scriptStepById.get(step.scriptStepId);
}

function stepNarration(step: DemoStep) {
  return getScriptStep(step)?.narration ?? step.eventDetail ?? "Continue through the ChurchWork workflow.";
}

function stepTitle(step: DemoStep, index: number) {
  return `Step ${index + 1} of ${demoSteps.length} · ${getScriptStep(step)?.title ?? step.scriptStepId}`;
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

function fieldDetail(action: Action, values: Record<string, FormValue>) {
  const details = action.fields
    .filter((field) => field.type !== "checkbox")
    .map((field) => `${field.label}: ${String(values[field.name] ?? field.defaultValue ?? "")}`);

  return `${action.eventDetail} ${details.join(" · ")}.`;
}

function eventVisible(event: TimelineEvent, portal: PortalKind) {
  if (portal === "facility") return event.facilityVisible;
  if (portal === "partner") return event.partnerVisible;
  return event.requesterVisible;
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

function guidedEvent(step: DemoStep, index: number): TimelineEvent {
  const script = getScriptStep(step);

  return {
    id: `guided-${step.scriptStepId}`,
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

export function ChurchWorkCareLedgerDashboard({ portal }: ChurchWorkCareLedgerDashboardProps) {
  const [displayPortal, setDisplayPortal] = useState<PortalKind>(portal);
  const [demoIndex, setDemoIndex] = useState<number | null>(null);
  const [voiceOn, setVoiceOn] = useState(true);
  const [manualEvents, setManualEvents] = useState<TimelineEvent[]>([]);
  const [activeAction, setActiveAction] = useState<Action | null>(null);
  const [values, setValues] = useState<Record<string, FormValue>>({});
  const [activeField, setActiveField] = useState<string | null>(null);
  const [status, setStatus] = useState<Record<PortalKind, string>>({
    requester: configs.requester.status,
    facility: configs.facility.status,
    partner: configs.partner.status
  });
  const [summaryDetail, setSummaryDetail] = useState(configs[portal].summaryDetail);

  const currentDemoIndex = demoIndex ?? -1;
  const demoRunning = currentDemoIndex >= 0;
  const currentStep = demoRunning ? demoSteps[currentDemoIndex] : null;
  const config = configs[displayPortal];

  const timeline = useMemo(() => {
    const demoEvents = demoRunning ? demoSteps.slice(0, currentDemoIndex + 1).map(guidedEvent).reverse() : [];
    const realEvents = demoRunning
      ? milestoneEvents.filter((event) => event.step <= currentDemoIndex).map((event) => workflowEvent(event.type, event)).reverse()
      : [];

    return [...manualEvents, ...realEvents, ...demoEvents, readyEvent].filter((event) => eventVisible(event, displayPortal));
  }, [currentDemoIndex, demoRunning, displayPortal, manualEvents]);

  function activeShell(target: Highlight) {
    return currentStep?.highlight === target
      ? "churchwork-demo-active ring-[6px] ring-[#d8c5ff] ring-offset-4 ring-offset-[#f7f3ea] shadow-[0_0_0_7px_rgba(203,187,234,0.35),0_24px_80px_rgba(91,74,131,0.22)]"
      : "";
  }

  function activeProps(target: Highlight) {
    return currentStep?.highlight === target ? { "data-demo-active": "true" } : {};
  }

  function playStepNarration(step: DemoStep) {
    void playChurchWorkDemoNarration({
      scriptId: demoScriptId,
      stepId: step.scriptStepId,
      fallbackText: stepNarration(step),
      voiceEnabled: voiceOn
    });
  }

  function applyStep(index: number, shouldPlayAudio = true) {
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

    if (shouldPlayAudio) playStepNarration(next);
  }

  function startDemo() {
    setManualEvents([]);
    setDisplayPortal("requester");
    applyStep(0);
  }

  function endDemo() {
    stopChurchWorkDemoNarration();
    setDemoIndex(null);
    setActiveAction(null);
    setActiveField(null);
    setDisplayPortal(portal);
    setSummaryDetail(configs[portal].summaryDetail);
  }

  function moveDemo(delta: number) {
    if (!demoRunning) return;
    applyStep(Math.max(0, Math.min(demoSteps.length - 1, currentDemoIndex + delta)));
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
      facilityVisible: true,
      partnerVisible: activeAction.partnerVisible
    };

    setManualEvents((items) => [newEvent, ...items]);
    setStatus((items) => ({ ...items, [displayPortal]: activeAction.statusAfter }));
    setActiveAction(null);
  }

  function DemoControls({ compact = false }: { compact?: boolean }) {
    if (!demoRunning || !currentStep) return null;

    return (
      <div className={`${compact ? "mt-4" : ""} rounded-[1.25rem] border border-[#d8c5ff] bg-white/95 p-3 shadow-sm`}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="rounded-full bg-[#f4effc] px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-[#5b4a83]">
            Guided demo · {currentDemoIndex + 1}/{demoSteps.length}
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={() => setVoiceOn((value) => !value)} className="rounded-full border border-[#cbbbea] bg-white px-3 py-2 text-xs font-black text-[#5b4a83]">
              Voice {voiceOn ? "On" : "Off"}
            </button>
            <button type="button" onClick={() => playStepNarration(currentStep)} className="rounded-full border border-[#cbbbea] bg-white px-3 py-2 text-xs font-black text-[#5b4a83]">
              Replay
            </button>
            <button type="button" onClick={() => moveDemo(-1)} disabled={currentDemoIndex === 0} className="rounded-full border border-[#cbbbea] bg-white px-3 py-2 text-xs font-black text-[#5b4a83] disabled:opacity-50">
              Back
            </button>
            <button type="button" onClick={() => moveDemo(1)} disabled={currentDemoIndex === demoSteps.length - 1} className="rounded-full bg-[#173b2d] px-5 py-2 text-xs font-black text-white disabled:opacity-50">
              Next
            </button>
            <button type="button" onClick={endDemo} className="rounded-full border border-[#d8d0c0] bg-white px-3 py-2 text-xs font-black text-[#5f4b1f]">
              End
            </button>
          </div>
        </div>
      </div>
    );
  }

  function renderField(field: Field) {
    const isActive = activeField === field.name;
    const shell = isActive
      ? "churchwork-demo-active border-[#6f4bb4] bg-[#f4effc] ring-[6px] ring-[#d8c5ff] shadow-[0_0_0_7px_rgba(203,187,234,0.36),0_16px_42px_rgba(91,74,131,0.22)]"
      : "border-[#ded6c8] bg-white";
    const dataProps = isActive ? { "data-demo-active": "true", "data-demo-field-active": "true" } : {};

    if (field.type === "checkbox") {
      return (
        <label key={field.name} {...dataProps} className={`relative flex gap-3 rounded-2xl border p-4 text-sm font-bold leading-6 text-[#5f4b1f] transition ${shell}`}>
          {isActive ? <span className="absolute -top-3 left-4 rounded-full bg-[#6f4bb4] px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-white">Current step</span> : null}
          <input type="checkbox" checked={Boolean(values[field.name])} onChange={(fieldEvent) => setValues((prev) => ({ ...prev, [field.name]: fieldEvent.target.checked }))} className="mt-1 h-5 w-5" />
          <span>{field.label}</span>
        </label>
      );
    }

    return (
      <label key={field.name} {...dataProps} className={`relative block rounded-2xl border p-4 text-sm font-bold text-[#173b2d] transition ${shell}`}>
        {isActive ? <span className="absolute -top-3 left-4 rounded-full bg-[#6f4bb4] px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-white">Current step</span> : null}
        {field.label}
        <select value={String(values[field.name] ?? field.defaultValue ?? "")} onChange={(fieldEvent) => setValues((prev) => ({ ...prev, [field.name]: fieldEvent.target.value }))} className="mt-2 w-full rounded-xl border border-[#d8d0c0] bg-white px-4 py-3 text-sm text-[#102b3a]">
          {(field.options ?? []).map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
      </label>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f3ea] text-[#102b3a]">
      <header className="sticky top-0 z-40 border-b border-[#15394b] bg-[#0d2b3b] text-white shadow-lg shadow-[#0d2b3b]/15">
        <div className="mx-auto flex max-w-[92rem] flex-col gap-4 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
          <Link href="/" className="flex items-center gap-3" aria-label="ChurchWork home">
            <span className="flex h-12 w-20 items-center justify-center rounded-2xl bg-white p-2 shadow-sm">
              <img src="/brand/churchwork-corner-logo.png" alt="ChurchWork CW logo" className="h-full w-full object-contain" />
            </span>
            <span>
              <span className="block font-serif text-2xl font-semibold tracking-[-0.04em]">Church<span className="text-[#8dbd9e]">Work</span></span>
              <span className="block text-xs font-bold text-[#d4dedc]">{portalNames[displayPortal]} care workspace</span>
            </span>
          </Link>

          <div className="flex flex-wrap items-center gap-3 text-sm">
            <div className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold text-[#edf5e6]">Structured care · consent-aware · role-safe</div>
            <button type="button" onClick={startDemo} className="rounded-full bg-[#cbbbea] px-4 py-2 text-xs font-black text-[#16243a] shadow-sm hover:bg-[#d8cff1]">
              Start Guided Demo
            </button>
          </div>
        </div>
      </header>

      {demoRunning && currentStep ? (
        <section className="sticky top-[5rem] z-30 mx-auto max-w-[92rem] px-5 pt-4" aria-live="polite">
          <div className="rounded-[1.5rem] border border-[#cbbbea] bg-[#f4effc]/95 p-5 shadow-lg shadow-[#5b4a83]/10 backdrop-blur">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#5b4a83]">{stepTitle(currentStep, currentDemoIndex)}</p>
                <p className="mt-2 max-w-4xl text-base font-black leading-7 text-[#16243a]">{stepNarration(currentStep)}</p>
              </div>
              {!activeAction ? <DemoControls /> : null}
            </div>
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-[92rem] px-5 py-7">
        <div {...activeProps("identity")} className={`mb-7 rounded-[2rem] border border-[#ded6c8] bg-[#fffdf8] p-5 shadow-[0_24px_80px_rgba(54,44,28,0.08)] transition md:p-7 ${activeShell("identity")}`}>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#789052]">{config.eyebrow}</p>
              <h1 className="mt-3 max-w-4xl font-serif text-4xl font-semibold tracking-[-0.045em] text-[#0d2b3b] md:text-6xl">{config.title}</h1>
              <p className="mt-4 max-w-3xl text-base font-semibold leading-8 text-[#4d5d55]">{config.subtitle}</p>
            </div>
            <div className="rounded-[1.5rem] bg-[#173b2d] p-5 text-white">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#c8d9b3]">Signed in as</p>
              <p className="mt-2 text-lg font-black">{config.accountName}</p>
              <p className="mt-1 text-sm font-semibold text-[#edf5e6]">{config.roleName}</p>
              <div className="mt-4 rounded-2xl bg-white/10 p-4">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#c8d9b3]">Current status</p>
                <p className="mt-1 text-xl font-black">{status[displayPortal]}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          <section className="space-y-6">
            <div {...activeProps("casefile")} className={`rounded-[2rem] border border-[#ded6c8] bg-white/95 shadow-[0_20px_70px_rgba(54,44,28,0.07)] transition ${activeShell("casefile")}`}>
              <div className="border-b border-[#eee7da] p-6 md:p-7">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#789052]">{config.caseLabel}</p>
                <div className="mt-4 flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h2 className="font-serif text-4xl font-semibold tracking-[-0.045em] text-[#102b3a]">Jane Doe</h2>
                    <p className="mt-2 text-sm font-bold text-[#4d5d55]">{config.subjectMeta}</p>
                    <p className="mt-5 max-w-3xl text-base font-semibold leading-8 text-[#4d5d55]">{summaryDetail}</p>
                  </div>
                  <div className="rounded-[1.25rem] border border-[#d8d0c0] bg-[#fbf8f0] p-4 md:w-72">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-[#173b2d]">Next best action</p>
                    <p className="mt-2 text-sm font-bold leading-6 text-[#4d5d55]">{config.nextStep}</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-0 lg:grid-cols-[270px_minmax(0,1fr)]">
                <aside {...activeProps("queue")} className={`border-b border-[#eee7da] p-6 lg:border-b-0 lg:border-r ${activeShell("queue")}`}>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#173b2d]">{config.queueTitle}</p>
                  <div className="mt-4 space-y-4">
                    {config.queueItems.map((item) => (
                      <div key={`${item.label}-${item.detail}`} className="border-b border-[#eee7da] pb-4 last:border-b-0 last:pb-0">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-black text-[#102b3a]">{item.label}</p>
                            <p className="mt-1 text-xs font-semibold leading-5 text-[#4d5d55]">{item.detail}</p>
                          </div>
                          {item.badge ? <span className="rounded-full bg-[#f0f5e8] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-[#315f44]">{item.badge}</span> : null}
                        </div>
                      </div>
                    ))}
                  </div>
                </aside>

                <section {...activeProps("ledger")} className={`p-6 transition ${activeShell("ledger")}`}>
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-[#173b2d]">Official care ledger</p>
                      <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-[#4d5d55]">Audit-backed record of acknowledgements, consent, sharing approvals, assignments, and care outcomes.</p>
                    </div>
                    <span className="rounded-full border border-[#d8d0c0] bg-[#fbf8f0] px-3 py-1 text-xs font-black text-[#4d5d55]">{timeline.length} visible</span>
                  </div>

                  {currentStep?.highlight === "ledger" ? <DemoControls compact /> : null}

                  <div className="mt-6 max-h-[38rem] space-y-0 overflow-y-auto pr-2 [scrollbar-width:thin]">
                    {timeline.map((event, index) => (
                      <article key={event.id} className="relative grid gap-4 border-l-2 border-[#ddd5c8] pb-6 pl-5 last:pb-0 md:grid-cols-[120px_1fr]">
                        <span className="absolute -left-[7px] top-1 h-3 w-3 rounded-full border-2 border-white bg-[#173b2d] shadow-sm" />
                        <div>
                          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#65717a]">{index === 0 ? "Newest" : "Today"}</p>
                          <p className="mt-1 text-xs font-bold text-[#789052]">{event.step >= 0 ? `Step ${event.step + 1}` : "Ready"}</p>
                        </div>
                        <div className="rounded-[1.25rem] border border-[#eee7da] bg-[#fffdf9] p-4">
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
              </div>
            </div>
          </section>

          <aside className="space-y-5 xl:sticky xl:top-[8.5rem] xl:max-h-[calc(100vh-9rem)] xl:overflow-y-auto xl:pr-1 [scrollbar-width:thin]">
            <section {...activeProps("checklist")} className={`rounded-[2rem] border border-[#ded6c8] bg-white/95 p-5 shadow-[0_18px_60px_rgba(54,44,28,0.07)] transition ${activeShell("checklist")}`}>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#173b2d]">{config.actionsTitle}</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-[#4d5d55]">{config.actionsIntro}</p>

              <div className="mt-5 space-y-2">
                {config.actions.map((action, index) => (
                  <button key={action.id} type="button" onClick={() => openAction(action)} className={`w-full rounded-[1.15rem] border px-4 py-4 text-left transition ${index === 0 ? "border-[#173b2d] bg-[#173b2d] text-white shadow-md hover:bg-[#102b3a]" : "border-[#ded6c8] bg-[#fffdf9] text-[#102b3a] hover:border-[#86a45f] hover:bg-[#f8fbf8]"}`}>
                    <span className="block text-sm font-black">{index + 1}. {action.label}</span>
                    <span className={`mt-1 block text-xs font-semibold ${index === 0 ? "text-[#edf5e6]" : "text-[#4d5d55]"}`}>{action.detail}</span>
                  </button>
                ))}
              </div>

              {activeAction ? (
                <form {...activeProps("form")} onSubmit={submitAction} className={`mt-5 rounded-[1.5rem] border border-[#cbbbea] bg-[#fbf8f0] p-4 transition ${activeShell("form")}`}>
                  <div className="sticky top-0 z-20 -mx-4 -mt-4 rounded-t-[1.5rem] border-b border-[#e6ddcd] bg-[#fbf8f0]/95 p-4 backdrop-blur">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-[#5b4a83]">{demoRunning ? "Guided step form" : "Structured form"}</p>
                    <h3 className="mt-2 text-lg font-black text-[#102b3a]">{activeAction.label}</h3>
                    {demoRunning ? <DemoControls compact /> : null}
                  </div>
                  <div className="mt-4 max-h-[43vh] space-y-3 overflow-y-auto px-1 py-2 [scrollbar-width:thin]">
                    {activeAction.fields.map(renderField)}
                  </div>
                  {demoRunning ? (
                    <p className="mt-3 rounded-xl bg-[#fff8e7] px-4 py-3 text-xs font-bold leading-5 text-[#5f4b1f]">The demo advances the official ledger as each step is completed.</p>
                  ) : (
                    <button type="submit" className="mt-4 w-full rounded-xl bg-[#173b2d] px-5 py-3 text-sm font-black text-white hover:bg-[#102b3a]">{activeAction.submitLabel}</button>
                  )}
                </form>
              ) : null}
            </section>

            <section {...activeProps("visibility")} className={`rounded-[2rem] border border-[#ddb66c]/45 bg-[#fff8e7] p-5 shadow-sm transition ${activeShell("visibility")}`}>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#7a5b20]">Role visibility</p>
              <p className="mt-2 text-sm font-bold leading-6 text-[#5f4b1f]">{config.visibility}</p>
              <p className="mt-4 border-t border-[#ead6a8] pt-4 text-xs font-semibold leading-5 text-[#76551c]">{config.workspaceNote}</p>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}
