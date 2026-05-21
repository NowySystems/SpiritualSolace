import { getFirestoreAdminDb } from "@/lib/firebase/admin";
import { type ReviewItemRecord } from "@/lib/firebase/firestore-types";

const MAX_SHORT_TEXT = 280;
const MAX_SUMMARY_TEXT = 600;
const MAX_NOTES_TEXT = 1200;

const STATUS_OPTIONS: ReviewItemRecord["status"][] = [
  "new",
  "reviewing",
  "high_priority",
  "bad_fit",
  "partner_needed",
  "research_partner_only",
  "archived",
];

const PRIORITY_OPTIONS: ReviewItemRecord["priority"][] = ["low", "medium", "high", "urgent"];

function sanitizeText(value: unknown, maxLength: number): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim().replace(/\s+/g, " ");
  if (!trimmed) return undefined;
  return trimmed.slice(0, maxLength);
}

function requireText(value: unknown, field: string, maxLength: number): string {
  const sanitized = sanitizeText(value, maxLength);
  if (!sanitized) {
    throw new Error(`[review-queue] ${field} is required.`);
  }
  return sanitized;
}

function parseStatus(value: unknown, researchFlag: boolean): ReviewItemRecord["status"] {
  if (value && STATUS_OPTIONS.includes(value as ReviewItemRecord["status"])) {
    return value as ReviewItemRecord["status"];
  }
  return researchFlag ? "research_partner_only" : "new";
}

function parsePriority(value: unknown, researchFlag: boolean): ReviewItemRecord["priority"] {
  if (value && PRIORITY_OPTIONS.includes(value as ReviewItemRecord["priority"])) {
    return value as ReviewItemRecord["priority"];
  }
  return researchFlag ? "low" : "medium";
}

export function validateReviewItemPayload(payload: unknown): Omit<ReviewItemRecord, "id" | "createdAt" | "updatedAt"> {
  const body = typeof payload === "object" && payload ? (payload as Record<string, unknown>) : {};

  const sourceName = requireText(body.sourceName, "sourceName", MAX_SHORT_TEXT);
  const sourceUrl = requireText(body.sourceUrl, "sourceUrl", MAX_SUMMARY_TEXT);
  const opportunityUrl = sanitizeText(body.opportunityUrl, MAX_SUMMARY_TEXT);
  const directUrl = sanitizeText(body.directUrl, MAX_SUMMARY_TEXT);

  if (!sourceUrl && !opportunityUrl && !directUrl) {
    throw new Error("[review-queue] source proof required: provide sourceUrl, opportunityUrl, or directUrl.");
  }

  const researchFlag = Boolean(body.researchFlag);

  return {
    title: requireText(body.title, "title", MAX_SHORT_TEXT),
    sourceName,
    sourceUrl,
    opportunityUrl,
    directUrl,
    sourceType: requireText(body.sourceType, "sourceType", MAX_SHORT_TEXT),
    fundingCategory: requireText(body.fundingCategory, "fundingCategory", MAX_SHORT_TEXT),
    agencyOrFunder: requireText(body.agencyOrFunder, "agencyOrFunder", MAX_SHORT_TEXT),
    deadline: sanitizeText(body.deadline, MAX_SHORT_TEXT),
    amountSummary: sanitizeText(body.amountSummary, MAX_SUMMARY_TEXT),
    eligibilitySummary: sanitizeText(body.eligibilitySummary, MAX_SUMMARY_TEXT),
    fitSummary: sanitizeText(body.fitSummary, MAX_SUMMARY_TEXT),
    badFitReasons: sanitizeText(body.badFitReasons, MAX_SUMMARY_TEXT),
    researchFlag,
    status: parseStatus(body.status, researchFlag),
    priority: parsePriority(body.priority, researchFlag),
    assignedReviewer: sanitizeText(body.assignedReviewer, MAX_SHORT_TEXT),
    internalNotes: sanitizeText(body.internalNotes, MAX_NOTES_TEXT),
    createdBy: sanitizeText(body.createdBy, MAX_SHORT_TEXT),
    lastReviewedAt: sanitizeText(body.lastReviewedAt, MAX_SHORT_TEXT),
  };
}

export async function createReviewItem(payload: unknown) {
  const validated = validateReviewItemPayload(payload);
  const now = new Date().toISOString();
  const db = await getFirestoreAdminDb();
  const ref = db.collection("review_items").doc();

  const record: ReviewItemRecord = {
    id: ref.id,
    createdAt: now,
    updatedAt: now,
    ...validated,
  };

  await ref.set(record);
  return record;
}
