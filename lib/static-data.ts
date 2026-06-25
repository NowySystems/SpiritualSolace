export const saveState = "ChurchWork 0.4 — Operations board demo build";

export const compatibilityBaseline = "ChurchWork 0.1 — One-way temporary support messaging baseline";

export const legacyNavigationAudit = ["/grants-gov-live", "/learning-loop", "/daily-brief"];

export const learningLoopValidationNote =
  "Future memory layer will improve recommendations using staff feedback, source quality, outcomes, and daily source changes.";

export const navigationItems = [
  { label: "Dashboard", href: "/app" },
  { label: "Support Requests", href: "/app/support-requests" },
  { label: "Approved Responders", href: "/app/approved-responders" },
  { label: "Message Review", href: "/app/message-review" },
  { label: "Facility Rules", href: "/app/facility-rules" },
  { label: "Patient View", href: "/app/patient-view" },
  { label: "Audit Log", href: "/app/audit-log" },
  { label: "Guardrails", href: "/app/guardrails" }
];

export const fundingTypes = ["Grant", "Foundation Funding", "Corporate Giving", "Community Investment"];
export const fundingStatuses = ["New Lead", "Possible Fit", "Needs Review", "Archived"];

export type FundingOpportunity = {
  title: string;
  fundingType: string;
  sourceName: string;
  sourceTier: string;
  sourceCategory: string;
  deadline: string;
  deadlineRisk: string;
  status: string;
  fundMatch: string;
  programMatch: string;
  geographyFit: string;
  confidence: string;
  estimatedEffort: string;
  matchRequirement: string;
  recommendedAction: string;
  shortMatchExplanation: string;
  keywordSignals: string[];
  keywordGroupMatches?: string[];
  lastCheckedDate: string;
};

export const fundingOpportunities: FundingOpportunity[] = [];
export const grantLeads = fundingOpportunities;

export const sourceTierDefinitions = [
  {
    tier: "Compatibility",
    label: "Legacy source compatibility shim",
    examples: "Legacy CRCF pages retained for compile compatibility only.",
    categories: ["Legacy"],
    posture: "ChurchWork demo compatibility"
  }
];

export const sourceTiers = sourceTierDefinitions;

export const sourceRegistry = [
  {
    id: "src-legacy-placeholder",
    name: "Legacy placeholder source",
    tier: "Compatibility",
    type: "Placeholder",
    category: "Legacy",
    urlReference: "#",
    accessType: "None",
    relatedFundCategories: [],
    relatedProgramCategories: [],
    bestKeywordSignals: [],
    checkFrequency: "None",
    lastCheckedDate: "2026-06-10",
    reliability: "N/A",
    connectionStatus: "Disabled",
    currentStatus: "Compatibility Only",
    usefulFor: "Build compatibility while ChurchWork replaces inherited pages.",
    recommendedStaffAction: "Do not use for production workflows.",
    notes: "This shim replaced corrupted legacy static data that contained merge-conflict artifacts."
  }
];

export const marketSignals = [
  {
    market: "Spiritual support operations",
    focus: "Facility-controlled solace workflow",
    use: "Demo placeholder replacing inherited donor-market intelligence while ChurchWork modules are rebuilt."
  },
  {
    market: "Responder coverage",
    focus: "Approved local responder availability",
    use: "Supports routing, review, and one-way comfort delivery demos."
  }
];

export const dashboardStats = [
  { label: "Requests", value: "3", note: "Demo records" },
  { label: "Messages", value: "2", note: "Review examples" },
  { label: "Responders", value: "3", note: "Approved groups" }
];

export const reviewQueue = [];
export const reports = [];
export const sourceChecks = [];
export const learningLoopItems = [];
export const guardrailItems = [
  "No real patient data",
  "No live messaging",
  "Human review required",
  "One-way temporary support"
];

export const keywordCategorySnapshot = [];
export const opportunityDatabaseSnapshot = [];
export const sourceDatabaseSnapshot = [];
