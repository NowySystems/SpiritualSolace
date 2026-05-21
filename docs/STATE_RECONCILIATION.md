# CRCF 3.4b — State/Version Reconciliation

Date: 2026-05-20  
Method: repository text scan for targeted phase/version strings.

## Baseline Statement (Current Truth)

- **Current baseline:** CRCF 3.4c — Activate First Helper Checks.
- **Current concern:** helper checks are mostly planned, not active.
- **Next recommended phase:** CRCF 3.4c — Activate First Helper Checks.
- **Then:** CRCF 3.5 — Source Database Real Status Layout.

## Reference Classification Matrix

### 1.4a
- Found in `ROADMAP.md` completed history.
- Classification: **docs-only historical**.

### 2.5
- Found in `docs/FIRESTORE_SCHEMA.md` historical/planning context.
- Classification: **historical**.

### 2.6
- Found in `docs/FEDERAL_CONNECTORS.md` and `docs/SOURCE_DISCOVERY_AGENT.md` context.
- Classification: **historical**.

### 2.7
- Found in federal/healthcare connector history docs.
- Classification: **historical**.

### 3.1
- Found in roadmap completed list and source-history docs.
- Classification: **historical**.

### 3.2.1
- Found in `ROADMAP.md` and `SAVE_STATE.md` as validator compatibility baseline.
- Classification: **compatibility-required**.

### 3.2.2
- No reference found in current scan.
- Classification: **historical (not present)**.

### 3.2.3
- Found in `ROADMAP.md` completed list.
- Classification: **docs-only historical**.

### 3.2.4
- Found in `FOUNDATION_WORKFLOW.md` and helper plan UX lock context.
- Classification: **docs-only historical**.

### 3.2.5
- Found in `docs/HELPER_AGENT_PLAN.md` plan phase header.
- Classification: **should be removed/hidden later** (once helper activation moves to implemented state docs).

### 3.3
- Found in helper plan as outdated "next implementation phase".
- Classification: **user-facing stale** in planning docs relative to current 3.4a baseline.

### 3.4
- Found in roadmap completed history and helper plan historical sequence.
- Classification: **historical**.

### 3.4a
- Found in `ROADMAP.md` and `SAVE_STATE.md` as current baseline.
- Classification: **current**.

## Reconciliation Notes

- `ROADMAP.md` and `SAVE_STATE.md` already align to 3.4a current state.
- `FOUNDATION_WORKFLOW.md` is stale on "Current State" heading (still 3.2.4 language).
- `docs/HELPER_AGENT_PLAN.md` contains stale forward-order language (3.3 as next implementation phase) that should be reframed as legacy planning context.

## User-Facing Stale Risk

- Stale phase text exists in documentation.
- No evidence in this audit that user UI is currently showing those stale phase labels as product-facing content.
- Status: **no confirmed active user-facing stale state**, but helper-based UI wording checks are recommended next.
