import type { ChurchWorkPortalRole, ChurchWorkTimelineEventType } from "./churchworkWorkflow";

export type ChurchWorkDemoScriptId =
  | "churchwork-end-to-end-v1"
  | "churchwork-requester-v1"
  | "churchwork-facility-v1"
  | "churchwork-partner-v1";

export type ChurchWorkDemoStep = {
  id: string;
  portal: ChurchWorkPortalRole;
  title: string;
  narration: string;
  relatedEventType?: ChurchWorkTimelineEventType;
};

export type ChurchWorkDemoScript = {
  id: ChurchWorkDemoScriptId;
  version: string;
  title: string;
  description: string;
  steps: ChurchWorkDemoStep[];
};

export const CHURCHWORK_END_TO_END_DEMO_STEPS: ChurchWorkDemoStep[] = [
  {
    id: "requester-start",
    portal: "requester",
    title: "Start with the requester",
    narration: "We start in the requester portal. Sarah will use controlled choices only to begin a spiritual-care request.",
    relatedEventType: "guided_step"
  },
  {
    id: "requester-select-person",
    portal: "requester",
    title: "Select the person",
    narration: "Sarah selects Jane Doe from the approved list. No free-text resident information is entered.",
    relatedEventType: "guided_step"
  },
  {
    id: "requester-relationship",
    portal: "requester",
    title: "Choose relationship",
    narration: "Sarah chooses Daughter from a fixed relationship list.",
    relatedEventType: "guided_step"
  },
  {
    id: "requester-request-type",
    portal: "requester",
    title: "Choose request type",
    narration: "Sarah selects Family Encouragement and Prayer Support as the structured request type.",
    relatedEventType: "guided_step"
  },
  {
    id: "requester-support-focus",
    portal: "requester",
    title: "Choose support focus",
    narration: "Sarah selects Prayer support and text messages for updates.",
    relatedEventType: "guided_step"
  },
  {
    id: "requester-terms-accepted",
    portal: "requester",
    title: "Accept spiritual-care-only acknowledgement",
    narration: "Sarah confirms the spiritual-care-only boundary. This acknowledgement becomes a real audit-log event on the timeline.",
    relatedEventType: "requester_acknowledgement"
  },
  {
    id: "care-request-submitted",
    portal: "requester",
    title: "Submit structured care request",
    narration: "The structured request is recorded and is ready for facility review.",
    relatedEventType: "care_request_submitted"
  },
  {
    id: "facility-queue-received",
    portal: "facility",
    title: "Facility receives request",
    narration: "The facility receives Jane Doe's request in its review queue.",
    relatedEventType: "guided_step"
  },
  {
    id: "facility-review-completed",
    portal: "facility",
    title: "Complete facility review",
    narration: "Morning Pointe reviews the request and confirms it is eligible for the spiritual-care workflow.",
    relatedEventType: "facility_review_completed"
  },
  {
    id: "facility-review-recorded",
    portal: "facility",
    title: "Record facility review",
    narration: "The facility review is recorded on the shared timeline.",
    relatedEventType: "facility_review_completed"
  },
  {
    id: "consent-visibility-selected",
    portal: "facility",
    title: "Select consent and visibility",
    narration: "The facility records consent source and chooses requester plus approved partner visibility.",
    relatedEventType: "consent_recorded"
  },
  {
    id: "consent-recorded",
    portal: "facility",
    title: "Record consent",
    narration: "Consent is documented before any partner receives information.",
    relatedEventType: "consent_recorded"
  },
  {
    id: "partner-sharing-approved",
    portal: "facility",
    title: "Approve partner sharing",
    narration: "The facility approves a limited spiritual-care summary for Morning Pointe Church. Medical details are not shared.",
    relatedEventType: "partner_sharing_approved"
  },
  {
    id: "partner-assignment-created",
    portal: "partner",
    title: "Partner receives assignment",
    narration: "The partner receives the approved assignment and sees only approved context.",
    relatedEventType: "partner_assignment_created"
  },
  {
    id: "partner-assignment-accepted",
    portal: "partner",
    title: "Partner accepts assignment",
    narration: "The partner accepts responsibility for visit and prayer support.",
    relatedEventType: "partner_assignment_accepted"
  },
  {
    id: "partner-acceptance-recorded",
    portal: "partner",
    title: "Record partner acceptance",
    narration: "The accepted assignment is recorded for the partner and facility.",
    relatedEventType: "partner_assignment_accepted"
  },
  {
    id: "care-focus-selected",
    portal: "partner",
    title: "Select care focus",
    narration: "The partner does not type a custom prayer. The partner selects the approved care focus: Comfort and Peace.",
    relatedEventType: "care_focus_selected"
  },
  {
    id: "care-outcome-selected",
    portal: "partner",
    title: "Select care outcome",
    narration: "The partner logs a structured care outcome: prayer support offered and no further action today.",
    relatedEventType: "care_outcome_logged"
  },
  {
    id: "care-outcome-recorded",
    portal: "partner",
    title: "Record care outcome",
    narration: "The structured outcome is recorded and shared back to the facility.",
    relatedEventType: "care_outcome_logged"
  },
  {
    id: "requester-approved-update",
    portal: "requester",
    title: "Requester sees approved update",
    narration: "Sarah sees approved updates only. Internal facility and partner workflow details remain hidden.",
    relatedEventType: "care_outcome_logged"
  }
];

export const CHURCHWORK_DEMO_SCRIPTS: Record<ChurchWorkDemoScriptId, ChurchWorkDemoScript> = {
  "churchwork-end-to-end-v1": {
    id: "churchwork-end-to-end-v1",
    version: "v1",
    title: "ChurchWork End-to-End Guided Demo",
    description: "Requester to facility to partner to requester approved update.",
    steps: CHURCHWORK_END_TO_END_DEMO_STEPS
  },
  "churchwork-requester-v1": {
    id: "churchwork-requester-v1",
    version: "v1",
    title: "Requester Portal Guided Demo",
    description: "Requester structured request and acknowledgement flow.",
    steps: CHURCHWORK_END_TO_END_DEMO_STEPS.filter((step) => step.portal === "requester")
  },
  "churchwork-facility-v1": {
    id: "churchwork-facility-v1",
    version: "v1",
    title: "Facility Portal Guided Demo",
    description: "Facility review, consent, and sharing approval flow.",
    steps: CHURCHWORK_END_TO_END_DEMO_STEPS.filter((step) => step.portal === "facility")
  },
  "churchwork-partner-v1": {
    id: "churchwork-partner-v1",
    version: "v1",
    title: "Partner Portal Guided Demo",
    description: "Partner assignment, prayer focus, and care outcome flow.",
    steps: CHURCHWORK_END_TO_END_DEMO_STEPS.filter((step) => step.portal === "partner")
  }
};

export function getChurchWorkDemoStep(scriptId: string, stepId: string): ChurchWorkDemoStep | null {
  const script = CHURCHWORK_DEMO_SCRIPTS[scriptId as ChurchWorkDemoScriptId];
  if (!script) return null;
  return script.steps.find((step) => step.id === stepId) ?? null;
}

export function getChurchWorkDemoScript(scriptId: string): ChurchWorkDemoScript | null {
  return CHURCHWORK_DEMO_SCRIPTS[scriptId as ChurchWorkDemoScriptId] ?? null;
}
