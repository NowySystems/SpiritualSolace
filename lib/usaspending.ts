export type UsaSpendingLookupMode = "Entity / recipient lookup" | "Topic / funding pattern lookup";

export type UsaSpendingAward = {
  id: string;
  awardId: string;
  recipientName: string;
  recipientLocation: string;
  awardingAgency: string;
  fundingAgency: string;
  awardAmount: string;
  rawAwardAmount: number | null;
  awardDatePeriod: string;
  awardType: string;
  assistanceListing: string;
  description: string;
  placeOfPerformance: string;
  sourceUrl: string;
  matchReason: string;
  confidenceNote: string;
  relevanceSummary: string;
  normalized: {
    awardId: string;
    recipientName: string;
    recipientLocation: string;
    agency: string;
    subAgency: string;
    awardAmount: string;
    awardDate: string;
    awardType: string;
    assistanceListingNumber: string;
    description: string;
    directUrl: string;
    relevanceSummary: string;
  };
};

export type UsaSpendingSearchResponse = {
  keyword: string;
  lookupMode: UsaSpendingLookupMode;
  hitCount: number;
  awards: UsaSpendingAward[];
  sourceNotice: string;
  warning: string;
};

const entitySignals = [
  "cookeville regional",
  "charitable foundation",
  "medical center",
  "foundation",
  "20-1550666",
  "201550666",
  "ein",
];

const federalAssistanceAwardTypeCodes = ["02", "03", "04", "05"];
const usaSpendingSourceRole = "Past Award / Payout Source";
const usaSpendingApplicationWarning = "Not an application source";

const usaSpendingAwardFields = [
  "Award ID",
  "Recipient Name",
  "Start Date",
  "End Date",
  "Award Amount",
  "Awarding Agency",
  "Awarding Sub Agency",
  "Funding Agency",
  "Funding Sub Agency",
  "Award Type",
  "Description",
  "CFDA Number",
  "CFDA Title",
];

export function getUsaSpendingLookupMode(keyword: string): UsaSpendingLookupMode {
  const normalized = keyword.toLowerCase();
  return entitySignals.some((signal) => normalized.includes(signal))
    ? "Entity / recipient lookup"
    : "Topic / funding pattern lookup";
}

function buildUsaSpendingBody(keyword: string, fields: string[]) {
  return {
    filters: {
      keywords: [keyword],
      award_type_codes: federalAssistanceAwardTypeCodes,
    },
    fields,
    page: 1,
    limit: 10,
    sort: "Award Amount",
    order: "desc",
    subawards: false,
  };
}

export function buildUsaSpendingSearchBody(keyword: string) {
  return buildUsaSpendingBody(keyword, usaSpendingAwardFields);
}

export function buildUsaSpendingFallbackSearchBody(keyword: string) {
  return buildUsaSpendingBody(keyword, [
    "Award ID",
    "Recipient Name",
    "Start Date",
    "End Date",
    "Award Amount",
    "Awarding Agency",
    "Awarding Sub Agency",
    "Funding Agency",
    "Funding Sub Agency",
    "Award Type",
  ]);
}

function asText(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function pickText(raw: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    const value = asText(raw[key]);
    if (value) return value;
  }
  return "";
}

function pickNumber(raw: Record<string, unknown>, keys: string[]): number | null {
  for (const key of keys) {
    const value = raw[key];
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string" && value.trim()) {
      const parsed = Number(value.replace(/[$,]/g, ""));
      if (Number.isFinite(parsed)) return parsed;
    }
  }
  return null;
}

function formatCurrency(value: number | null): string {
  if (value === null) return "Amount not shown";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

function formatPeriod(startDate: string, endDate: string): string {
  if (startDate && endDate) return `${startDate} to ${endDate}`;
  if (startDate) return `Starts ${startDate}`;
  if (endDate) return `Ends ${endDate}`;
  return "Award period not shown";
}

function getAssistanceListing(raw: Record<string, unknown>): string {
  const number = pickText(raw, ["CFDA Number", "cfda_number", "Assistance Listing Number", "aln"]);
  const title = pickText(raw, ["CFDA Title", "cfda_title", "Assistance Listing Title", "aln_title"]);

  if (number && title) return `${number} — ${title}`;
  return number || title || "Assistance listing not shown";
}

function getAwardUrl(raw: Record<string, unknown>, awardId: string): string {
  const internalId = pickText(raw, ["generated_internal_id", "Generated Internal ID", "internal_id", "id"]);
  const urlId = internalId || awardId;
  return urlId ? `https://www.usaspending.gov/award/${encodeURIComponent(urlId)}` : "https://www.usaspending.gov/";
}

function getMatchReason(keyword: string, lookupMode: UsaSpendingLookupMode): string {
  if (lookupMode === "Entity / recipient lookup") {
    return `Matched public federal award records against organization/entity search text: “${keyword}”. Related-entity and partner-name review may still be needed.`;
  }

  return `Matched public federal award records against topic/funding-pattern search text: “${keyword}”. Use as pattern intelligence, not proof of CRCF eligibility.`;
}

export function normalizeUsaSpendingAward(
  raw: Record<string, unknown>,
  keyword: string,
  lookupMode: UsaSpendingLookupMode,
): UsaSpendingAward {
  const awardId = pickText(raw, ["Award ID", "award_id", "generated_unique_award_id", "piid", "fain", "uri"]);
  const startDate = pickText(raw, ["Start Date", "start_date", "period_of_performance_start_date"]);
  const endDate = pickText(raw, ["End Date", "end_date", "period_of_performance_current_end_date"]);
  const rawAwardAmount = pickNumber(raw, ["Award Amount", "award_amount", "total_obligation", "generated_pragmatic_obligation"]);
  const awardingAgency = pickText(raw, ["Awarding Agency", "awarding_agency", "awarding_toptier_agency_name"]);
  const awardingSubAgency = pickText(raw, ["Awarding Sub Agency", "awarding_sub_agency", "awarding_subtier_agency_name"]);
  const fundingAgency = pickText(raw, ["Funding Agency", "funding_agency", "funding_toptier_agency_name"]);
  const fundingSubAgency = pickText(raw, ["Funding Sub Agency", "funding_sub_agency", "funding_subtier_agency_name"]);

  return {
    id:
      pickText(raw, ["generated_internal_id", "id"]) ||
      awardId ||
      `${keyword}-${pickText(raw, ["Recipient Name", "recipient_name", "legal_entity_name"])}-${rawAwardAmount ?? "amount-not-shown"}`,
    awardId: awardId || "Award ID not shown",
    recipientName: pickText(raw, ["Recipient Name", "recipient_name", "recipient", "legal_entity_name"]) || "Recipient not shown",
    recipientLocation:
      pickText(raw, ["Recipient Location", "recipient_location", "recipient_location_text", "legal_entity_city_name"]) ||
      "Recipient location not shown",
    awardingAgency: [awardingAgency, awardingSubAgency].filter(Boolean).join(" / ") || "Awarding agency not shown",
    fundingAgency: [fundingAgency, fundingSubAgency].filter(Boolean).join(" / ") || "Funding agency not shown",
    awardAmount: formatCurrency(rawAwardAmount),
    rawAwardAmount,
    awardDatePeriod: formatPeriod(startDate, endDate),
    awardType: pickText(raw, ["Award Type", "award_type", "type_description"]) || "Award type not shown",
    assistanceListing: getAssistanceListing(raw),
    description: pickText(raw, ["Description", "description", "award_description"]) || "Description not shown in search result.",
    placeOfPerformance:
      pickText(raw, ["Place of Performance", "place_of_performance", "place_of_performance_location"]) ||
      "Place of performance not shown in search result.",
    sourceUrl: getAwardUrl(raw, awardId),
    matchReason: getMatchReason(keyword, lookupMode),
    relevanceSummary: "Past-award/advisor intelligence only. Not an open application source.",
    confidenceNote:
      "Public federal award record from USAspending.gov. Human verification required; matches can appear under related entities, pass-through partners, agencies, hospitals, universities, counties, or other lead applicants.",
    normalized: {
      awardId: awardId || "Award ID not shown",
      recipientName: pickText(raw, ["Recipient Name", "recipient_name", "recipient", "legal_entity_name"]) || "Recipient not shown",
      recipientLocation:
        pickText(raw, ["Recipient Location", "recipient_location", "recipient_location_text", "legal_entity_city_name"]) ||
        "Recipient location not shown",
      agency: awardingAgency || "Awarding agency not shown",
      subAgency: awardingSubAgency || "Awarding sub-agency not shown",
      awardAmount: formatCurrency(rawAwardAmount),
      awardDate: startDate || endDate || "Award date not shown",
      awardType: pickText(raw, ["Award Type", "award_type", "type_description"]) || "Award type not shown",
      assistanceListingNumber: pickText(raw, ["CFDA Number", "cfda_number", "Assistance Listing Number", "aln"]) || "Not shown",
      description: pickText(raw, ["Description", "description", "award_description"]) || "Description not shown in search result.",
      directUrl: getAwardUrl(raw, awardId),
      relevanceSummary: "Past-award/advisor intelligence only. Not an open application source.",
    },
  };
}

export function parseUsaSpendingResponse(keyword: string, data: unknown): UsaSpendingSearchResponse {
  const lookupMode = getUsaSpendingLookupMode(keyword);
  const payload = data as { results?: unknown[]; page_metadata?: { total?: unknown }; metadata?: { total?: unknown } };
  const results = Array.isArray(payload?.results) ? payload.results : [];

  return {
    keyword,
    lookupMode,
    hitCount: Number(payload?.page_metadata?.total ?? payload?.metadata?.total ?? results.length ?? 0),
    awards: results
      .filter((result): result is Record<string, unknown> => Boolean(result) && typeof result === "object")
      .map((result) => normalizeUsaSpendingAward(result, keyword, lookupMode)),
    sourceNotice:
      `${usaSpendingApplicationWarning}. ${usaSpendingSourceRole}. Live read-only USAspending.gov API lookup. Results are public-record intelligence only and are not saved, submitted, emailed, or written to any source system.`,
    warning:
      "USAspending results are public federal award records. They do not include every private, state, local, pass-through, or foundation grant. Staff must verify before relying on a match.",
  };
}
