"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

type PortalKind = "requester" | "facility" | "partner";
type FieldType = "select" | "date" | "checkbox";
type TimelineTone = "teal" | "gold" | "blue" | "green" | "clay" | "stone";
type DemoHighlight = "title" | "context" | "summary" | "details" | "timeline" | "actions" | "visibility" | "demo" | null;
type FormValue = string | boolean;

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

type DemoStep = {
  id: string;
  portal: PortalKind;
  label: string;
  narration: string;
  highlight: DemoHighlight;
  actionId?: string;
  activeField?: string;
  values?: Record<string, FormValue>;
  status?: Partial<Record<PortalKind, string>>;
  subjectDetail?: string;
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

const demoTimelineEvents: { step: number; event: TimelineEvent }[] = [
  {
    step: 6,
    event: {
      id: "demo-request-submitted",
      date: "Today",
      time: "Step 6",
      title: "Care request submitted",
      detail: "Sarah submitted a structured request: Person Jane Doe · Relationship Daughter · Request Family Encouragement & Prayer Support · Contact Text messages.",
      actor: "Sarah K. (Daughter)",
      badge: "Submitted",
      tone: "green",
      requesterVisible: true,
      partnerVisible: false
    }
  },
  {
    step: 8,
    event: {
      id: "demo-facility-reviewed",
      date: "Today",
      time: "Step 8",
      title: "Request reviewed by facility",
      detail: "Morning Pointe reviewed the request and confirmed it is eligible for spiritual-care workflow.",
      actor: "Morning Pointe Franklin",
      badge: "Reviewed",
      tone: "blue",
      requesterVisible: true,
      partnerVisible: false
    }
  },
  {
    step: 10,
    event: {
      id: "demo-consent-confirmed",
      date: "Today",
      time: "Step 10",
      title: "Consent confirmed by facility",
      detail: "Consent source: POA / family contact · Approved visibility: Requester + approved partner · Consent reviewed before sharing.",
      actor: "Morning Pointe Franklin",
      badge: "Consent",
      tone: "green",
      requesterVisible: true,
      partnerVisible: true
    }
  },
  {
    step: 12,
    event: {
      id: "demo-shared-partner",
      date: "Today",
      time: "Step 12",
      title: "Request shared with partner",
      detail: "Morning Pointe shared a limited spiritual-care summary with Morning Pointe Church.",
      actor: "Morning Pointe Franklin",
      badge: "Shared",
      tone: "teal",
      requesterVisible: true,
      partnerVisible: true
    }
  },
  {
    step: 14,
    event: {
      id: "demo-assignment-accepted",
      date: "Today",
      time: "Step 14",
      title: "Assignment accepted",
      detail: "Morning Pointe Church accepted the assignment scope: Visit and prayer support.",
      actor: "Morning Pointe Church",
      badge: "Accepted",
      tone: "green",
      requesterVisible: false,
      partnerVisible: true
    }
  },
  {
    step: 16,
    event: {
      id: "demo-prayer-focus",
      date: "Today",
      time: "Step 16",
      title: "Prayer focus selected",
      detail: "Prayer focus: Comfort and Peace · Care approach: Brief visit. No custom prayer text was typed or sent.",
      actor: "Morning Pointe Church",
      badge: "Prayer Focus",
      tone: "teal",
      requesterVisible: false,
      partnerVisible: true
    }
  },
  {
    step: 18,
    event: {
      id: "demo-outcome-logged",
      date: "Today",
      time: "Step 18",
      title: "Partner care outcome logged",
      detail: "Care outcome: Prayer support offered · Next step: No further action today · Shared with facility.",
      actor: "Morning Pointe Church",
      badge: "Outcome",
      tone: "green",
      requesterVisible: true,
      partnerVisible: true
    }
  }
];

const initialTimeline: TimelineEvent[] = [
  {
    id: "request-started",
    date: "Today",
    time: "Ready",
    title: "Demo ready",
    detail: "Start the guided demo. Use Next to move one step at a time through requester, facility, and partner workflow.",
    actor: "ChurchWork",
    badge: "Ready",
    tone: "stone",
    requesterVisible: true,
    partnerVisible: true
  }
];

const demoSteps: DemoStep[] = [
  {
    id: "intro",
    portal: "requester",
    label: "Step 1 of 20 · Start with the requester",
    narration: "We start in the requester portal. This is not an open chat box. Sarah will submit a care request using controlled choices only.",
    highlight: "title",
    subjectDetail: "Sarah uses preselected choices only. No open text request is needed to start a spiritual-care workflow.",
    status: { requester: "Ready to Submit", facility: "Awaiting Review", partner: "Waiting for Assignment" }
  },
  {
    id: "requester-person",
    portal: "requester",
    label: "Step 2 of 20 · Select the person",
    narration: "The request form opens. The first field is who this is for. Sarah selects Jane Doe from the approved list.",
    highlight: "actions",
    actionId: "requester-submit-care-request",
    activeField: "person",
    values: { person: "Jane Doe" }
  },
  {
    id: "requester-relationship",
    portal: "requester",
    label: "Step 3 of 20 · Choose relationship",
    narration: "Next, Sarah chooses her relationship. This is a fixed dropdown. She selects Daughter.",
    highlight: "actions",
    actionId: "requester-submit-care-request",
    activeField: "relationship",
    values: { person: "Jane Doe", relationship: "Daughter" }
  },
  {
    id: "requester-type",
    portal: "requester",
    label: "Step 4 of 20 · Choose request type",
    narration: "Now she chooses the request type. She selects Family Encouragement and Prayer Support.",
    highlight: "actions",
    actionId: "requester-submit-care-request",
    activeField: "requestType",
    values: { person: "Jane Doe", relationship: "Daughter", requestType: "Family Encouragement & Prayer Support" }
  },
  {
    id: "requester-focus",
    portal: "requester",
    label: "Step 5 of 20 · Choose support focus",
    narration: "The support focus is also structured. Sarah selects Prayer support and text messages for updates.",
    highlight: "actions",
    actionId: "requester-submit-care-request",
    activeField: "supportFocus",
    values: { person: "Jane Doe", relationship: "Daughter", requestType: "Family Encouragement & Prayer Support", supportFocus: "Prayer support", contactPreference: "Text messages" }
  },
  {
    id: "requester-ack",
    portal: "requester",
    label: "Step 6 of 20 · Confirm safe boundary",
    narration: "Before submitting, Sarah confirms this is spiritual-care coordination only and does not include medical details.",
    highlight: "actions",
    actionId: "requester-submit-care-request",
    activeField: "acknowledgeNoMedical",
    values: { person: "Jane Doe", relationship: "Daughter", requestType: "Family Encouragement & Prayer Support", supportFocus: "Prayer support", contactPreference: "Text messages", acknowledgeNoMedical: true }
  },
  {
    id: "requester-submitted",
    portal: "requester",
    label: "Step 7 of 20 · Request enters timeline",
    narration: "The request is submitted and appears on the requester timeline. It is not shared with a partner yet.",
    highlight: "timeline",
    status: { requester: "Submitted" }
  },
  {
    id: "facility-open",
    portal: "facility",
    label: "Step 8 of 20 · Facility receives request",
    narration: "Now the facility portal receives Jane Doe's request in the queue for review.",
    highlight: "context",
    subjectDetail: portalCopy.facility.primaryCardDetail,
    status: { facility: "Awaiting Review" }
  },
  {
    id: "facility-review",
    portal: "facility",
    label: "Step 9 of 20 · Facility reviews request",
    narration: "The facility reviews the request and confirms it is eligible for spiritual-care workflow.",
    highlight: "actions",
    actionId: "facility-review-request",
    activeField: "facilityDisposition",
    values: { requestType: "Family Encouragement & Prayer Support", facilityDisposition: "Eligible for spiritual-care workflow" }
  },
  {
    id: "facility-review-timeline",
    portal: "facility",
    label: "Step 10 of 20 · Review is recorded",
    narration: "The facility review is now recorded on the shared timeline.",
    highlight: "timeline",
    status: { facility: "Facility Reviewed" }
  },
  {
    id: "facility-consent",
    portal: "facility",
    label: "Step 11 of 20 · Confirm consent",
    narration: "Next, the facility confirms consent and chooses the visibility level: requester plus approved partner.",
    highlight: "actions",
    actionId: "facility-confirm-consent",
    activeField: "visibility",
    values: { consentSource: "POA / family contact", visibility: "Requester + approved partner", confirmed: true }
  },
  {
    id: "facility-consent-timeline",
    portal: "facility",
    label: "Step 12 of 20 · Consent is recorded",
    narration: "Consent is now documented before anything is shared outside the facility workflow.",
    highlight: "timeline",
    status: { facility: "Consent Confirmed" }
  },
  {
    id: "facility-share",
    portal: "facility",
    label: "Step 13 of 20 · Share approved context",
    narration: "The facility shares only a limited spiritual-care summary with Morning Pointe Church. No medical details are shared.",
    highlight: "actions",
    actionId: "facility-share-partner",
    activeField: "sharingLevel",
    values: { partner: "Morning Pointe Church", sharingLevel: "Limited spiritual-care summary", approved: true }
  },
  {
    id: "partner-open",
    portal: "partner",
    label: "Step 14 of 20 · Partner receives assignment",
    narration: "Now the partner portal receives the approved assignment. The partner sees only the approved care need.",
    highlight: "context",
    subjectDetail: portalCopy.partner.primaryCardDetail,
    status: { partner: "New Assignment", facility: "Shared With Partner" }
  },
  {
    id: "partner-accept",
    portal: "partner",
    label: "Step 15 of 20 · Accept assignment",
    narration: "The partner accepts responsibility for the approved care action.",
    highlight: "actions",
    actionId: "partner-accept-assignment",
    activeField: "assignmentScope",
    values: { assignmentScope: "Visit and prayer support", accepted: true }
  },
  {
    id: "partner-accepted-timeline",
    portal: "partner",
    label: "Step 16 of 20 · Assignment is recorded",
    narration: "The accepted assignment is recorded for the partner and facility. The requester does not need to see every internal partner step.",
    highlight: "timeline",
    status: { partner: "Assignment Accepted" }
  },
  {
    id: "partner-prayer-focus",
    portal: "partner",
    label: "Step 17 of 20 · Select prayer focus",
    narration: "The partner does not type and send a custom prayer. The partner selects an approved prayer focus: Comfort and Peace.",
    highlight: "actions",
    actionId: "partner-select-prayer-focus",
    activeField: "prayerFocus",
    values: { prayerFocus: "Comfort and Peace", careApproach: "Brief visit" }
  },
  {
    id: "partner-outcome",
    portal: "partner",
    label: "Step 18 of 20 · Log structured outcome",
    narration: "After the care action, the partner logs a structured outcome: prayer support offered and no further action today.",
    highlight: "actions",
    actionId: "partner-log-outcome",
    activeField: "outcome",
    values: { outcome: "Prayer support offered", nextStep: "No further action today", shareWithFacility: true }
  },
  {
    id: "partner-outcome-recorded",
    portal: "partner",
    label: "Step 19 of 20 · Outcome reaches timeline",
    narration: "The partner outcome is recorded on the timeline and shared back to the facility.",
    highlight: "timeline",
    status: { partner: "Outcome Logged" }
  },
  {
    id: "requester-final",
    portal: "requester",
    label: "Step 20 of 20 · Requester sees approved update",
    narration: "Back in the requester portal, Sarah sees only approved status updates. Internal notes and partner-only workflow remain hidden.",
    highlight: "timeline",
    status: { requester: "Care Outcome Logged" },
    subjectDetail: "Sarah now sees the approved care outcome and next step without seeing facility-only notes or partner-only workflow details."
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

function defaultValuesForAction(action: PortalAction) {
  return action.fields.reduce<Record<string, FormValue>>((values, field) => {
    values[field.name] = field.type === "checkbox" ? false : field.defaultValue ?? field.options?.[0] ?? "";
    return values;
  }, {});
}

function buildEventDetail(action: PortalAction, values: Record<string, FormValue>) {
  const details = action.fields
    .filter((field) => field.type !== "checkbox")
    .map((field) => `${field.label}: ${String(values[field.name] ?? field.defaultValue ?? "")}`)
    .filter((line) => !line.endsWith(": "));

  if (!details.length) return action.eventDetail;
  return `${action.eventDetail} ${details.join(" · ")}.`;
}

function chooseFriendlyEnglishVoice() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return undefined;

  const voices = window.speechSynthesis.getVoices();
  const englishVoices = voices.filter((voice) => voice.lang.toLowerCase().startsWith("en"));
  return (
    englishVoices.find((voice) => /samantha|ava|jenny|aria|emma|natural|female|warm/i.test(`${voice.name} ${voice.voiceURI}`)) ??
    englishVoices.find((voice) => voice.lang.toLowerCase().startsWith("en-us")) ??
    englishVoices[0]
  );
}

function speakStep(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) return;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.94;
  utterance.pitch = 1.02;
  utterance.volume = 0.86;
  const voice = chooseFriendlyEnglishVoice();
  if (voice) utterance.voice = voice;
  window.speechSynthesis.speak(utterance);
}

function actionFor(portal: PortalKind, actionId?: string) {
  if (!actionId) return null;
  return portalCopy[portal].actions.find((action) => action.id === actionId) ?? null;
}

function renderField(
  field: ActionField,
  value: FormValue,
  onChange: (name: string, value: FormValue) => void,
  isActive: boolean
) {
  const activeClasses = isActive ? "border-[#8f7bb8] bg-[#f4effc] ring-4 ring-[#cbbbea]" : "border-[#d8d0c0] bg-white";

  if (field.type === "checkbox") {
    return (
      <label key={field.name} data-demo-field={field.name} className={`flex gap-3 rounded-2xl border p-4 text-sm font-bold leading-6 text-[#5f4b1f] transition ${activeClasses}`}>
        <input name={field.name} type="checkbox" checked={Boolean(value)} onChange={(event) => onChange(field.name, event.target.checked)} required={field.required} className="mt-1 h-5 w-5" />
        <span>{field.label}</span>
      </label>
    );
  }

  return (
    <label key={field.name} data-demo-field={field.name} className={`block rounded-2xl border p-4 text-sm font-bold text-[#173b2d] transition ${activeClasses}`}>
      {field.label}
      {field.type === "date" ? (
        <input name={field.name} type="date" required={field.required} value={String(value ?? field.defaultValue ?? "")} onChange={(event) => onChange(field.name, event.target.value)} className="mt-2 w-full rounded-xl border border-[#d8d0c0] bg-white px-4 py-3 text-sm text-[#102b3a] outline-none ring-[#86a45f]/25 focus:border-[#86a45f] focus:ring-4" />
      ) : (
        <select name={field.name} required={field.required} value={String(value ?? field.defaultValue ?? "")} onChange={(event) => onChange(field.name, event.target.value)} className="mt-2 w-full rounded-xl border border-[#d8d0c0] bg-white px-4 py-3 text-sm text-[#102b3a] outline-none ring-[#86a45f]/25 focus:border-[#86a45f] focus:ring-4">
          {(field.options ?? []).map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      )}
    </label>
  );
}

export function ChurchWorkPortalDashboard({ portal }: ChurchWorkPortalDashboardProps) {
  const [manualTimeline, setManualTimeline] = useState<TimelineEvent[]>([]);
  const [displayPortal, setDisplayPortal] = useState<PortalKind>(portal);
  const [statusLabels, setStatusLabels] = useState<Record<PortalKind, string>>({ requester: portalCopy.requester.statusLabel, facility: portalCopy.facility.statusLabel, partner: portalCopy.partner.statusLabel });
  const [subjectName, setSubjectName] = useState("Jane Doe");
  const [subjectMeta, setSubjectMeta] = useState("Room 104B · Family Encouragement & Prayer Support");
  const [subjectDetail, setSubjectDetail] = useState(portalCopy[portal].primaryCardDetail);
  const [activeAction, setActiveAction] = useState<PortalAction | null>(null);
  const [fieldValues, setFieldValues] = useState<Record<string, FormValue>>({});
  const [demoIndex, setDemoIndex] = useState<number | null>(null);
  const [demoRunning, setDemoRunning] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [activeFieldName, setActiveFieldName] = useState<string | null>(null);

  const step = demoIndex === null ? null : demoSteps[demoIndex];
  const copy = portalCopy[displayPortal];
  const demoTimeline = demoIndex === null ? [] : demoTimelineEvents.filter((item) => item.step <= demoIndex).map((item) => item.event);
  const visibleTimeline = useMemo(() => [...manualTimeline, ...demoTimeline, ...initialTimeline].filter((event) => visibleForPortal(event, displayPortal)), [manualTimeline, demoTimeline, displayPortal]);

  function ringFor(target: DemoHighlight) {
    return step?.highlight === target ? "ring-4 ring-[#cbbbea] ring-offset-4 ring-offset-[#f7f3ea]" : "";
  }

  function applyDemoStep(index: number, shouldSpeak = true) {
    const nextStep = demoSteps[index];
    const nextAction = actionFor(nextStep.portal, nextStep.actionId);
    const baseStatus = { requester: portalCopy.requester.statusLabel, facility: portalCopy.facility.statusLabel, partner: portalCopy.partner.statusLabel };
    const statusFromSteps = demoSteps.slice(0, index + 1).reduce<Partial<Record<PortalKind, string>>>((statuses, item) => ({ ...statuses, ...item.status }), {});

    setDisplayPortal(nextStep.portal);
    setDemoIndex(index);
    setStatusLabels({ ...baseStatus, ...statusFromSteps });
    setSubjectName("Jane Doe");
    setSubjectMeta(nextStep.portal === "partner" ? portalCopy.partner.primaryCardMeta : nextStep.portal === "facility" ? portalCopy.facility.primaryCardMeta : "Room 104B · Family Encouragement & Prayer Support");
    setSubjectDetail(nextStep.subjectDetail ?? portalCopy[nextStep.portal].primaryCardDetail);
    setActiveFieldName(nextStep.activeField ?? null);

    if (nextAction) {
      setActiveAction(nextAction);
      setFieldValues({ ...defaultValuesForAction(nextAction), ...(nextStep.values ?? {}) });
    } else {
      setActiveAction(null);
      setFieldValues({});
    }

    if (shouldSpeak && voiceEnabled) speakStep(nextStep.narration);
  }

  function startGuidedDemo() {
    setDemoRunning(true);
    setManualTimeline([]);
    applyDemoStep(0);
  }

  function stopGuidedDemo() {
    window.speechSynthesis?.cancel();
    setDemoRunning(false);
    setDemoIndex(null);
    setActiveAction(null);
    setActiveFieldName(null);
  }

  function moveDemo(delta: number) {
    if (demoIndex === null) return;
    const nextIndex = Math.max(0, Math.min(demoSteps.length - 1, demoIndex + delta));
    applyDemoStep(nextIndex);
  }

  function replayVoice() {
    if (step && voiceEnabled) speakStep(step.narration);
  }

  function openManualAction(action: PortalAction) {
    setDemoRunning(false);
    setDemoIndex(null);
    setActiveFieldName(null);
    setActiveAction(action);
    setFieldValues(defaultValuesForAction(action));
  }

  function handleActionSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!activeAction) return;

    const newEvent: TimelineEvent = {
      id: `${displayPortal}-${activeAction.id}-${Date.now()}`,
      date: "Today",
      time: "Now",
      title: activeAction.eventTitle,
      detail: buildEventDetail(activeAction, fieldValues),
      actor: copy.accountName,
      badge: activeAction.label,
      tone: activeAction.tone,
      requesterVisible: activeAction.requesterVisible,
      partnerVisible: activeAction.partnerVisible
    };

    setManualTimeline((items) => [newEvent, ...items]);
    setStatusLabels((labels) => ({ ...labels, [displayPortal]: activeAction.statusAfter }));

    if (activeAction.id === "requester-submit-care-request") {
      const person = String(fieldValues.person ?? "Jane Doe");
      const requestType = String(fieldValues.requestType ?? "Family Encouragement & Prayer Support");
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
            Structured choices · role-safe timeline · step-by-step demo
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm">
            <button type="button" onClick={startGuidedDemo} className="rounded-full bg-[#cbbbea] px-4 py-2 text-xs font-black text-[#16243a] shadow-sm hover:bg-[#d8cff1]">
              Start Guided Demo
            </button>
            <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-2 text-right">
              <p className="font-black">{copy.accountName}</p>
              <p className="text-xs font-semibold text-[#d4dedc]">{copy.accountRole}</p>
            </div>
          </div>
        </div>
      </header>

      {demoRunning && step ? (
        <section className={`mx-auto mt-5 max-w-[92rem] px-5 ${ringFor("demo")}`} aria-live="polite">
          <div className="rounded-[1.5rem] border border-[#cbbbea] bg-[#f4effc] p-5 shadow-lg shadow-[#5b4a83]/10">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#5b4a83]">{step.label}</p>
                <p className="mt-2 max-w-4xl text-base font-black leading-7 text-[#16243a]">{step.narration}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button type="button" onClick={() => setVoiceEnabled((value) => !value)} className="rounded-full border border-[#cbbbea] bg-white px-4 py-2 text-xs font-black text-[#5b4a83]">
                  Voice {voiceEnabled ? "On" : "Off"}
                </button>
                <button type="button" onClick={replayVoice} className="rounded-full border border-[#cbbbea] bg-white px-4 py-2 text-xs font-black text-[#5b4a83]">
                  Replay Voice
                </button>
                <button type="button" onClick={() => moveDemo(-1)} disabled={demoIndex === 0} className="rounded-full border border-[#cbbbea] bg-white px-4 py-2 text-xs font-black text-[#5b4a83] disabled:cursor-not-allowed disabled:opacity-50">
                  Back
                </button>
                <button type="button" onClick={() => moveDemo(1)} disabled={demoIndex === demoSteps.length - 1} className="rounded-full bg-[#173b2d] px-4 py-2 text-xs font-black text-white disabled:cursor-not-allowed disabled:opacity-50">
                  Next
                </button>
                <button type="button" onClick={stopGuidedDemo} className="rounded-full border border-[#d8d0c0] bg-white px-4 py-2 text-xs font-black text-[#5f4b1f]">
                  End
                </button>
              </div>
            </div>
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
                    onClick={() => openManualAction(action)}
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
              {activeAction.fields.map((field) => renderField(field, fieldValues[field.name], (name, value) => setFieldValues((values) => ({ ...values, [name]: value })), activeFieldName === field.name))}
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
