"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type PortalKind = "requester" | "facility" | "partner";

type TimelineEvent = {
  id: string;
  date: string;
  time: string;
  type: string;
  title: string;
  detail: string;
  actor: string;
  badge: string;
  tone: "teal" | "gold" | "blue" | "green" | "clay" | "stone";
  requesterVisible: boolean;
  partnerVisible: boolean;
};

type ChurchWorkPortalDashboardProps = {
  portal: PortalKind;
};

const roleLinks: { id: PortalKind; label: string; href: string }[] = [
  { id: "requester", label: "Requester Portal", href: "/requester-portal" },
  { id: "facility", label: "Facility Portal", href: "/facility-portal" },
  { id: "partner", label: "Partner Portal", href: "/partner-portal" }
];

const portalCopy: Record<PortalKind, {
  eyebrow: string;
  title: string;
  subtitle: string;
  accountName: string;
  accountRole: string;
  primaryCardTitle: string;
  primaryCardMeta: string;
  primaryCardDetail: string;
  statusLabel: string;
  nextStep: string;
  contextTitle: string;
  contextItems: { label: string; detail: string; badge?: string }[];
  infoCards: { title: string; body: string; footer: string }[];
  actionsTitle: string;
  actions: { label: string; detail: string; eventTitle: string; eventDetail: string; tone: TimelineEvent["tone"] }[];
}> = {
  requester: {
    eyebrow: "Requester access",
    title: "My Care Request Workspace",
    subtitle: "A simple view of the request, the next step, and approved updates.",
    accountName: "Sarah K. (Daughter)",
    accountRole: "Requester",
    primaryCardTitle: "Jane Doe",
    primaryCardMeta: "Room 104B · Age 78 · Protestant",
    primaryCardDetail: "Family encouragement and prayer support request. Updates shown here are requester-safe and approved for family visibility.",
    statusLabel: "In Review",
    nextStep: "The facility care team is reviewing consent and scheduling the next care touch.",
    contextTitle: "Request Snapshot",
    contextItems: [
      { label: "Submitted", detail: "Jun 20, 2025 · 9:42 AM" },
      { label: "Requested by", detail: "Sarah K. (Daughter)" },
      { label: "Best contact", detail: "Text messages" },
      { label: "Consent", detail: "Confirmed", badge: "Private" }
    ],
    infoCards: [
      { title: "Current Support", body: "Prayer support, encouragement, and short visits to help Mom feel connected.", footer: "Family Encouragement" },
      { title: "Approved Care Team", body: "Elena Morris is coordinating the facility review. Michael Torres is approved for pastoral care once scheduled.", footer: "Care Team" },
      { title: "Consent & Privacy", body: "Only approved request updates are visible here. Facility notes and partner-only notes stay hidden.", footer: "Consent Confirmed" }
    ],
    actionsTitle: "Requester Actions",
    actions: [
      { label: "Send Message", detail: "Message the care team securely", eventTitle: "Requester message sent", eventDetail: "Sarah asked the care team for a short status update.", tone: "blue" },
      { label: "Request Follow-up", detail: "Ask for an update or next touch", eventTitle: "Follow-up requested", eventDetail: "Requester asked for a follow-up after the next care team review.", tone: "gold" },
      { label: "Update Contact Preference", detail: "Choose how updates should arrive", eventTitle: "Contact preference updated", eventDetail: "Requester updated preferred contact method to text messages.", tone: "teal" },
      { label: "Review Consent", detail: "View consent and privacy summary", eventTitle: "Consent summary reviewed", eventDetail: "Requester reviewed the current consent and privacy settings.", tone: "green" }
    ]
  },
  facility: {
    eyebrow: "Facility access",
    title: "Facility Care Workspace",
    subtitle: "Review requests, confirm consent, coordinate partners, and keep the shared timeline clean.",
    accountName: "Morning Pointe Franklin",
    accountRole: "Facility Team",
    primaryCardTitle: "Evelyn Allen",
    primaryCardMeta: "Room 214B · Assisted Living · Baptist",
    primaryCardDetail: "Senior care and companionship request. Facility staff controls consent, visibility, partner handoff, and internal notes.",
    statusLabel: "Action Needed",
    nextStep: "Confirm visit details and review consent before the partner receives any additional information.",
    contextTitle: "Facility Queue",
    contextItems: [
      { label: "Evelyn Allen", detail: "Room 214B · request #24-00058", badge: "Active" },
      { label: "Robert Johnson", detail: "Room 118A · consent pending", badge: "Review" },
      { label: "Margaret Davis", detail: "Room 302C · partner note due", badge: "Follow-up" },
      { label: "Thomas Brown", detail: "Room 105A · scheduled visit", badge: "Visit" }
    ],
    infoCards: [
      { title: "Consent & Visibility", body: "Family updates and partner sharing are approved. Internal facility notes remain facility-only.", footer: "Shared with Partners" },
      { title: "Partner Sharing", body: "Morning Pointe Church is approved to receive the limited spiritual-care summary and visit details.", footer: "Partner Approved" },
      { title: "Upcoming Visit", body: "Visit with care partner is scheduled for tomorrow at 11:00 AM in Room 214B.", footer: "Scheduled" }
    ],
    actionsTitle: "Facility Actions",
    actions: [
      { label: "Confirm Consent", detail: "Review resident/family sharing permissions", eventTitle: "Consent confirmed by facility", eventDetail: "Facility confirmed the request can be shared with approved partners.", tone: "green" },
      { label: "Schedule Visit", detail: "Set or update a care visit", eventTitle: "Visit scheduled", eventDetail: "Facility scheduled a care partner visit for tomorrow at 11:00 AM.", tone: "teal" },
      { label: "Add Internal Note", detail: "Facility-only note", eventTitle: "Internal facility note added", eventDetail: "Facility added a private note for care coordination review.", tone: "gold" },
      { label: "Share With Partner", detail: "Approve limited partner visibility", eventTitle: "Request shared with partner", eventDetail: "Facility shared the approved summary with Morning Pointe Church.", tone: "blue" },
      { label: "Send Family Update", detail: "Approved update to requester", eventTitle: "Family update sent", eventDetail: "Facility sent an approved status update to Grace Allen.", tone: "teal" }
    ]
  },
  partner: {
    eyebrow: "Partner access",
    title: "Partner Care Workspace",
    subtitle: "See approved assignments, complete care actions, and report back to the facility.",
    accountName: "Grace Gardens Care",
    accountRole: "Partner Team",
    primaryCardTitle: "Jane Doe",
    primaryCardMeta: "Room 104B · Prayer Support · Family Encouragement",
    primaryCardDetail: "Approved partner summary only. Partner users see the care need, consent status, assignment, and partner-visible timeline updates.",
    statusLabel: "New Assignment",
    nextStep: "Accept the assignment, prepare for the visit, then send the facility a completed-visit update.",
    contextTitle: "My Assignments",
    contextItems: [
      { label: "Jane Doe", detail: "Assigned today · prayer support", badge: "New" },
      { label: "Elena Morris", detail: "Follow-up due · weekly visit", badge: "Follow-up" },
      { label: "Mary Johnson", detail: "Visit scheduled · scripture reading", badge: "Visit" },
      { label: "Robert Smith", detail: "In progress · quiet check-in", badge: "Active" }
    ],
    infoCards: [
      { title: "Approved Care Needs", body: "Prayer support, spiritual encouragement, and gentle family encouragement are approved for this assignment.", footer: "Approved Summary" },
      { title: "Facility Contact", body: "Sarah K. is the family contact. Facility coordinator remains the handoff point for all updates.", footer: "Contact Approved" },
      { title: "Sharing Rules", body: "No medical details, diagnoses, financial information, or unrelated resident details can be shared.", footer: "Human Reviewed" }
    ],
    actionsTitle: "Partner Actions",
    actions: [
      { label: "Accept Assignment", detail: "Take responsibility for this care action", eventTitle: "Assignment accepted", eventDetail: "Partner accepted responsibility for the approved care assignment.", tone: "green" },
      { label: "Confirm Visit", detail: "Schedule or confirm visit timing", eventTitle: "Partner visit confirmed", eventDetail: "Partner confirmed the planned visit time with the facility.", tone: "teal" },
      { label: "Send Update to Facility", detail: "Report back after action", eventTitle: "Partner update sent", eventDetail: "Partner shared a visit update back to the facility.", tone: "blue" },
      { label: "Log Completed Visit", detail: "Record completed partner care", eventTitle: "Partner visit completed", eventDetail: "Partner logged the completed spiritual-care visit.", tone: "green" },
      { label: "Request Clarification", detail: "Ask facility a question", eventTitle: "Clarification requested", eventDetail: "Partner asked the facility for clarification before taking the next step.", tone: "gold" }
    ]
  }
};

const initialTimeline: TimelineEvent[] = [
  {
    id: "visit-completed",
    date: "Jun 21",
    time: "10:15 AM",
    type: "VISIT",
    title: "Pastoral visit completed",
    detail: "The approved care partner completed a short encouragement and prayer visit.",
    actor: "Michael Torres",
    badge: "Completed",
    tone: "green",
    requesterVisible: true,
    partnerVisible: true
  },
  {
    id: "shared-care-team",
    date: "Jun 20",
    time: "11:30 AM",
    type: "SHARED",
    title: "Request shared with approved care team",
    detail: "The facility shared the approved spiritual-care summary with the care team.",
    actor: "Elena Morris",
    badge: "Shared",
    tone: "teal",
    requesterVisible: true,
    partnerVisible: true
  },
  {
    id: "consent-confirmed",
    date: "Jun 20",
    time: "11:02 AM",
    type: "CONSENT",
    title: "Consent confirmed",
    detail: "Consent and visibility settings were reviewed and documented by the facility.",
    actor: "Facility Team",
    badge: "Confirmed",
    tone: "green",
    requesterVisible: true,
    partnerVisible: true
  },
  {
    id: "internal-plan",
    date: "Jun 20",
    time: "10:24 AM",
    type: "PLAN",
    title: "Spiritual care plan reviewed",
    detail: "Facility care plan aligned around prayer support, weekly visit, and family encouragement.",
    actor: "Care Coordinator",
    badge: "Internal",
    tone: "gold",
    requesterVisible: false,
    partnerVisible: false
  },
  {
    id: "request-submitted",
    date: "Jun 20",
    time: "9:42 AM",
    type: "SUBMITTED",
    title: "Care request submitted",
    detail: "A family encouragement and prayer support request was submitted for review.",
    actor: "Sarah K.",
    badge: "Submitted",
    tone: "stone",
    requesterVisible: true,
    partnerVisible: false
  }
];

function badgeClasses(tone: TimelineEvent["tone"]) {
  const tones: Record<TimelineEvent["tone"], string> = {
    teal: "border-[#9fc6bd] bg-[#edf7f5] text-[#275d55]",
    gold: "border-[#e5c071] bg-[#fff7e6] text-[#76551c]",
    blue: "border-[#b5c8d4] bg-[#eef4f7] text-[#385d70]",
    green: "border-[#b7d1c0] bg-[#eef6f0] text-[#315f44]",
    clay: "border-[#e0a08f] bg-[#fff0eb] text-[#8d3f2c]",
    stone: "border-[#d8d0c0] bg-[#fbf8f0] text-[#4d5d55]"
  };

  return tones[tone];
}

function visibleForPortal(event: TimelineEvent, portal: PortalKind) {
  if (portal === "facility") return true;
  if (portal === "partner") return event.partnerVisible;
  return event.requesterVisible;
}

export function ChurchWorkPortalDashboard({ portal }: ChurchWorkPortalDashboardProps) {
  const [timeline, setTimeline] = useState(initialTimeline);
  const copy = portalCopy[portal];
  const visibleTimeline = useMemo(() => timeline.filter((event) => visibleForPortal(event, portal)), [timeline, portal]);

  function recordAction(action: (typeof copy.actions)[number]) {
    const newEvent: TimelineEvent = {
      id: `${portal}-${Date.now()}`,
      date: "Today",
      time: "Now",
      type: "ACTION",
      title: action.eventTitle,
      detail: action.eventDetail,
      actor: copy.accountName,
      badge: action.label,
      tone: action.tone,
      requesterVisible: portal === "requester" || portal === "facility",
      partnerVisible: portal === "partner" || action.label.includes("Partner") || action.label.includes("Assignment")
    };

    setTimeline((items) => [newEvent, ...items]);
  }

  return (
    <main className="min-h-screen bg-[#f7f3ea] text-[#102b3a]">
      <header className="border-b border-white/10 bg-[#0d2b3b] text-white shadow-lg shadow-[#0d2b3b]/15">
        <div className="mx-auto flex max-w-[92rem] flex-col gap-4 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
          <Link href="/" className="flex items-center gap-3" aria-label="ChurchWork home">
            <span className="flex h-12 w-20 items-center justify-center rounded-2xl bg-white p-2 shadow-sm">
              <img src="/brand/churchwork-corner-logo.png" alt="ChurchWork CW logo" className="h-full w-full object-contain" />
            </span>
            <span>
              <span className="block font-serif text-2xl font-semibold tracking-[-0.04em]">Church<span className="text-[#3f806e]">Work</span></span>
              <span className="block text-xs font-bold text-[#d4dedc]">Pilot V1</span>
            </span>
          </Link>

          <nav className="flex flex-wrap items-center gap-2 text-xs font-black uppercase tracking-[0.12em]">
            {roleLinks.map((role) => (
              <Link
                key={role.id}
                href={role.href}
                className={`rounded-full border px-4 py-2 transition ${portal === role.id ? "border-[#86a45f] bg-[#173b2d] text-[#d7e7b7]" : "border-white/10 bg-white/5 text-[#d4dedc] hover:bg-white/10"}`}
              >
                {role.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold text-[#edf5e6]">Same app · role-safe timeline · human-reviewed sharing</span>
            <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-2 text-right">
              <p className="font-black">{copy.accountName}</p>
              <p className="text-xs font-semibold text-[#d4dedc]">{copy.accountRole}</p>
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-[92rem] px-5 py-6">
        <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#789052]">{copy.eyebrow}</p>
            <h1 className="mt-2 font-serif text-4xl font-semibold tracking-[-0.04em] md:text-5xl">{copy.title}</h1>
            <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-[#4d5d55]">{copy.subtitle}</p>
          </div>
          <div className="rounded-2xl border border-[#d8d0c0] bg-white/85 px-5 py-4 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#789052]">Current status</p>
            <p className="mt-1 text-lg font-black text-[#102b3a]">{copy.statusLabel}</p>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-[310px_minmax(0,1fr)_320px]">
          <aside className="space-y-5">
            <section className="rounded-[1.7rem] border border-[#d8d0c0] bg-white/90 p-5 shadow-sm">
              <h2 className="text-sm font-black uppercase tracking-[0.18em] text-[#173b2d]">{copy.contextTitle}</h2>
              <div className="mt-4 space-y-3">
                {copy.contextItems.map((item) => (
                  <article key={`${item.label}-${item.detail}`} className="rounded-2xl border border-[#ded6c8] bg-[#fffdf9] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-black text-[#102b3a]">{item.label}</p>
                        <p className="mt-1 text-xs font-semibold leading-5 text-[#4d5d55]">{item.detail}</p>
                      </div>
                      {item.badge ? <span className="rounded-full bg-[#f0f5e8] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-[#315f44]">{item.badge}</span> : null}
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-[1.7rem] border border-[#d8d0c0] bg-[#173b2d] p-5 text-white shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#c8d9b3]">Next step</p>
              <p className="mt-3 text-sm font-semibold leading-6 text-[#edf5e6]">{copy.nextStep}</p>
            </section>
          </aside>

          <section className="space-y-5">
            <section className="rounded-[1.8rem] border border-[#d8d0c0] bg-white/95 p-6 shadow-sm">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eaf2ed] text-lg font-black text-[#173b2d]">{copy.primaryCardTitle.split(" ").map((part) => part[0]).slice(0, 2).join("")}</span>
                    <div>
                      <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-[#102b3a]">{copy.primaryCardTitle}</h2>
                      <p className="mt-1 text-sm font-bold text-[#4d5d55]">{copy.primaryCardMeta}</p>
                    </div>
                  </div>
                  <p className="mt-5 max-w-3xl text-sm font-semibold leading-7 text-[#4d5d55]">{copy.primaryCardDetail}</p>
                </div>
                <div className="rounded-2xl border border-[#d7cdeb] bg-[#f4effc] p-5 lg:w-80">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#5b4a83]">What should happen next?</p>
                  <p className="mt-2 text-sm font-bold leading-6 text-[#102b3a]">{copy.nextStep}</p>
                </div>
              </div>
            </section>

            <div className="grid gap-4 lg:grid-cols-3">
              {copy.infoCards.map((card) => (
                <article key={card.title} className="rounded-[1.5rem] border border-[#d8d0c0] bg-white/95 p-5 shadow-sm">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#173b2d]">{card.title}</p>
                  <p className="mt-3 text-sm font-semibold leading-6 text-[#4d5d55]">{card.body}</p>
                  <span className="mt-4 inline-flex rounded-full border border-[#bdd7ca] bg-[#eef6f0] px-3 py-1 text-xs font-black text-[#315f44]">{card.footer}</span>
                </article>
              ))}
            </div>

            <section className="rounded-[1.8rem] border border-[#d8d0c0] bg-white/95 p-6 shadow-sm">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h2 className="text-sm font-black uppercase tracking-[0.18em] text-[#173b2d]">Shared Care Timeline</h2>
                  <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-[#4d5d55]">One care story, filtered by this portal. Facility sees internal workflow, partners see approved shared events, and requesters see requester-safe updates.</p>
                </div>
                <p className="text-xs font-bold text-[#789052]">Newest first · {visibleTimeline.length} visible</p>
              </div>

              <div className="mt-6 space-y-4">
                {visibleTimeline.map((event) => (
                  <article key={event.id} className="grid gap-4 rounded-2xl border border-[#e2dfd9] bg-white p-4 shadow-[0_10px_30px_rgba(30,41,59,0.05)] md:grid-cols-[92px_1fr]">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.14em] text-[#65717a]">{event.date}</p>
                      <p className="mt-1 text-xs font-bold text-[#789052]">{event.time}</p>
                    </div>
                    <div className="border-l-2 border-[#d8d6d1] pl-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${badgeClasses(event.tone)}`}>{event.badge}</span>
                        <span className="text-xs font-bold text-[#65717a]">{event.actor}</span>
                      </div>
                      <h3 className="mt-2 font-black text-[#102b3a]">{event.title}</h3>
                      <p className="mt-1 text-sm font-semibold leading-6 text-[#4d5d55]">{event.detail}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </section>

          <aside className="space-y-5">
            <section className="rounded-[1.7rem] border border-[#d8d0c0] bg-white/95 p-5 shadow-sm">
              <h2 className="text-sm font-black uppercase tracking-[0.18em] text-[#173b2d]">{copy.actionsTitle}</h2>
              <p className="mt-2 text-xs font-semibold leading-5 text-[#4d5d55]">Only the actions this portal actually needs are shown here.</p>
              <div className="mt-4 space-y-2">
                {copy.actions.map((action, index) => (
                  <button
                    key={action.label}
                    type="button"
                    onClick={() => recordAction(action)}
                    className={`w-full rounded-2xl border px-4 py-4 text-left transition ${index === 0 ? "border-[#173b2d] bg-[#173b2d] text-white shadow-md hover:bg-[#102b3a]" : "border-[#d8d0c0] bg-white text-[#102b3a] hover:border-[#86a45f] hover:bg-[#f8fbf8]"}`}
                  >
                    <span className="block text-sm font-black">{action.label}</span>
                    <span className={`mt-1 block text-xs font-semibold ${index === 0 ? "text-[#edf5e6]" : "text-[#4d5d55]"}`}>{action.detail}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="rounded-[1.7rem] border border-[#ddb66c]/45 bg-[#fff8e7] p-5 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#7a5b20]">Guardrail</p>
              <p className="mt-2 text-sm font-bold leading-6 text-[#5f4b1f]">This portal shows only the information and actions appropriate for {copy.accountRole.toLowerCase()} access.</p>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}
