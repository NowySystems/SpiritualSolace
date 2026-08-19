import { NextResponse } from "next/server";

const expectedRoutes = {
  public: ["/", "/requester-login", "/facility-login", "/partner-login"],
  internalBackend: ["/admin", "/mvp", "/requester-portal", "/facility-portal", "/partner-portal"],
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
  status: "pilot-mvp-navigation-recovery-baseline",
  buildMarker: "churchwork-aug19-recovery-baseline-v1",
  recovery: {
    date: "2026-08-19",
    base: "ee0a256",
    summary: "Recovered main to the last green Supabase-client auth build, preserved portal-first public landing and clean role login entrances, and excluded the failed diagnostic patch series from active main."
  },
  visibility: {
    publicRoutes: expectedRoutes.public,
    backendRoutesRequireInternalAccess: true,
    summary: "Public landing points to requester, facility, and partner login entrances. Backend, MVP sandbox, previews, demos, diagnostics, and BI routes are internal-only surfaces."
  },
  nsb: {
    sourceOfTruth: true,
    governingRule: "rules/nsb-build-flow-governance.md",
    pattern: "role-login-public-entry-private-backend-ai-readable-smoke"
  },
  expectations: {
    publicLandingHasThreeRoleLogins: true,
    publicLandingHasNoBackendLinks: true,
    roleLoginEntrancesAvailable: true,
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
    syntheticSmokeWritesData: false
  },
  expectedRoutes,
  routeChecks: [
    { path: "/", expect: "Public landing with Requester Login, Facility Login, and Partner Login only. No admin, MVP, preview, demo, or diagnostic links." },
    { path: "/requester-login", expect: "Public requester login entrance. Requesters may create an account." },
    { path: "/facility-login", expect: "Public facility login entrance. Facility accounts are invited or approved, not public self-create." },
    { path: "/partner-login", expect: "Public partner login entrance. Partner accounts are invited or approved, not public self-create." },
    { path: "/internal-access", expect: "Private access screen for internal ChurchWork backend routes." },
    { path: "/admin", expect: "Internal backend command center with links to pilot MVP, role logins, public site, and BI/test surfaces." },
    { path: "/mvp", expect: "Internal integrated one-device sandbox: requester creates a safe request, facility approves, partner logs outcome, and requester sees approved update." },
    { path: "/ai-map", expect: "Internal JSON contract for BI/NSB route discovery, roles, safety flags, and current synthetic checks." },
    { path: "/synthetic-smoke", expect: "Internal JSON smoke contract for expected routes, safety assertions, known issues, and future Playwright targets." }
  ],
  safetyAssertions: [
    "Public landing must expose only requester, facility, and partner login entrances.",
    "Public landing must not expose admin, MVP, demo, preview, diagnostics, Cole, or Sam language.",
    "Backend, MVP, preview, demo, diagnostics, pilot, and legacy role portal paths must require internal access.",
    "Requester account creation may be public; facility and partner account creation must not be public.",
    "MVP, preview, and demo routes must not collect diagnosis, treatment, medication, insurance, emergency, or medical record details.",
    "MVP, preview, and demo routes must not write data.",
    "Partner routes must show approved context only.",
    "Facility review must remain the approval boundary before partner release.",
    "Requester updates must be approved and limited.",
    "Diagnostics must stay separate from the public product workflow."
  ],
  currentSyntheticChecks: [
    "Public landing has exactly the role login destinations needed for the pilot.",
    "Role login entrances render without the internal backend gate.",
    "Requester login exposes account creation; facility and partner logins do not.",
    "Internal backend routes redirect to /internal-access.",
    "Desktop and mobile layouts avoid horizontal overflow."
  ],
  knownIssues: [
    { key: "role-login-auth-fetch-failed", severity: "high", status: "open", summary: "Role login screens use the Supabase client auth bridge, but sign-in can still return fetch failed. Next fix should be small and tested from this green recovery baseline." },
    { key: "pilot-supabase-auth-fetch", severity: "high", status: "under-diagnosis", summary: "/pilot sign-in can return Failed to fetch; /pilot-auth-check and /pilot-auth-server-check are diagnostic paths." },
    { key: "chrome-install-event-suppressed", severity: "medium", status: "open", summary: "Android Chrome may suppress beforeinstallprompt even when manifest, icon, and service worker checks pass." }
  ],
  nextSyntheticUserUpgrade: {
    target: "Role-auth Playwright runner",
    capabilities: [
      "open / and verify only role login links are exposed",
      "open /requester-login, /facility-login, and /partner-login",
      "verify backend routes require /internal-access",
      "after real auth, execute requester submission, facility approval, partner outcome, and requester status checks",
      "capture screenshots and video",
      "record console errors",
      "record failed network requests",
      "compare rendered output to /ai-map, /synthetic-smoke, and NSB rules"
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
