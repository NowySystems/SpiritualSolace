type PreviewRole = "admin" | "requester" | "facility" | "partner" | "pilot";

type PreviewCard = {
  title: string;
  eyebrow: string;
  body: string;
  status: string;
};

type PreviewConfig = {
  role: PreviewRole;
  title: string;
  subtitle: string;
  primaryAction: string;
  secondaryAction: string;
  accent: string;
  cards: PreviewCard[];
  workflow: string[];
};

const previewConfigs: Record<PreviewRole, PreviewConfig> = {
  admin: {
    role: "admin",
    title: "Operator access hub",
    subtitle: "A safe visual copy of the admin home base for reviewing navigation, pilot controls, role access, and launchpad clarity without auth or database calls.",
    primaryAction: "Open requester preview",
    secondaryAction: "Review gated pilot path",
    accent: "#082838",
    cards: [
      {
        eyebrow: "PWA home",
        title: "One place to open every pilot role",
        body: "Admin should feel like the installed app starting point for Cole and Sam, not a heavy analytics dashboard yet.",
        status: "Preview only"
      },
      {
        eyebrow: "Guardrails",
        title: "No medical workflow",
        body: "This view should keep the spiritual-care lane obvious: no diagnosis, charting, treatment, emergency, or uncontrolled routing language.",
        status: "Safe copy"
      },
      {
        eyebrow: "Role launch",
        title: "Requester, facility, partner",
        body: "Each role should have a clear reason to exist and a low-friction path into the right workspace.",
        status: "Review flow"
      }
    ],
    workflow: [
      "Operator opens ChurchWork from installed app or browser.",
      "Operator chooses requester, facility, partner, or gated pilot testing.",
      "Operator sees guardrails before any role workflow.",
      "Supabase-backed actions stay outside this safe preview route."
    ]
  },
  requester: {
    role: "requester",
    title: "Requester status path",
    subtitle: "A safe family/requester view for reviewing calm language, intake clarity, status updates, and what the requester should understand next.",
    primaryAction: "Start sample intake",
    secondaryAction: "View sample status",
    accent: "#0f6b54",
    cards: [
      {
        eyebrow: "Profile",
        title: "Who is this request for?",
        body: "The requester should understand that only basic spiritual-care coordination information belongs here.",
        status: "Mock data"
      },
      {
        eyebrow: "Intake",
        title: "Structured request, not open chat",
        body: "The flow should use guided choices and safe notes instead of inviting medical details or broad free-text stories.",
        status: "No submit"
      },
      {
        eyebrow: "Status",
        title: "Clear next step visibility",
        body: "The requester needs a simple status path: received, reviewing, shared with approved partner, update available.",
        status: "Visual only"
      }
    ],
    workflow: [
      "Requester confirms basic non-medical context.",
      "Requester chooses a spiritual-care need from safe structured options.",
      "Facility reviews before anything is shared.",
      "Requester only sees approved updates."
    ]
  },
  facility: {
    role: "facility",
    title: "Facility review console",
    subtitle: "A safe Grandview-style workspace for reviewing request triage, consent, sharing state, and operational clarity without real records.",
    primaryAction: "Review sample request",
    secondaryAction: "Check sharing rules",
    accent: "#173b2d",
    cards: [
      {
        eyebrow: "Review queue",
        title: "Requests need human review",
        body: "Facility users should see enough context to make a safe coordination decision without turning this into clinical documentation.",
        status: "Mock queue"
      },
      {
        eyebrow: "Consent",
        title: "Sharing state is explicit",
        body: "The UI should make it obvious what can be shared, what is held back, and who approved release.",
        status: "Safe review"
      },
      {
        eyebrow: "Activity",
        title: "Record coordination actions",
        body: "Actions should log spiritual-care coordination steps, not treatment details or medical decisions.",
        status: "No writes"
      }
    ],
    workflow: [
      "Facility sees incoming request snapshot.",
      "Facility confirms safe context and consent state.",
      "Facility releases approved context to partner only when ready.",
      "Facility records a non-clinical coordination action."
    ]
  },
  partner: {
    role: "partner",
    title: "Partner assignment workspace",
    subtitle: "A safe Hope Church-style workspace for reviewing assignments, approved context, visit preparation, and report-back copy.",
    primaryAction: "Open sample assignment",
    secondaryAction: "Draft safe update",
    accent: "#789052",
    cards: [
      {
        eyebrow: "Assignment",
        title: "Approved context only",
        body: "Partner users should only see the spiritual-care context released by the facility, not unrestricted requester or facility notes.",
        status: "Scoped view"
      },
      {
        eyebrow: "Preparation",
        title: "Simple visit guidance",
        body: "The page should help partners know what to do next without creating an emergency or counseling workflow.",
        status: "Preview only"
      },
      {
        eyebrow: "Report back",
        title: "Safe outcome language",
        body: "Updates should be structured and limited: contacted, visited, unable to reach, follow-up requested, general note.",
        status: "No submit"
      }
    ],
    workflow: [
      "Partner receives an approved assignment.",
      "Partner reviews only facility-approved context.",
      "Partner records a safe non-medical outcome.",
      "Facility/requester only see approved updates."
    ]
  },
  pilot: {
    role: "pilot",
    title: "Gated pilot path preview",
    subtitle: "A safe preview of what the real signed-in pilot should feel like once Supabase auth is healthy.",
    primaryAction: "Review auth checkpoint",
    secondaryAction: "Open admin preview",
    accent: "#5f4b1f",
    cards: [
      {
        eyebrow: "Auth",
        title: "Sign-in should explain the pilot boundary",
        body: "The gated path should make named pilot access clear without blocking visual review of the product surfaces.",
        status: "Auth-free preview"
      },
      {
        eyebrow: "Acknowledgment",
        title: "Pilot Safe v1 acceptance",
        body: "Users should acknowledge no emergency, no medical records, no diagnosis, no treatment details, and no open chat.",
        status: "Static mock"
      },
      {
        eyebrow: "After sign-in",
        title: "Same role hub, stricter tools",
        body: "Once signed in, the pilot path can mount the real Supabase-backed admin, facility, and requester tools.",
        status: "Future gated"
      }
    ],
    workflow: [
      "Pilot user reaches sign-in boundary.",
      "Pilot user accepts safe-use acknowledgments.",
      "Pilot user opens role workspace after auth.",
      "Real data actions stay gated behind Supabase."
    ]
  }
};

const roleLinks: { role: PreviewRole; label: string }[] = [
  { role: "admin", label: "Admin" },
  { role: "requester", label: "Requester" },
  { role: "facility", label: "Facility" },
  { role: "partner", label: "Partner" },
  { role: "pilot", label: "Pilot" }
];

function PreviewShell({ children }: { children: React.ReactNode }) {
  return <main className="min-h-screen bg-[#edf4f0] text-[#0d2b3b]">{children}</main>;
}

function PreviewNav({ activeRole }: { activeRole?: PreviewRole }) {
  return (
    <nav className="border-b border-white/10 bg-[#082838] px-5 py-4 text-white shadow-xl shadow-[#0d2b3b]/15 md:px-8">
      <div className="mx-auto flex max-w-[118rem] flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <a href="/preview" className="flex items-center gap-4">
          <span className="flex h-12 w-16 items-center justify-center rounded-2xl bg-white p-2 shadow-sm">
            <img src="/brand/churchwork-corner-logo.png" alt="ChurchWork logo" className="h-full w-full object-contain" />
          </span>
          <span>
            <span className="block font-serif text-2xl font-semibold tracking-[-0.03em]">Church<span className="text-[#8dbd9e]">Work</span></span>
            <span className="block text-xs font-semibold text-[#d9e7df]">Safe Preview · No auth · No database</span>
          </span>
        </a>
        <div className="flex flex-wrap gap-2">
          {roleLinks.map((link) => {
            const active = activeRole === link.role;
            return (
              <a
                key={link.role}
                href={`/preview/${link.role}`}
                className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.12em] transition ${
                  active ? "bg-[#d6a943] text-[#082838]" : "border border-white/15 bg-white/8 text-[#d9e7df] hover:bg-white/15"
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export function SafePreviewHome() {
  return (
    <PreviewShell>
      <PreviewNav />
      <section className="mx-auto max-w-[118rem] px-5 py-8 md:px-8 md:py-12">
        <div className="overflow-hidden rounded-[2rem] border border-[#d9dfd7] bg-white shadow-xl shadow-[#0d2b3b]/8">
          <div className="bg-[#0f3f35] px-6 py-10 text-white md:px-10 md:py-14">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#c7e2d0]">Visual review mode</p>
            <h1 className="mt-4 max-w-5xl font-serif text-4xl font-semibold tracking-[-0.05em] md:text-6xl">Safe previews for every ChurchWork role.</h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-[#d9e7df]">
              These routes are intentionally static. They let us review layout, wording, workflow, guardrails, and mobile clarity without signing in, calling Supabase, or touching real pilot data.
            </p>
          </div>

          <div className="grid gap-4 bg-[#f8fbf8] p-5 md:grid-cols-2 md:p-7 xl:grid-cols-5">
            {roleLinks.map((link) => {
              const config = previewConfigs[link.role];
              return (
                <a
                  key={link.role}
                  href={`/preview/${link.role}`}
                  className="group flex min-h-[16rem] flex-col justify-between rounded-[1.5rem] border border-[#d9dfd7] bg-white p-5 shadow-sm shadow-[#0d2b3b]/5 transition hover:-translate-y-1 hover:border-[#8dbd9e] hover:shadow-xl hover:shadow-[#0d2b3b]/10"
                >
                  <span>
                    <span className="block text-xs font-black uppercase tracking-[0.16em] text-[#506a49]">{link.label} preview</span>
                    <span className="mt-3 block font-serif text-2xl font-semibold tracking-[-0.04em] text-[#0d2b3b]">{config.title}</span>
                    <span className="mt-3 block text-sm leading-6 text-[#4f6259]">{config.subtitle}</span>
                  </span>
                  <span className="mt-5 inline-flex w-fit rounded-full bg-[#082838] px-4 py-2 text-sm font-black text-white group-hover:bg-[#0f3f35]">Open preview</span>
                </a>
              );
            })}
          </div>
        </div>
      </section>
    </PreviewShell>
  );
}

export function SafePreviewCanvas({ role }: { role: PreviewRole }) {
  const config = previewConfigs[role];

  return (
    <PreviewShell>
      <PreviewNav activeRole={role} />
      <section className="mx-auto max-w-[118rem] px-5 py-8 md:px-8 md:py-12">
        <div className="rounded-[2rem] border border-[#ddb66c]/60 bg-[#fff8e7] p-5 text-sm font-semibold leading-7 text-[#5f4b1f] shadow-sm shadow-[#0d2b3b]/5 md:p-6">
          Safe preview route. No login, no Supabase, no real writes, no medical data, no emergency workflow. Use this for visual review and workflow critique only.
        </div>

        <div className="mt-6 overflow-hidden rounded-[2rem] border border-[#d9dfd7] bg-white shadow-xl shadow-[#0d2b3b]/8">
          <div className="px-6 py-10 text-white md:px-10 md:py-14" style={{ backgroundColor: config.accent }}>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-white/75">{role} preview</p>
            <h1 className="mt-4 max-w-5xl font-serif text-4xl font-semibold tracking-[-0.05em] md:text-6xl">{config.title}</h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-white/82">{config.subtitle}</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <span className="rounded-xl bg-white px-5 py-3 text-sm font-black text-[#082838] shadow-lg">{config.primaryAction}</span>
              <span className="rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-black text-white">{config.secondaryAction}</span>
            </div>
          </div>

          <div className="grid gap-5 bg-[#f8fbf8] p-5 md:grid-cols-3 md:p-7">
            {config.cards.map((card) => (
              <article key={card.title} className="flex min-h-[16rem] flex-col justify-between rounded-[1.5rem] border border-[#d9dfd7] bg-white p-5 shadow-sm shadow-[#0d2b3b]/5">
                <span>
                  <span className="block text-xs font-black uppercase tracking-[0.16em] text-[#506a49]">{card.eyebrow}</span>
                  <span className="mt-3 block font-serif text-2xl font-semibold tracking-[-0.04em] text-[#0d2b3b]">{card.title}</span>
                  <span className="mt-3 block text-sm leading-6 text-[#4f6259]">{card.body}</span>
                </span>
                <span className="mt-5 inline-flex w-fit rounded-full bg-[#e7f1eb] px-3 py-1 text-xs font-black uppercase tracking-[0.1em] text-[#0f6b54]">{card.status}</span>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-7 grid gap-6 lg:grid-cols-[1fr_24rem]">
          <section className="rounded-[1.5rem] border border-[#d9dfd7] bg-white p-6 shadow-sm shadow-[#0d2b3b]/5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#506a49]">Workflow read-through</p>
            <h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.04em] text-[#0d2b3b]">What the user should understand.</h2>
            <ol className="mt-5 space-y-3 text-sm font-semibold leading-7 text-[#4f6259]">
              {config.workflow.map((step, index) => (
                <li key={step} className="flex gap-3 rounded-2xl border border-[#d9dfd7] bg-[#f8fbf8] p-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#d6a943] text-xs font-black text-[#082838]">{index + 1}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </section>

          <aside className="rounded-[1.5rem] border border-[#d9dfd7] bg-white p-6 shadow-sm shadow-[#0d2b3b]/5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#506a49]">Review checklist</p>
            <ul className="mt-5 space-y-3 text-sm font-semibold leading-6 text-[#4f6259]">
              <li>Does the role know what to do first?</li>
              <li>Is anything asking for unsafe medical detail?</li>
              <li>Is the next step obvious on mobile?</li>
              <li>Does the page feel real enough for a pilot?</li>
              <li>Is anything too wordy, vague, or fake?</li>
            </ul>
            <a href="/preview" className="mt-6 inline-flex rounded-xl bg-[#082838] px-5 py-3 text-sm font-black text-white shadow-lg hover:bg-[#0f3f35]">Back to previews</a>
          </aside>
        </div>
      </section>
    </PreviewShell>
  );
}
