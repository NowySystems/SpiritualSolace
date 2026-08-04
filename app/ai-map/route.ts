import { NextResponse } from "next/server";

const aiMap = {
  schema: "nowysystems.ai-map.v1",
  project: {
    name: "ChurchWork",
    repo: "LL-COLE-J/SpiritualSolace",
    productFamily: "NowySystems",
    status: "private-mvp-sandbox",
    description: "Spiritual-care operations workflow for requesters, facilities, partner care teams, and internal operators."
  },
  nsb: {
    sourceOfTruth: true,
    governingRule: "rules/nsb-build-flow-governance.md",
    ruleSummary: "Reusable build patterns, preview routes, AI-readable surfaces, workflow conventions, guardrails, and cross-project architecture ideas flow through NSB first."
  },
  visibility: {
    publicRoutes: ["/"],
    internalRoutesRequireAccessKey: true,
    note: "Admin, MVP sandbox, role portals, previews, diagnostics, and BI inspection routes are internal review surfaces, not public demo pages."
  },
  safety: {
    safePreviewAvailable: true,
    mvpSandboxAvailable: true,
    previewRoutesWriteData: false,
    mvpRouteWritesData: false,
    containsMedicalWorkflow: false,
    allowsEmergencyWorkflow: false,
    allowsOpenChat: false,
    allowsUncontrolledPartnerRouting: false,
    notes: [
      "ChurchWork /mvp is an internal integrated one-device sandbox that demonstrates the real operating flow without persistence.",
      "Preview, demo, and MVP sandbox routes do not perform Supabase writes.",
      "No medical records, diagnosis, symptoms, medications, treatment details, insurance, or emergency information should be collected."
    ]
  },
  roles: [
    { key: "requester", label: "Requester / family user", purpose: "Profile, structured spiritual-care intake, consent-aware status visibility, and approved updates." },
    { key: "facility", label: "Facility reviewer", purpose: "Review requests, confirm consent/sharing state, and control what can move to partner care teams." },
    { key: "partner", label: "Partner care team", purpose: "Receive approved context, coordinate assignment, and report safe non-medical updates." },
    { key: "admin", label: "Admin / operator", purpose: "Cole/Sam operator launchpad, MVP navigation, demo navigation, and controlled pilot access." }
  ],
  routes: {
    public: [
      { path: "/", label: "Public landing page", authRequired: false }
    ],
    internalSandbox: [
      { path: "/admin", label: "Admin operator hub", internalAccessRequired: true },
      { path: "/mvp", label: "Integrated MVP sandbox", internalAccessRequired: true, writesData: false },
      { path: "/requester-portal", label: "Requester portal", internalAccessRequired: true },
      { path: "/facility-portal", label: "Facility portal", internalAccessRequired: true },
      { path: "/partner-portal", label: "Partner portal", internalAccessRequired: true }
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
  knownIssues: [
    { key: "chrome-install-event-suppressed", status: "open", severity: "medium", summary: "Manifest/icons/service worker can pass while Android Chrome still suppresses beforeinstallprompt." },
    { key: "pilot-supabase-auth-fetch", status: "under-diagnosis", severity: "high", summary: "/pilot sign-in can return Failed to fetch; auth diagnostic routes exist to isolate browser, server, env, and upstream issues." },
    { key: "text-reader-client-shell-limitation", status: "known-limitation", severity: "low", summary: "Text-only inspection can see the client shell before rendered portal UI; future Playwright synthetic user should validate rendered pages." }
  ],
  biContract: {
    canBeScannedByBI: true,
    preferredEntry: "/ai-map",
    preferredMvpEntry: "/mvp",
    preferredSmokeEntry: "/synthetic-smoke",
    preferredVisualEntry: "/preview",
    preferredDemoEntry: "/demo/synthetic",
    compareAgainstNSB: true,
    internalAccessRequired: true,
    mvpSandboxReady: true,
    syntheticSmokeReady: true,
    syntheticDemoReady: true,
    syntheticUserReady: false,
    syntheticUserFutureUse: [
      "open /mvp with internal access and execute the requester-facility-partner-status path",
      "open safe preview routes with internal access",
      "play the synthetic super demo route with internal access",
      "capture screenshots",
      "read DOM text",
      "record console errors",
      "record failed network requests",
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
