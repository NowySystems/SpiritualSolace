export type SolaceRequestStatus = "New" | "Intake Review" | "Routed" | "Message Review" | "Delivered" | "Expired";

export type MessageType =
  | "Prayer"
  | "Affirmation"
  | "Guidance"
  | "Encouragement"
  | "Pep / Strength"
  | "Calming Words";

export type ResponderStatus = "Active" | "Limited" | "Renewal Needed" | "Paused";

export type ReviewStatus = "Needs Review" | "Approved" | "Needs Edit" | "Rejected";

export type SolaceRequest = {
  id: string;
  patientAlias: string;
  location: string;
  requestType: MessageType;
  traditionPreference: string;
  tonePreference: string;
  language: string;
  consentConfirmed: boolean;
  status: SolaceRequestStatus;
  priority: "Routine" | "Soon" | "Time Sensitive";
  submittedAt: string;
  assignedResponderId?: string;
  note: string;
};

export type ApprovedResponder = {
  id: string;
  name: string;
  organization: string;
  tradition: string;
  coverageArea: string;
  languages: string[];
  messageTypes: MessageType[];
  status: ResponderStatus;
  reviewRequired: boolean;
  lastVerified: string;
  notes: string;
};

export type SolaceMessage = {
  id: string;
  requestId: string;
  responderId: string;
  body: string;
  status: ReviewStatus;
  safetyNotes: string[];
  submittedAt: string;
  reviewedBy?: string;
};

export type FacilityRule = {
  id: string;
  name: string;
  rule: string;
  status: "Enabled" | "Draft";
};

export type AuditEvent = {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  target: string;
  note: string;
};

export const messageTypes: MessageType[] = [
  "Prayer",
  "Affirmation",
  "Guidance",
  "Encouragement",
  "Pep / Strength",
  "Calming Words"
];

export const traditionPreferences = [
  "No specific tradition",
  "Interfaith",
  "Christian",
  "Catholic",
  "Protestant",
  "Jewish",
  "Muslim",
  "Other / Staff follow-up"
];

export const solaceRequests: SolaceRequest[] = [
  {
    id: "REQ-1001",
    patientAlias: "Patient A",
    location: "3rd Floor · Pre-op",
    requestType: "Prayer",
    traditionPreference: "Christian",
    tonePreference: "Gentle and reassuring",
    language: "English",
    consentConfirmed: true,
    status: "Delivered",
    priority: "Soon",
    submittedAt: "Today · 8:42 AM",
    assignedResponderId: "RESP-001",
    note: "Patient requested a brief prayer before surgery. No medical details should be included."
  },
  {
    id: "REQ-1002",
    patientAlias: "Patient B",
    location: "2nd Floor · Recovery",
    requestType: "Encouragement",
    traditionPreference: "No specific tradition",
    tonePreference: "Hopeful but calm",
    language: "English",
    consentConfirmed: true,
    status: "Routed",
    priority: "Routine",
    submittedAt: "Today · 9:15 AM",
    assignedResponderId: "RESP-003",
    note: "Patient asked for soothing words after a difficult night."
  },
  {
    id: "REQ-1003",
    patientAlias: "Patient C",
    location: "ICU Family Area",
    requestType: "Calming Words",
    traditionPreference: "Interfaith",
    tonePreference: "Peaceful and brief",
    language: "English",
    consentConfirmed: true,
    status: "Message Review",
    priority: "Time Sensitive",
    submittedAt: "Today · 10:03 AM",
    assignedResponderId: "RESP-002",
    note: "Family requested non-denominational comfort language."
  }
];

export const approvedResponders: ApprovedResponder[] = [
  {
    id: "RESP-001",
    name: "First Community Prayer Team",
    organization: "Local Christian Partner",
    tradition: "Christian",
    coverageArea: "Cookeville / Putnam County",
    languages: ["English"],
    messageTypes: ["Prayer", "Encouragement", "Pep / Strength"],
    status: "Active",
    reviewRequired: true,
    lastVerified: "2026-06-01",
    notes: "Approved for one-way prayer and encouragement only."
  },
  {
    id: "RESP-002",
    name: "Interfaith Comfort Circle",
    organization: "Community Support Partner",
    tradition: "Interfaith",
    coverageArea: "Regional",
    languages: ["English", "Spanish"],
    messageTypes: ["Affirmation", "Calming Words", "Guidance"],
    status: "Active",
    reviewRequired: true,
    lastVerified: "2026-05-29",
    notes: "Best fit for no-specific-tradition and family comfort requests."
  },
  {
    id: "RESP-003",
    name: "Volunteer Encouragement Desk",
    organization: "Facility Volunteer Program",
    tradition: "No specific tradition",
    coverageArea: "Facility controlled",
    languages: ["English"],
    messageTypes: ["Encouragement", "Pep / Strength", "Calming Words"],
    status: "Limited",
    reviewRequired: true,
    lastVerified: "2026-05-20",
    notes: "Daytime coverage only. Staff review required before delivery."
  }
];

export const solaceMessages: SolaceMessage[] = [
  {
    id: "MSG-5001",
    requestId: "REQ-1003",
    responderId: "RESP-002",
    body: "May this moment feel a little steadier. May peace surround you and your family with gentleness, care, and quiet strength.",
    status: "Needs Review",
    safetyNotes: ["No medical advice", "No outcome promises", "Appropriate one-way comfort tone"],
    submittedAt: "Today · 10:18 AM"
  },
  {
    id: "MSG-5002",
    requestId: "REQ-1001",
    responderId: "RESP-001",
    body: "We are holding you in prayer today. May you feel courage, calm, and the presence of care around you.",
    status: "Approved",
    safetyNotes: ["Brief", "Faith preference matched", "No follow-up request"],
    submittedAt: "Today · 9:02 AM",
    reviewedBy: "Staff Review"
  }
];

export const facilityRules: FacilityRule[] = [
  {
    id: "RULE-001",
    name: "Human review before delivery",
    rule: "All responder messages require staff review before patient delivery in the MVP.",
    status: "Enabled"
  },
  {
    id: "RULE-002",
    name: "No medical advice or outcome promises",
    rule: "Messages must not include diagnosis, treatment direction, or promises of healing or recovery.",
    status: "Enabled"
  },
  {
    id: "RULE-003",
    name: "One-way temporary delivery",
    rule: "Patient delivery is one-way only. Any additional support requires a new request or staff-assisted workflow.",
    status: "Enabled"
  }
];

export const auditEvents: AuditEvent[] = [
  {
    id: "AUD-9001",
    timestamp: "Today · 8:42 AM",
    actor: "Intake Helper",
    action: "Created request",
    target: "REQ-1001",
    note: "Consent confirmed and request submitted for review."
  },
  {
    id: "AUD-9002",
    timestamp: "Today · 9:02 AM",
    actor: "Responder",
    action: "Submitted message",
    target: "MSG-5002",
    note: "One-way prayer message submitted for staff review."
  },
  {
    id: "AUD-9003",
    timestamp: "Today · 10:18 AM",
    actor: "Responder",
    action: "Submitted message",
    target: "MSG-5001",
    note: "Interfaith calming message awaiting review."
  }
];

export function getResponderName(id?: string) {
  if (!id) return "Unassigned";
  return approvedResponders.find((responder) => responder.id === id)?.name ?? "Unknown responder";
}

export function getRequestById(id: string) {
  return solaceRequests.find((request) => request.id === id);
}

export function getResponderById(id: string) {
  return approvedResponders.find((responder) => responder.id === id);
}

export function getRequestStats() {
  return {
    total: solaceRequests.length,
    needsReview: solaceRequests.filter((request) => request.status === "Intake Review" || request.status === "Message Review").length,
    routed: solaceRequests.filter((request) => request.status === "Routed").length,
    timeSensitive: solaceRequests.filter((request) => request.priority === "Time Sensitive").length
  };
}
