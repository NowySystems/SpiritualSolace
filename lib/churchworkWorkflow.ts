export type ChurchWorkPortalRole = "requester" | "facility" | "partner";

export type ChurchWorkTimelineEventType =
  | "guided_step"
  | "requester_acknowledgement"
  | "care_request_submitted"
  | "facility_review_completed"
  | "consent_recorded"
  | "partner_sharing_approved"
  | "partner_assignment_created"
  | "partner_assignment_accepted"
  | "care_focus_selected"
  | "care_outcome_logged";

export type ChurchWorkVisibility = {
  requesterVisible: boolean;
  facilityVisible: boolean;
  partnerVisible: boolean;
};

export type ChurchWorkTimelineEventDefinition = {
  type: ChurchWorkTimelineEventType;
  title: string;
  category: "Guided Step" | "Audit Log" | "Care Request" | "Facility Review" | "Partner Assignment" | "Care Outcome";
  defaultActorRole: ChurchWorkPortalRole | "system";
  defaultVisibility: ChurchWorkVisibility;
  immutableAuditRecord: boolean;
  description: string;
};

export const CHURCHWORK_TIMELINE_EVENT_DEFINITIONS: Record<ChurchWorkTimelineEventType, ChurchWorkTimelineEventDefinition> = {
  guided_step: {
    type: "guided_step",
    title: "Guided demo step",
    category: "Guided Step",
    defaultActorRole: "system",
    defaultVisibility: { requesterVisible: true, facilityVisible: true, partnerVisible: true },
    immutableAuditRecord: false,
    description: "Demo-only event used to show the guided walkthrough path. This is not a real care record."
  },
  requester_acknowledgement: {
    type: "requester_acknowledgement",
    title: "Spiritual-care-only acknowledgement accepted",
    category: "Audit Log",
    defaultActorRole: "requester",
    defaultVisibility: { requesterVisible: true, facilityVisible: true, partnerVisible: false },
    immutableAuditRecord: true,
    description: "Requester confirmed this is spiritual-care coordination only and no medical details are included."
  },
  care_request_submitted: {
    type: "care_request_submitted",
    title: "Structured care request submitted",
    category: "Care Request",
    defaultActorRole: "requester",
    defaultVisibility: { requesterVisible: true, facilityVisible: true, partnerVisible: false },
    immutableAuditRecord: true,
    description: "Requester submitted a structured spiritual-care request for facility review."
  },
  facility_review_completed: {
    type: "facility_review_completed",
    title: "Facility review completed",
    category: "Facility Review",
    defaultActorRole: "facility",
    defaultVisibility: { requesterVisible: true, facilityVisible: true, partnerVisible: false },
    immutableAuditRecord: true,
    description: "Facility reviewed the request and determined whether it can proceed through the spiritual-care workflow."
  },
  consent_recorded: {
    type: "consent_recorded",
    title: "Consent and visibility recorded",
    category: "Audit Log",
    defaultActorRole: "facility",
    defaultVisibility: { requesterVisible: true, facilityVisible: true, partnerVisible: true },
    immutableAuditRecord: true,
    description: "Facility recorded consent source and visibility boundaries before sharing context outside the facility workflow."
  },
  partner_sharing_approved: {
    type: "partner_sharing_approved",
    title: "Partner sharing approved",
    category: "Audit Log",
    defaultActorRole: "facility",
    defaultVisibility: { requesterVisible: true, facilityVisible: true, partnerVisible: true },
    immutableAuditRecord: true,
    description: "Facility approved a limited spiritual-care summary for an external partner."
  },
  partner_assignment_created: {
    type: "partner_assignment_created",
    title: "Partner assignment created",
    category: "Partner Assignment",
    defaultActorRole: "facility",
    defaultVisibility: { requesterVisible: false, facilityVisible: true, partnerVisible: true },
    immutableAuditRecord: false,
    description: "Facility created a partner assignment using approved context only."
  },
  partner_assignment_accepted: {
    type: "partner_assignment_accepted",
    title: "Partner assignment accepted",
    category: "Partner Assignment",
    defaultActorRole: "partner",
    defaultVisibility: { requesterVisible: false, facilityVisible: true, partnerVisible: true },
    immutableAuditRecord: true,
    description: "Partner accepted responsibility for an approved spiritual-care action."
  },
  care_focus_selected: {
    type: "care_focus_selected",
    title: "Prayer and care focus selected",
    category: "Partner Assignment",
    defaultActorRole: "partner",
    defaultVisibility: { requesterVisible: false, facilityVisible: true, partnerVisible: true },
    immutableAuditRecord: false,
    description: "Partner selected an approved prayer/care focus from structured options."
  },
  care_outcome_logged: {
    type: "care_outcome_logged",
    title: "Care outcome logged",
    category: "Care Outcome",
    defaultActorRole: "partner",
    defaultVisibility: { requesterVisible: true, facilityVisible: true, partnerVisible: true },
    immutableAuditRecord: true,
    description: "Partner logged a structured outcome back to the facility. Requester sees only the approved outcome summary."
  }
};

export const CHURCHWORK_STRUCTURED_REQUEST_FIELDS = [
  "person",
  "relationship",
  "requestType",
  "supportFocus",
  "contactPreference",
  "acknowledgeNoMedical"
] as const;

export const CHURCHWORK_PARTNER_STRUCTURED_OUTCOME_FIELDS = [
  "assignmentScope",
  "prayerFocus",
  "careApproach",
  "outcome",
  "nextStep",
  "shareWithFacility"
] as const;

export function getTimelineEventVisibility(type: ChurchWorkTimelineEventType): ChurchWorkVisibility {
  return CHURCHWORK_TIMELINE_EVENT_DEFINITIONS[type].defaultVisibility;
}

export function isImmutableAuditEvent(type: ChurchWorkTimelineEventType): boolean {
  return CHURCHWORK_TIMELINE_EVENT_DEFINITIONS[type].immutableAuditRecord;
}
