export type PilotPolicy = {
  key: string;
  version: string;
  title: string;
  shortText: string;
};

export const PILOT_POLICY_VERSION = "pilot-safe-v1";

export const requiredPilotPolicies: PilotPolicy[] = [
  {
    key: "terms_of_service",
    version: PILOT_POLICY_VERSION,
    title: "Terms of Service",
    shortText: "I agree to use ChurchWork only for approved spiritual-care coordination and according to ChurchWork rules."
  },
  {
    key: "privacy_policy",
    version: PILOT_POLICY_VERSION,
    title: "Privacy Policy",
    shortText: "I understand ChurchWork collects limited account, organization, request, timeline, and audit information for pilot operations."
  },
  {
    key: "pilot_participation_notice",
    version: PILOT_POLICY_VERSION,
    title: "Pilot Participation Notice",
    shortText: "I understand this is an early controlled pilot that may change, pause, or limit access for safety, security, privacy, or operations."
  },
  {
    key: "no_medical_information_policy",
    version: PILOT_POLICY_VERSION,
    title: "No Medical Information Policy",
    shortText: "I understand ChurchWork is not a medical record or emergency service and I will not enter diagnosis, symptoms, medications, treatment details, chart notes, clinical instructions, insurance information, or emergency information."
  }
];
