export type EvidenceSourceGroup =
  | "Poverty / Economic Indicators"
  | "Healthcare Burden"
  | "Rural / Access Barriers"
  | "Workforce / Provider Shortages"
  | "Community Need References"
  | "Internal Institutional References";

export type EvidenceSourceStatus =
  | "Shell only"
  | "Planned read-only connector"
  | "Internal reference only";

export type EvidenceSourceConfidence =
  | "High"
  | "Medium"
  | "Staff verification required";

export type EvidenceIntelligenceSource = {
  id: string;
  sourceName: string;
  sourceRole: "Evidence / Need-Proof Source" | "Internal Reference Source";
  sourceGroup: EvidenceSourceGroup;
  connectorType: string;
  status: EvidenceSourceStatus;
  confidence: EvidenceSourceConfidence;
  whatItHelpsProve: string;
  howItImprovesRecommendations: string;
  directSourceLink: string;
  humanVerificationNote: string;
};

export const evidenceSourceGroups: EvidenceSourceGroup[] = [
  "Poverty / Economic Indicators",
  "Healthcare Burden",
  "Rural / Access Barriers",
  "Workforce / Provider Shortages",
  "Community Need References",
  "Internal Institutional References",
];

export const evidenceIntelligenceSources: EvidenceIntelligenceSource[] = [
  {
    id: "evidence-census-acs",
    sourceName: "Census ACS",
    sourceRole: "Evidence / Need-Proof Source",
    sourceGroup: "Poverty / Economic Indicators",
    connectorType: "True API / Structured Source shell",
    status: "Planned read-only connector",
    confidence: "High",
    whatItHelpsProve:
      "Poverty, income, disability, transportation access, age demographics, household trends, and rural/economic conditions for service-area need narratives.",
    howItImprovesRecommendations:
      "Helps future advisors explain economic hardship, access barriers, and population context when ranking health-access or prevention opportunities.",
    directSourceLink: "https://www.census.gov/programs-surveys/acs/data/data-via-api.html",
    humanVerificationNote:
      "Not an application source. No statistics are shown until a reviewed read-only lookup exists and staff verifies the indicator, geography, vintage, and citation.",
  },
  {
    id: "evidence-cdc-places",
    sourceName: "CDC PLACES",
    sourceRole: "Evidence / Need-Proof Source",
    sourceGroup: "Healthcare Burden",
    connectorType: "Structured public data shell",
    status: "Planned read-only connector",
    confidence: "Medium",
    whatItHelpsProve:
      "Chronic disease burden, obesity, smoking, diabetes, mental-health indicators, preventive-health concerns, and healthcare-access burden.",
    howItImprovesRecommendations:
      "Helps future advisors connect community-health, screening, prevention, and access opportunities to documented local health-burden context.",
    directSourceLink: "https://www.cdc.gov/places/tools/data-portal.html",
    humanVerificationNote:
      "Not an application source. PLACES indicators must be reviewed for geography, release year, measure definition, and limitations before narrative use.",
  },
  {
    id: "evidence-county-health-rankings",
    sourceName: "County Health Rankings & Roadmaps",
    sourceRole: "Evidence / Need-Proof Source",
    sourceGroup: "Community Need References",
    connectorType: "Download / Bulk File shell",
    status: "Shell only",
    confidence: "Medium",
    whatItHelpsProve:
      "County-level health comparisons, mortality and morbidity context, access barriers, social/economic indicators, and healthcare environment signals.",
    howItImprovesRecommendations:
      "Helps future advisors compare regional health context with funding patterns and explain why a county-level need should be prioritized.",
    directSourceLink: "https://www.countyhealthrankings.org/health-data/methodology-and-sources/data-documentation",
    humanVerificationNote:
      "Not an application source. Use only after staff verifies the data year, measure definitions, and county comparison language.",
  },
  {
    id: "evidence-hrsa-shortage",
    sourceName: "HRSA shortage/rural-health data",
    sourceRole: "Evidence / Need-Proof Source",
    sourceGroup: "Workforce / Provider Shortages",
    connectorType: "Structured public data shell",
    status: "Shell only",
    confidence: "Medium",
    whatItHelpsProve:
      "HPSA/MUA shortage areas, provider shortages, rural-health designations, and healthcare access gaps.",
    howItImprovesRecommendations:
      "Helps future advisors explain workforce, provider-capacity, rural-access, and underserved-area arguments when reviewing opportunities.",
    directSourceLink: "https://data.hrsa.gov/topics/health-workforce/shortage-areas",
    humanVerificationNote:
      "Not an application source. Shortage designations can affect eligibility and must be confirmed directly by staff before use.",
  },
  {
    id: "evidence-uchra-needs-assessment",
    sourceName: "UCHRA community needs assessment",
    sourceRole: "Internal Reference Source",
    sourceGroup: "Internal Institutional References",
    connectorType: "Internal Reference Only",
    status: "Internal reference only",
    confidence: "Staff verification required",
    whatItHelpsProve:
      "Regional community needs, poverty barriers, transportation/access issues, and Upper Cumberland service context when staff provides approved references.",
    howItImprovesRecommendations:
      "Helps future advisors align public evidence with staff-verified regional context and avoid overclaiming beyond approved local references.",
    directSourceLink: "https://www.uchra.org/",
    humanVerificationNote:
      "Internal/reference context only. No automatic ingestion; use approved excerpts or staff-verified documents only.",
  },
  {
    id: "evidence-crmc-annual-reports",
    sourceName: "CRMC annual reports",
    sourceRole: "Internal Reference Source",
    sourceGroup: "Internal Institutional References",
    connectorType: "Internal Reference Only",
    status: "Internal reference only",
    confidence: "Staff verification required",
    whatItHelpsProve:
      "Institutional capacity, community benefit themes, service-line context, prior investments, workforce/capacity needs, and documented organizational priorities.",
    howItImprovesRecommendations:
      "Helps future advisors connect external opportunities to staff-approved CRMC/CRCF priorities, annual-report language, and institutional context.",
    directSourceLink: "https://www.crmchealth.org/",
    humanVerificationNote:
      "Internal/reference context only. Staff must verify the specific annual report, page, quote, and allowed use before narrative support.",
  },
];

export const futureAdvisorEvidenceExamples = [
  "High diabetes burden may strengthen community-health funding narratives.",
  "Provider shortage indicators may strengthen workforce or rural-access applications.",
  "Transportation barriers may support patient-access and telehealth requests.",
  "Economic hardship indicators may support patient-assistance and prevention programs.",
];

export const evidenceIntelligenceGovernanceNotes = [
  "Evidence sources are not grant application sources.",
  "Evidence sources support narratives but do not guarantee eligibility or award outcomes.",
  "Public evidence and intelligence must be reviewed by humans before use.",
  "Internal references are informational only unless verified by staff.",
  "No evidence source performs outreach, applications, submissions, emails, source-system writes, database writes, or external actions.",
];
