import { NextResponse } from "next/server";

const expectedRoutes = {
  public: ["/"],
  internalSandbox: ["/admin", "/mvp", "/requester-portal", "/facility-portal", "/partner-portal"],
  preview: ["/preview", "/preview/admin", "/preview/requester", "/preview/facility", "/preview/partner", "/preview/pilot"],
  demo: ["/demo/synthetic"],
  diagnostics: ["/ai-map", "/synthetic-smoke", "/pwa-check", "/pwa-reset", "/pilot-auth-check", "/pilot-auth-server-check"],
  gated: ["/pilot"]
};

const smokeContract = {
  schema: "nowysystems.synthetic-smoke.v1",
  project: "ChurchWork",
  repo: "LL-COLE-J/SpiritualSolace",
  productFamily: "NowySystems",
  status: "private-mvp-sandbox",
  buildMarker: "churchwork-private-mvp-v1",
  visibility: {
    publicRoutes: ["/"],
    internalAccessRequired: true,
    summary: "Admin, MVP sandbox, role portals, previews, diagnostics, and pilot tools are internal-only surfaces."
  },
  nsb: {
    sourceOfTruth: true,
    governingRule: "rules/nsb-build-flow-governance.md",
    pattern: "private-mvp-sandbox-safe-preview-ai-readable-smoke-demo"
  },
  expectations: {
    publicLandingOnly: true,
    internalAccessGateAvailable: true,
    integratedMvpAvailable: true,
    safePreviewChainComplete: true,
    syntheticDemoAvailable: true,
    aiMapAvailable: true,
    adminHubAvailable: true,
    mvpRouteRequiresInternalAccess: true,
    mvpRouteWritesData: false,
    previewRoutesRequireInternalAccess: true,
    previewRoutesWriteData: false,
    demoRoutesRequireInternalAccess: true,
    demoRoutesWriteData: false,
    realWritesBehindPilotAuth: true,
    syntheticSmokeWritesData: false
  },
  expectedRoutes,
  routeChecks: [
    { path: "/", expect: "Public landing page only. No public links into admin, MVP sandbox, role portals, diagnostics, or previews." },
    { path: "/internal-access", expect: "Private access key screen for internal ChurchWork review routes." },
    { path: "/mvp", expect: "Internal integrated one-device sandbox: requester creates a safe request, Grandview approves, Hope Church logs outcome, requester sees approved update, and BI guardrails display." },
    { path: "/ai-map", expect: "Internal JSON contract for BI/NSB route discovery, roles, MVP entry, safety flags, demo entry, and known issues." },
    { path: "/synthetic-smoke", expect: "Internal JSON smoke contract for expected routes, safety assertions, known issues, MVP path, and future Playwright targets." },
    { path: "/demo/synthetic", expect: "Internal synthetic actor demo that shows the workflow without auth or writes." },
    { path: "/preview", expect: "Internal safe preview index with no Supabase writes and links to role previews." }
  ],
  safetyAssertions: [
    "Only / is public.",
    "Admin, MVP, preview, demo, diagnostics, pilot, and role portal routes must require internal access.",
    "MVP, preview, and demo routes must not collect diagnosis, treatment, medication, insurance, emergency, or medical record details.",
    "MVP, preview, and demo routes must not write data.",
    "Partner routes must show approved context only.",
    "Facility review must remain the approval boundary before partner release.",
    "Requester updates must be approved and limited.",
    "Diagnostics must stay separate from the public product workflow.",
    "The synthetic demo is staged playback, not a real auth/session runner.",
    "The MVP sandbox is an interactive local-state prototype, not production persistence."
  ],
  knownIssues: [
    { key: "chrome-install-event-suppressed", severity: "medium", status: "open", summary: "Android Chrome may suppress beforeinstallprompt even when manifest, icon, and service worker checks pass." },
    { key: "pilot-supabase-auth-fetch", severity: "high", status: "under-diagnosis", summary: "/pilot sign-in can return Failed to fetch; /pilot-auth-check and /pilot-auth-server-check are diagnostic paths." },
    { key: "text-reader-client-shell-limitation", severity: "low", status: "known-limitation", summary: "Non-browser text readers may see Preparing ChurchWork before client-rendered portal UI appears. Playwright will resolve this later." }
  ],
  nextSyntheticUserUpgrade: {
    target: "Playwright runner",
    capabilities: [
      "open /mvp with internal access in a real browser",
      "execute requester submission, facility approval, partner outcome, and requester status checks",
      "run the same path as /demo/synthetic against rendered screens",
      "capture screenshots and video",
      "read rendered DOM text",
      "record console errors",
      "record failed network requests",
      "compare rendered output to /ai-map and /synthetic-smoke"
    ]
  },
  generatedAt: "static-build-time"
};

export function GET() {
  return NextResponse.json(smokeContract, {
    headers: {
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow, noarchive"
    }
  });
}
