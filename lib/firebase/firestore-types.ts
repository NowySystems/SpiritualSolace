export type FirestoreCollectionName =
  | 'review_items'
  | 'staff_feedback'
  | 'source_checks'
  | 'daily_briefs'
  | 'reapplication_watch'
  | 'advisor_memory_events'
  | 'source_quality_scores'
  | 'grant_outcomes';

export interface BaseMemoryRecord {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  tags?: string[];
  notes?: string;
}

export interface ReviewItemRecord extends BaseMemoryRecord {
  title: string;
  sourceName: string;
  sourceUrl: string;
  opportunityUrl?: string;
  directUrl?: string;
  sourceType: string;
  fundingCategory: string;
  agencyOrFunder: string;
  deadline?: string;
  amountSummary?: string;
  eligibilitySummary?: string;
  fitSummary?: string;
  badFitReasons?: string;
  researchFlag: boolean;
  status:
    | 'new'
    | 'reviewing'
    | 'high_priority'
    | 'bad_fit'
    | 'partner_needed'
    | 'research_partner_only'
    | 'archived';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedReviewer?: string;
  internalNotes?: string;
  lastReviewedAt?: string;
}

export interface StaffFeedbackRecord extends BaseMemoryRecord {
  reviewItemId: string;
  signal:
    | 'useful'
    | 'not_useful'
    | 'high_priority'
    | 'bad_fit'
    | 'partner_needed'
    | 'pursued'
    | 'not_pursued';
}

export interface SourceCheckRecord extends BaseMemoryRecord {
  sourceName: string;
  checkedAt: string;
  sourceStatus: 'healthy' | 'degraded' | 'offline';
  resultQuality: 'junk' | 'mixed' | 'strong_lead';
  confidence: 'low' | 'medium' | 'high';
}
