export type CommunityNeedProfileGeography =
  | "Cookeville"
  | "Putnam County"
  | "Upper Cumberland"
  | "Tennessee";

export type CommunityNeedIndicatorCategory =
  | "Rural-health indicators"
  | "Workforce shortage indicators"
  | "Poverty/economic indicators"
  | "Healthcare burden indicators"
  | "Transportation/access indicators"
  | "Internal reference context";

export type CommunityNeedIndicatorShell = {
  id: string;
  category: CommunityNeedIndicatorCategory;
  label: string;
  intendedEvidenceSource: string;
  status: "Not connected yet" | "Staff reference only";
  dataValue: null;
  citationUrl: string;
  staffVerificationRequired: true;
  useInAdvisorReasoning: string;
};

export type CommunityNeedProfileShell = {
  profileName: string;
  geographies: CommunityNeedProfileGeography[];
  status: "Shell only — no live data values";
  evidenceUse: string;
  indicators: CommunityNeedIndicatorShell[];
  governanceNote: string;
};

export const communityNeedProfileShell: CommunityNeedProfileShell = {
  profileName: "CRCF / CRMC Upper Cumberland Community Need Profile",
  geographies: ["Cookeville", "Putnam County", "Upper Cumberland", "Tennessee"],
  status: "Shell only — no live data values",
  evidenceUse:
    "Future normalized profile for rural-health, workforce shortage, poverty/economic, transportation/access, healthcare-burden, and verified internal-reference context.",
  indicators: [
    {
      id: "profile-poverty-economic",
      category: "Poverty/economic indicators",
      label: "Poverty, income, disability, household, age, and transportation-access indicators",
      intendedEvidenceSource: "Census ACS",
      status: "Not connected yet",
      dataValue: null,
      citationUrl: "https://www.census.gov/programs-surveys/acs/data/data-via-api.html",
      staffVerificationRequired: true,
      useInAdvisorReasoning:
        "Explain economic hardship and access barriers when reviewing prevention, assistance, and rural-health opportunities.",
    },
    {
      id: "profile-healthcare-burden",
      category: "Healthcare burden indicators",
      label: "Chronic disease, diabetes, obesity, smoking, mental-health, preventive-health, and access-burden indicators",
      intendedEvidenceSource: "CDC PLACES",
      status: "Not connected yet",
      dataValue: null,
      citationUrl: "https://www.cdc.gov/places/tools/data-portal.html",
      staffVerificationRequired: true,
      useInAdvisorReasoning:
        "Explain public-health burden and urgency for community-health, screening, prevention, and access narratives.",
    },
    {
      id: "profile-county-health-context",
      category: "Healthcare burden indicators",
      label: "County-level health comparisons, social/economic factors, morbidity, mortality, and access context",
      intendedEvidenceSource: "County Health Rankings & Roadmaps",
      status: "Not connected yet",
      dataValue: null,
      citationUrl: "https://www.countyhealthrankings.org/health-data/methodology-and-sources/data-documentation",
      staffVerificationRequired: true,
      useInAdvisorReasoning:
        "Compare county-level need context with funding priorities and historical funding patterns.",
    },
    {
      id: "profile-provider-shortage",
      category: "Workforce shortage indicators",
      label: "HPSA/MUA, provider shortage, rural-health designation, and healthcare access-gap indicators",
      intendedEvidenceSource: "HRSA shortage/rural-health data",
      status: "Not connected yet",
      dataValue: null,
      citationUrl: "https://data.hrsa.gov/topics/health-workforce/shortage-areas",
      staffVerificationRequired: true,
      useInAdvisorReasoning:
        "Support workforce, provider-capacity, rural-access, and underserved-area funding-fit explanations.",
    },
    {
      id: "profile-internal-reference-context",
      category: "Internal reference context",
      label: "UCHRA needs assessment, CRMC annual reports, prior applications, support letters, and workforce/capacity references",
      intendedEvidenceSource: "Staff-verified internal institutional references",
      status: "Staff reference only",
      dataValue: null,
      citationUrl: "#",
      staffVerificationRequired: true,
      useInAdvisorReasoning:
        "Align external evidence with staff-approved internal context without importing private records or inventing statistics.",
    },
  ],
  governanceNote:
    "This shell intentionally contains no invented values. Staff must verify every indicator, geography, data vintage, and source citation before use in grant narratives or recommendations.",
};
