"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

type PortalKind = "requester" | "facility" | "partner";
type FieldType = "select" | "date" | "checkbox";
type TimelineTone = "teal" | "gold" | "blue" | "green" | "clay" | "stone";
type DemoHighlight = "title" | "context" | "summary" | "details" | "timeline" | "actions" | "visibility" | "demo" | null;

type TimelineEvent = {
  id: string;
  date: string;
  time: string;
  title: string;
  detail: string;
  actor: string;
  badge: string;
  tone: TimelineTone;
  requesterVisible: boolean;
  partnerVisible: boolean;
};

type ActionField = {
  name: string;
  label: string;
  type: FieldType;
  options?: string[];
  defaultValue?: string;
  required?: boolean;
};

type PortalAction = {
  id: string;
  label: string;
  detail: string;
  eventTitle: string;
  eventDetail: string;
  submitLabel: string;
  statusAfter: string;
  tone: TimelineTone;
  requesterVisible: boolean;
  partnerVisible: boolean;
  fields: ActionField[];
};

type PortalCopy = {
  eyebrow: string;
  title: string;
  subtitle: string;
  accountName: string;
  accountRole: string;
  primaryCardTitle: string;
  primaryCardMeta: string;
  primaryCardDetail: string;
  statusLabel: string;
  nextStep: string;
  contextTitle: string;
  contextItems: { label: string; detail: string; badge?: string }[];
  infoCards: { title: string; body: string; footer: string }[];
  actionsTitle: string;
  visibilitySummary: string;
  actions: PortalAction[];
};

type ChurchWorkPortalDashboardProps = {
  portal: PortalKind;
};

const portalNames: Record<PortalKind, string> = {
  requester: "Requester Portal",
  facility: "Facility Portal",
  partner: "Partner Portal"
};

const sharedPeople = ["Jane Doe", "Elena Morris", "Mary Johnson", "Robert Smith"];
const requestTypes = ["Family Encouragement & Prayer Support", "Pastoral Visit", "Prayer Support", "Church Connection", "Facility Follow-up"];
const carePartners = ["Morning Pointe Church", "Grace Community Church", "First Assembly Care Team"];
const prayerFocuses = ["Comfort and Peace", "Strength for Family", "Hope and Reassurance", "Thankful Encouragement", "Quiet Presence"];
const careOutcomes = ["Prayer support offered", "Visit completed", "Follow-up requested", "Facility update needed", "No further action today"];

const portalCopy: Record<PortalKind, PortalCopy> = {
  requester: {
    eyebrow: "Requester access",
    title: "My Care Request Workspace",
    subtitle: "Submit a care request with guided choices, then see approved updates only.",
    accountName: "Sarah K. (Daughter)",
    accountRole: "Requester",
    primaryCardTitle: "Jane Doe",
    primaryCardMeta: "Room 104B · Age 78 · Protestant",
    primaryCardDetail: "Family encouragement and prayer support request. Requesters use preselected choices only; no open-ended medical or free-text request boxes.",
    statusLabel: "Ready to Submit",
    nextStep: "Choose the structured request details, confirm the privacy acknowledgement, and submit for facility review.",
    contextTitle: "Request Snapshot",
    contextItems: [
      { label: "Person", detail: "Jane Doe", badge: "Selected" },
      { label: "Relationship", detail: "Daughter" },
      { label: "Request type", detail: "Family Encouragement & Prayer Support" },
      { label: "Contact preference", detail: "Text messages" }
    ],
    infoCards: [
      { title: "Structured Choices", body: "The requester chooses from controlled options so the request stays safe, searchable, and reviewable.", footer: "No Free Text" },
      { title: "Facility Review", body: "The facility receives the request, confirms consent, and decides what can be shared externally.", footer: "Human Reviewed" },
      { title: "Requester Updates", body: "The requester only sees approved status updates, visit confirmations, and family-safe timeline events.", footer: "Filtered View" }
    ],
    actionsTitle: "Requester Actions",
    visibilitySummary: "Requester view shows approved status updates, consent summary, next steps, and family-safe timeline entries only.",
    actions: [
      {
        id: "requester-submit-care-request",
        label: "Submit Care Request",
        detail: "Use guided choices only",
        eventTitle: "Care request submitted",
        eventDetail: "Sarah submitted a structured spiritual-care request for Jane Doe.",
        submitLabel: "Submit request",
        statusAfter: "Submitted",
        tone: "green",
        requesterVisible: true,
        partnerVisible: false,
        fields: [
          { name: "person", label: "Who is this request for?", type: "select", options: sharedPeople, defaultValue: "Jane Doe", required: true },
          { name: "relationship", label: "Relationship", type: "select", options: ["Daughter", "Son", "Spouse", "Resident", "Facility contact"], defaultValue: "Daughter", required: true },
          { name: "requestType", label: "Request type", type: "select", options: requestTypes, defaultValue: "Family Encouragement & Prayer Support", required: true },
          { name: "supportFocus", label: "Support focus", type: "select", options: ["Prayer support", "Family encouragement", "Short visit", "Church check-in"], defaultValue: "Prayer support", required: true },
          { name: "contactPreference", label: "Contact preference", type: "select", options: ["Text messages", "Phone call", "Email"], defaultValue: "Text messages", required: true },
          { name: "acknowledgeNoMedical", label: "I understand this is spiritual-care coordination only and does not include medical details.", type: "checkbox", required: true }
        ]
      },
      {
        id: "requester-request-update",
        label: "Request Update",
        detail: "Choose the update type needed",
        eventTitle: "Requester update requested",
        eventDetail: "Sarah requested an approved status update from the care team.",
        submitLabel: "Request update",
        statusAfter: "Update Requested",
        tone: "gold",
        requesterVisible: true,
        partnerVisible: false,
        fields: [
          { name: "updateType", label: "What update is needed?", type: "select", options: ["Visit timing", "Consent status", "Care team status", "Contact preference"], defaultValue: "Visit timing", required: true }
        ]
      },
      {
        id: "requester-review-consent",
        label: "Review Consent",
        detail: "Confirm privacy summary was reviewed",
        eventTitle: "Consent summary reviewed",
        eventDetail: "Sarah reviewed the consent and privacy summary.",
        submitLabel: "Mark reviewed",
        statusAfter: "Consent Reviewed",
        tone: "teal",
        requesterVisible: true,
        partnerVisible: false,
        fields: [
          { name: "reviewed", label: "I reviewed the consent and privacy summary.", type: "checkbox", required: true }
        ]
      }
    ]
  },
  facility: {
    eyebrow: "Facility access",
    title: "Facility Care Workspace",
    subtitle: "Review requests, confirm consent, share only approved details, and keep the shared timeline clean.",
    accountName: "Morning Pointe Franklin",
    accountRole: "Facility Team",
    primaryCardTitle: "Jane Doe",
    primaryCardMeta: "Room 104B · Assisted Living · Protestant",
    primaryCardDetail: "Facility staff controls consent, visibility, partner handoff, visit timing, and internal-only care coordination.",
    statusLabel: "Awaiting Review",
    nextStep: "Review the request, confirm consent, then share only the approved spiritual-care summary with the partner.",
    contextTitle: "Facility Queue",
    contextItems: [
      { label: "Jane Doe", detail: "Room 104B · new request", badge: "New" },
      { label: "Elena Morris", detail: "Room 108A · consent pending", badge: "Review" },
      { label: "Mary Johnson", detail: "Room 112C · visit follow-up", badge: "Follow-up" },
      { label: "Robert Smith", detail: "Room 119A · routine care", badge: "Active" }
    ],
    infoCards: [
      { title: "Consent & Visibility", body: "Facility users decide whether the requester, partner, or facility-only team can see each update.", footer: "Facility Controlled" },
      { title: "Partner Sharing", body: "Partners receive only approved spiritual-care context, not medical details or unrelated resident information.", footer: "Limited Summary" },
      { title: "Upcoming Visit", body: "Once the partner is approved, the facility can confirm timing and location for the care visit.", footer: "Scheduled by Facility" }
    ],
    actionsTitle: "Facility Actions",
    visibilitySummary: "Facility view shows full facility workflow, consent status, internal notes, partner sharing, family updates, and the complete case timeline.",
    actions: [
      {
        id: "facility-review-request",
        label: "Review Request",
        detail: "Move request into facility workflow",
        eventTitle: "Request reviewed by facility",
        eventDetail: "Morning Pointe reviewed Jane Doe's request and opened the facility workflow.",
        submitLabel: "Complete review",
        statusAfter: "Facility Reviewed",
        tone: "blue",
        requesterVisible: true,
        partnerVisible: false,
        fields: [
          { name: "requestType", label: "Confirmed request type", type: "select", options: requestTypes, defaultValue: "Family Encouragement & Prayer Support", required: true },
          { name: "facilityDisposition", label: "Facility disposition", type: "select", options: ["Eligible for spiritual-care workflow", "Needs consent review", "Needs family clarification"], defaultValue: "Eligible for spiritual-care workflow", required: true }
        ]
      },
      {
        id: "facility-confirm-consent",
        label: "Confirm Consent",
        detail: "Document sharing permissions",
        eventTitle: "Consent confirmed by facility",
        eventDetail: "Morning Pointe confirmed consent and visibility for the spiritual-care request.",
        submitLabel: "Confirm consent",
        statusAfter: "Consent Confirmed",
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
        id: "facility-share-partner",
        label: "Share With Partner",
        detail: "Send approved context only",
        eventTitle: "Request shared with partner",
        eventDetail: "Morning Pointe shared the approved spiritual-care summary with the selected partner.",
        submitLabel: "Share approved summary",
        statusAfter: "Shared With Partner",
        tone: "teal",
        requesterVisible: true,
        partnerVisible: true,
        fields: [
          { name: "partner", label: "Approved partner", type: "select", options: carePartners, defaultValue: "Morning Pointe Church", required: true },
          { name: "sharingLevel", label: "Sharing level", type: "select", options: ["Limited spiritual-care summary", "Visit details only", "Prayer request only"], defaultValue: "Limited spiritual-care summary", required: true },
          { name: "approved", label: "I confirm this sharing level is approved for this partner.", type: "checkbox", required: true }
        ]
      },
      {
        id: "facility-schedule-visit",
        label: "Schedule Visit",
        detail: "Confirm timing and location",
        eventTitle: "Visit scheduled",
        eventDetail: "Morning Pointe scheduled the approved partner visit.",
        submitLabel: "Schedule visit",
        statusAfter: "Visit Scheduled",
        tone: "gold",
        requesterVisible: true,
        partnerVisible: true,
        fields: [
          { name: "visitDate", label: "Visit date", type: "date", defaultValue: "2026-07-15", required: true },
          { name: "visitWindow", label: "Visit window", type: "select", options: ["Morning", "Afternoon", "Evening"], defaultValue: "Morning", required: true },
          { name: "location", label: "Location", type: "select", options: ["Room 104B", "Chapel", "Family room", "Common area"], defaultValue: "Room 104B", required: true }
        ]
      }
    ]
  },
  partner: {
    eyebrow: "Partner access",
    title: "Partner Care Workspace",
    subtitle: "Accept approved assignments, choose care actions, and report structured outcomes back to the facility.",
    accountName: "Morning Pointe Church",
    accountRole: "Partner Team",
    primaryCardTitle: "Jane Doe",
    primaryCardMeta: "Room 104B · Prayer Support · Family Encouragement",
    primaryCardDetail: "Partners see approved context only. Prayer and care outcomes are selected from structured choices, not typed as open-ended prayer text.",
    statusLabel: "New Assignment",
    nextStep: "Accept the assignment, select the prayer/care focus, then send the completed outcome back to the facility.",
    contextTitle: "My Assignments",
    contextItems: [
      { label: "Jane Doe", detail: "Prayer support · assigned today", badge: "New" },
      { label: "Elena Morris", detail: "Weekly visit · follow-up due", badge: "Follow-up" },
      { label: "Mary Johnson", detail: "Scripture reading · visit scheduled", badge: "Visit" },
      { label: "Robert Smith", detail: "Quiet check-in · active", badge: "Active" }
    ],
    infoCards: [
      { title: "Approved Need", body: "The approved request is for prayer support, family encouragement, and a short visit.", footer: "Approved Summary" },
      { title: "Facility Contact", body: "All questions, updates, and visit outcomes go back to the facility care coordinator.", footer: "Facility Routed" },
      { title: "Prayer Options", body: "The partner selects a prayer focus and care outcome. No open prayer text is sent from the portal.", footer: "Structured Only" }
    ],
    actionsTitle: "Partner Actions",
    visibilitySummary: "Partner view shows approved assignments, approved request details, partner-visible timeline entries, and report-back actions only.",
    actions: [
      {
        id: "partner-accept-assignment",
        label: "Accept Assignment",
        detail: "Take responsibility for this approved care action",
        eventTitle: "Assignment accepted",
        eventDetail: "Morning Pointe Church accepted the approved care assignment.",
        submitLabel: "Accept assignment",
        statusAfter: "Assignment Accepted",
        tone: "green",
        requesterVisible: false,
        partnerVisible: true,
        fields: [
          { name: "assignmentScope", label: "Assignment scope", type: "select", options: ["Prayer support", "Visit and prayer support", "Family encouragement", "Church connection"], defaultValue: "Visit and prayer support", required: true },
          { name: "accepted", label: "I accept this assignment for the partner team.", type: "checkbox", required: true }
        ]
      },
      {
        id: "partner-select-prayer-focus",
        label: "Select Prayer Focus",
        detail: "Choose an approved prayer category",
        eventTitle: "Prayer focus selected",
        eventDetail: "Morning Pointe Church selected an approved prayer focus for the care assignment.",
        submitLabel: "Save prayer focus",
        statusAfter: "Prayer Focus Selected",
        tone: "teal",
        requesterVisible: false,
        partnerVisible: true,
        fields: [
          { name: "prayerFocus", label: "Prayer focus", type: "select", options: prayerFocuses, defaultValue: "Comfort and Peace", required: true },
          { name: "careApproach", label: "Care approach", type: "select", options: ["Brief visit", "Quiet prayer", "Encouragement note", "Family encouragement", "Follow-up with facility"], defaultValue: "Brief visit", required: true }
        ]
      },
      {
        id: "partner-log-outcome",
        label: "Log Care Outcome",
        detail: "Report a structured outcome to the facility",
        eventTitle: "Partner care outcome logged",
        eventDetail: "Morning Pointe Church logged a structured care outcome back to the facility.",
        submitLabel: "Log outcome",
        statusAfter: "Outcome Logged",
        tone: "green",
        requesterVisible: true,
        partnerVisible: true,
        fields: [
          { name: "outcome", label: "Care outcome", type: "select", options: careOutcomes, defaultValue: "Prayer support offered", required: true },
          { name: "nextStep", label: "Next step", type: "select", options: ["No further action today", "Facility follow-up", "Schedule another visit", "Family update recommended"], defaultValue: "No further action today", required: true },
          { name: "shareWithFacility", label: "Share this completed outcome with the facility.", type: "checkbox", required: true }
        ]
      },
      {
        id: "partner-request-clarification",
        label: "Request Clarification",
        detail: "Ask a structured question before acting",
        eventTitle: "Clarification requested",
        eventDetail: "Morning Pointe Church requested clarification before taking the next care step.",
        submitLabel: "Request clarification",
        statusAfter: "Clarification Requested",
        tone: "gold",
        requesterVisible: false,
        partnerVisible: true,
        fields: [
          { name: "question", label: "Question type", type: "select", options: ["Visit timing", "Location", "Consent boundary", "Preferred care approach"], defaultValue: "Visit timing", required: true }
        ]
      }
    ]
  }
};

const initialTimeline: TimelineEvent[] = [
  {
    id: "request-started",
    date: "Today",
    time: "Ready",
    title: "Demo ready",
    detail: "Start the end-to-end demo to watch a requester, facility, and partner complete one shared care workflow.",
    actor: "ChurchWork",
    badge: "Ready",
    tone: "stone",
    requesterVisible: true,
    partnerVisible: true
  }
];

function badgeClasses(tone: TimelineTone) {
  const tones: Record<TimelineTone, string> = {
    teal: "border-[#9fc6bd] bg-[#edf7f5] text-[#275d55]",
    gold: "border-[#e5c071] bg-[#fff7e6] text-[#76551c]",
    blue: "border-[#b5c8d4] bg-[#eef4f7] text-[#385d70]",
    green: "border-[#b7d1c0] bg-[#eef6f0] text-[#315f44]",
    clay: "border-[#e0a08f] bg-[#fff0eb] text-[#8d3f2c]",
    stone: "border-[#d8d0c0] bg-[#fbf8f0] text-[#4d5d55]"
  };

  return tones[tone];
}

function visibleForPortal(event: TimelineEvent, portal: PortalKind) {
  if (portal === "facility") return true;
  if (portal === "partner") return event.partnerVisible;
  return event.requesterVisible;
}

function fieldValue(formData: FormData, field: ActionField) {
  const value = formData.get(field.name);
  if (field.type === "checkbox") return value ? "Confirmed" : "Not confirmed";
  return String(value ?? field.defaultValue ?? "").trim();
}

function buildEventDetail(action: PortalAction, formData: FormData) {
  const details = action.fields
    .filter((field) => field.type !== "checkbox")
    .map((field) => `${field.label}: ${fieldValue(formData, field)}`)
    .filter((line) => !line.endsWith(": "));

  if (!details.length) return action.eventDetail;
  return `${action.eventDetail} ${details.join(" · ")}.`;
}

function renderField(field: ActionField) {
  if (field.type === "checkbox") {
    return (
      <label key={field.name} className="flex gap-3 rounded-2xl border border-[#d8d0c0] bg-[#fff8e7] p-4 text-sm font-bold leading-6 text-[#5f4b1f]">
        <input name={field.name} type="checkbox" required={field.required} className="mt-1 h-5 w-5" />
        <span>{field.label}</span>
      </label>
    );
  }

  return (
    <label key={field.name} className="block text-sm font-bold text-[#173b2d]">
      {field.label}
      {field.type === "date" ? (
        <input name={field.name} type="date" required={field.required} defaultValue={field.defaultValue} className="mt-2 w-full rounded-2xl border border-[#d8d0c0] bg-white px-4 py-3 text-sm text-[#102b3a] outline-none ring-[#86a45f]/25 focus:border-[#86a45f] focus:ring-4" />
      ) : (
        <select name={field.name} required={field.required} defaultValue={field.defaultValue} className="mt-2 w-full rounded-2xl border border-[#d8d0c0] bg-white px-4 py-3 text-sm text-[#102b3a] outline-none ring-[#86a45f]/25 focus:border-[#86a45f] focus:ring-4">
          {(field.options ?? []).map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      )}
    </label>
  );
}

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function speakEnglish(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.93;
  utterance.pitch = 1.02;
  utterance.volume = 0.9;
  const voices = window.speechSynthesis.getVoices();
  const englishVoice = voices.find((voice) => voice.lang.toLowerCase().startsWith("en-us")) ?? voices.find((voice) => voice.lang.toLowerCase().startsWith("en"));
  if (englishVoice) utterance.voice = englishVoice;
  window.speechSynthesis.speak(utterance);
}

function selectAction(portal: PortalKind, actionId: string) {
  return portalCopy[portal].actions.find((action) => action.id === actionId) ?? portalCopy[portal].actions[0];
}

export function ChurchWorkPortalDashboard({ portal }: ChurchWorkPortalDashboardProps) {
  const [timeline, setTimeline] = useState(initialTimeline);
  const [activeAction, setActiveAction] = useState<PortalAction | null>(null);
  const [displayPortal, setDisplayPortal] = useState<PortalKind>(portal);
  const [statusLabels, setStatusLabels] = useState<Record<PortalKind, string>>({ requester: portalCopy.requester.statusLabel, facility: portalCopy.facility.statusLabel, partner: portalCopy.partner.statusLabel });
  const [subjectName, setSubjectName] = useState("Jane Doe");
  const [subjectMeta, setSubjectMeta] = useState("Room 104B · Family Encouragement & Prayer Support");
  const [subjectDetail, setSubjectDetail] = useState(portalCopy[portal].primaryCardDetail);
  const [demoCaption, setDemoCaption] = useState("");
  const [demoStepLabel, setDemoStepLabel] = useState("");
  const [demoHighlight, setDemoHighlight] = useState<DemoHighlight>(null);
  const [isDemoRunning, setDemoRunning] = useState(false);

  const copy = portalCopy[displayPortal];
  const visibleTimeline = useMemo(() => timeline.filter((event) => visibleForPortal(event, displayPortal)), [timeline, displayPortal]);

  function ringFor(target: DemoHighlight) {
    return demoHighlight === target ? "ring-4 ring-[#cbbbea] ring-offset-4 ring-offset-[#f7f3ea]" : "";
  }

  function addTimelineEvent(portalForAction: PortalKind, action: PortalAction, detailOverride?: string) {
    const actor = portalCopy[portalForAction].accountName;
    const newEvent: TimelineEvent = {
      id: `${portalForAction}-${action.id}-${Date.now()}`,
      date: "Today",
      time: "Now",
      title: action.eventTitle,
      detail: detailOverride ?? action.eventDetail,
      actor,
      badge: action.label,
      tone: action.tone,
      requesterVisible: action.requesterVisible,
      partnerVisible: action.partnerVisible
    };

    setStatusLabels((labels) => ({ ...labels, [portalForAction]: action.statusAfter }));
    setTimeline((items) => [newEvent, ...items]);
  }

  async function typeDemoLine(text: string, stepLabel: string, highlight: DemoHighlight) {
    setDemoStepLabel(stepLabel);
    setDemoHighlight(highlight);
    setDemoCaption("");
    speakEnglish(text);
    for (let index = 0; index <= text.length; index += 1) {
      setDemoCaption(text.slice(0, index));
      await wait(16);
    }
    await wait(1000);
  }

  async function startEndToEndDemo() {
    if (isDemoRunning) return;
    setDemoRunning(true);
    setActiveAction(null);
    setTimeline(initialTimeline);
    setStatusLabels({ requester: "Ready to Submit", facility: "Awaiting Review", partner: "Waiting for Assignment" });

    try {
      setDisplayPortal("requester");
      setSubjectName("Jane Doe");
      setSubjectMeta("Room 104B · Family Encouragement & Prayer Support");
      setSubjectDetail("Sarah uses preselected choices only. No open text request is needed to start a spiritual-care workflow.");
      await typeDemoLine("Requester portal. Sarah selects Jane Doe, chooses Daughter, selects Family Encouragement and Prayer Support, chooses text messages, and confirms this is spiritual-care coordination only.", "Step 1 · Requester submits", "actions");
      addTimelineEvent("requester", selectAction("requester", "requester-submit-care-request"), "Sarah submitted a structured request: Person Jane Doe · Relationship Daughter · Request Family Encouragement & Prayer Support · Contact Text messages.");

      await typeDemoLine("The request is now visible to the requester as submitted, but it is not sent to a partner yet. The facility must review it first.", "Step 2 · Timeline records request", "timeline");

      setDisplayPortal("facility");
      setSubjectDetail(portalCopy.facility.primaryCardDetail);
      await typeDemoLine("Facility portal. Morning Pointe reviews Jane Doe's request and moves it into the facility workflow.", "Step 3 · Facility reviews", "actions");
      addTimelineEvent("facility", selectAction("facility", "facility-review-request"), "Morning Pointe reviewed the request and confirmed it is eligible for spiritual-care workflow.");

      await typeDemoLine("The facility confirms consent and chooses the visibility level: requester plus approved partner.", "Step 4 · Consent confirmed", "actions");
      addTimelineEvent("facility", selectAction("facility", "facility-confirm-consent"), "Consent source: POA / family contact · Approved visibility: Requester + approved partner · Consent reviewed before sharing.");

      await typeDemoLine("The facility shares only a limited spiritual-care summary with Morning Pointe Church. Medical details and internal notes stay hidden.", "Step 5 · Partner sharing", "visibility");
      addTimelineEvent("facility", selectAction("facility", "facility-share-partner"), "Morning Pointe shared: Limited spiritual-care summary · Approved partner: Morning Pointe Church.");

      setDisplayPortal("partner");
      setSubjectDetail(portalCopy.partner.primaryCardDetail);
      await typeDemoLine("Partner portal. Morning Pointe Church receives the approved assignment and accepts responsibility for the care action.", "Step 6 · Partner accepts", "actions");
      addTimelineEvent("partner", selectAction("partner", "partner-accept-assignment"), "Morning Pointe Church accepted the assignment scope: Visit and prayer support.");

      await typeDemoLine("The partner does not type and send a custom prayer. The partner selects an approved prayer focus: Comfort and Peace.", "Step 7 · Prayer focus selected", "actions");
      addTimelineEvent("partner", selectAction("partner", "partner-select-prayer-focus"), "Prayer focus: Comfort and Peace · Care approach: Brief visit.");

      await typeDemoLine("After the visit, the partner logs a structured outcome back to the facility: prayer support offered, no further action today.", "Step 8 · Outcome logged", "actions");
      addTimelineEvent("partner", selectAction("partner", "partner-log-outcome"), "Care outcome: Prayer support offered · Next step: No further action today · Shared with facility.");

      setDisplayPortal("requester");
      await typeDemoLine("Back on the requester portal, Sarah sees only the approved status updates. Internal notes and partner-only details are not visible.", "Step 9 · Requester sees approved updates", "timeline");
      setStatusLabels((labels) => ({ ...labels, requester: "Care Outcome Logged" }));

      await typeDemoLine("End-to-end demo complete. One structured request moved from requester, to facility review, to approved partner care, and back into the shared timeline.", "Complete", "demo");
    } finally {
      window.speechSynthesis?.cancel();
      setDemoRunning(false);
      setDemoHighlight(null);
    }
  }

  function handleActionSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!activeAction) return;

    const formData = new FormData(event.currentTarget);
    addTimelineEvent(displayPortal, activeAction, buildEventDetail(activeAction, formData));

    if (activeAction.id === "requester-submit-care-request") {
      const person = String(formData.get("person") ?? "Jane Doe");
      const requestType = String(formData.get("requestType") ?? "Family Encouragement & Prayer Support");
      setSubjectName(person);
      setSubjectMeta(`Room 104B · ${requestType}`);
      setSubjectDetail("Structured spiritual-care request submitted through the requester portal. The facility will review consent, visibility, and the next safe care step.");
    }

    setActiveAction(null);
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

          <div className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold text-[#edf5e6]">
            Structured choices · role-safe timeline · English voice demo
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm">
            <button type="button" disabled={isDemoRunning} onClick={() => void startEndToEndDemo()} className="rounded-full bg-[#cbbbea] px-4 py-2 text-xs font-black text-[#16243a] shadow-sm hover:bg-[#d8cff1] disabled:cursor-not-allowed disabled:opacity-60">
              {isDemoRunning ? "Demo Running…" : "Start End-to-End Demo"}
            </button>
            <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-2 text-right">
              <p className="font-black">{copy.accountName}</p>
              <p className="text-xs font-semibold text-[#d4dedc]">{copy.accountRole}</p>
            </div>
          </div>
        </div>
      </header>

      {demoCaption ? (
        <section className={`mx-auto mt-5 max-w-[92rem] px-5 ${ringFor("demo")}`} aria-live="polite">
          <div className="rounded-[1.5rem] border border-[#cbbbea] bg-[#f4effc] p-5 shadow-lg shadow-[#5b4a83]/10">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#5b4a83]">{demoStepLabel}</p>
            <p className="mt-2 text-lg font-black leading-7 text-[#16243a]">{demoCaption}<span className="animate-pulse">|</span></p>
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-[92rem] px-5 py-6">
        <div className={`mb-5 flex flex-col gap-4 rounded-[1.7rem] p-1 transition lg:flex-row lg:items-end lg:justify-between ${ringFor("title")}`}>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#789052]">{copy.eyebrow}</p>
            <h1 className="mt-2 font-serif text-4xl font-semibold tracking-[-0.04em] md:text-5xl">{copy.title}</h1>
            <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-[#4d5d55]">{copy.subtitle}</p>
          </div>
          <div className="rounded-2xl border border-[#d8d0c0] bg-white/85 px-5 py-4 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#789052]">Current status</p>
            <p className="mt-1 text-lg font-black text-[#102b3a]">{statusLabels[displayPortal]}</p>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-[310px_minmax(0,1fr)_320px]">
          <aside className="space-y-5">
            <section className={`rounded-[1.7rem] border border-[#d8d0c0] bg-white/90 p-5 shadow-sm transition ${ringFor("context")}`}>
              <h2 className="text-sm font-black uppercase tracking-[0.18em] text-[#173b2d]">{copy.contextTitle}</h2>
              <div className="mt-4 space-y-3">
                {copy.contextItems.map((item) => (
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
              <p className="mt-3 text-sm font-semibold leading-6 text-[#edf5e6]">{copy.nextStep}</p>
            </section>
          </aside>

          <section className="space-y-5">
            <section className={`rounded-[1.8rem] border border-[#d8d0c0] bg-white/95 p-6 shadow-sm transition ${ringFor("summary")}`}>
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eaf2ed] text-lg font-black text-[#173b2d]">{subjectName.split(" ").map((part) => part[0]).slice(0, 2).join("")}</span>
                    <div>
                      <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-[#102b3a]">{subjectName}</h2>
                      <p className="mt-1 text-sm font-bold text-[#4d5d55]">{subjectMeta}</p>
                    </div>
                  </div>
                  <p className="mt-5 max-w-3xl text-sm font-semibold leading-7 text-[#4d5d55]">{subjectDetail}</p>
                </div>
                <div className="rounded-2xl border border-[#d7cdeb] bg-[#f4effc] p-5 lg:w-80">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#5b4a83]">What should happen next?</p>
                  <p className="mt-2 text-sm font-bold leading-6 text-[#102b3a]">{copy.nextStep}</p>
                </div>
              </div>
            </section>

            <div className={`grid gap-4 transition lg:grid-cols-3 ${ringFor("details")}`}>
              {copy.infoCards.map((card) => (
                <article key={card.title} className="rounded-[1.5rem] border border-[#d8d0c0] bg-white/95 p-5 shadow-sm">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#173b2d]">{card.title}</p>
                  <p className="mt-3 text-sm font-semibold leading-6 text-[#4d5d55]">{card.body}</p>
                  <span className="mt-4 inline-flex rounded-full border border-[#bdd7ca] bg-[#eef6f0] px-3 py-1 text-xs font-black text-[#315f44]">{card.footer}</span>
                </article>
              ))}
            </div>

            <section className={`rounded-[1.8rem] border border-[#d8d0c0] bg-white/95 p-6 shadow-sm transition ${ringFor("timeline")}`}>
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h2 className="text-sm font-black uppercase tracking-[0.18em] text-[#173b2d]">Shared Care Timeline</h2>
                  <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-[#4d5d55]">One care story, filtered by this portal. Facility sees internal workflow, partners see approved shared events, and requesters see requester-safe updates.</p>
                </div>
                <p className="text-xs font-bold text-[#789052]">Newest first · {visibleTimeline.length} visible</p>
              </div>

              <div className="mt-6 space-y-4">
                {visibleTimeline.map((event) => (
                  <article key={event.id} className="grid gap-4 rounded-2xl border border-[#e2dfd9] bg-white p-4 shadow-[0_10px_30px_rgba(30,41,59,0.05)] md:grid-cols-[92px_1fr]">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.14em] text-[#65717a]">{event.date}</p>
                      <p className="mt-1 text-xs font-bold text-[#789052]">{event.time}</p>
                    </div>
                    <div className="border-l-2 border-[#d8d6d1] pl-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${badgeClasses(event.tone)}`}>{event.badge}</span>
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
            <section className={`rounded-[1.7rem] border border-[#d8d0c0] bg-white/95 p-5 shadow-sm transition ${ringFor("actions")}`}>
              <h2 className="text-sm font-black uppercase tracking-[0.18em] text-[#173b2d]">{copy.actionsTitle}</h2>
              <p className="mt-2 text-xs font-semibold leading-5 text-[#4d5d55]">Every action opens a structured form. No requester or partner open-ended prayer/request text.</p>
              <div className="mt-4 space-y-2">
                {copy.actions.map((action, index) => (
                  <button
                    key={action.id}
                    type="button"
                    onClick={() => setActiveAction(action)}
                    className={`w-full rounded-2xl border px-4 py-4 text-left transition ${index === 0 ? "border-[#173b2d] bg-[#173b2d] text-white shadow-md hover:bg-[#102b3a]" : "border-[#d8d0c0] bg-white text-[#102b3a] hover:border-[#86a45f] hover:bg-[#f8fbf8]"}`}
                  >
                    <span className="block text-sm font-black">{action.label}</span>
                    <span className={`mt-1 block text-xs font-semibold ${index === 0 ? "text-[#edf5e6]" : "text-[#4d5d55]"}`}>{action.detail}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className={`rounded-[1.7rem] border border-[#ddb66c]/45 bg-[#fff8e7] p-5 shadow-sm transition ${ringFor("visibility")}`}>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#7a5b20]">Access & Visibility</p>
              <p className="mt-2 text-sm font-bold leading-6 text-[#5f4b1f]">{copy.visibilitySummary}</p>
            </section>
          </aside>
        </div>
      </section>

      {activeAction ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#0d2b3b]/60 p-4 backdrop-blur-sm">
          <form onSubmit={handleActionSubmit} className="max-h-[92vh] w-full max-w-2xl overflow-auto rounded-[2rem] border border-[#d8d0c0] bg-[#fbf8f0] p-6 text-[#102b3a] shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#789052]">{portalNames[displayPortal]}</p>
                <h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.04em]">{activeAction.label}</h2>
                <p className="mt-2 text-sm font-semibold leading-6 text-[#4d5d55]">{activeAction.detail}</p>
              </div>
              <button type="button" onClick={() => setActiveAction(null)} className="rounded-full border border-[#d8d0c0] bg-white px-4 py-2 text-sm font-black text-[#4d5d55] hover:border-[#86a45f]">
                Close
              </button>
            </div>

            <div className="mt-6 grid gap-4">
              {activeAction.fields.map((field) => renderField(field))}
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs font-bold leading-5 text-[#5f4b1f]">Submitting this form records a structured demo event inside this portal flow.</p>
              <button type="submit" className="rounded-xl bg-[#173b2d] px-6 py-3 text-sm font-black text-white shadow-lg hover:bg-[#102b3a]">
                {activeAction.submitLabel}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </main>
  );
}
