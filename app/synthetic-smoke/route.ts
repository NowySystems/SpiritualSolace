import { NextResponse } from "next/server";

const expectedRoutes = {
  public: ["/", "/admin", "/mvp", "/requester-portal", "/facility-portal", "/partner-portal"],
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
  status: "mvp-sandbox",
  buildMarker: "churchwork-integrated-mvp-v1",
  nsb: {
    sourceOfTruth: true,
    governingRule: "rules/nsb-build-flow-governance.md",
    pattern: "mvp-sandbox-safe-preview-ai-readable-smoke-demo"
  },
  expectations: {
    integratedMvpAvailable: true,
    safePreviewChainComplete: true,
    syntheticDemoAvailable: true,
    aiMapAvailable: true,
    adminHubAvailable: true,
    mvpRouteRequiresAuth: false,
    mvpRouteWritesData: false,
    previewRoutesRequireAuth: false,
    previewRoutesWriteData: false,
    demoRoutesRequireAuth: false,
    demoRoutesWriteData: false,
    realWritesBehindPilotAuth: true,
    syntheticSmokeWritesData: false,
    syntheticSmokeRequiresAuth: false
  },
  expectedRoutes,
  routeChecks: [
    { path: "/mvp", expect: "Integrated one-device sandbox: requester creates a safe request, Grandview approves, Hope Church logs outcome, requester sees approved update, and BI guardrails display." },
    { path: "/ai-map", expect: "JSON contract for BI/NSB route discovery, roles, MVP entry, safety flags, demo entry, and known issues." },
    { path: "/synthetic-smoke", expect: "JSON smoke contract for expected routes, safety assertions, known issues, MVP path, and future Playwright targets." },
    { path: "/demo/synthetic", expect: "Static synthetic actor demo that shows the workflow without auth or writes." },
    { path: "/preview", expect: "Static safe preview index with no auth, no Supabase, no writes, and links to role previews." },
    { path: "/preview/requester", expect: "Family-facing safe intake/status preview with facility-review boundary." },
    { path: "/preview/facility", expect: "Grandview review console preview showing human approval and release control." },
    { path: "/preview/partner", expect: "Partner assignment preview showing approved context only and safe report-back." },
    { path: "/preview/pilot", expect: "End-to-end pilot overview with auth separation and BI/NSB inspection targets." }
  ],
  safetyAssertions: [
    "MVP, preview, and demo routes must not collect diagnosis, treatment, medication, insurance, emergency, or medical record details.",
    "MVP, preview, and demo routes must not write data.",
    "Partner routes must show approved context only.",
    "Facility review must remain the approval boundary before partner release.",
    "Requester updates must be approved and limited.",
    "Diagnostics must stay separate from the product workflow.",
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
      "open /mvp in a real browser",
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
      "Cache-Control": "public, max-age=60, stale-while-revalidate=300"
    }
  });
}
