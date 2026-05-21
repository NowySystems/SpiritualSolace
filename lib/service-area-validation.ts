export const serviceAreaStatuses = [
  "upper_cumberland_confirmed",
  "tennessee_statewide",
  "rural_tennessee_likely",
  "national_tennessee_eligible",
  "major_city_limited",
  "unclear_staff_verify",
  "likely_not_applicable"
] as const;

export type ServiceAreaStatus = (typeof serviceAreaStatuses)[number];

export type ServiceAreaValidation = {
  serviceAreaStatus: ServiceAreaStatus;
  serviceAreaSummary: string;
  upperCumberlandEligible: boolean;
  tennesseeEligible: boolean;
  localRestrictionRisk: "low" | "medium" | "high";
  staffVerificationRequired: boolean;
  reason: string;
};

export function validateServiceArea(sourceText: string): ServiceAreaValidation {
  const normalized = sourceText.toLowerCase();

  if (normalized.includes("upper cumberland") || normalized.includes("putnam") || normalized.includes("cookeville")) {
    return {
      serviceAreaStatus: "upper_cumberland_confirmed",
      serviceAreaSummary: "Upper Cumberland service area is explicitly included.",
      upperCumberlandEligible: true,
      tennesseeEligible: true,
      localRestrictionRisk: "low",
      staffVerificationRequired: false,
      reason: "Source text explicitly references Upper Cumberland geographies."
    };
  }

  if (normalized.includes("statewide") && normalized.includes("tennessee")) {
    return {
      serviceAreaStatus: "tennessee_statewide",
      serviceAreaSummary: "Statewide Tennessee coverage appears explicit.",
      upperCumberlandEligible: true,
      tennesseeEligible: true,
      localRestrictionRisk: "low",
      staffVerificationRequired: false,
      reason: "Source text includes Tennessee statewide language."
    };
  }

  if (normalized.includes("rural tennessee") || (normalized.includes("rural") && normalized.includes("tennessee"))) {
    return {
      serviceAreaStatus: "rural_tennessee_likely",
      serviceAreaSummary: "Rural Tennessee language suggests probable regional applicability.",
      upperCumberlandEligible: true,
      tennesseeEligible: true,
      localRestrictionRisk: "medium",
      staffVerificationRequired: true,
      reason: "Rural Tennessee scope is likely but requires notice-level confirmation."
    };
  }

  if (normalized.includes("national") || normalized.includes("united states") || normalized.includes("u.s.")) {
    return {
      serviceAreaStatus: "national_tennessee_eligible",
      serviceAreaSummary: "National scope appears to include Tennessee entities.",
      upperCumberlandEligible: true,
      tennesseeEligible: true,
      localRestrictionRisk: "medium",
      staffVerificationRequired: true,
      reason: "National opportunities typically include Tennessee, but constraints vary."
    };
  }

  if (normalized.includes("nashville") || normalized.includes("memphis") || normalized.includes("knoxville") || normalized.includes("chattanooga")) {
    return {
      serviceAreaStatus: "major_city_limited",
      serviceAreaSummary: "Language suggests major-city targeting with limited regional coverage.",
      upperCumberlandEligible: false,
      tennesseeEligible: true,
      localRestrictionRisk: "high",
      staffVerificationRequired: true,
      reason: "Source appears city-limited rather than Upper Cumberland inclusive."
    };
  }

  if (!normalized.trim()) {
    return {
      serviceAreaStatus: "unclear_staff_verify",
      serviceAreaSummary: "No usable service-area text was provided.",
      upperCumberlandEligible: false,
      tennesseeEligible: false,
      localRestrictionRisk: "high",
      staffVerificationRequired: true,
      reason: "Missing service-area information requires manual validation."
    };
  }

  return {
    serviceAreaStatus: "likely_not_applicable",
    serviceAreaSummary: "Service area does not clearly support CRCF Tennessee regional scope.",
    upperCumberlandEligible: false,
    tennesseeEligible: false,
    localRestrictionRisk: "high",
    staffVerificationRequired: true,
    reason: "No explicit Tennessee/Upper Cumberland alignment found in source text."
  };
}
