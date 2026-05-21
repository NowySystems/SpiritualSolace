export type PilotMode = "live" | "manual";

export type SourcePilotRecord = {
  sourceId: string;
  sourceName: string;
  mode: PilotMode;
  sourceUrl: string;
  notes: string;
  sourceBoundLinks: string[];
  humanReviewRequired: true;
  canSendToReviewQueue: false;
  canPersist: false;
};

export const liveSourcePilots: SourcePilotRecord[] = [
  {
    sourceId: "tn-health",
    sourceName: "Tennessee Department of Health",
    mode: "live",
    sourceUrl: "https://www.tn.gov/health",
    notes: "Live pilot listing; read-only/source-bound behavior enforced.",
    sourceBoundLinks: ["https://www.tn.gov/health"],
    humanReviewRequired: true,
    canSendToReviewQueue: false,
    canPersist: false
  },
  {
    sourceId: "cfmt",
    sourceName: "Community Foundation of Middle Tennessee",
    mode: "live",
    sourceUrl: "https://www.cfmt.org",
    notes: "Live pilot listing; read-only/source-bound behavior enforced.",
    sourceBoundLinks: ["https://www.cfmt.org"],
    humanReviewRequired: true,
    canSendToReviewQueue: false,
    canPersist: false
  },
  {
    sourceId: "bcbst-foundation",
    sourceName: "BlueCross BlueShield of Tennessee Foundation",
    mode: "manual",
    sourceUrl: "https://www.bcbst.com/foundation",
    notes: "Readiness/manual posture in CRCF 3.2.1.",
    sourceBoundLinks: ["https://www.bcbst.com/foundation"],
    humanReviewRequired: true,
    canSendToReviewQueue: false,
    canPersist: false
  },
  {
    sourceId: "healing-trust",
    sourceName: "The Healing Trust",
    mode: "manual",
    sourceUrl: "https://www.thehealingtrust.org",
    notes: "Readiness/manual posture in CRCF 3.2.1.",
    sourceBoundLinks: ["https://www.thehealingtrust.org"],
    humanReviewRequired: true,
    canSendToReviewQueue: false,
    canPersist: false
  }
];
