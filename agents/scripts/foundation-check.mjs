import fs from "fs";
import path from "path";

const requiredFiles = [
  "AGENTS.md",
  "FOUNDATION_WORKFLOW.md",
  "ROADMAP.md",
  "SAVE_STATE.md",
  "SECURITY_RULES.md",
  "package.json",
  "next.config.mjs",
  "tailwind.config.ts",
  "tsconfig.json",
  "app/layout.tsx",
  "app/page.tsx",
  "app/daily-brief/page.tsx",
  "app/grant-radar/page.tsx",
  "app/source-watch/page.tsx",
  "app/source-database/page.tsx",
  "app/keyword-category-manager/page.tsx",
  "app/opportunity-database/page.tsx",
  "app/review-queue/page.tsx",
  "app/proposal-scanner/page.tsx",
  "app/funding-search/page.tsx",
  "app/grants-gov-live/page.tsx",
  "app/fund-class-map/page.tsx",
  "app/donor-market-intelligence/page.tsx",
  "app/reports/page.tsx",
  "app/governance/page.tsx",
  "app/past-awards/page.tsx",
  "app/advisor-intelligence/page.tsx",
  "app/evidence-intelligence/page.tsx",
  "app/learning-loop/page.tsx",
  "app/api/grants-gov/search/route.ts",
  "app/api/grants-gov/detail/route.ts",
  "app/api/usaspending/search/route.ts",
  "components/AppShell.tsx",
  "components/UsaSpendingAwardLookup.tsx",
  "components/GrantsGovDeepSynopsis.tsx",
  "components/InfoCard.tsx",
  "components/PageHeader.tsx",
  "lib/static-data.ts",
  "lib/source-database.ts",
  "lib/keyword-registry.ts",
  "lib/opportunity-database.ts",
  "lib/proposal-scanner.ts",
  "lib/proposal-grants-match.ts",
  "lib/grants-gov.ts",
  "lib/grants-gov-detail.ts",
  "lib/usaspending.ts",
  "lib/advisor-intelligence-sources.ts",
  "lib/evidence-intelligence.ts",
  "lib/community-need-profile.ts",
  "lib/need-proof-sources.ts",
  "agents/knowledge/FOUNDATION_KNOWLEDGE.md",
  "agents/knowledge/GRANT_SOURCE_KNOWLEDGE.md",
  "agents/knowledge/FUND_CLASS_KNOWLEDGE.md",
  "agents/knowledge/KEYWORD_KNOWLEDGE.md",
  "agents/knowledge/DONOR_MARKET_KNOWLEDGE.md",
];

const requiredSaveState = "CRCF 3.2.1 — Grants.gov Forecast / Non-Actionable Opportunity Handling";
const ignoredDirs = new Set(["node_modules", ".git", ".next"]);
const textExtensions = new Set([
  ".css",
  ".js",
  ".json",
  ".jsx",
  ".md",
  ".mjs",
  ".ts",
  ".tsx",
  ".txt",
  ".yml",
  ".yaml",
]);

const internalScanExclusions = new Set([
  ".github/workflows/foundation-check.yml",
  "agents/scripts/foundation-check.mjs",
]);

let failed = false;
let softReviewCount = 0;

console.log("CRCF Funding Command Center validation starting...\n");

function fail(message) {
  console.error(message);
  failed = true;
}

function softReview(message) {
  console.warn(message);
  softReviewCount += 1;
}

for (const file of requiredFiles) {
  if (!fs.existsSync(file)) {
    fail(`Missing required file: ${file}`);
  } else {
    console.log(`Found: ${file}`);
  }
}

function read(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
}

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;

  for (const entry of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, entry);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (!ignoredDirs.has(entry)) walk(fullPath, files);
      continue;
    }

    if (textExtensions.has(path.extname(entry))) files.push(fullPath);
  }

  return files;
}

for (const file of walk(".")) {
  const normalized = file.replaceAll(path.sep, "/").replace(/^\.\//, "");
  if (internalScanExclusions.has(normalized)) continue;

  const text = read(file);
  const lines = text.split(/\r?\n/);

  lines.forEach((line, index) => {
    if (/^(<<<<<<<|>>>>>>>)($|\s)/.test(line)) {
      fail(`Forbidden unresolved conflict marker found in ${normalized}:${index + 1}`);
    }

    if (/^\s*=======$/.test(line)) {
      softReview(`Soft-review marker (======= only) found in ${normalized}:${index + 1}`);
    }

    if (/\bcodex\/update\b/.test(line)) {
      fail(`Forbidden branch-marker remnant found in ${normalized}:${index + 1}`);
    }

    if (/\bcodex_patch\b/.test(line)) {
      fail(`Forbidden patch-marker remnant found in ${normalized}:${index + 1}`);
    }
  });
}

const packageJson = JSON.parse(read("package.json") || "{}");
for (const scriptName of ["dev", "build", "start", "typecheck", "foundation:check", "validate"]) {
  if (!packageJson.scripts?.[scriptName]) fail(`Required package script missing: ${scriptName}`);
}
if ("lint" in (packageJson.scripts ?? {}) && !packageJson.scripts.lint) {
  fail("Package lint script exists but is empty.");
}

const saveStateFile = read("SAVE_STATE.md");
const roadmapFile = read("ROADMAP.md");
const staticDataFile = read("lib/static-data.ts");
const grantsGovFile = read("lib/grants-gov.ts");
const grantsGovPage = read("app/grants-gov-live/page.tsx");
const grantsGovRoute = read("app/api/grants-gov/search/route.ts");
const grantsGovDetailRoute = read("app/api/grants-gov/detail/route.ts");
const grantsGovDetailFile = read("lib/grants-gov-detail.ts");
const grantsGovDeepSynopsisComponent = read("components/GrantsGovDeepSynopsis.tsx");
const proposalScannerFile = read("lib/proposal-scanner.ts");
const proposalGrantsMatchFile = read("lib/proposal-grants-match.ts");
const opportunityDatabaseFile = read("lib/opportunity-database.ts");
const reportsPage = read("app/reports/page.tsx");
const sourceDatabaseFile = read("lib/source-database.ts");
const sourceDatabasePage = read("app/source-database/page.tsx");
const usaSpendingFile = read("lib/usaspending.ts");
const usaSpendingRoute = read("app/api/usaspending/search/route.ts");
const usaSpendingLookupComponent = read("components/UsaSpendingAwardLookup.tsx");
const pastAwardsPage = read("app/past-awards/page.tsx");
const advisorIntelligenceFile = read("lib/advisor-intelligence-sources.ts");
const evidenceIntelligenceFile = read("lib/evidence-intelligence.ts");
const evidenceIntelligencePage = read("app/evidence-intelligence/page.tsx");
const communityNeedProfileFile = read("lib/community-need-profile.ts");
const learningLoopPage = read("app/learning-loop/page.tsx");
const reviewQueuePage = read("app/review-queue/page.tsx");
const dailyBriefPage = read("app/daily-brief/page.tsx");
const governancePage = read("app/governance/page.tsx");

for (const [file, text] of [["SAVE_STATE.md", saveStateFile], ["ROADMAP.md", roadmapFile], ["lib/static-data.ts", staticDataFile]]) {
  if (!text.includes(requiredSaveState)) fail(`Required save state text missing in ${file}: ${requiredSaveState}`);
}

for (const requiredText of ["/funding-search", "/grants-gov-live", "/opportunity-database", "/review-queue", "/proposal-scanner", "/source-database", "/evidence-intelligence", "/learning-loop", "/daily-brief"]) {
  if (!staticDataFile.includes(requiredText)) fail(`Navigation/route text missing in static data: ${requiredText}`);
}

for (const requiredText of ["Review Queue + Internal Actions Shell", "No real opportunities have been added to review yet.", "Future Internal Actions", "Add to Review Queue", "Mark High Priority", "Mark Bad Fit", "Mark Partner Needed", "Mark Research / Partner Only", "Create Internal Brief", "Copy Summary", "Print Brief", "Add Internal Notes", "Assign Staff Reviewer", "Set Review Deadline", "Save Source Lead for Review", "External Actions Disabled", "No applications", "No submissions", "No emails", "No funder outreach", "No source-system writes", "Action Status", "controlled internal server-side queue writes only"]) {
  if (!reviewQueuePage.includes(requiredText)) fail(`Review Queue page validation text missing: ${requiredText}`);
}

for (const [file, text] of [["app/funding-search/page.tsx", read("app/funding-search/page.tsx")], ["app/proposal-scanner/page.tsx", read("app/proposal-scanner/page.tsx")]]) {
  if (!text.includes("Future internal action: Add to Review Queue")) fail(`Future Review Queue action text missing in ${file}`);
}

for (const requiredText of ["PageHeader", "fundingRadarSnapshot", "sampleReports", "sourceManagerSnapshot", "keywordCategoryGroups", "keywordCategorySnapshot", "opportunityDatabaseSnapshot", "Funding Radar Snapshot", "Source Manager Snapshot", "Keyword & Category Snapshot", "Opportunity Database Snapshot", "Source Database Snapshot"]) {
  if (!reportsPage.includes(requiredText)) fail(`Reports page validation text missing: ${requiredText}`);
}

for (const requiredText of ["Advisor Learning Loop", "The system should get smarter through structured staff feedback and", "real outcomes, not guessing.", "useful / not useful", "high priority", "bad fit", "partner needed", "pursued / not pursued", "won / lost / pending", "source returned junk", "source returned strong lead", "reapplication window found", "eligibility changed", "deadline missed", "staff notes", "persistent storage", "review history", "source-check history", "staff feedback", "outcome tracking", "scheduled jobs for daily checks", "CRCF/GrantView", "Bastion", "Avora", "Learning must be explainable.", "Learning must be auditable.", "Human review required.", "No uncontrolled external actions.", "No sensitive data exposure.", "No automatic applications/outreach."]) {
  if (!learningLoopPage.includes(requiredText)) fail(`Learning Loop page validation text missing: ${requiredText}`);
}

for (const requiredText of ["Learning Loop", "Future memory layer will improve recommendations using staff feedback, source quality, outcomes, and daily source changes."]) {
  if (!staticDataFile.includes(requiredText) && !read("app/page.tsx").includes(requiredText)) fail(`Learning Loop dashboard/navigation validation text missing: ${requiredText}`);
}

for (const requiredText of ["Daily Funding Brief shell", "No daily brief has been generated yet", "High-fit opportunities", "Deadline-soon opportunities", "Reopened prior grants", "Evidence needed", "Partner-needed opportunities", "Grants.gov", "USAspending", "Real source-backed results only", "No fake opportunities", "No outreach, submissions, or emails", "Human review required", "future memory layer"]) {
  if (!dailyBriefPage.includes(requiredText)) fail(`Daily Brief page validation text missing: ${requiredText}`);
}

for (const requiredText of ["Daily Funding Brief", "Daily Funding Brief Snapshot", "No fake results are shown"]) {
  if (!staticDataFile.includes(requiredText) && !reportsPage.includes(requiredText)) fail(`Daily Funding Brief report/dashboard validation text missing: ${requiredText}`);
}

for (const requiredText of ["Daily Funding Brief is read-only", "does not apply, submit, email, contact funders, or write to source systems"]) {
  if (!staticDataFile.includes(requiredText) && !governancePage.includes(requiredText)) fail(`Daily Funding Brief governance validation text missing: ${requiredText}`);
}

for (const requiredText of ["sourceDatabaseRecords", "sourceDatabaseSnapshot", "Grants.gov Search", "Lead only — verify on source page.", "Structured source — still requires human review.", "Manual or subscription source — do not scrape credentials or private records."]) {
  if (!sourceDatabaseFile.includes(requiredText)) fail(`Source database validation text missing: ${requiredText}`);
}

for (const requiredText of ["Source/Site Database Shell", "Read-only planning registry", "Connector type", "Open direct source link", "does not connect, crawl, scrape, log in, submit, email"]) {
  if (!sourceDatabasePage.includes(requiredText)) fail(`Source Database page validation text missing: ${requiredText}`);
}

for (const requiredText of ["buildUsaSpendingSearchBody", "parseUsaSpendingResponse", "Entity / recipient lookup", "Topic / funding pattern lookup", "Past Award / Payout Source", "Not an application source", "Human verification required"]) {
  if (!usaSpendingFile.includes(requiredText)) fail(`USAspending helper validation text missing: ${requiredText}`);
}

if (!usaSpendingRoute.includes("https://api.usaspending.gov/api/v2/search/spending_by_award/") || !usaSpendingRoute.includes('cache: "no-store"')) {
  fail("USAspending API route must keep read-only no-store live search behavior.");
}

for (const requiredText of ["Public Award Intelligence", "/api/usaspending/search", "Cookeville Regional Medical Center Foundation", "nursing apprenticeship Tennessee", "No public federal award matches found", "USAspending results are public federal award records"]) {
  if (!usaSpendingLookupComponent.includes(requiredText)) fail(`USAspending lookup component validation text missing: ${requiredText}`);
}

for (const requiredText of ["UsaSpendingAwardLookup", "USAspending.gov is a Past Award / Payout Source", "not an application source"]) {
  if (!pastAwardsPage.includes(requiredText)) fail(`Past Awards USAspending validation text missing: ${requiredText}`);
}

for (const requiredText of ["USAspending.gov", "Connected", "Used to compare similar past awards"]) {
  if (!advisorIntelligenceFile.includes(requiredText)) fail(`Advisor intelligence USAspending validation text missing: ${requiredText}`);
}

for (const requiredText of ["Evidence / Need-Proof Source", "Census ACS", "CDC PLACES", "County Health Rankings & Roadmaps", "HRSA shortage/rural-health data", "UCHRA Community Needs Assessment", "CRMC annual reports", "Not an application source", "Used to strengthen recommendation quality and narrative support"]) {
  if (!sourceDatabaseFile.includes(requiredText)) fail(`Evidence source database validation text missing: ${requiredText}`);
}

for (const requiredText of ["Evidence / Need-Proof Connectors", "What evidence intelligence means", "These sources help explain why a project, population, or healthcare need may deserve funding", "They do not provide grants to apply for", "No fake statistics", "Open direct source link", "Future advisor examples"]) {
  if (!evidenceIntelligencePage.includes(requiredText)) fail(`Evidence Intelligence page validation text missing: ${requiredText}`);
}

for (const requiredText of ["evidenceIntelligenceSources", "evidenceSourceGroups", "Census ACS", "CDC PLACES", "County Health Rankings & Roadmaps", "HRSA shortage/rural-health data", "UCHRA community needs assessment", "CRMC annual reports", "Evidence sources are not grant application sources"]) {
  if (!evidenceIntelligenceFile.includes(requiredText)) fail(`Evidence Intelligence helper validation text missing: ${requiredText}`);
}

for (const requiredText of ["communityNeedProfileShell", "Cookeville", "Putnam County", "Upper Cumberland", "Tennessee", "Shell only — no live data values", "dataValue: null"]) {
  if (!communityNeedProfileFile.includes(requiredText)) fail(`Community Need Profile helper validation text missing: ${requiredText}`);
}

for (const requiredText of ["OpportunityRecord", "opportunityOriginTypes", "humanReviewRequired", "future-api"]) {
  if (!opportunityDatabaseFile.includes(requiredText)) fail(`Opportunity database validation text missing: ${requiredText}`);
}

for (const requiredText of ["OpportunityNoticeSummary", "Structured opportunity fields were detected", "opportunityDatabaseDraft", "external-opportunity"]) {
  if (!proposalScannerFile.includes(requiredText)) fail(`Proposal scanner validation text missing: ${requiredText}`);
}

for (const requiredText of ["buildGrantsGovSearchBody", "parseGrantsGovResponse", "getResearchFlag", "principal investigator", "clinical trial", "human subjects research", "Research / Academic Grant — Partner Only", "Clinical trial / NIH-style research — Low priority by default", "Research-informed delivery / outreach", "community health", "rural access", "equipment", "workforce", "telehealth"]) {
  if (!grantsGovFile.includes(requiredText)) fail(`Grants.gov helper validation text missing: ${requiredText}`);
}

if (!grantsGovRoute.includes("https://api.grants.gov/v1/api/search2") || !grantsGovRoute.includes('cache: "no-store"')) {
  fail("Grants.gov API route must keep read-only no-store live search behavior.");
}

if (!grantsGovDetailRoute.includes("https://api.grants.gov/v1/api/fetchOpportunity") || !grantsGovDetailRoute.includes('cache: "no-store"')) {
  fail("Grants.gov detail route must keep read-only no-store detail fetch behavior.");
}

for (const requiredText of ["normalizeGrantsGovDetail", "likelyCrcfRole", "Partner / Coalition Participant", "Grant-Writing / Coordination Support", "Research-informed delivery / outreach", "NOFO / attachment link — staff should verify on source"]) {
  if (!grantsGovDetailFile.includes(requiredText)) fail(`Grants.gov detail helper validation text missing: ${requiredText}`);
}

for (const requiredText of ["Build Deep Synopsis", "/api/grants-gov/detail", "Deep Synopsis Summary", "Source Links", "Nothing is saved"]) {
  if (!grantsGovDeepSynopsisComponent.includes(requiredText)) fail(`Grants.gov deep synopsis component validation text missing: ${requiredText}`);
}

for (const requiredText of ["Open Grants.gov source", "Research filter", "read-only", "No results are saved", "GrantsGovDeepSynopsis"]) {
  if (!grantsGovPage.includes(requiredText)) fail(`Grants.gov Live page validation text missing: ${requiredText}`);
}

for (const requiredText of ["selectGrantsGovMatchSearchTerms", "rankGrantsGovMatches", "dedupeGrantsGovOpportunities", "rural health", "healthcare access", "cancer screening", "Research / Partner Only", "Strong Match"]) {
  if (!proposalGrantsMatchFile.includes(requiredText)) fail(`Proposal-to-Grants match helper validation text missing: ${requiredText}`);
}

for (const requiredText of ["Find Grants.gov Matches", "/api/grants-gov/search", "Live Grants.gov Matches", "Best Match", "local priority points", "Score bands", "How scoring works", "not an eligibility", "not win probability", "GrantsGovDeepSynopsis"]) {
  if (!read("app/proposal-scanner/page.tsx").includes(requiredText)) fail(`Proposal Scanner live match validation text missing: ${requiredText}`);
}

const implementationRiskPatterns = [
  {
    pattern: new RegExp("from\\s+[\"'].*(quick" + "books|donor" + "perfect)|fetch\\([^)]*(quick" + "books|donor" + "perfect)", "i"),
    label: "restricted finance/donor-system implementation",
    codeOnly: true,
  },
  {
    pattern: new RegExp("nodemailer|sendgrid|mailgun|smtpTransport|send" + "Mail\\(", "i"),
    label: "automated email implementation",
  },
  {
    pattern: /api[_-]?key\s*=|private[_-]?key\s*=|client[_-]?secret\s*=/i,
    label: "possible committed credential",
  },
];

for (const file of walk(".")) {
  const normalized = file.replaceAll(path.sep, "/").replace(/^\.\//, "");
  if (internalScanExclusions.has(normalized)) continue;

  const text = read(file);
  const isCode = /\.(ts|tsx|js|jsx|mjs)$/.test(normalized);

  for (const { pattern, label, codeOnly } of implementationRiskPatterns) {
    if (codeOnly && !isCode) continue;
    if (pattern.test(text)) {
      fail(`Forbidden sensitive integration pattern found (${label}) in ${normalized}`);
    }
  }
}

if (softReviewCount > 0) {
  console.warn(`\nSoft-review findings: ${softReviewCount}. Please verify manually.`);
}

if (failed) {
  console.error("\nValidation failed.");
  process.exit(1);
}

console.log("\nValidation passed.");
