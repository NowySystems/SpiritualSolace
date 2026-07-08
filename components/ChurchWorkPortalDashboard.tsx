"use client";

import Link from "next/link";
import { FormEvent, useCallback, useMemo, useState } from "react";
import { driver, type DriveStep } from "driver.js";
import "driver.js/dist/driver.css";

type PortalKind = "requester" | "facility" | "partner";
type FieldType = "text" | "textarea" | "select" | "date" | "checkbox";

type TimelineTone = "teal" | "gold" | "blue" | "green" | "clay" | "stone";

type TimelineEvent = {
  id: string;
  date: string;
  time: string;
  type: string;
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
  actions: PortalAction[];
  visibilitySummary: string;
};

type ChurchWorkPortalDashboardProps = {
  portal: PortalKind;
};

const portalNames: Record<PortalKind, string> = {
  requester: "Requester Portal",
  facility: "Facility Portal",
  partner: "Partner Portal"
};

const portalCopy: Record<PortalKind, PortalCopy> = {
  requester: {
    eyebrow: "Requester access",
    title: "My Care Request Workspace",
    subtitle: "Submit a care request, see the next step, and follow approved updates.",
    accountName: "Sarah K. (Daughter)",
    accountRole: "Requester",
    primaryCardTitle: "Jane Doe",
    primaryCardMeta: "Room 104B · Age 78 · Protestant",
    primaryCardDetail: "Family encouragement and prayer support request. Updates shown here are requester-safe and approved for family visibility.",
    statusLabel: "In Review",
    nextStep: "The facility care team is reviewing consent and scheduling the next care touch.",
    contextTitle: "Request Snapshot",
    contextItems: [
      { label: "Submitted", detail: "Jun 20, 2025 · 9:42 AM" },
      { label: "Requested by", detail: "Sarah K. (Daughter)" },
      { label: "Best contact", detail: "Text messages" },
      { label: "Consent", detail: "Confirmed", badge: "Private" }
    ],
    infoCards: [
      { title: "Current Support", body: "Prayer support, encouragement, and short visits to help Mom feel connected.", footer: "Family Encouragement" },
      { title: "Approved Care Team", body: "Elena Morris is coordinating the facility review. Michael Torres is approved for pastoral care once scheduled.", footer: "Care Team" },
      { title: "Consent & Privacy", body: "Only approved request updates are visible here. Facility notes and partner-only notes stay hidden.", footer: "Consent Confirmed" }
    ],
    actionsTitle: "Requester Actions",
    visibilitySummary: "Requester view shows approved status updates, consent summary, next steps, and family-safe timeline entries only.",
    actions: [
      {
        id: "requester-submit-care-request",
        label: "Submit Care Request",
        detail: "Create or update the active request",
        eventTitle: "Care request submitted",
        eventDetail: "Requester submitted a structured spiritual-care request.",
        submitLabel: "Submit request",
        statusAfter: "Submitted",
        tone: "green",
        requesterVisible: true,
        partnerVisible: false,
        fields: [
          { name: "residentName", label: "Resident or person name", type: "text", defaultValue: "Jane Doe", required: true },
          { name: "requesterName", label: "Your name", type: "text", defaultValue: "Sarah K.", required: true },
          { name: "relationship", label: "Relationship", type: "select", options: ["Daughter", "Son", "Spouse", "Friend", "Resident", "Facility staff"], defaultValue: "Daughter", required: true },
          { name: "requestType", label: "Request type", type: "select", options: ["Family Encouragement & Prayer Support", "Pastoral Visit", "Prayer Support", "Church Connection", "Facility Follow-up"], defaultValue: "Family Encouragement & Prayer Support", required: true },
          { name: "contactPreference", label: "Contact preference", type: "select", options: ["Text messages", "Phone call", "Email"], defaultValue: "Text messages", required: true },
          { name: "acknowledgeNoMedical", label: "I understand this request is for spiritual-care coordination only and does not include medical details.", type: "checkbox", required: true }
        ]
      },
      {
        id: "requester-send-message",
        label: "Send Message",
        detail: "Message the care team securely",
        eventTitle: "Requester message sent",
        eventDetail: "Requester sent a message to the care team.",
        submitLabel: "Send message",
        statusAfter: "Message Sent",
        tone: "blue",
        requesterVisible: true,
        partnerVisible: false,
        fields: [
          { name: "message", label: "Message to care team", type: "textarea", defaultValue: "Could you let me know when the next visit is confirmed?", required: true }
        ]
      },
      {
        id: "requester-follow-up",
        label: "Request Follow-up",
        detail: "Ask for an update or next touch",
        eventTitle: "Follow-up requested",
        eventDetail: "Requester asked for a follow-up after the next care team review.",
        submitLabel: "Request follow-up",
        statusAfter: "Follow-up Requested",
        tone: "gold",
        requesterVisible: true,
        partnerVisible: false,
        fields: [
          { name: "followUpReason", label: "Follow-up reason", type: "select", options: ["Visit timing", "Consent question", "Care team update", "Contact preference"], defaultValue: "Visit timing", required: true },
          { name: "note", label: "Brief note", type: "textarea", defaultValue: "Please send an update when the visit time is set.", required: true }
        ]
      },
      {
        id: "requester-contact-preference",
        label: "Update Contact Preference",
        detail: "Choose how updates should arrive",
        eventTitle: "Contact preference updated",
        eventDetail: "Requester updated how care updates should be delivered.",
        submitLabel: "Save preference",
        statusAfter: "Preference Updated",
        tone: "teal",
        requesterVisible: true,
        partnerVisible: false,
        fields: [
          { name: "contactPreference", label: "Preferred update method", type: "select", options: ["Text messages", "Phone call", "Email"], defaultValue: "Text messages", required: true }
        ]
      },
      {
        id: "requester-review-consent",
        label: "Review Consent",
        detail: "Confirm the privacy summary was reviewed",
        eventTitle: "Consent summary reviewed",
        eventDetail: "Requester reviewed the current consent and privacy settings.",
        submitLabel: "Mark reviewed",
        statusAfter: "Consent Reviewed",
        tone: "green",
        requesterVisible: true,
        partnerVisible: false,
        fields: [
          { name: "consentReviewed", label: "I reviewed the consent and privacy summary for this request.", type: "checkbox", required: true }
        ]
      }
    ]
  },
  facility: {
    eyebrow: "Facility access",
    title: "Facility Care Workspace",
    subtitle: "Review requests, confirm consent, coordinate partners, and keep the shared timeline clean.",
    accountName: "Morning Pointe Franklin",
    accountRole: "Facility Team",
    primaryCardTitle: "Evelyn Allen",
    primaryCardMeta: "Room 214B · Assisted Living · Baptist",
    primaryCardDetail: "Senior care and companionship request. Facility staff controls consent, visibility, partner handoff, and internal notes.",
    statusLabel: "Action Needed",
    nextStep: "Confirm visit details and review consent before the partner receives any additional information.",
    contextTitle: "Facility Queue",
    contextItems: [
      { label: "Evelyn Allen", detail: "Room 214B · request #24-00058", badge: "Active" },
      { label: "Robert Johnson", detail: "Room 118A · consent pending", badge: "Review" },
      { label: "Margaret Davis", detail: "Room 302C · partner note due", badge: "Follow-up" },
      { label: "Thomas Brown", detail: "Room 105A · scheduled visit", badge: "Visit" }
    ],
    infoCards: [
      { title: "Consent & Visibility", body: "Family updates and partner sharing are approved. Internal facility notes remain facility-only.", footer: "Shared with Partners" },
      { title: "Partner Sharing", body: "Morning Pointe Church is approved to receive the limited spiritual-care summary and visit details.", footer: "Partner Approved" },
      { title: "Upcoming Visit", body: "Visit with care partner is scheduled for tomorrow at 11:00 AM in Room 214B.", footer: "Scheduled" }
    ],
    actionsTitle: "Facility Actions",
    visibilitySummary: "Facility view shows full facility workflow, consent status, internal notes, partner sharing, family updates, and the complete case timeline.",
    actions: [
      {
        id: "facility-review-request",
        label: "Review New Request",
        detail: "Accept the request into facility workflow",
        eventTitle: "Request reviewed by facility",
        eventDetail: "Facility reviewed the new spiritual-care request and opened the facility workflow.",
        submitLabel: "Complete review",
        statusAfter: "Facility Reviewed",
        tone: "blue",
        requesterVisible: true,
        partnerVisible: false,
        fields: [
          { name: "residentName", label: "Resident name", type: "text", defaultValue: "Evelyn Allen", required: true },
          { name: "room", label: "Room", type: "text", defaultValue: "214B", required: true },
          { name: "requestType", label: "Request type", type: "select", options: ["Prayer Support", "Senior Care & Companionship", "Pastoral Visit", "Family Encouragement"], defaultValue: "Senior Care & Companionship", required: true }
        ]
      },
      {
        id: "facility-confirm-consent",
        label: "Confirm Consent",
        detail: "Review resident/family sharing permissions",
        eventTitle: "Consent confirmed by facility",
        eventDetail: "Facility confirmed the request can be shared with approved partners.",
        submitLabel: "Confirm consent",
        statusAfter: "Consent Confirmed",
        tone: "green",
        requesterVisible: true,
        partnerVisible: true,
        fields: [
          { name: "visibilityLevel", label: "Visibility level", type: "select", options: ["Requester + approved partner", "Requester only", "Facility only"], defaultValue: "Requester + approved partner", required: true },
          { name: "consentSource", label: "Consent source", type: "select", options: ["Resident", "POA / family contact", "Facility reviewer"], defaultValue: "POA / family contact", required: true },
          { name: "confirmed", label: "Consent was reviewed and documented before sharing.", type: "checkbox", required: true }
        ]
      },
      {
        id: "facility-schedule-visit",
        label: "Schedule Visit",
        detail: "Set or update a care visit",
        eventTitle: "Visit scheduled",
        eventDetail: "Facility scheduled a care partner visit.",
        submitLabel: "Schedule visit",
        statusAfter: "Visit Scheduled",
        tone: "teal",
        requesterVisible: true,
        partnerVisible: true,
        fields: [
          { name: "visitDate", label: "Visit date", type: "date", defaultValue: "2026-07-15", required: true },
          { name: "visitWindow", label: "Visit window", type: "select", options: ["Morning", "Afternoon", "Evening"], defaultValue: "Morning", required: true },
          { name: "visitor", label: "Visitor or team", type: "text", defaultValue: "Morning Pointe Church care team", required: true },
          { name: "location", label: "Location", type: "text", defaultValue: "Room 214B", required: true }
        ]
      },
      {
        id: "facility-add-note",
        label: "Add Internal Note",
        detail: "Facility-only note",
        eventTitle: "Internal facility note added",
        eventDetail: "Facility added a private note for care coordination review.",
        submitLabel: "Save internal note",
        statusAfter: "Internal Note Added",
        tone: "gold",
        requesterVisible: false,
        partnerVisible: false,
        fields: [
          { name: "note", label: "Internal facility note", type: "textarea", defaultValue: "Resident prefers morning visits and short encouragement-focused conversations.", required: true }
        ]
      },
      {
        id: "facility-share-partner",
        label: "Share With Partner",
        detail: "Approve limited partner visibility",
        eventTitle: "Request shared with partner",
        eventDetail: "Facility shared the approved summary with the selected partner.",
        submitLabel: "Share approved summary",
        statusAfter: "Shared With Partner",
        tone: "blue",
        requesterVisible: true,
        partnerVisible: true,
        fields: [
          { name: "partner", label: "Approved partner", type: "select", options: ["Morning Pointe Church", "Grace Community Church", "First Assembly Care Team"], defaultValue: "Morning Pointe Church", required: true },
          { name: "sharingLevel", label: "Sharing level", type: "select", options: ["Limited spiritual-care summary", "Visit details only", "Prayer request only"], defaultValue: "Limited spiritual-care summary", required: true },
          { name: "approved", label: "I confirm this sharing level is approved for this partner.", type: "checkbox", required: true }
        ]
      },
      {
        id: "facility-family-update",
        label: "Send Family Update",
        detail: "Approved update to requester",
        eventTitle: "Family update sent",
        eventDetail: "Facility sent an approved status update to the requester.",
        submitLabel: "Send update",
        statusAfter: "Family Updated",
        tone: "teal",
        requesterVisible: true,
        partnerVisible: false,
        fields: [
          { name: "update", label: "Family-safe update", type: "textarea", defaultValue: "The request has been reviewed. A visit is being scheduled and we will share the confirmed time once available.", required: true }
        ]
      }
    ]
  },
  partner: {
    eyebrow: "Partner access",
    title: "Partner Care Workspace",
    subtitle: "See approved assignments, complete care actions, and report back to the facility.",
    accountName: "Grace Gardens Care",
    accountRole: "Partner Team",
    primaryCardTitle: "Jane Doe",
    primaryCardMeta: "Room 104B · Prayer Support · Family Encouragement",
    primaryCardDetail: "Approved partner summary only. Partner users see the care need, consent status, assignment, and partner-visible timeline updates.",
    statusLabel: "New Assignment",
    nextStep: "Accept the assignment, prepare for the visit, then send the facility a completed-visit update.",
    contextTitle: "My Assignments",
    contextItems: [
      { label: "Jane Doe", detail: "Assigned today · prayer support", badge: "New" },
      { label: "Elena Morris", detail: "Follow-up due · weekly visit", badge: "Follow-up" },
      { label: "Mary Johnson", detail: "Visit scheduled · scripture reading", badge: "Visit" },
      { label: "Robert Smith", detail: "In progress · quiet check-in", badge: "Active" }
    ],
    infoCards: [
      { title: "Approved Care Needs", body: "Prayer support, spiritual encouragement, and gentle family encouragement are approved for this assignment.", footer: "Approved Summary" },
      { title: "Facility Contact", body: "Sarah K. is the family contact. Facility coordinator remains the handoff point for all updates.", footer: "Contact Approved" },
      { title: "Sharing Rules", body: "No medical details, diagnoses, financial information, or unrelated resident details can be shared.", footer: "Human Reviewed" }
    ],
    actionsTitle: "Partner Actions",
    visibilitySummary: "Partner view shows approved assignments, approved request details, partner-visible timeline entries, and report-back actions only.",
    actions: [
      {
        id: "partner-accept-assignment",
        label: "Accept Assignment",
        detail: "Take responsibility for this care action",
        eventTitle: "Assignment accepted",
        eventDetail: "Partner accepted responsibility for the approved care assignment.",
        submitLabel: "Accept assignment",
        statusAfter: "Assignment Accepted",
        tone: "green",
        requesterVisible: false,
        partnerVisible: true,
        fields: [
          { name: "partnerLead", label: "Partner lead", type: "text", defaultValue: "Michael Torres", required: true },
          { name: "assignmentScope", label: "Assignment scope", type: "select", options: ["Prayer support", "Visit and prayer support", "Family encouragement", "Church connection"], defaultValue: "Visit and prayer support", required: true },
          { name: "accepted", label: "I accept this assignment for the partner team.", type: "checkbox", required: true }
        ]
      },
      {
        id: "partner-confirm-visit",
        label: "Confirm Visit",
        detail: "Schedule or confirm visit timing",
        eventTitle: "Partner visit confirmed",
        eventDetail: "Partner confirmed the planned visit time with the facility.",
        submitLabel: "Confirm visit",
        statusAfter: "Visit Confirmed",
        tone: "teal",
        requesterVisible: true,
        partnerVisible: true,
        fields: [
          { name: "visitDate", label: "Visit date", type: "date", defaultValue: "2026-07-15", required: true },
          { name: "visitWindow", label: "Visit window", type: "select", options: ["Morning", "Afternoon", "Evening"], defaultValue: "Morning", required: true },
          { name: "visitor", label: "Visitor", type: "text", defaultValue: "Michael Torres", required: true }
        ]
      },
      {
        id: "partner-send-update",
        label: "Send Update to Facility",
        detail: "Report back after action",
        eventTitle: "Partner update sent",
        eventDetail: "Partner shared a care update back to the facility.",
        submitLabel: "Send update",
        statusAfter: "Update Sent",
        tone: "blue",
        requesterVisible: false,
        partnerVisible: true,
        fields: [
          { name: "update", label: "Facility update", type: "textarea", defaultValue: "Visit is confirmed. Partner team will report back after the visit is complete.", required: true }
        ]
      },
      {
        id: "partner-log-visit",
        label: "Log Completed Visit",
        detail: "Record completed partner care",
        eventTitle: "Partner visit completed",
        eventDetail: "Partner logged the completed spiritual-care visit.",
        submitLabel: "Log visit",
        statusAfter: "Visit Completed",
        tone: "green",
        requesterVisible: true,
        partnerVisible: true,
        fields: [
          { name: "visitSummary", label: "Visit summary", type: "textarea", defaultValue: "Short encouragement visit completed. Prayer support offered. No medical details were discussed or recorded.", required: true },
          { name: "shareWithFacility", label: "Share this completed-visit update with the facility.", type: "checkbox", required: true }
        ]
      },
      {
        id: "partner-clarification",
        label: "Request Clarification",
        detail: "Ask facility a question",
        eventTitle: "Clarification requested",
        eventDetail: "Partner asked the facility for clarification before taking the next step.",
        submitLabel: "Request clarification",
        statusAfter: "Clarification Requested",
        tone: "gold",
        requesterVisible: false,
        partnerVisible: true,
        fields: [
          { name: "question", label: "Question for facility", type: "textarea", defaultValue: "Please confirm whether a morning visit is still preferred for this resident.", required: true }
        ]
      }
    ]
  }
};

const initialTimeline: TimelineEvent[] = [
  {
    id: "visit-completed",
    date: "Jun 21",
    time: "10:15 AM",
    type: "VISIT",
    title: "Pastoral visit completed",
    detail: "The approved care partner completed a short encouragement and prayer visit.",
    actor: "Michael Torres",
    badge: "Completed",
    tone: "green",
    requesterVisible: true,
    partnerVisible: true
  },
  {
    id: "shared-care-team",
    date: "Jun 20",
    time: "11:30 AM",
    type: "SHARED",
    title: "Request shared with approved care team",
    detail: "The facility shared the approved spiritual-care summary with the care team.",
    actor: "Elena Morris",
    badge: "Shared",
    tone: "teal",
    requesterVisible: true,
    partnerVisible: true
  },
  {
    id: "consent-confirmed",
    date: "Jun 20",
    time: "11:02 AM",
    type: "CONSENT",
    title: "Consent confirmed",
    detail: "Consent and visibility settings were reviewed and documented by the facility.",
    actor: "Facility Team",
    badge: "Confirmed",
    tone: "green",
    requesterVisible: true,
    partnerVisible: true
  },
  {
    id: "internal-plan",
    date: "Jun 20",
    time: "10:24 AM",
    type: "PLAN",
    title: "Spiritual care plan reviewed",
    detail: "Facility care plan aligned around prayer support, weekly visit, and family encouragement.",
    actor: "Care Coordinator",
    badge: "Internal",
    tone: "gold",
    requesterVisible: false,
    partnerVisible: false
  },
  {
    id: "request-submitted",
    date: "Jun 20",
    time: "9:42 AM",
    type: "SUBMITTED",
    title: "Care request submitted",
    detail: "A family encouragement and prayer support request was submitted for review.",
    actor: "Sarah K.",
    badge: "Submitted",
    tone: "stone",
    requesterVisible: true,
    partnerVisible: false
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

function portalDemoSteps(portal: PortalKind, copy: PortalCopy): DriveStep[] {
  const portalLabel = portal === "requester" ? "requester" : portal === "facility" ? "facility" : "partner";

  return [
    {
      element: '[data-portal-demo="portal-title"]',
      popover: {
        title: copy.title,
        description: `This is the ${portalLabel} portal. It is one focused dashboard with no permanent left-side admin navigation.`,
        side: "bottom",
        align: "start"
      }
    },
    {
      element: '[data-portal-demo="context-panel"]',
      popover: {
        title: copy.contextTitle,
        description: "This panel keeps the current request, queue, or assignments close while the rest of the page stays focused on care work.",
        side: "right",
        align: "start"
      }
    },
    {
      element: '[data-portal-demo="summary-card"]',
      popover: {
        title: "Current request summary",
        description: "The top card explains who this request is about, what is happening, and what the safe next step should be.",
        side: "bottom",
        align: "start"
      }
    },
    {
      element: '[data-portal-demo="info-cards"]',
      popover: {
        title: "Useful details only",
        description: "Each portal shows the detail level that role actually needs. Requesters, facilities, and partners do not need the same information.",
        side: "bottom",
        align: "start"
      }
    },
    {
      element: '[data-portal-demo="timeline"]',
      popover: {
        title: "Shared care timeline",
        description: "This is the shared source of truth. The same timeline is filtered so each portal sees the right events in English.",
        side: "top",
        align: "start"
      }
    },
    {
      element: '[data-portal-demo="actions"]',
      popover: {
        title: copy.actionsTitle,
        description: "These actions open real forms and add events to the timeline. The buttons are limited to what this role needs.",
        side: "left",
        align: "start"
      }
    },
    {
      element: '[data-portal-demo="visibility"]',
      popover: {
        title: "Access and visibility",
        description: "This summary explains what this portal can see. It is the rule that keeps the three portals separated.",
        side: "left",
        align: "start"
      }
    }
  ];
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
      {field.type === "textarea" ? (
        <textarea name={field.name} required={field.required} defaultValue={field.defaultValue} rows={4} className="mt-2 w-full rounded-2xl border border-[#d8d0c0] bg-white px-4 py-3 text-sm leading-6 text-[#102b3a] outline-none ring-[#86a45f]/25 focus:border-[#86a45f] focus:ring-4" />
      ) : field.type === "select" ? (
        <select name={field.name} required={field.required} defaultValue={field.defaultValue} className="mt-2 w-full rounded-2xl border border-[#d8d0c0] bg-white px-4 py-3 text-sm text-[#102b3a] outline-none ring-[#86a45f]/25 focus:border-[#86a45f] focus:ring-4">
          {(field.options ?? []).map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      ) : (
        <input name={field.name} type={field.type} required={field.required} defaultValue={field.defaultValue} className="mt-2 w-full rounded-2xl border border-[#d8d0c0] bg-white px-4 py-3 text-sm text-[#102b3a] outline-none ring-[#86a45f]/25 focus:border-[#86a45f] focus:ring-4" />
      )}
    </label>
  );
}

export function ChurchWorkPortalDashboard({ portal }: ChurchWorkPortalDashboardProps) {
  const [timeline, setTimeline] = useState(initialTimeline);
  const [activeAction, setActiveAction] = useState<PortalAction | null>(null);
  const [statusLabel, setStatusLabel] = useState(portalCopy[portal].statusLabel);
  const [subjectName, setSubjectName] = useState(portalCopy[portal].primaryCardTitle);
  const [subjectMeta, setSubjectMeta] = useState(portalCopy[portal].primaryCardMeta);
  const [subjectDetail, setSubjectDetail] = useState(portalCopy[portal].primaryCardDetail);
  const copy = portalCopy[portal];
  const visibleTimeline = useMemo(() => timeline.filter((event) => visibleForPortal(event, portal)), [timeline, portal]);

  const startGuidedDemo = useCallback(() => {
    const demo = driver({
      showProgress: true,
      allowClose: true,
      overlayOpacity: 0.55,
      stagePadding: 8,
      nextBtnText: "Next",
      prevBtnText: "Back",
      doneBtnText: "Done",
      popoverClass: "churchwork-portal-demo-popover",
      steps: portalDemoSteps(portal, copy)
    });

    demo.drive();
  }, [copy, portal]);

  function handleActionSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!activeAction) return;

    const formData = new FormData(event.currentTarget);
    const newEvent: TimelineEvent = {
      id: `${portal}-${activeAction.id}-${Date.now()}`,
      date: "Today",
      time: "Now",
      type: "ACTION",
      title: activeAction.eventTitle,
      detail: buildEventDetail(activeAction, formData),
      actor: copy.accountName,
      badge: activeAction.label,
      tone: activeAction.tone,
      requesterVisible: activeAction.requesterVisible,
      partnerVisible: activeAction.partnerVisible
    };

    if (activeAction.id === "requester-submit-care-request") {
      const residentName = String(formData.get("residentName") ?? "Jane Doe").trim();
      const relationship = String(formData.get("relationship") ?? "Requester").trim();
      const requestType = String(formData.get("requestType") ?? "Spiritual-care request").trim();
      setSubjectName(residentName || "Jane Doe");
      setSubjectMeta(`${requestType} · Requested by ${relationship}`);
      setSubjectDetail("Structured spiritual-care request submitted through the requester portal. The facility will review consent, visibility, and the next safe care step.");
    }

    setStatusLabel(activeAction.statusAfter);
    setTimeline((items) => [newEvent, ...items]);
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
              <span className="block text-xs font-bold text-[#d4dedc]">{portalNames[portal]}</span>
            </span>
          </Link>

          <div className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold text-[#edf5e6]">
            Role-safe timeline · human-reviewed sharing · English guided demo
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

      <section className="mx-auto max-w-[92rem] px-5 py-6">
        <div data-portal-demo="portal-title" className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#789052]">{copy.eyebrow}</p>
            <h1 className="mt-2 font-serif text-4xl font-semibold tracking-[-0.04em] md:text-5xl">{copy.title}</h1>
            <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-[#4d5d55]">{copy.subtitle}</p>
          </div>
          <div className="rounded-2xl border border-[#d8d0c0] bg-white/85 px-5 py-4 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#789052]">Current status</p>
            <p className="mt-1 text-lg font-black text-[#102b3a]">{statusLabel}</p>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-[310px_minmax(0,1fr)_320px]">
          <aside className="space-y-5">
            <section data-portal-demo="context-panel" className="rounded-[1.7rem] border border-[#d8d0c0] bg-white/90 p-5 shadow-sm">
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
            <section data-portal-demo="summary-card" className="rounded-[1.8rem] border border-[#d8d0c0] bg-white/95 p-6 shadow-sm">
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

            <div data-portal-demo="info-cards" className="grid gap-4 lg:grid-cols-3">
              {copy.infoCards.map((card) => (
                <article key={card.title} className="rounded-[1.5rem] border border-[#d8d0c0] bg-white/95 p-5 shadow-sm">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#173b2d]">{card.title}</p>
                  <p className="mt-3 text-sm font-semibold leading-6 text-[#4d5d55]">{card.body}</p>
                  <span className="mt-4 inline-flex rounded-full border border-[#bdd7ca] bg-[#eef6f0] px-3 py-1 text-xs font-black text-[#315f44]">{card.footer}</span>
                </article>
              ))}
            </div>

            <section data-portal-demo="timeline" className="rounded-[1.8rem] border border-[#d8d0c0] bg-white/95 p-6 shadow-sm">
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
            <section data-portal-demo="actions" className="rounded-[1.7rem] border border-[#d8d0c0] bg-white/95 p-5 shadow-sm">
              <h2 className="text-sm font-black uppercase tracking-[0.18em] text-[#173b2d]">{copy.actionsTitle}</h2>
              <p className="mt-2 text-xs font-semibold leading-5 text-[#4d5d55]">Each action opens a real form and writes a new event into the shared timeline.</p>
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

            <section data-portal-demo="visibility" className="rounded-[1.7rem] border border-[#ddb66c]/45 bg-[#fff8e7] p-5 shadow-sm">
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
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#789052]">{portalNames[portal]}</p>
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
              <p className="text-xs font-bold leading-5 text-[#5f4b1f]">Submitting this form records a demo timeline event inside this portal flow.</p>
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
