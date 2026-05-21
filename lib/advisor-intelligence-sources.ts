export type IntelligenceGroup =
  | "Past Awards / Payout Intelligence"
  | "Evidence Intelligence"
  | "Program Catalog Context"
  | "Research Pattern Intelligence"
  | "Internal Reference Sources";

export type IntelligenceSourceCard = {
  id: string;
  sourceName: string;
  sourceRole: string;
  group: IntelligenceGroup;
  connectorType: string;
  status: "Planned" | "Not Connected" | "Connected";
  confidence: "High" | "Medium" | "Staff verification required";
  whatItTeaches: string;
  improvesRecommendationsBy: string;
  directSourceLink: string;
  humanVerificationNote: string;
};

export const advisorIntelligenceSources: IntelligenceSourceCard[] = [
  {
    id: "ai-usaspending",
    sourceName: "USAspending.gov",
    sourceRole: "Advisor Intelligence Source + Past Award / Payout Source",
    group: "Past Awards / Payout Intelligence",
    connectorType: "True API",
    status: "Connected",
    confidence: "High",
    whatItTeaches: "Public federal award history, award amounts, typical recipients, recipient types, agency/funder history, and funding patterns.",
    improvesRecommendationsBy: "Used to compare similar past awards, award amounts, agencies, recipient types, and funding patterns so staff can judge direct-applicant, partner-led, or low-fit paths before drafting.",
    directSourceLink: "https://www.usaspending.gov/",
    humanVerificationNote: "Connected read-only API. Not an application source. Public award intelligence must be human-verified before decisions.",
  },
  {
    id: "ai-census-acs",
    sourceName: "Census ACS",
    sourceRole: "Evidence / Need-Proof Source",
    group: "Evidence Intelligence",
    connectorType: "True API / Structured Source",
    status: "Planned",
    confidence: "High",
    whatItTeaches: "Community poverty, income, disability, transportation, household, age, and related demographic indicators.",
    improvesRecommendationsBy: "Supports stronger need narratives and helps explain why a funding lane may align to CRCF service-region needs.",
    directSourceLink: "https://www.census.gov/programs-surveys/acs",
    humanVerificationNote: "Not an application source. Evidence supports narratives but does not prove eligibility.",
  },
  {
    id: "ai-cdc-places",
    sourceName: "CDC PLACES",
    sourceRole: "Evidence / Need-Proof Source",
    group: "Evidence Intelligence",
    connectorType: "True API / Structured Source",
    status: "Planned",
    confidence: "Medium",
    whatItTeaches: "Local chronic-disease burden and public-health risk signals.",
    improvesRecommendationsBy: "Adds health-burden context to explain urgency and fit for prevention, screening, and access opportunities.",
    directSourceLink: "https://www.cdc.gov/places/",
    humanVerificationNote: "Not an application source. Use as supporting context only with staff review.",
  },

  {
    id: "ai-county-health-rankings",
    sourceName: "County Health Rankings & Roadmaps",
    sourceRole: "Evidence / Need-Proof Source",
    group: "Evidence Intelligence",
    connectorType: "Download / Bulk File shell",
    status: "Planned",
    confidence: "Medium",
    whatItTeaches: "County-level health comparisons, mortality/morbidity context, access barriers, social/economic indicators, and healthcare environment context.",
    improvesRecommendationsBy: "Adds county-level need context so future advisors can explain why healthcare burden and social determinants may make an opportunity more important.",
    directSourceLink: "https://www.countyhealthrankings.org/health-data/methodology-and-sources/data-documentation",
    humanVerificationNote: "Not an application source. Staff must verify data year, measure definitions, and county comparison language before narrative use.",
  },
  {
    id: "ai-hrsa-shortage",
    sourceName: "HRSA shortage/rural-health data",
    sourceRole: "Evidence / Need-Proof Source",
    group: "Evidence Intelligence",
    connectorType: "Structured public data shell",
    status: "Planned",
    confidence: "Medium",
    whatItTeaches: "HPSA/MUA shortage areas, provider shortages, rural-health designations, and healthcare access gaps.",
    improvesRecommendationsBy: "Supports rural-access, provider-shortage, workforce, and healthcare-capacity reasoning for future fit explanations.",
    directSourceLink: "https://data.hrsa.gov/topics/health-workforce/shortage-areas",
    humanVerificationNote: "Not an application source. Shortage designations can affect eligibility and must be confirmed directly by staff before use.",
  },
  {
    id: "ai-sam-assistance",
    sourceName: "SAM.gov Assistance Listings",
    sourceRole: "Program Catalog Source",
    group: "Program Catalog Context",
    connectorType: "True API / Structured Source",
    status: "Planned",
    confidence: "Medium",
    whatItTeaches: "Federal assistance listing purpose, objectives, and broad eligibility context.",
    improvesRecommendationsBy: "Helps explain program intent and whether CRCF should review directly or as a partner.",
    directSourceLink: "https://sam.gov/content/assistance-listings",
    humanVerificationNote: "Program catalog source. Not the primary place to apply.",
  },
  {
    id: "ai-nih-reporter",
    sourceName: "NIH RePORTER",
    sourceRole: "Advisor Intelligence Source + Research Pattern Intelligence",
    group: "Research Pattern Intelligence",
    connectorType: "True API / Structured Source",
    status: "Planned",
    confidence: "Medium",
    whatItTeaches: "NIH/research-heavy award patterns, likely institutions, and project-type trends.",
    improvesRecommendationsBy: "Helps classify research-heavy opportunities as direct-fit, partner-needed, or low-priority for CRCF.",
    directSourceLink: "https://reporter.nih.gov/",
    humanVerificationNote: "Research pattern intelligence only; not a primary CRCF application source.",
  },
  {
    id: "ai-uchra-needs-assessment",
    sourceName: "UCHRA community needs assessment",
    sourceRole: "Internal Reference Source",
    group: "Internal Reference Sources",
    connectorType: "Internal Reference Only",
    status: "Not Connected",
    confidence: "Staff verification required",
    whatItTeaches: "Regional community needs, poverty barriers, transportation/access issues, and Upper Cumberland service context when staff provides approved references.",
    improvesRecommendationsBy: "Aligns public evidence with staff-verified local context and reduces overclaiming in future narratives.",
    directSourceLink: "https://www.uchra.org/",
    humanVerificationNote: "Staff-provided references only. No automatic imports, private data prompts, outreach, or external writes.",
  },
  {
    id: "ai-crmc-annual-reports",
    sourceName: "CRMC annual reports",
    sourceRole: "Internal Reference Source",
    group: "Internal Reference Sources",
    connectorType: "Internal Reference Only",
    status: "Not Connected",
    confidence: "Staff verification required",
    whatItTeaches: "Institutional capacity, community benefit themes, service-line context, prior investments, workforce/capacity needs, and documented organizational priorities.",
    improvesRecommendationsBy: "Connects opportunity review to staff-approved CRMC/CRCF priorities and institutional context.",
    directSourceLink: "https://www.crmchealth.org/",
    humanVerificationNote: "Staff must verify the specific report, page, quote, and approved use before narrative support.",
  },
  {
    id: "ai-internal-reference",
    sourceName: "CRCF Internal Past Applications",
    sourceRole: "Internal Reference Source",
    group: "Internal Reference Sources",
    connectorType: "Internal Reference Only",
    status: "Not Connected",
    confidence: "Staff verification required",
    whatItTeaches: "Historical internal application language, outcomes, and institutional context when staff provides approved records.",
    improvesRecommendationsBy: "Prevents repeated low-fit pursuits and supports clearer internal next-step guidance.",
    directSourceLink: "#",
    humanVerificationNote: "Staff-provided references only. No automatic imports or external writes.",
  },
];
