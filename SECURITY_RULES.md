# Security Rules

## Hard Safety Rules (Always Enforced)

- No PHI.
- No patient names.
- No SSNs.
- No private donor records.
- No credentials committed to the repo.
- No automatic outreach.
- No submissions.
- No source-system writes.
- No QuickBooks writes.
- No DonorPerfect writes.
- Human review required before any external action.

## Data Classification

### Allowed in MVP

- Public grant opportunities
- Public funder information
- Public agency pages
- Public corporate giving pages
- Public foundation information
- Foundation mission/program descriptions
- Aggregated impact metrics
- Sample/fake proposal text
- Manually entered non-sensitive notes

### Not Allowed in MVP

- Patient names
- PHI
- SSNs
- DOBs
- private financial details
- immigration status
- private donor records
- DonorPerfect exports
- QuickBooks exports
- bank data
- passwords
- API keys
- credentials

## System Rule

The project must remain internal-only and read-only until the human owner explicitly approves an integration phase.

## Conflict/Validation Guardrails

- Hard stop only on actual unresolved conflict markers: `<<<<<<<` and `>>>>>>>`.
- Standalone `=======` is soft-review only and requires human review context.
- Conflict recovery uses full-file canonical replacement for guarded files.
- Guardrail/tooling changes should be isolated from feature/tool PRs.
