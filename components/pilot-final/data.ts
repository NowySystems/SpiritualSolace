import type { CareRequest, StatusStep } from "./types";

export const statusSteps: StatusStep[] = [
  {
    key: "request_submitted",
    label: "Request submitted",
    shortLabel: "Request",
    description: "The request has been created with structured spiritual-care details."
  },
  {
    key: "facility_review",
    label: "Facility review",
    shortLabel: "Facility review",
    description: "The facility is reviewing the request and consent boundaries."
  },
  {
    key: "consent_needed",
    label: "Consent",
    shortLabel: "Consent",
    description: "Consent and sharing permissions are being confirmed."
  },
  {
    key: "ready_for_partner",
    label: "Partner assignment",
    shortLabel: "Partner",
    description: "Approved spiritual-care context is ready for a partner assignment."
  },
  {
    key: "outcome_recorded",
    label: "Outcome recorded",
    shortLabel: "Outcome",
    description: "Approved outcome information has been recorded."
  }
];

export const pilotCareRequest: CareRequest = {
  id: "pilot-request-jane-doe",
  displayId: "REQ-2025-0427",
  personName: "Jane Doe",
  room: "104B",
  locationLabel: "Morning Pointe Franklin",
  requestType: "Family encouragement & prayer support",
  requestedBy: {
    name: "Sarah K.",
    relationship: "Daughter"
  },
  preferredContact: "Text messages",
  bestContactTime: "Evenings",
  createdAt: "Apr 27, 2025 · 9:15 AM",
  currentStatus: "facility_review",
  consentStatus: "pending",
  sharingStatus: "not_shared",
  approvedUpdates: [
    {
      id: "approved-update-review-progress",
      dateLabel: "APR 27",
      title: "Facility review in progress",
      summary: "The facility is reviewing the request details and care preferences.",
      approvedBy: "Melissa Peterson",
      occurredAt: "10:42 AM"
    }
  ],
  timeline: [
    {
      id: "timeline-request-submitted",
      title: "Request submitted",
      actor: "Sarah K. (Daughter)",
      actorRole: "requester",
      occurredAt: "Apr 27, 2025 9:15 AM",
      summary: "Structured request was submitted for facility review.",
      visibleTo: ["requester", "facility"],
      statusImpact: "request_submitted"
    },
    {
      id: "timeline-facility-started",
      title: "Facility review started",
      actor: "Melissa Peterson",
      actorRole: "facility",
      occurredAt: "Apr 27, 2025 9:32 AM",
      summary: "Facility review began for consent and sharing boundaries.",
      visibleTo: ["facility"],
      statusImpact: "facility_review"
    },
    {
      id: "timeline-facility-progress",
      title: "Facility review in progress",
      actor: "Melissa Peterson",
      actorRole: "facility",
      occurredAt: "Apr 27, 2025 10:42 AM",
      summary: "Reviewing request details and care preferences.",
      visibleTo: ["requester", "facility"],
      statusImpact: "facility_review"
    }
  ]
};
