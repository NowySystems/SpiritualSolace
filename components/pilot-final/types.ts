export type PortalRole = "requester" | "facility" | "partner";

export type CareRequestStatus =
  | "request_submitted"
  | "facility_review"
  | "consent_needed"
  | "ready_for_partner"
  | "partner_assigned"
  | "care_in_progress"
  | "outcome_recorded"
  | "closed";

export type VisibilityRole = "requester" | "facility" | "partner" | "system";

export type TimelineEvent = {
  id: string;
  title: string;
  actor: string;
  actorRole: VisibilityRole;
  occurredAt: string;
  summary: string;
  visibleTo: VisibilityRole[];
  statusImpact?: CareRequestStatus;
};

export type ApprovedUpdate = {
  id: string;
  dateLabel: string;
  title: string;
  summary: string;
  approvedBy: string;
  occurredAt: string;
};

export type CareRequest = {
  id: string;
  displayId: string;
  personName: string;
  room: string;
  locationLabel: string;
  requestType: string;
  requestedBy: {
    name: string;
    relationship: string;
  };
  preferredContact: string;
  bestContactTime: string;
  createdAt: string;
  currentStatus: CareRequestStatus;
  consentStatus: "not_recorded" | "pending" | "approved";
  sharingStatus: "not_shared" | "approved_for_partner" | "partner_assigned";
  partnerName?: string;
  approvedUpdates: ApprovedUpdate[];
  timeline: TimelineEvent[];
};

export type StatusStep = {
  key: CareRequestStatus;
  label: string;
  shortLabel: string;
  description: string;
};
