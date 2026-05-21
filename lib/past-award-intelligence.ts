export type PastAwardLookupField =
  | "legal_name"
  | "alternate_name"
  | "ein"
  | "address"
  | "related_entity"
  | "geography"
  | "project_term";

export const pastAwardLookupProfile = {
  legalName: "Cookeville Regional Medical Center Foundation",
  ein: "20-1550666",
  alternateName: "Cookeville Regional Charitable Foundation",
  address: "1 Medical Center Blvd, Cookeville, TN 38501",
  relatedEntity: "Cookeville Regional Medical Center",
  region: "Cookeville / Putnam County / Upper Cumberland / Tennessee",
};

export const futurePastAwardFields = [
  "Prior public award found",
  "Amount awarded",
  "Agency/funder",
  "Recipient type",
  "Matched by legal name / EIN / address / related entity / project term",
  "Reapplication cycle",
  "Eligibility changed?",
  "Human verification required",
] as const;
