export type FundingFitConfidence =
  | "High Fit — Review First"
  | "Medium Fit — Needs Eligibility Review"
  | "Partner Fit — Find Lead Applicant"
  | "Low Fit — Do Not Prioritize"
  | "Research Fit — Partner Only"
  | "Insufficient Data — Verify Source";

export type SourceDepthLevel =
  | "Level 1 — Metadata only"
  | "Level 2 — Detail page read"
  | "Level 3 — NOFO/RFP/attachments read"
  | "Level 4 — Q&A/prior awards/source-site context read";

export const fundingFitDisclaimer =
  "This is not a probability of award. It is a review-priority signal based on source data, CRCF fit, eligibility clues, deadline, funding patterns, and human-review criteria.";

export const fundingThresholdGuidance = [
  "Reimbursement grants should generally be close to $1M+ to prioritize unless strategically important.",
  "Equipment/capital requests may be valuable below $1M if they directly support clinical access, patient safety, capacity, or rural healthcare infrastructure.",
  "Small private/community grants may still be useful for patient assistance, cancer assistance, food, utilities, transportation, screenings, and community health.",
  "Political/appropriations and CPF requests may justify larger capital/infrastructure targets.",
  "Legacy/planned giving is not a grant and should be treated as a separate long-term funding lane."
];

export type FundingLaneModel = {
  name: string;
  description: string;
  strongFitTerms: string[];
  weakNoiseTerms: string[];
  goodSourceTypes: string[];
  typicalCrcfRole: string;
  badFitRisks: string[];
  recommendedNextStep: string;
  referencePattern: string;
};

export const badFitReasons = [
  "Wrong applicant type",
  "Direct applicant unlikely",
  "Partner lead required",
  "Too research-heavy",
  "Clinical trial / NIH-style research",
  "Not rural / Upper Cumberland eligible",
  "Not Tennessee eligible",
  "Too small for reimbursement grant priority",
  "Deadline too short",
  "Capital costs not allowed",
  "Equipment not allowed",
  "Staffing/payroll not allowed",
  "Land/building excluded",
  "Requires university PI",
  "Requires academic institution lead",
  "Not healthcare/community benefit aligned",
  "No clear source link",
  "Insufficient detail returned",
  "Manual verification required",
  "Source is parser/manual lead only",
  "Application burden too high for expected benefit",
  "Reimbursement terms unclear",
  "Match requirement too high",
  "Sustainability burden unclear"
];

export const fundingNeedLanes: FundingLaneModel[] = [
  { name: "Workforce / Apprenticeship", description: "Supports healthcare workforce training, retention, and apprenticeship pipelines for frontline care roles.", strongFitTerms: ["apprenticeship", "LPN", "healthcare workforce", "clinical training", "preceptor"], weakNoiseTerms: ["doctoral dissertation", "lab-only fellowship"], goodSourceTypes: ["State workforce", "Federal workforce", "Private foundation"], typicalCrcfRole: "Possible Direct Applicant or Partner", badFitRisks: ["Wrong applicant type", "Requires academic institution lead"], recommendedNextStep: "Confirm applicant eligibility and workforce credential requirements.", referencePattern: "LPN apprenticeship / healthcare workforce." },
  { name: "Rural Healthcare Access", description: "Improves care access for rural and underserved Upper Cumberland populations.", strongFitTerms: ["rural health", "underserved", "care access", "mobile clinic"], weakNoiseTerms: ["urban-only", "non-health civic"], goodSourceTypes: ["HRSA", "USDA", "State health", "Community foundation"], typicalCrcfRole: "Possible Direct Applicant", badFitRisks: ["Not rural / Upper Cumberland eligible", "Not Tennessee eligible"], recommendedNextStep: "Verify geography/service area and healthcare-delivery requirements.", referencePattern: "Rural healthcare access category." },
  { name: "Equipment", description: "Funds clinical equipment that expands capacity, safety, and direct patient care quality.", strongFitTerms: ["equipment", "medical device", "cardiac rehab", "diagnostic"], weakNoiseTerms: ["software-only", "pure research lab"], goodSourceTypes: ["Corporate giving", "Foundation", "State/Federal grants"], typicalCrcfRole: "Possible Direct Applicant", badFitRisks: ["Equipment not allowed", "Reimbursement terms unclear"], recommendedNextStep: "Validate allowable equipment list, procurement rules, and reimbursement language.", referencePattern: "Cardiac rehab equipment." },
  { name: "Capital / Facilities", description: "Supports facility renovation, expansion, and capital infrastructure for care delivery.", strongFitTerms: ["capital", "facility", "renovation", "infrastructure", "construction"], weakNoiseTerms: ["event sponsorship"], goodSourceTypes: ["Appropriations", "USDA/State capital", "Major foundations"], typicalCrcfRole: "Needs Eligibility Review", badFitRisks: ["Capital costs not allowed", "Land/building excluded", "Match requirement too high"], recommendedNextStep: "Review eligible capital uses, ownership rules, and match burden with leadership.", referencePattern: "Emergency department capital infrastructure." },
  { name: "Emergency / Critical Care Infrastructure", description: "Targets emergency department and critical-care readiness infrastructure improvements.", strongFitTerms: ["emergency department", "critical care", "trauma", "stabilization"], weakNoiseTerms: ["non-clinical amenities"], goodSourceTypes: ["Federal/state emergency", "Appropriations", "Health-system foundations"], typicalCrcfRole: "Possible Direct Applicant with leadership review", badFitRisks: ["Capital costs not allowed", "Deadline too short"], recommendedNextStep: "Map requested infrastructure to patient-safety and emergency-access outcomes.", referencePattern: "Emergency department capital infrastructure." },
  { name: "Patient Assistance", description: "Provides direct patient support for practical barriers that impact treatment adherence.", strongFitTerms: ["patient assistance", "copay", "navigation", "support fund"], weakNoiseTerms: ["general fundraising event"], goodSourceTypes: ["Community foundation", "Private foundation", "Corporate giving"], typicalCrcfRole: "Direct Applicant or Coordination Support", badFitRisks: ["Not healthcare/community benefit aligned", "Sustainability burden unclear"], recommendedNextStep: "Confirm eligibility rules and support-delivery operations with program leads.", referencePattern: "Cancer patient assistance." },
  { name: "Cancer Support", description: "Funds screenings, navigation, and treatment-support services for cancer patients.", strongFitTerms: ["cancer screening", "oncology", "navigation", "early detection"], weakNoiseTerms: ["basic science only"], goodSourceTypes: ["Cancer foundations", "Community funds", "State prevention programs"], typicalCrcfRole: "Possible Direct Applicant", badFitRisks: ["Too research-heavy", "Not Tennessee eligible"], recommendedNextStep: "Validate service-delivery scope and patient-impact metrics.", referencePattern: "Cancer patient assistance." },
  { name: "Behavioral Health / Poverty Barriers", description: "Addresses behavioral-health and social-barrier interventions tied to care access.", strongFitTerms: ["behavioral health", "poverty", "mental health", "substance use", "case management"], weakNoiseTerms: ["non-health workforce incentive"], goodSourceTypes: ["State behavioral health", "Federal SAMHSA-style", "Private foundation"], typicalCrcfRole: "Possible Direct Applicant or Partner", badFitRisks: ["Direct applicant unlikely", "Application burden too high for expected benefit"], recommendedNextStep: "Review licensure/compliance requirements and partner lead needs.", referencePattern: "Empower UC behavioral health / poverty barriers." },
  { name: "Community Health / Prevention", description: "Supports prevention programming, screenings, and community-health outreach.", strongFitTerms: ["prevention", "screening", "community health", "education"], weakNoiseTerms: ["one-time marketing campaign"], goodSourceTypes: ["Public health agencies", "Community foundations", "Hospital benefit grants"], typicalCrcfRole: "Possible Direct Applicant", badFitRisks: ["Insufficient detail returned", "Manual verification required"], recommendedNextStep: "Confirm measurable prevention outcomes and allowable costs.", referencePattern: "Community Health Fund." },
  { name: "Telehealth", description: "Improves remote care access through telehealth technology and implementation.", strongFitTerms: ["telehealth", "virtual care", "remote monitoring", "broadband health"], weakNoiseTerms: ["consumer app without care integration"], goodSourceTypes: ["Federal rural health", "State innovation", "Foundation digital health"], typicalCrcfRole: "Possible Direct Applicant", badFitRisks: ["Equipment not allowed", "Staffing/payroll not allowed"], recommendedNextStep: "Confirm technology scope, compliance expectations, and reimbursement model.", referencePattern: "Rural healthcare access + telehealth expansion." },
  { name: "Transportation / Access Barriers", description: "Reduces transportation and access barriers that prevent patients from receiving care.", strongFitTerms: ["transportation", "ride support", "access barriers", "non-emergency medical transport"], weakNoiseTerms: ["general transit infrastructure"], goodSourceTypes: ["Community grants", "Hospital community benefit", "State social services"], typicalCrcfRole: "Direct Applicant or Partner", badFitRisks: ["Not healthcare/community benefit aligned", "Too small for reimbursement grant priority"], recommendedNextStep: "Validate patient-eligibility criteria and operational partner capacity.", referencePattern: "Transportation / access barriers support." },
  { name: "Food / Utilities / Housing Support", description: "Supports non-medical social needs linked to improved health outcomes.", strongFitTerms: ["food insecurity", "utility assistance", "housing stability", "social needs"], weakNoiseTerms: ["non-targeted poverty campaign"], goodSourceTypes: ["Community foundations", "Corporate giving", "Local trusts"], typicalCrcfRole: "Coordination Support with program teams", badFitRisks: ["Sustainability burden unclear", "No clear source link"], recommendedNextStep: "Confirm program guardrails, target population, and continuation plan.", referencePattern: "Food, utilities, housing patient-assistance support." },
  { name: "Legacy / Planned Giving", description: "Long-term philanthropic lane for planned gifts and legacy commitments (not grant workflow).", strongFitTerms: ["planned giving", "legacy gift", "estate", "bequest"], weakNoiseTerms: ["government NOFO"], goodSourceTypes: ["Internal development strategy", "Private donor advisement"], typicalCrcfRole: "Development coordination; not grant submission", badFitRisks: ["No clear source link", "Direct applicant unlikely"], recommendedNextStep: "Route to development leadership for long-term donor planning.", referencePattern: "Legacy/planned giving." },
  { name: "Political / Appropriations", description: "Supports appropriations and public-funding requests for large infrastructure/community priorities.", strongFitTerms: ["appropriation", "CPF", "legislative", "earmark"], weakNoiseTerms: ["small reimbursement-only grant"], goodSourceTypes: ["Legislative offices", "Federal/state appropriations channels"], typicalCrcfRole: "Leadership-led with partner coordination", badFitRisks: ["Partner lead required", "Application burden too high for expected benefit"], recommendedNextStep: "Escalate to leadership for strategy, sponsor alignment, and timeline review.", referencePattern: "Political/appropriations capital infrastructure requests." },
  { name: "Corporate Giving", description: "Corporate philanthropy and community-benefit investments aligned to service impact.", strongFitTerms: ["corporate giving", "community benefit", "charitable foundation", "employee giving"], weakNoiseTerms: ["procurement contract"], goodSourceTypes: ["Corporate foundation portals", "Regional business philanthropy"], typicalCrcfRole: "Direct Applicant", badFitRisks: ["Insufficient detail returned", "Manual verification required"], recommendedNextStep: "Confirm giving-cycle details and eligibility with documented source links.", referencePattern: "Corporate giving for community-health and patient support." },
  { name: "Foundation / Private Giving", description: "Private and family foundation opportunities with mission-fit healthcare impact.", strongFitTerms: ["private foundation", "family fund", "charitable trust", "grant cycle"], weakNoiseTerms: ["research commercialization"], goodSourceTypes: ["Private foundation sites", "Community foundation databases"], typicalCrcfRole: "Direct Applicant or Partner", badFitRisks: ["Match requirement too high", "Deadline too short"], recommendedNextStep: "Collect current guidelines and build an internal fit brief.", referencePattern: "Community Health Fund / private foundation categories." },
  { name: "Research / Partner Only", description: "Research-heavy opportunities where CRCF is usually not the lead applicant.", strongFitTerms: ["NIH", "clinical trial", "principal investigator", "R01", "research protocol"], weakNoiseTerms: ["direct patient assistance"], goodSourceTypes: ["Federal research programs", "University-led NOFOs"], typicalCrcfRole: "Partner Only", badFitRisks: ["Requires university PI", "Requires academic institution lead", "Clinical trial / NIH-style research"], recommendedNextStep: "Find an eligible academic/health-system lead and define CRCF partner scope.", referencePattern: "Research / partner-only category." }
];

export function fundingLaneForText(text: string) {
  const normalized = text.toLowerCase();
  return fundingNeedLanes.find((lane) => lane.strongFitTerms.some((term) => normalized.includes(term.toLowerCase()))) ?? fundingNeedLanes[1];
}
