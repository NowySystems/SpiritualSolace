export type FundingSearchProfileId =
  | "crcf-general-funding"
  | "rural-healthcare-access"
  | "medical-equipment-capital"
  | "patient-assistance"
  | "cancer-screening-prevention"
  | "mental-health-substance-use"
  | "diabetes-heart-chronic-disease"
  | "healthcare-workforce"
  | "transportation-access"
  | "hospice-home-health"
  | "pediatrics-family-support"
  | "community-health";

export type FundingSearchProfile = {
  id: FundingSearchProfileId;
  label: string;
  defaultKeywords: string[];
  sourceCategories: string[];
  fundingCategories: string[];
  badFitFilters: string[];
};

export const SEARCH_ALL_PROFILE_ID = "crcf-general-funding";

export const fundingSearchProfiles: FundingSearchProfile[] = [
  { id: "crcf-general-funding", label: "CRCF General Funding", defaultKeywords: ["rural health", "community health", "patient access", "nonprofit healthcare"], sourceCategories: ["Federal Opportunity Sources", "Rural / Healthcare / Human Services Sources"], fundingCategories: ["Federal grants", "Community health", "Patient assistance"], badFitFilters: ["individual-only awards", "student-only scholarships", "for-profit-only programs", "expired opportunities"] },
  { id: "rural-healthcare-access", label: "Rural Healthcare Access", defaultKeywords: ["rural health", "healthcare access", "clinic access", "underserved"], sourceCategories: ["Federal Opportunity Sources", "Rural / Healthcare / Human Services Sources"], fundingCategories: ["Rural health", "Access to care"], badFitFilters: ["geography mismatch", "non-healthcare programs"] },
  { id: "medical-equipment-capital", label: "Medical Equipment / Capital", defaultKeywords: ["medical equipment", "capital", "facility", "infrastructure"], sourceCategories: ["Federal Opportunity Sources", "Federal Program Catalog Sources"], fundingCategories: ["Capital / Facilities", "Equipment funding"], badFitFilters: ["research-only programs with no partner path", "small scholarship-only programs"] },
  { id: "patient-assistance", label: "Patient Assistance", defaultKeywords: ["patient assistance", "financial assistance", "navigation", "support services"], sourceCategories: ["Federal Opportunity Sources", "Rural / Healthcare / Human Services Sources"], fundingCategories: ["Patient assistance", "Community support"], badFitFilters: ["for-profit-only programs", "student-only scholarships"] },
  { id: "cancer-screening-prevention", label: "Cancer / Screening / Prevention", defaultKeywords: ["cancer screening", "prevention", "community outreach", "early detection"], sourceCategories: ["Federal Opportunity Sources", "Rural / Healthcare / Human Services Sources"], fundingCategories: ["Cancer", "Screening", "Prevention"], badFitFilters: ["non-healthcare programs", "expired opportunities"] },
  { id: "mental-health-substance-use", label: "Mental Health / Substance Use", defaultKeywords: ["mental health", "substance use", "behavioral health", "recovery"], sourceCategories: ["Rural / Healthcare / Human Services Sources", "Federal Opportunity Sources"], fundingCategories: ["Behavioral health", "Substance use"], badFitFilters: ["capital-only programs without service component", "for-profit-only programs"] },
  { id: "diabetes-heart-chronic-disease", label: "Diabetes / Heart / Chronic Disease", defaultKeywords: ["diabetes", "heart disease", "chronic disease", "prevention"], sourceCategories: ["Federal Opportunity Sources", "Rural / Healthcare / Human Services Sources"], fundingCategories: ["Chronic disease", "Prevention"], badFitFilters: ["non-healthcare programs", "student-only scholarships"] },
  { id: "healthcare-workforce", label: "Healthcare Workforce", defaultKeywords: ["healthcare workforce", "training", "staffing", "clinical education"], sourceCategories: ["Federal Opportunity Sources", "Rural / Healthcare / Human Services Sources"], fundingCategories: ["Workforce", "Training"], badFitFilters: ["research-only programs with no partner path", "wrong applicant type"] },
  { id: "transportation-access", label: "Transportation Access", defaultKeywords: ["transportation", "access barriers", "non-emergency medical transportation"], sourceCategories: ["Federal Opportunity Sources", "Rural / Healthcare / Human Services Sources"], fundingCategories: ["Transportation", "Access"], badFitFilters: ["general infrastructure unrelated to healthcare", "for-profit-only programs"] },
  { id: "hospice-home-health", label: "Hospice / Home Health", defaultKeywords: ["hospice", "home health", "palliative care", "care at home"], sourceCategories: ["Federal Opportunity Sources", "Rural / Healthcare / Human Services Sources"], fundingCategories: ["Hospice", "Home health"], badFitFilters: ["student-only", "non-healthcare programs"] },
  { id: "pediatrics-family-support", label: "Pediatrics / Family Support", defaultKeywords: ["pediatrics", "family support", "maternal child health", "child wellness"], sourceCategories: ["Federal Opportunity Sources", "Rural / Healthcare / Human Services Sources"], fundingCategories: ["Pediatrics", "Family support"], badFitFilters: ["for-profit-only programs", "research-only without partner path"] },
  { id: "community-health", label: "Community Health", defaultKeywords: ["community health", "health equity", "prevention", "outreach"], sourceCategories: ["Federal Opportunity Sources", "Rural / Healthcare / Human Services Sources"], fundingCategories: ["Community health", "Prevention"], badFitFilters: ["non-healthcare programs", "expired opportunities"] }
];

export function getFundingSearchProfile(id: FundingSearchProfileId) {
  return fundingSearchProfiles.find((profile) => profile.id === id) ?? fundingSearchProfiles[0];
}
