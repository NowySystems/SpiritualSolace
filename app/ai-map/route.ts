import { NextResponse } from "next/server";

const aiMap = {
  schema: "nowysystems.ai-map.v1",
  project: {
    name: "ChurchWork",
    repo: "LL-COLE-J/SpiritualSolace",
    productFamily: "NowySystems",
    status: "pilot-mvp-navigation",
    description: "Spiritual-care operations workflow for requesters, facilities, partner care teams, and internal operators."
  },
  nsb: {
    sourceOfTruth: true,
    governingRule: "rules/nsb-build-flow-governance.md",
    ruleSummary: "Reusable build patterns, preview routes, AI-readable surfaces, workflow conventions, guardrails, and cross-project architecture ideas flow through NSB first."
  },
  visibility: {
    publicRoutes: ["/", "/requester-login", "/facility-login", "/partner-login"],
    publicLandingRule: "The public landing page should direct users only to the three role login entrances.",
    backendRoutesRequireInternalAccess: true,
    note: "Backend, MVP sandbox, preview, demo, diagnostics, and BI inspection routes are internal review surfaces, not public demo pages."
  },
  safety: {
    roleLoginEntrancesAvailable: true,
    safePreviewAvailable: true,
    mvpSandboxAvailable: true,
    previewRoutesWriteData: false,
    mvpRouteWritesData: false,
    containsMedicalWorkflow: false,
    allowsEmergencyWorkflow: false,
    allowsOpenChat: false,
    allowsUncontrolledPartnerRouting: false,
    notes: [
      "Public users choose requester, facility, or partner login from the landing page.",
      "ChurchWork /mvp is an internal integrated one-device sandbox that demonstrates the real operating flow without persistence.",
      "Preview, demo, and MVP sandbox routes do not perform Supabase writes.",
      "No medical records, diagnosis, symptoms, medications, treatment details, insurance, or emergency information should be collected."
    ]
  },
  roles: [
    { key: "requester", label: "Requester / family user", purpose: "Role login, structured spiritual-care intake, consent-aware status visibility, and approved updates." },
    { key: "facility", label: "Facility reviewer", purpose: "Role login, request review, consent/sharing control, and partner release control." },
    { key: "partner", label: "Partner care team", purpose: "Role login, approved assignment visibility, coordination, and safe non-medical report-back." },
    { key: "operator", label: "Internal operator", purpose: "Internal backend command center, MVP navigation, public-site link, diagnostics, and BI/test surfaces." }
  ],
  routes: {
    public: [
      { path: "/", label: "Public landing page", authRequired: false },
      { path: "/requester-login", label: "Requester login entrance", authRequired: false },
      { path: "/facility-login", label: "Facility login entrance", authRequired: false },
      { path: "/partner-login", label: "Partner login entrance", authRequired: false }
    ],
    internalBackend: [
      { path: "/admin", label: "Internal backend command center", internalAccessRequired: true },
      { path: "/mvp", label: "Integrated MVP sandbox", internalAccessRequired: true, writesData: false },
      { path: "/requester-portal", label: "Legacy/internal requester portal path", internalAccessRequired: true },
      { path: "/facility-portal", label: "Legacy/internal facility portal path", internalAccessRequired: true },
      { path: "/partner-portal", label: "Legacy/internal partner portal path", internalAccessRequired: true }
    ],
    preview: [
      { path: "/preview", label: "Preview index", internalAccessRequired: true, writesData: false },
      { path: "/preview/admin", label: "Admin preview", internalAccessRequired: true, writesData: false },
      { path: "/preview/requester", label: "Requester preview", internalAccessRequired: true, writesData: false },
      { path: "/preview/facility", label: "Facility preview", internalAccessRequired: true, writesData: false },
      { path: "/preview/partner", label: "Partner preview", internalAccessRequired: true, writesData: false },
      { path: "/preview/pilot", label: "Pilot flow preview", internalAccessRequired: true, writesData: false }
    ],
    demo: [
      { path: "/demo/synthetic", label: "Synthetic super demo", internalAccessRequired: true, writesData: false }
    ],
    gated: [
      { path: "/pilot", label: "Gated pilot sign-in path", internalAccessRequired: true, authRequired: true, writesData: true }
    ],
    diagnostics: [
      { path: "/pwa-check", label: "PWA install diagnostics", internalAccessRequired: true },
      { path: "/pwa-reset", label: "PWA browser state reset", internalAccessRequired: true },
      { path: "/pilot-auth-check", label: "Supabase browser auth diagnostics", internalAccessRequired: true },
      { path: "/pilot-auth-server-check", label: "Supabase server auth diagnostics", internalAccessRequired: true },
      { path: "/ai-map", label: "AI-readable project map", internalAccessRequired: true },
      { path: "/synthetic-smoke", label: "Synthetic smoke contract", internalAccessRequired: true }
    ]
  },
  currentSyntheticChecks: [
    "Public landing has three role login links and no backend/demo links.",
    "Role login entrances are reachable without the internal backend gate.",
    "Internal backend, MVP, AI map, and smoke contract require internal access.",
    "Desktop and mobile runs must have no horizontal overflow."
  ],
  knownIssues: [
    { key: "role-login-access-code-not-full-auth", status: "open", severity: "high", summary: "Requester, facility, and partner login entrances still use the pilot access-code gate; replace with real role auth for pilot MVP." },
    { key: "pilot-supabase-auth-fetch", status: "under-diagnosis", severity: "high", summary: "/pilot sign-in can return Failed to fetch; auth diagnostic routes exist to isolate browser, server, env, and upstream issues." },
    { key: "chrome-install-event-suppressed", status: "open", severity: "medium", summary: "Manifest/icons/service worker can pass while Android Chrome still suppresses beforeinstallprompt." }
  ],
  biContract: {
    canBeScannedByBI: true,
    preferredEntry: "/ai-map",
    preferredPublicEntry: "/",
    preferredRoleLoginEntries: ["/requester-login", "/facility-login", "/partner-login"],
    preferredMvpEntry: "/mvp",
    preferredSmokeEntry: "/synthetic-smoke",
    compareAgainstNSB: true,
    internalAccessRequiredForBackend: true,
    mvpSandboxReady: true,
    syntheticSmokeReady: true,
    syntheticUserReady: true,
    syntheticUserCurrentUse: [
      "open public landing and verify only role login links are exposed",
      "open each role login entrance",
      "verify internal backend routes redirect to /internal-access",
      "capture public landing screenshot",
      "check mobile and desktop overflow"
    ],
    syntheticUserFutureUse: [
      "replace access-code gate checks with real role auth once pilot auth is wired",
      "execute requester submission, facility approval, partner outcome, and requester status checks",
      "record console errors and failed network requests",
      "compare route behavior against this ai-map, /synthetic-smoke, and NSB rules"
    ]
  },
  generatedAt: "static-build-time"
};

export function GET() {
  return NextResponse.json(aiMap, {
    headers: {
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow, noarchive"
    }
  });
}
