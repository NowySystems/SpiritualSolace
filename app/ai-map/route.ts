import { NextResponse } from "next/server";

const aiMap = {
  schema: "nowysystems.ai-map.v1",
  project: {
    name: "ChurchWork",
    repo: "LL-COLE-J/SpiritualSolace",
    productFamily: "NowySystems",
    status: "pilot-preview",
    description: "Spiritual-care operations workflow for requesters, facilities, partner care teams, and internal operators."
  },
  nsb: {
    sourceOfTruth: true,
    governingRule: "rules/nsb-build-flow-governance.md",
    ruleSummary: "Reusable build patterns, preview routes, AI-readable surfaces, workflow conventions, guardrails, and cross-project architecture ideas flow through NSB first."
  },
  safety: {
    safePreviewAvailable: true,
    previewRoutesRequireAuth: false,
    previewRoutesWriteData: false,
    containsMedicalWorkflow: false,
    allowsEmergencyWorkflow: false,
    allowsOpenChat: false,
    allowsUncontrolledPartnerRouting: false,
    notes: [
      "ChurchWork preview routes are for visual and workflow review only.",
      "No Supabase writes are performed by preview routes.",
      "No medical records, diagnosis, symptoms, medications, treatment details, insurance, or emergency information should be collected."
    ]
  },
  roles: [
    {
      key: "requester",
      label: "Requester / family user",
      purpose: "Profile, structured spiritual-care intake, consent-aware status visibility, and approved updates."
    },
    {
      key: "facility",
      label: "Facility reviewer",
      purpose: "Review requests, confirm consent/sharing state, and control what can move to partner care teams."
    },
    {
      key: "partner",
      label: "Partner care team",
      purpose: "Receive approved context, coordinate assignment, and report safe non-medical updates."
    },
    {
      key: "admin",
      label: "Admin / operator",
      purpose: "Cole/Sam operator launchpad, demo navigation, and controlled pilot access."
    }
  ],
  routes: {
    public: [
      { path: "/", label: "Landing page", authRequired: false },
      { path: "/requester-portal", label: "Requester portal", authRequired: false },
      { path: "/facility-portal", label: "Facility portal", authRequired: false },
      { path: "/partner-portal", label: "Partner portal", authRequired: false },
      { path: "/admin", label: "Admin operator hub", authRequired: false }
    ],
    preview: [
      { path: "/preview", label: "Preview index", authRequired: false, writesData: false },
      { path: "/preview/admin", label: "Admin preview", authRequired: false, writesData: false },
      { path: "/preview/requester", label: "Requester preview", authRequired: false, writesData: false },
      { path: "/preview/facility", label: "Facility preview", authRequired: false, writesData: false },
      { path: "/preview/partner", label: "Partner preview", authRequired: false, writesData: false },
      { path: "/preview/pilot", label: "Pilot flow preview", authRequired: false, writesData: false }
    ],
    gated: [
      { path: "/pilot", label: "Gated pilot sign-in path", authRequired: true, writesData: true }
    ],
    diagnostics: [
      { path: "/pwa-check", label: "PWA install diagnostics", authRequired: false },
      { path: "/pwa-reset", label: "PWA browser state reset", authRequired: false },
      { path: "/pilot-auth-check", label: "Supabase auth diagnostics", authRequired: false },
      { path: "/ai-map", label: "AI-readable project map", authRequired: false },
      { path: "/synthetic-smoke", label: "Synthetic smoke contract", authRequired: false }
    ]
  },
  knownIssues: [
    {
      key: "chrome-install-event-suppressed",
      status: "open",
      severity: "medium",
      summary: "Manifest/icons/service worker can pass while Android Chrome still suppresses beforeinstallprompt."
    },
    {
      key: "pilot-supabase-auth-fetch",
      status: "under-diagnosis",
      severity: "high",
      summary: "/pilot sign-in can return Failed to fetch; /pilot-auth-check exists to isolate auth/network/env issues."
    },
    {
      key: "text-reader-client-shell-limitation",
      status: "known-limitation",
      severity: "low",
      summary: "Text-only inspection can see the client shell before rendered portal UI; future Playwright synthetic user should validate rendered pages."
    }
  ],
  biContract: {
    canBeScannedByBI: true,
    preferredEntry: "/ai-map",
    preferredSmokeEntry: "/synthetic-smoke",
    preferredVisualEntry: "/preview",
    compareAgainstNSB: true,
    syntheticSmokeReady: true,
    syntheticUserReady: false,
    syntheticUserFutureUse: [
      "open safe preview routes",
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
      "Cache-Control": "public, max-age=60, stale-while-revalidate=300"
    }
  });
}
