export type KeywordCategoryType =
  | "Funding Signal"
  | "Geography"
  | "Current Assistance Area"
  | "Strategic Growth Area"
  | "Capital / Facilities"
  | "Equipment"
  | "Workforce / Staffing"
  | "Coalition / Fiscal Agent"
  | "Donor / Private Giving"
  | "Appropriations / Legislative"
  | "SDOH / Hardship"
  | "Emergency / EMS"
  | "Telehealth / Digital Access";

export type KeywordPriority = "High" | "Medium" | "Watch";

export type KeywordCategoryGroup = {
  groupId: string;
  groupName: string;
  categoryType: KeywordCategoryType;
  priority: KeywordPriority;
  searchTerms: string[];
  exclusionTerms: string[];
  relatedCurrentAssistanceAreas: string[];
  relatedStrategicGrowthCategories: string[];
  relatedSourceCategories: string[];
  recommendedSourceTypes: string[];
  fundingRadarSearchPhrase: string;
  futureGrantsGovSearchPhrase: string;
  matchExplanationTemplate: string;
  recommendedStaffAction: string;
};

const localReviewAction = "Use locally for staff-reviewed searching and brief drafting only; do not contact sources, submit applications, or call live systems.";

export const keywordCategoryGroups: KeywordCategoryGroup[] = [
  {
    groupId: "geo-tennessee-upper-cumberland",
    groupName: "Tennessee / Upper Cumberland",
    categoryType: "Geography",
    priority: "High",
    searchTerms: ["Tennessee", "Upper Cumberland", "Cookeville", "Putnam County", "rural Tennessee", "Middle Tennessee", "service area"],
    exclusionTerms: ["Cumberland County Pennsylvania", "Cumberland Maryland"],
    relatedCurrentAssistanceAreas: ["Community Health", "Caring Hands", "Empower UC"],
    relatedStrategicGrowthCategories: ["Regional healthcare access", "Rural service area expansion", "Public/private partnership"],
    relatedSourceCategories: ["Federal/state public sources", "State and regional health foundations", "Local trusts and private local funding leads"],
    recommendedSourceTypes: ["State grant portals", "Regional foundations", "Local public agencies"],
    fundingRadarSearchPhrase: "Upper Cumberland Tennessee rural healthcare access grant",
    futureGrantsGovSearchPhrase: "Tennessee rural health Upper Cumberland healthcare access",
    matchExplanationTemplate: "Matches CRCF service-region signals and should be checked for county eligibility, rural status, and regional benefit.",
    recommendedStaffAction: localReviewAction
  },
  {
    groupId: "source-federal-grants-gov",
    groupName: "Federal / Grants.gov",
    categoryType: "Funding Signal",
    priority: "High",
    searchTerms: ["federal grant", "Grants.gov", "NOFO", "HRSA", "USDA Rural Development", "SAM.gov", "assistance listing"],
    exclusionTerms: ["closed opportunity", "forecast only without date"],
    relatedCurrentAssistanceAreas: ["Community Health", "Caring Hands", "Empower UC"],
    relatedStrategicGrowthCategories: ["Federal grant readiness", "Rural healthcare access", "Capacity building"],
    relatedSourceCategories: ["Primary public funding portals", "Federal/state public sources"],
    recommendedSourceTypes: ["Grants.gov future connector", "Federal agency notices", "Manual staff-entered federal leads"],
    fundingRadarSearchPhrase: "NOFO rural health access Tennessee nonprofit",
    futureGrantsGovSearchPhrase: "rural health access Tennessee nonprofit healthcare assistance",
    matchExplanationTemplate: "Federal source signal detected; eligibility, UEI/SAM status, match, and authorized applicant rules require human review.",
    recommendedStaffAction: "Save as future Grants.gov-ready search language only; no live API call or application action in CRCF 0.8."
  },
  {
    groupId: "signal-funding-deadline-language",
    groupName: "Funding signals: grant, RFP, RFA, NOFO, call for proposals, appropriation, application deadline",
    categoryType: "Funding Signal",
    priority: "High",
    searchTerms: ["grant", "RFP", "RFA", "NOFO", "call for proposals", "appropriation", "application deadline", "letter of intent", "LOI"],
    exclusionTerms: ["award winner announcement", "press release only"],
    relatedCurrentAssistanceAreas: ["Community Health", "Caring Hands", "Cancer Patient Assistance"],
    relatedStrategicGrowthCategories: ["Opportunity intake", "Deadline triage", "Application readiness"],
    relatedSourceCategories: ["Primary public funding portals", "Federal/state public sources", "State and regional health foundations"],
    recommendedSourceTypes: ["Public notices", "Foundation opportunity pages", "Agency procurement pages"],
    fundingRadarSearchPhrase: "healthcare access RFP RFA NOFO application deadline Tennessee",
    futureGrantsGovSearchPhrase: "healthcare access NOFO application deadline Tennessee",
    matchExplanationTemplate: "Funding mechanism or deadline language is present and should trigger eligibility/deadline confirmation before prioritization.",
    recommendedStaffAction: "Classify the mechanism, deadline risk, and owner for internal review only."
  },
  {
    groupId: "growth-rural-healthcare-access",
    groupName: "Rural healthcare access",
    categoryType: "Strategic Growth Area",
    priority: "High",
    searchTerms: ["rural healthcare access", "rural health", "access to care", "healthcare access", "underserved", "safety net", "patient navigation"],
    exclusionTerms: ["veterinary", "non-healthcare broadband only"],
    relatedCurrentAssistanceAreas: ["Community Health", "Caring Hands", "Empower UC"],
    relatedStrategicGrowthCategories: ["Rural care expansion", "Patient navigation", "Regional health equity"],
    relatedSourceCategories: ["Federal/state public sources", "State and regional health foundations", "Corporate giving and community benefit"],
    recommendedSourceTypes: ["Federal rural health programs", "State rural health sources", "Community benefit programs"],
    fundingRadarSearchPhrase: "rural healthcare access patient navigation Upper Cumberland",
    futureGrantsGovSearchPhrase: "rural healthcare access patient navigation Tennessee",
    matchExplanationTemplate: "Rural access language supports CRCF mission expansion when it improves healthcare access or reduces hardship in the service region.",
    recommendedStaffAction: localReviewAction
  },
  {
    groupId: "growth-urgent-care-clinic-expansion",
    groupName: "Urgent care / clinic expansion",
    categoryType: "Strategic Growth Area",
    priority: "High",
    searchTerms: ["urgent care", "clinic expansion", "rural clinic", "ambulatory care", "primary care access", "same-day care", "community clinic"],
    exclusionTerms: ["for-profit acquisition only"],
    relatedCurrentAssistanceAreas: ["Community Health", "Caring Hands", "Empower UC"],
    relatedStrategicGrowthCategories: ["Clinic access expansion", "Facility partnership", "Primary care capacity"],
    relatedSourceCategories: ["Federal/state public sources", "State and regional health foundations", "Corporate giving and community benefit"],
    recommendedSourceTypes: ["Capital grants", "Health foundation initiatives", "Public/private partnerships"],
    fundingRadarSearchPhrase: "rural clinic expansion urgent care access Tennessee grant",
    futureGrantsGovSearchPhrase: "rural clinic urgent care expansion Tennessee",
    matchExplanationTemplate: "Clinic expansion terms indicate strategic growth beyond current funds and need governance review for role, eligibility, and sustainability.",
    recommendedStaffAction: "Prepare an internal concept note and confirm board/staff appetite before external exploration."
  },
  {
    groupId: "capital-facilities-construction-renovation",
    groupName: "Capital / facilities / construction / renovation",
    categoryType: "Capital / Facilities",
    priority: "High",
    searchTerms: ["capital grant", "facility", "construction", "renovation", "build-out", "facility improvement", "bricks and mortar", "health facility"],
    exclusionTerms: ["residential real estate only", "unrelated commercial development"],
    relatedCurrentAssistanceAreas: ["Community Health", "Empower UC"],
    relatedStrategicGrowthCategories: ["Capital campaign", "Facility expansion", "Clinic infrastructure"],
    relatedSourceCategories: ["Primary public funding portals", "Corporate giving and community benefit", "Local trusts and private local funding leads"],
    recommendedSourceTypes: ["Capital foundations", "USDA rural facilities", "Local corporate philanthropy"],
    fundingRadarSearchPhrase: "health facility construction renovation capital grant Tennessee",
    futureGrantsGovSearchPhrase: "health facility construction renovation rural Tennessee",
    matchExplanationTemplate: "Capital/facility terms may support strategic infrastructure; confirm ownership, match, compliance, and human approval.",
    recommendedStaffAction: "Route to leadership for capital-scope review before any external step."
  },
  {
    groupId: "capital-land-building-financing",
    groupName: "Land/building/facility financing",
    categoryType: "Capital / Facilities",
    priority: "Medium",
    searchTerms: ["land acquisition", "building purchase", "facility financing", "loan guarantee", "community facilities", "real estate", "healthcare facility financing"],
    exclusionTerms: ["speculative development", "private mortgage advertising"],
    relatedCurrentAssistanceAreas: ["Community Health", "Empower UC"],
    relatedStrategicGrowthCategories: ["Facility financing", "Rural infrastructure", "Capital campaign"],
    relatedSourceCategories: ["Federal/state public sources", "Corporate giving and community benefit", "Local trusts and private local funding leads"],
    recommendedSourceTypes: ["USDA community facilities", "CDFI/community lenders", "Major gift prospects in aggregate"],
    fundingRadarSearchPhrase: "community facilities healthcare financing rural Tennessee",
    futureGrantsGovSearchPhrase: "community facilities healthcare financing Tennessee nonprofit",
    matchExplanationTemplate: "Facility financing language is strategic and high-governance; evaluate feasibility, restrictions, and long-term operating risk.",
    recommendedStaffAction: "Flag for executive review and keep as planning intelligence only."
  },
  {
    groupId: "equipment-clinical-dme-mobility",
    groupName: "Clinical equipment / DME / mobility",
    categoryType: "Equipment",
    priority: "High",
    searchTerms: ["clinical equipment", "medical equipment", "DME", "durable medical equipment", "wheelchair", "walker", "mobility", "equipment closet", "assistive device"],
    exclusionTerms: ["equipment sales pitch", "consumer coupon"],
    relatedCurrentAssistanceAreas: ["Community Health", "Home Health", "Caring Hands"],
    relatedStrategicGrowthCategories: ["Equipment access", "Home recovery", "Aging in place"],
    relatedSourceCategories: ["Corporate giving and community benefit", "Local trusts and private local funding leads", "State and regional health foundations"],
    recommendedSourceTypes: ["Corporate giving", "Medical supplier philanthropy", "Community foundations"],
    fundingRadarSearchPhrase: "medical equipment DME mobility grant Upper Cumberland",
    futureGrantsGovSearchPhrase: "durable medical equipment mobility rural health Tennessee",
    matchExplanationTemplate: "Equipment terms map to CRCF community-health support and can reduce hardship when eligibility and use rules are confirmed.",
    recommendedStaffAction: localReviewAction
  },
  {
    groupId: "workforce-staffing-capacity",
    groupName: "Workforce / staffing / capacity building",
    categoryType: "Workforce / Staffing",
    priority: "High",
    searchTerms: ["workforce", "staffing", "capacity building", "healthcare careers", "pipeline", "training", "credential", "retention", "scholarship"],
    exclusionTerms: ["job posting only", "staffing agency advertisement"],
    relatedCurrentAssistanceAreas: ["Empower UC", "Community Health"],
    relatedStrategicGrowthCategories: ["Healthcare workforce pipeline", "Regional capacity", "Training partnership"],
    relatedSourceCategories: ["State public workforce sources", "Federal/state public sources", "Corporate giving and community benefit"],
    recommendedSourceTypes: ["Workforce boards", "State labor/health programs", "Employer partnerships"],
    fundingRadarSearchPhrase: "healthcare workforce capacity building Upper Cumberland RFA",
    futureGrantsGovSearchPhrase: "healthcare workforce training capacity building Tennessee",
    matchExplanationTemplate: "Workforce terms indicate Empower UC or strategic capacity alignment; confirm applicant eligibility and partner commitments.",
    recommendedStaffAction: "Validate eligible applicant, partner roles, and reporting burden before drafting."
  },
  {
    groupId: "workforce-admin-grant-management",
    groupName: "Administrative capacity / grant management",
    categoryType: "Workforce / Staffing",
    priority: "Medium",
    searchTerms: ["administrative capacity", "grant management", "technical assistance", "planning grant", "capacity grant", "general operating", "back office"],
    exclusionTerms: ["software demo only", "consultant sales funnel"],
    relatedCurrentAssistanceAreas: ["Community Health", "Empower UC"],
    relatedStrategicGrowthCategories: ["Grant readiness", "Administrative capacity", "Implementation support"],
    relatedSourceCategories: ["State and regional health foundations", "Corporate giving and community benefit", "Local trusts and private local funding leads"],
    recommendedSourceTypes: ["Capacity-building foundations", "Technical assistance programs", "Community benefit grants"],
    fundingRadarSearchPhrase: "nonprofit healthcare grant management capacity building Tennessee",
    futureGrantsGovSearchPhrase: "healthcare nonprofit capacity building grant management Tennessee",
    matchExplanationTemplate: "Administrative-capacity terms may improve CRCF readiness without direct service expansion; confirm allowable uses.",
    recommendedStaffAction: "Document staffing, compliance, and sustainability questions for human review."
  },
  {
    groupId: "coalition-fiduciary-backbone",
    groupName: "Coalition / fiduciary / backbone organization",
    categoryType: "Coalition / Fiscal Agent",
    priority: "Medium",
    searchTerms: ["coalition", "fiscal agent", "fiduciary", "backbone organization", "collective impact", "regional partnership", "convener"],
    exclusionTerms: ["political campaign committee"],
    relatedCurrentAssistanceAreas: ["Community Health", "Empower UC", "Caring Hands"],
    relatedStrategicGrowthCategories: ["Coalition backbone", "Fiscal sponsorship", "Regional partnership"],
    relatedSourceCategories: ["Federal/state public sources", "State and regional health foundations", "Local trusts and private local funding leads"],
    recommendedSourceTypes: ["Health coalitions", "Public health agencies", "Regional foundations"],
    fundingRadarSearchPhrase: "health coalition backbone organization fiscal agent Tennessee",
    futureGrantsGovSearchPhrase: "health coalition backbone fiscal agent Tennessee rural",
    matchExplanationTemplate: "Coalition/fiscal-agent terms suggest CRCF could play a convening or fiduciary role only after leadership approval.",
    recommendedStaffAction: "Prepare role/risk questions; do not commit CRCF as fiscal agent without owner approval."
  },
  {
    groupId: "current-cancer-screening-support",
    groupName: "Cancer screening/support",
    categoryType: "Current Assistance Area",
    priority: "High",
    searchTerms: ["cancer", "screening", "mammogram", "oncology", "Pink Ribbon", "patient navigation", "treatment support", "prevention"],
    exclusionTerms: ["astrology cancer", "cancer biology research only"],
    relatedCurrentAssistanceAreas: ["Cancer Patient Assistance"],
    relatedStrategicGrowthCategories: ["Screening navigation", "Prevention outreach", "Transportation support"],
    relatedSourceCategories: ["State and regional health foundations", "Corporate giving and community benefit", "Federal/state public sources"],
    recommendedSourceTypes: ["Health foundations", "Hospital/community benefit", "Federal screening programs"],
    fundingRadarSearchPhrase: "cancer screening patient navigation Upper Cumberland grant",
    futureGrantsGovSearchPhrase: "cancer screening patient navigation Tennessee rural",
    matchExplanationTemplate: "Cancer screening/support terms map directly to CRCF cancer assistance and prevention-navigation opportunities.",
    recommendedStaffAction: localReviewAction
  },
  {
    groupId: "current-pediatric-family-support",
    groupName: "Pediatric/family support",
    categoryType: "Current Assistance Area",
    priority: "Medium",
    searchTerms: ["pediatric", "children", "child health", "family support", "kids", "youth", "caregiver", "school health"],
    exclusionTerms: ["daycare franchise", "unrelated youth sports only"],
    relatedCurrentAssistanceAreas: ["Pediatric Patient Assistance", "Caring Hands"],
    relatedStrategicGrowthCategories: ["Family hardship relief", "Child health access", "School/community partnership"],
    relatedSourceCategories: ["State and regional health foundations", "Local trusts and private local funding leads", "Corporate giving and community benefit"],
    recommendedSourceTypes: ["Child health foundations", "Local trusts", "Corporate family programs"],
    fundingRadarSearchPhrase: "pediatric family support healthcare assistance Tennessee foundation",
    futureGrantsGovSearchPhrase: "pediatric family support healthcare access Tennessee",
    matchExplanationTemplate: "Pediatric/family terms align with child-centered assistance and family hardship reduction.",
    recommendedStaffAction: localReviewAction
  },
  {
    groupId: "current-hospice-palliative-caregiver",
    groupName: "Hospice/palliative/caregiver support",
    categoryType: "Current Assistance Area",
    priority: "High",
    searchTerms: ["hospice", "palliative", "caregiver", "respite", "comfort care", "end-of-life", "bereavement", "family assistance"],
    exclusionTerms: ["funeral home advertising only"],
    relatedCurrentAssistanceAreas: ["Hospice Patient Assistance", "Home Health"],
    relatedStrategicGrowthCategories: ["Caregiver support", "Aging in place", "Compassionate care"],
    relatedSourceCategories: ["Local trusts and private local funding leads", "State and regional health foundations", "Corporate giving and community benefit"],
    recommendedSourceTypes: ["Local trusts", "Aging foundations", "Community benefit programs"],
    fundingRadarSearchPhrase: "hospice caregiver palliative support foundation Tennessee",
    futureGrantsGovSearchPhrase: "caregiver support palliative hospice Tennessee rural",
    matchExplanationTemplate: "Hospice/caregiver terms align with compassionate support and should be reviewed for service-area and expense restrictions.",
    recommendedStaffAction: localReviewAction
  },
  {
    groupId: "current-heart-cpr-aed",
    groupName: "Heart health / CPR / AED",
    categoryType: "Emergency / EMS",
    priority: "Medium",
    searchTerms: ["heart health", "cardiac", "CPR", "AED", "defibrillator", "first aid", "emergency training", "A Woman's Heart"],
    exclusionTerms: ["fitness tracker sale"],
    relatedCurrentAssistanceAreas: ["Heart Patient Assistance", "Community Health"],
    relatedStrategicGrowthCategories: ["Emergency readiness", "Prevention education", "Employer wellness"],
    relatedSourceCategories: ["Corporate giving and community benefit", "Sponsorships and employer community investment", "State and regional health foundations"],
    recommendedSourceTypes: ["Corporate sponsors", "Emergency preparedness grants", "Health foundations"],
    fundingRadarSearchPhrase: "CPR AED heart health training sponsorship Upper Cumberland",
    futureGrantsGovSearchPhrase: "CPR AED cardiac emergency training Tennessee",
    matchExplanationTemplate: "Heart/CPR/AED language supports prevention and readiness activities with sponsorship or grant potential.",
    recommendedStaffAction: localReviewAction
  },
  {
    groupId: "current-mental-behavioral-health",
    groupName: "Mental health / behavioral health",
    categoryType: "Current Assistance Area",
    priority: "High",
    searchTerms: ["mental health", "behavioral health", "counseling", "therapy", "crisis", "substance use", "trauma", "peer support"],
    exclusionTerms: ["wellness app sale only"],
    relatedCurrentAssistanceAreas: ["Mental Health Patient Assistance", "Community Health"],
    relatedStrategicGrowthCategories: ["Behavioral health access", "Crisis support", "Care navigation"],
    relatedSourceCategories: ["Federal/state public sources", "State and regional health foundations", "Corporate giving and community benefit"],
    recommendedSourceTypes: ["State behavioral health programs", "Health foundations", "Community benefit grants"],
    fundingRadarSearchPhrase: "behavioral health access rural Tennessee grant",
    futureGrantsGovSearchPhrase: "mental health behavioral health access Tennessee rural",
    matchExplanationTemplate: "Mental/behavioral health terms may fit current assistance or strategic access work; avoid private medical details.",
    recommendedStaffAction: "Use only sanitized, aggregate need descriptions and route eligibility questions to staff."
  },
  {
    groupId: "current-diabetes-chronic-disease",
    groupName: "Diabetes/chronic disease",
    categoryType: "Current Assistance Area",
    priority: "Medium",
    searchTerms: ["diabetes", "chronic disease", "A1C", "supplies", "prevention", "self-management", "hypertension", "nutrition education"],
    exclusionTerms: ["diet product marketing"],
    relatedCurrentAssistanceAreas: ["Diabetes Patient Assistance", "Community Health"],
    relatedStrategicGrowthCategories: ["Chronic disease prevention", "Self-management education", "Screening access"],
    relatedSourceCategories: ["State and regional health foundations", "Federal/state public sources", "Corporate giving and community benefit"],
    recommendedSourceTypes: ["Health foundations", "Public health programs", "Corporate wellness sponsors"],
    fundingRadarSearchPhrase: "diabetes chronic disease prevention rural Tennessee grant",
    futureGrantsGovSearchPhrase: "diabetes chronic disease self management Tennessee rural",
    matchExplanationTemplate: "Diabetes/chronic-disease terms align with prevention, education, and patient assistance if expenses are allowable.",
    recommendedStaffAction: localReviewAction
  },
  {
    groupId: "sdoh-transportation-utilities-food",
    groupName: "Transportation / utilities / food hardship",
    categoryType: "SDOH / Hardship",
    priority: "High",
    searchTerms: ["transportation assistance", "utilities", "food insecurity", "hardship", "basic needs", "gas card", "housing stability", "social determinants of health", "SDOH"],
    exclusionTerms: ["for-profit delivery coupon"],
    relatedCurrentAssistanceAreas: ["Caring Hands", "Community Health", "Cancer Patient Assistance"],
    relatedStrategicGrowthCategories: ["Hardship relief", "SDOH partnership", "Patient navigation"],
    relatedSourceCategories: ["Local trusts and private local funding leads", "Corporate giving and community benefit", "State and regional health foundations"],
    recommendedSourceTypes: ["Community foundations", "Bank community reinvestment", "Health equity funds"],
    fundingRadarSearchPhrase: "healthcare transportation utilities food hardship assistance Tennessee",
    futureGrantsGovSearchPhrase: "social determinants health transportation food assistance Tennessee",
    matchExplanationTemplate: "SDOH/hardship language supports CRCF mission when connected to healthcare access and financial relief.",
    recommendedStaffAction: "Confirm the request is aggregate and non-sensitive before preparing a match brief."
  },
  {
    groupId: "emergency-ems-ambulance-response",
    groupName: "EMS / ambulance / emergency response",
    categoryType: "Emergency / EMS",
    priority: "Medium",
    searchTerms: ["EMS", "ambulance", "emergency response", "first responder", "rescue squad", "emergency readiness", "paramedic", "AED"],
    exclusionTerms: ["police tactical equipment only"],
    relatedCurrentAssistanceAreas: ["Community Health", "Heart Patient Assistance"],
    relatedStrategicGrowthCategories: ["Emergency response capacity", "Regional readiness", "Equipment support"],
    relatedSourceCategories: ["Federal/state public sources", "Corporate giving and community benefit", "Sponsorships and employer community investment"],
    recommendedSourceTypes: ["Emergency preparedness grants", "Corporate sponsors", "State EMS programs"],
    fundingRadarSearchPhrase: "EMS ambulance emergency response equipment rural Tennessee grant",
    futureGrantsGovSearchPhrase: "EMS emergency response equipment rural Tennessee",
    matchExplanationTemplate: "Emergency/EMS terms indicate readiness or equipment opportunities that may fit community-health capacity.",
    recommendedStaffAction: localReviewAction
  },
  {
    groupId: "telehealth-digital-access",
    groupName: "Telehealth / digital access",
    categoryType: "Telehealth / Digital Access",
    priority: "Medium",
    searchTerms: ["telehealth", "telemedicine", "digital access", "remote patient monitoring", "broadband", "devices", "digital literacy", "virtual care"],
    exclusionTerms: ["consumer phone plan advertising"],
    relatedCurrentAssistanceAreas: ["Community Health", "Home Health", "Empower UC"],
    relatedStrategicGrowthCategories: ["Digital access", "Rural virtual care", "Care navigation technology"],
    relatedSourceCategories: ["Federal/state public sources", "State and regional health foundations", "Corporate giving and community benefit"],
    recommendedSourceTypes: ["Telehealth grants", "Rural broadband health programs", "Technology philanthropy"],
    fundingRadarSearchPhrase: "telehealth digital access rural healthcare Tennessee grant",
    futureGrantsGovSearchPhrase: "telehealth digital access rural healthcare Tennessee",
    matchExplanationTemplate: "Telehealth/digital-access terms may support rural access if privacy, scope, and operations are staff-approved.",
    recommendedStaffAction: "Keep as planning intelligence until technology, privacy, and operating responsibilities are approved."
  },
  {
    groupId: "donor-corporate-sponsorships",
    groupName: "Corporate giving / sponsorships",
    categoryType: "Donor / Private Giving",
    priority: "High",
    searchTerms: ["corporate giving", "sponsorship", "community benefit", "employee giving", "employer wellness", "CSR", "community investment"],
    exclusionTerms: ["private donor record", "individual donor list"],
    relatedCurrentAssistanceAreas: ["Community Health", "Heart Patient Assistance", "Cancer Patient Assistance"],
    relatedStrategicGrowthCategories: ["Sponsorship pipeline", "Employer partnership", "Community benefit"],
    relatedSourceCategories: ["Corporate giving and community benefit", "Sponsorships and employer community investment"],
    recommendedSourceTypes: ["Corporate philanthropy pages", "Employer sponsorship programs", "Hospital/community benefit partners"],
    fundingRadarSearchPhrase: "corporate giving sponsorship healthcare access Upper Cumberland",
    futureGrantsGovSearchPhrase: "not applicable private giving; keep future API phrase empty",
    matchExplanationTemplate: "Corporate/sponsorship terms indicate private giving prospects in aggregate only; do not use private donor data.",
    recommendedStaffAction: "Draft aggregate sponsorship themes for human review; no outreach automation."
  },
  {
    groupId: "donor-foundations-major-gifts-capital",
    groupName: "Private foundations / major gifts / capital campaigns",
    categoryType: "Donor / Private Giving",
    priority: "High",
    searchTerms: ["private foundation", "major gift", "capital campaign", "challenge grant", "family foundation", "community foundation", "lead gift"],
    exclusionTerms: ["private donor records", "wealth screening export"],
    relatedCurrentAssistanceAreas: ["Community Health", "Empower UC", "Caring Hands"],
    relatedStrategicGrowthCategories: ["Capital campaign", "Major gift strategy", "Strategic growth funding"],
    relatedSourceCategories: ["Local trusts and private local funding leads", "State and regional health foundations"],
    recommendedSourceTypes: ["Public foundation guidelines", "Aggregate advisor-network themes", "Community foundation programs"],
    fundingRadarSearchPhrase: "private foundation capital campaign healthcare access Tennessee",
    futureGrantsGovSearchPhrase: "not applicable private giving; keep future API phrase empty",
    matchExplanationTemplate: "Foundation/major-gift terms can support strategic growth, but private donor records must not be used or exposed.",
    recommendedStaffAction: "Use public/aggregate source intelligence only and require human approval before outreach."
  },
  {
    groupId: "appropriations-legislative-health-access",
    groupName: "Appropriations / legislative health access",
    categoryType: "Appropriations / Legislative",
    priority: "Watch",
    searchTerms: ["appropriation", "appropriations", "legislative grant", "state budget", "earmark", "community project funding", "directed grant"],
    exclusionTerms: ["campaign contribution", "lobbying service advertisement"],
    relatedCurrentAssistanceAreas: ["Community Health", "Caring Hands", "Empower UC"],
    relatedStrategicGrowthCategories: ["Appropriations readiness", "Public partnership", "Regional resource development"],
    relatedSourceCategories: ["Federal/state public sources", "Primary public funding portals"],
    recommendedSourceTypes: ["Public budget documents", "Agency legislative notices", "Staff-entered public appropriations leads"],
    fundingRadarSearchPhrase: "healthcare access appropriation rural Tennessee community project funding",
    futureGrantsGovSearchPhrase: "appropriation healthcare access rural Tennessee",
    matchExplanationTemplate: "Appropriations/legislative terms may indicate public funding pathways, but any live advocacy or external contact requires human owner approval.",
    recommendedStaffAction: "Track as internal planning intelligence only and route any legislative or public action question to leadership."
  },
  {
    groupId: "donor-endowments-planned-giving",
    groupName: "Endowments / planned giving",
    categoryType: "Donor / Private Giving",
    priority: "Watch",
    searchTerms: ["endowment", "planned giving", "legacy gift", "bequest", "charitable remainder", "estate gift", "advisor network"],
    exclusionTerms: ["private estate file", "donor record export"],
    relatedCurrentAssistanceAreas: ["Community Health", "Caring Hands", "Hospice Patient Assistance"],
    relatedStrategicGrowthCategories: ["Long-term sustainability", "Planned giving education", "Advisor referral pathways"],
    relatedSourceCategories: ["Local trusts and private local funding leads", "Sponsorships and employer community investment"],
    recommendedSourceTypes: ["Public planned-giving education", "Aggregate advisor market intelligence", "Community foundation resources"],
    fundingRadarSearchPhrase: "planned giving endowment healthcare foundation Tennessee",
    futureGrantsGovSearchPhrase: "not applicable private giving; keep future API phrase empty",
    matchExplanationTemplate: "Planned-giving/endowment terms support long-term strategy using aggregate education only, not private donor records.",
    recommendedStaffAction: "Prepare education themes for owner review; no donor-specific data or automated outreach."
  }
];

export const keywordCategoryTypes = Array.from(new Set(keywordCategoryGroups.map((group) => group.categoryType)));
export const keywordPriorities = ["High", "Medium", "Watch"] as const;
export const currentAssistanceAreaOptions = Array.from(new Set(keywordCategoryGroups.flatMap((group) => group.relatedCurrentAssistanceAreas))).sort();
export const strategicGrowthCategoryOptions = Array.from(new Set(keywordCategoryGroups.flatMap((group) => group.relatedStrategicGrowthCategories))).sort();
export const sourceCategoryOptions = Array.from(new Set(keywordCategoryGroups.flatMap((group) => group.relatedSourceCategories))).sort();

export const keywordCategorySnapshot = {
  totalGroups: keywordCategoryGroups.length,
  highPriorityGroups: keywordCategoryGroups.filter((group) => group.priority === "High").length,
  strategicGrowthGroups: keywordCategoryGroups.filter((group) => group.relatedStrategicGrowthCategories.length > 0).length,
  futureGrantsGovReadyGroups: keywordCategoryGroups.filter((group) => !group.futureGrantsGovSearchPhrase.startsWith("not applicable")).length,
  nextSetupRecommendation: "Review High-priority rural access, capital/facility, workforce, and donor/private-giving groups with staff before enabling any future live connectors."
};

export const keywordGovernanceNote = "Keyword/category groups are local/static intelligence only. No live source calls, no APIs, no scraping/crawling, no external data movement, and no patient or private donor data.";

export function findKeywordGroupsForText(text: string) {
  const normalizedText = text.toLowerCase();

  return keywordCategoryGroups
    .map((group) => ({
      group,
      matchedTerms: group.searchTerms.filter((term) => normalizedText.includes(term.toLowerCase()))
    }))
    .filter((item) => item.matchedTerms.length > 0)
    .sort((a, b) => b.matchedTerms.length - a.matchedTerms.length || (a.group.priority === "High" ? -1 : 1));
}
