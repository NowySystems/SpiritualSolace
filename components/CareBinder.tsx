"use client";

import { FormEvent, useMemo, useState } from "react";

type TimelineEvent = {
  id: string;
  type: "VISIT" | "VISIT_SCHEDULED" | "PRAYER" | "CHURCH" | "NOTE" | "PLAN" | "FOLLOW_UP";
  title: string;
  date: string;
  actor: string;
  detail: string;
};

type Resident = {
  id: string;
  name: string;
  room: string;
  age: number;
  faith: string;
  status: "Active" | "Monitoring" | "New";
  priority: string;
  summary: string;
  nextStep: string;
  needs: string[];
  church: string;
  pastor: string;
  volunteer: string;
  carePlan: string[];
};

const initialResidents: Resident[] = [
  {
    id: "jane-doe",
    name: "Jane Doe",
    room: "104B",
    age: 78,
    faith: "Protestant",
    status: "Active",
    priority: "Prayer request ready",
    summary:
      "Demo resident welcomes Protestant spiritual care, short volunteer visits, and family-aware encouragement through the approved facility workflow.",
    nextStep: "Send a consent-confirmed prayer request for human review, then verify the new PRAYER event in the timeline.",
    needs: ["Prayer Support", "Weekly Visit", "Family Encouragement", "Church Check-In"],
    church: "First Assembly of God",
    pastor: "Rev. Michael Torres",
    volunteer: "Sarah K.",
    carePlan: [
      "Offer brief, calm prayer support when consent is documented.",
      "Keep external church communication human-reviewed and one-way until approved.",
      "Log every care action to the resident timeline before moving to the next step."
    ]
  },
  {
    id: "elena-morris",
    name: "Elena Morris",
    room: "108A",
    age: 83,
    faith: "Catholic",
    status: "New",
    priority: "Confirm consent",
    summary: "Demo queue item awaiting preference confirmation before any external church or volunteer action.",
    nextStep: "Confirm consent and preferred parish contact with facility staff.",
    needs: ["Consent Review", "Parish Preference", "Clergy Intro"],
    church: "St. Mark Parish",
    pastor: "Fr. Daniel Ruiz",
    volunteer: "Unassigned",
    carePlan: ["Confirm faith preference.", "Document consent status.", "Route any parish outreach through staff review."]
  },
  {
    id: "mary-johnson",
    name: "Mary Johnson",
    room: "112C",
    age: 81,
    faith: "Baptist",
    status: "Monitoring",
    priority: "Visit follow-up",
    summary: "Demo resident enjoys scripture readings and brief encouragement notes after therapy.",
    nextStep: "Schedule the next volunteer visit window.",
    needs: ["Scripture Reading", "Visit Scheduling", "Encouragement Note"],
    church: "Hope Baptist Church",
    pastor: "Pastor Linda Gray",
    volunteer: "Thomas R.",
    carePlan: ["Keep visits short.", "Use approved scripture readings only.", "Add follow-up note after each visit."]
  },
  {
    id: "robert-smith",
    name: "Robert Smith",
    room: "119A",
    age: 76,
    faith: "Methodist",
    status: "Active",
    priority: "Routine care",
    summary: "Demo resident prefers Sunday bulletin delivery and quiet pastoral check-ins.",
    nextStep: "Add a follow-up note after the next visit.",
    needs: ["Bulletin", "Pastoral Check-In", "Quiet Visit"],
    church: "Grace Methodist",
    pastor: "Rev. Alan Price",
    volunteer: "Mina S.",
    carePlan: ["Coordinate bulletin delivery.", "Avoid unscheduled calls.", "Timeline every pastoral touchpoint."]
  }
];

const initialTimeline: TimelineEvent[] = [
  {
    id: "visit-completed-jun-21",
    type: "VISIT",
    title: "Volunteer visit completed",
    date: "Jun 21",
    actor: "Sarah K.",
    detail: "Short weekly visit completed and marked ready for prayer follow-up."
  },
  {
    id: "plan-reviewed-jun-20",
    type: "PLAN",
    title: "Spiritual care plan reviewed",
    date: "Jun 20",
    actor: "Care Coordinator",
    detail: "Care plan aligned around prayer support, weekly visit, and church check-in."
  },
  {
    id: "church-contact-jun-18",
    type: "CHURCH",
    title: "Church connection confirmed",
    date: "Jun 18",
    actor: "Pastor Michael Torres",
    detail: "Church contact confirmed for continued human-reviewed care coordination."
  },
  {
    id: "care-note-jun-15",
    type: "NOTE",
    title: "Current needs organized",
    date: "Jun 15",
    actor: "Care Coordinator",
    detail: "Needs grouped for prayer support, weekly visit, family encouragement, and church check-in."
  }
];

const prayerTemplates = [
  {
    id: "comfort",
    label: "Comfort & peace",
    body:
      "Please pray for Jane Doe in Room 104B, asking for comfort, peace, and reassurance today. She welcomes Protestant prayer support and a gentle message of encouragement."
  },
  {
    id: "weekly",
    label: "Weekly support",
    body:
      "Please pray that Jane Doe feels steady, cared for, and strengthened this week. A short, warm note from the church care team would be appreciated."
  },
  {
    id: "family",
    label: "Family encouragement",
    body:
      "Please pray for Jane Doe and her family, asking that they feel supported, hopeful, and surrounded by compassionate care."
  }
];

const secondaryActions = ["Schedule Visit", "Contact Church", "Assign Volunteer", "Add Follow-Up", "Add Note", "Message Care Team"];

const followUpTypes = ["Gentle check-in", "Prayer support", "Volunteer visit", "Church care note", "Family encouragement"];
const followUpOwners = ["Care Coordinator", "Sarah K.", "Thomas R.", "Church Care Team"];

const visitTypes = ["Pastoral visit", "Volunteer visit", "Chaplain visit", "Seminary student visit", "Prayer visit", "Care plan visit"];
const visitDates = ["Today", "Tomorrow", "This week", "Custom"];
const visitWindows = ["Morning", "Afternoon", "Evening", "Custom"];
const visitVisitors = ["Pastor Sam", "Church Care Team", "Volunteer", "Chaplain", "Seminary Student"];

function eventStyles(type: TimelineEvent["type"]) {
  if (type === "PRAYER") return "border-[#d8c6ff] bg-[#f5efff] text-[#5b3d91]";
  if (type === "VISIT") return "border-[#bfe4c7] bg-[#effaf0] text-[#2f6f45]";
  if (type === "VISIT_SCHEDULED") return "border-[#9cc9b7] bg-[#eef8f4] text-[#275d50]";
  if (type === "CHURCH") return "border-[#f3d59d] bg-[#fff8e8] text-[#806020]";
  if (type === "PLAN") return "border-[#b8d8e6] bg-[#eef8fb] text-[#2d6475]";
  if (type === "FOLLOW_UP") return "border-[#b7d6c0] bg-[#eef8ed] text-[#2e6842]";
  return "border-[#cdd7df] bg-[#f5f8fa] text-[#405a6b]";
}

export function CareBinder() {
  const [residentList, setResidentList] = useState(initialResidents);
  const [selectedId, setSelectedId] = useState("jane-doe");
  const [timeline, setTimeline] = useState(initialTimeline);
  const [recentActivity, setRecentActivity] = useState(initialTimeline.slice(0, 3));
  const [isPrayerOpen, setPrayerOpen] = useState(false);
  const [isVisitOpen, setVisitOpen] = useState(false);
  const [isFollowUpOpen, setFollowUpOpen] = useState(false);
  const [templateId, setTemplateId] = useState(prayerTemplates[0].id);
  const [prayerText, setPrayerText] = useState(prayerTemplates[0].body);
  const [hasConsent, setHasConsent] = useState(false);
  const [followUpType, setFollowUpType] = useState(followUpTypes[0]);
  const [followUpDueDate, setFollowUpDueDate] = useState("");
  const [followUpOwner, setFollowUpOwner] = useState(followUpOwners[0]);
  const [followUpNote, setFollowUpNote] = useState("");
  const [hasFollowUpConsent, setHasFollowUpConsent] = useState(false);
  const [visitType, setVisitType] = useState(visitTypes[0]);
  const [visitDate, setVisitDate] = useState(visitDates[0]);
  const [customVisitDate, setCustomVisitDate] = useState("");
  const [visitWindow, setVisitWindow] = useState(visitWindows[0]);
  const [customVisitWindow, setCustomVisitWindow] = useState("");
  const [visitVisitor, setVisitVisitor] = useState(visitVisitors[0]);
  const [visitLocation, setVisitLocation] = useState("");
  const [visitNote, setVisitNote] = useState("");
  const [hasVisitConsent, setHasVisitConsent] = useState(false);

  const selectedResident = useMemo(() => residentList.find((resident) => resident.id === selectedId) ?? residentList[0], [residentList, selectedId]);

  const chooseTemplate = (id: string) => {
    const template = prayerTemplates.find((item) => item.id === id) ?? prayerTemplates[0];
    setTemplateId(template.id);
    setPrayerText(template.body.replace("Jane Doe", selectedResident.name).replace("104B", selectedResident.room));
  };

  const submitPrayerRequest = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!hasConsent || !prayerText.trim()) return;

    const newEvent: TimelineEvent = {
      id: `prayer-${Date.now()}`,
      type: "PRAYER",
      title: "Prayer request submitted for review",
      date: "Today",
      actor: "Care Coordinator",
      detail: prayerText.trim()
    };

    setTimeline((items) => [newEvent, ...items]);
    setRecentActivity((items) => [newEvent, ...items].slice(0, 3));
    setPrayerOpen(false);
    setHasConsent(false);
  };


  const resetVisitForm = () => {
    setVisitType(visitTypes[0]);
    setVisitDate(visitDates[0]);
    setCustomVisitDate("");
    setVisitWindow(visitWindows[0]);
    setCustomVisitWindow("");
    setVisitVisitor(visitVisitors[0]);
    setVisitLocation("");
    setVisitNote("");
    setHasVisitConsent(false);
  };

  const closeVisit = () => {
    setVisitOpen(false);
    resetVisitForm();
  };

  const submitVisit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const resolvedDate = visitDate === "Custom" ? customVisitDate : visitDate;
    const resolvedWindow = visitWindow === "Custom" ? customVisitWindow : visitWindow;

    if (!hasVisitConsent || !resolvedDate.trim() || !resolvedWindow.trim() || !visitLocation.trim() || !visitNote.trim()) return;

    const newEvent: TimelineEvent = {
      id: `visit-scheduled-${Date.now()}`,
      type: "VISIT_SCHEDULED",
      title: `${visitType} scheduled`,
      date: "Today",
      actor: visitVisitor,
      detail: `${resolvedDate} · ${resolvedWindow} · ${visitLocation.trim()}. ${visitNote.trim()}`
    };

    setTimeline((items) => [newEvent, ...items]);
    setRecentActivity((items) => [newEvent, ...items].slice(0, 3));
    setResidentList((items) =>
      items.map((resident) =>
        resident.id === selectedResident.id
          ? {
              ...resident,
              priority: "Visit scheduled",
              nextStep: `${visitVisitor} should complete the ${visitType.toLowerCase()} ${resolvedDate.toLowerCase()} during the ${resolvedWindow.toLowerCase()} window, then add a timeline note before any outside action.`
            }
          : resident
      )
    );
    closeVisit();
  };

  const resetFollowUpForm = () => {
    setFollowUpType(followUpTypes[0]);
    setFollowUpDueDate("");
    setFollowUpOwner(followUpOwners[0]);
    setFollowUpNote("");
    setHasFollowUpConsent(false);
  };

  const closeFollowUp = () => {
    setFollowUpOpen(false);
    resetFollowUpForm();
  };

  const submitFollowUp = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!hasFollowUpConsent || !followUpDueDate || !followUpNote.trim()) return;

    const newEvent: TimelineEvent = {
      id: `follow-up-${Date.now()}`,
      type: "FOLLOW_UP",
      title: `${followUpType} follow-up set`,
      date: "Today",
      actor: followUpOwner,
      detail: `Due ${followUpDueDate}. ${followUpNote.trim()}`
    };

    setTimeline((items) => [newEvent, ...items]);
    setRecentActivity((items) => [newEvent, ...items].slice(0, 3));
    setResidentList((items) =>
      items.map((resident) =>
        resident.id === selectedResident.id
          ? {
              ...resident,
              priority: "Follow-up scheduled",
              nextStep: `${followUpOwner} should complete the ${followUpType.toLowerCase()} by ${followUpDueDate}, then add a timeline note before any outside action.`
            }
          : resident
      )
    );
    closeFollowUp();
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] overflow-hidden rounded-[2rem] border border-[#d9d2c4] bg-[#ede6d8] shadow-[0_24px_70px_rgba(38,55,49,0.16)]">
      <div className="border-b border-[#214532]/20 bg-[#173b2d] px-5 py-4 text-white">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#c8d9b3]">Queue → Person → Action → Timeline</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-[-0.03em]">Care Binder</h1>
          </div>
          <p className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-[#edf5e6]">Local demo state · no external action until human review</p>
        </div>
      </div>

      <div className="grid min-h-[760px] lg:grid-cols-[310px_minmax(0,1fr)_300px]">
        <aside className="border-b border-[#d8d0c0] bg-[#f5efe3] lg:border-b-0 lg:border-r">
          <div className="p-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-black uppercase tracking-[0.18em] text-[#53655b]">Care Queue</h2>
              <span className="rounded-full bg-[#dfe8d2] px-2.5 py-1 text-[11px] font-bold text-[#33523d]">{residentList.length} demo residents</span>
            </div>
            <p className="mt-3 text-xs leading-5 text-[#66746b]">Select a resident to open the person record, choose one action, then confirm the timeline update.</p>
            <div className="mt-4 space-y-2">
              {residentList.map((resident) => (
                <button key={resident.id} onClick={() => setSelectedId(resident.id)} className={`w-full rounded-2xl border p-3 text-left transition ${selectedResident.id === resident.id ? "border-[#8da167] bg-white shadow-md" : "border-transparent bg-white/55 hover:border-[#d8d0c0]"}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-[#1f342b]">{resident.name}</p>
                      <p className="mt-1 text-xs text-[#69766c]">Room {resident.room} · Age {resident.age}</p>
                    </div>
                    <span className={`rounded-full px-2 py-1 text-[10px] font-black uppercase ${resident.status === "Active" ? "bg-[#dff2df] text-[#217342]" : "bg-[#fff2c8] text-[#856014]"}`}>{resident.status}</span>
                  </div>
                  <p className="mt-3 text-xs font-semibold text-[#6a5f4c]">{resident.priority}</p>
                </button>
              ))}
            </div>
          </div>
        </aside>

        <main className="bg-[#eee8db] p-5 lg:p-7">
          <section className="rounded-[1.7rem] border border-[#d9d1c2] bg-[#fbf8f0] p-6 shadow-sm">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-serif text-4xl font-semibold tracking-[-0.04em] text-[#1e342b]">{selectedResident.name}</h2>
                  <span className="rounded-full bg-[#dff2df] px-3 py-1 text-xs font-black uppercase tracking-[0.1em] text-[#227343]">{selectedResident.status}</span>
                </div>
                <p className="mt-2 text-sm font-semibold text-[#5c6b62]">Room {selectedResident.room} · Age {selectedResident.age} · {selectedResident.faith}</p>
                <p className="mt-4 max-w-3xl text-base leading-7 text-[#44574f]">{selectedResident.summary}</p>
              </div>
              <div className="rounded-2xl border border-[#e1dacd] bg-[#f4efdf] p-4 xl:w-80">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#657568]">What should happen next?</p>
                <p className="mt-2 text-sm font-semibold leading-6 text-[#20372d]">{selectedResident.nextStep}</p>
              </div>
            </div>
          </section>

          <section className="mt-5 grid gap-5 xl:grid-cols-[1fr_0.92fr]">
            <div className="rounded-[1.7rem] border border-[#d9d1c2] bg-[#fbf8f0] p-6">
              <h3 className="text-sm font-black uppercase tracking-[0.18em] text-[#53655b]">Current Needs</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {selectedResident.needs.map((need) => (
                  <span key={need} className="rounded-full border border-[#ded3bc] bg-[#fffaf0] px-3 py-2 text-xs font-bold text-[#6d5c36]">{need}</span>
                ))}
              </div>
            </div>
            <div className="rounded-[1.7rem] border border-[#d9d1c2] bg-[#fbf8f0] p-6">
              <h3 className="text-sm font-black uppercase tracking-[0.18em] text-[#53655b]">Church Connection</h3>
              <p className="mt-3 font-bold text-[#20372d]">{selectedResident.church}</p>
              <p className="mt-1 text-sm text-[#5f6d64]">Pastor: {selectedResident.pastor}</p>
              <p className="mt-1 text-sm text-[#5f6d64]">Volunteer: {selectedResident.volunteer}</p>
            </div>
          </section>

          <section className="mt-5 rounded-[1.7rem] border border-[#d9d1c2] bg-[#fbf8f0] p-6">
            <h3 className="text-sm font-black uppercase tracking-[0.18em] text-[#53655b]">Spiritual Care Plan</h3>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {selectedResident.carePlan.map((step, index) => (
                <div key={step} className="rounded-2xl border border-[#ded6c8] bg-[#fffaf0] p-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[#7a6a45]">Plan {index + 1}</p>
                  <p className="mt-2 text-sm leading-6 text-[#405249]">{step}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-5 rounded-[1.7rem] border border-[#d9d1c2] bg-[#fbf8f0] p-6">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-sm font-black uppercase tracking-[0.18em] text-[#53655b]">Care Timeline</h3>
              <p className="text-xs font-semibold text-[#69766c]">Newest first</p>
            </div>
            <div className="mt-5 space-y-4">
              {timeline.map((item) => (
                <article key={item.id} className="grid gap-4 border-l-2 border-[#d9d1c2] pl-4 sm:grid-cols-[92px_1fr]">
                  <p className="text-xs font-bold text-[#69766c]">{item.date}</p>
                  <div>
                    <span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${eventStyles(item.type)}`}>{item.type}</span>
                    <h4 className="mt-2 font-bold text-[#1f342b]">{item.title}</h4>
                    <p className="mt-1 text-xs font-bold text-[#6a765f]">{item.actor}</p>
                    <p className="mt-1 text-sm leading-6 text-[#506158]">{item.detail}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </main>

        <aside className="border-t border-[#d8d0c0] bg-[#f5efe3] lg:border-l lg:border-t-0">
          <div className="sticky top-24 p-4">
            <h2 className="text-sm font-black uppercase tracking-[0.18em] text-[#53655b]">Actions</h2>
            <div className="mt-4 space-y-2">
              <button onClick={() => setPrayerOpen(true)} className="w-full rounded-2xl bg-[#173b2d] px-4 py-3 text-left text-sm font-black text-white shadow-md hover:bg-[#234b3b]">
                Send Prayer Request
                <span className="mt-1 block text-xs font-medium text-[#d7e7c5]">Choose, edit, consent, submit</span>
              </button>
              {secondaryActions.map((action) => {
                const isVisitAction = action === "Schedule Visit";
                const isFollowUpAction = action === "Add Follow-Up";
                const actionHandler = isVisitAction ? () => setVisitOpen(true) : isFollowUpAction ? () => setFollowUpOpen(true) : undefined;
                const actionDescription = isVisitAction
                  ? "Plan a consent-confirmed spiritual care visit"
                  : isFollowUpAction
                    ? "Set a consent-confirmed next care touch"
                    : "Scaffolded for a later workflow";

                return (
                  <button key={action} onClick={actionHandler} className="w-full rounded-2xl border border-[#d8d0c0] bg-white/70 px-4 py-3 text-left text-sm font-bold text-[#20372d] hover:bg-white" type="button">
                    {action}
                    <span className="mt-1 block text-xs font-medium text-[#718075]">{actionDescription}</span>
                  </button>
                );
              })}
            </div>

            <section className="mt-6">
              <h3 className="text-xs font-black uppercase tracking-[0.18em] text-[#53655b]">Recent Activity</h3>
              <div className="mt-3 space-y-2">
                {recentActivity.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-[#ded6c8] bg-white/65 p-3">
                    <p className="text-xs font-bold text-[#6d776d]">{item.date} · {item.actor}</p>
                    <p className="mt-1 text-sm font-bold text-[#20372d]">{item.title}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </aside>
      </div>

      {isPrayerOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#132d23]/55 p-4 backdrop-blur-sm">
          <form onSubmit={submitPrayerRequest} className="w-full max-w-2xl rounded-[1.8rem] border border-[#ded6c8] bg-[#fbf8f0] p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#6a7a63]">Human-reviewed action</p>
                <h2 className="mt-2 font-serif text-3xl font-semibold text-[#1f342b]">Send Prayer Request</h2>
                <p className="mt-2 text-sm text-[#5d6b62]">For {selectedResident.name}, Room {selectedResident.room}</p>
              </div>
              <button type="button" onClick={() => setPrayerOpen(false)} className="rounded-full border border-[#d8d0c0] px-3 py-1.5 text-sm font-bold text-[#4d5f55]">Close</button>
            </div>

            <label className="mt-6 block text-sm font-bold text-[#20372d]" htmlFor="prayer-template">Canned template</label>
            <select id="prayer-template" value={templateId} onChange={(event) => chooseTemplate(event.target.value)} className="mt-2 w-full rounded-2xl border border-[#d8d0c0] bg-white px-4 py-3 text-sm text-[#20372d] outline-none ring-[#8aa363] focus:ring-2">
              {prayerTemplates.map((template) => (
                <option key={template.id} value={template.id}>{template.label}</option>
              ))}
            </select>

            <label className="mt-5 block text-sm font-bold text-[#20372d]" htmlFor="prayer-text">Custom prayer/support text</label>
            <textarea id="prayer-text" value={prayerText} onChange={(event) => setPrayerText(event.target.value)} rows={6} className="mt-2 w-full rounded-2xl border border-[#d8d0c0] bg-white px-4 py-3 text-sm leading-6 text-[#20372d] outline-none ring-[#8aa363] focus:ring-2" />

            <label className="mt-5 flex gap-3 rounded-2xl border border-[#e0d6c4] bg-[#fffaf0] p-4 text-sm leading-6 text-[#4f5e54]">
              <input type="checkbox" checked={hasConsent} onChange={(event) => setHasConsent(event.target.checked)} className="mt-1 h-4 w-4 accent-[#173b2d]" />
              <span>I confirm consent is documented and this request will receive human review before any external church or volunteer action.</span>
            </label>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button type="button" onClick={() => setPrayerOpen(false)} className="rounded-full border border-[#cfc5b5] px-5 py-3 text-sm font-black text-[#44564c]">Cancel</button>
              <button type="submit" disabled={!hasConsent || !prayerText.trim()} className="rounded-full bg-[#173b2d] px-6 py-3 text-sm font-black text-white shadow-md hover:bg-[#234b3b] disabled:cursor-not-allowed disabled:bg-[#aab3a8]">Submit Prayer Request</button>
            </div>
          </form>
        </div>
      ) : null}


      {isVisitOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#132d23]/55 p-4 backdrop-blur-sm">
          <form onSubmit={submitVisit} className="w-full max-w-3xl rounded-[1.8rem] border border-[#ded6c8] bg-[#fbf8f0] p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#6a7a63]">Local spiritual support action</p>
                <h2 className="mt-2 font-serif text-3xl font-semibold text-[#1f342b]">Schedule Visit</h2>
                <p className="mt-2 text-sm text-[#5d6b62]">For {selectedResident.name}, Room {selectedResident.room}</p>
              </div>
              <button type="button" onClick={closeVisit} className="rounded-full border border-[#d8d0c0] px-3 py-1.5 text-sm font-bold text-[#4d5f55]">Close</button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-bold text-[#20372d]" htmlFor="visit-type">Visit type</label>
                <select id="visit-type" value={visitType} onChange={(event) => setVisitType(event.target.value)} className="mt-2 w-full rounded-2xl border border-[#d8d0c0] bg-white px-4 py-3 text-sm text-[#20372d] outline-none ring-[#8aa363] focus:ring-2">
                  {visitTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-[#20372d]" htmlFor="visit-visitor">Assigned visitor</label>
                <select id="visit-visitor" value={visitVisitor} onChange={(event) => setVisitVisitor(event.target.value)} className="mt-2 w-full rounded-2xl border border-[#d8d0c0] bg-white px-4 py-3 text-sm text-[#20372d] outline-none ring-[#8aa363] focus:ring-2">
                  {visitVisitors.map((visitor) => (
                    <option key={visitor} value={visitor}>{visitor}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-[#20372d]" htmlFor="visit-date">Date</label>
                <select id="visit-date" value={visitDate} onChange={(event) => setVisitDate(event.target.value)} className="mt-2 w-full rounded-2xl border border-[#d8d0c0] bg-white px-4 py-3 text-sm text-[#20372d] outline-none ring-[#8aa363] focus:ring-2">
                  {visitDates.map((date) => (
                    <option key={date} value={date}>{date}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-[#20372d]" htmlFor="visit-window">Time window</label>
                <select id="visit-window" value={visitWindow} onChange={(event) => setVisitWindow(event.target.value)} className="mt-2 w-full rounded-2xl border border-[#d8d0c0] bg-white px-4 py-3 text-sm text-[#20372d] outline-none ring-[#8aa363] focus:ring-2">
                  {visitWindows.map((window) => (
                    <option key={window} value={window}>{window}</option>
                  ))}
                </select>
              </div>
              {visitDate === "Custom" ? (
                <div>
                  <label className="block text-sm font-bold text-[#20372d]" htmlFor="custom-visit-date">Custom date</label>
                  <input id="custom-visit-date" value={customVisitDate} onChange={(event) => setCustomVisitDate(event.target.value)} placeholder="Example: Friday after lunch" className="mt-2 w-full rounded-2xl border border-[#d8d0c0] bg-white px-4 py-3 text-sm text-[#20372d] outline-none ring-[#8aa363] focus:ring-2" />
                </div>
              ) : null}
              {visitWindow === "Custom" ? (
                <div>
                  <label className="block text-sm font-bold text-[#20372d]" htmlFor="custom-visit-window">Custom time window</label>
                  <input id="custom-visit-window" value={customVisitWindow} onChange={(event) => setCustomVisitWindow(event.target.value)} placeholder="Example: 2:00–3:00 PM" className="mt-2 w-full rounded-2xl border border-[#d8d0c0] bg-white px-4 py-3 text-sm text-[#20372d] outline-none ring-[#8aa363] focus:ring-2" />
                </div>
              ) : null}
            </div>

            <label className="mt-5 block text-sm font-bold text-[#20372d]" htmlFor="visit-location">Location / room</label>
            <input id="visit-location" value={visitLocation} onChange={(event) => setVisitLocation(event.target.value)} placeholder={`Room ${selectedResident.room} or approved chapel/common area`} className="mt-2 w-full rounded-2xl border border-[#d8d0c0] bg-white px-4 py-3 text-sm text-[#20372d] outline-none ring-[#8aa363] focus:ring-2" />

            <label className="mt-5 block text-sm font-bold text-[#20372d]" htmlFor="visit-note">Visit note</label>
            <textarea id="visit-note" value={visitNote} onChange={(event) => setVisitNote(event.target.value)} rows={4} placeholder="Describe the safe spiritual support purpose for this visit." className="mt-2 w-full rounded-2xl border border-[#d8d0c0] bg-white px-4 py-3 text-sm leading-6 text-[#20372d] outline-none ring-[#8aa363] focus:ring-2" />

            <label className="mt-5 flex gap-3 rounded-2xl border border-[#e0d6c4] bg-[#fffaf0] p-4 text-sm leading-6 text-[#4f5e54]">
              <input type="checkbox" checked={hasVisitConsent} onChange={(event) => setHasVisitConsent(event.target.checked)} className="mt-1 h-4 w-4 accent-[#173b2d]" />
              <span>I confirm the resident&apos;s consent and care preferences support this spiritual support visit, and any outside contact still requires human review.</span>
            </label>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button type="button" onClick={closeVisit} className="rounded-full border border-[#cfc5b5] px-5 py-3 text-sm font-black text-[#44564c]">Cancel</button>
              <button type="submit" disabled={!hasVisitConsent || !(visitDate === "Custom" ? customVisitDate.trim() : visitDate) || !(visitWindow === "Custom" ? customVisitWindow.trim() : visitWindow) || !visitLocation.trim() || !visitNote.trim()} className="rounded-full bg-[#173b2d] px-6 py-3 text-sm font-black text-white shadow-md hover:bg-[#234b3b] disabled:cursor-not-allowed disabled:bg-[#aab3a8]">Schedule Visit</button>
            </div>
          </form>
        </div>
      ) : null}

      {isFollowUpOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#132d23]/55 p-4 backdrop-blur-sm">
          <form onSubmit={submitFollowUp} className="w-full max-w-2xl rounded-[1.8rem] border border-[#ded6c8] bg-[#fbf8f0] p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#6a7a63]">Local care action</p>
                <h2 className="mt-2 font-serif text-3xl font-semibold text-[#1f342b]">Add Follow-Up</h2>
                <p className="mt-2 text-sm text-[#5d6b62]">For {selectedResident.name}, Room {selectedResident.room}</p>
              </div>
              <button type="button" onClick={closeFollowUp} className="rounded-full border border-[#d8d0c0] px-3 py-1.5 text-sm font-bold text-[#4d5f55]">Close</button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-bold text-[#20372d]" htmlFor="follow-up-type">Follow-up type</label>
                <select id="follow-up-type" value={followUpType} onChange={(event) => setFollowUpType(event.target.value)} className="mt-2 w-full rounded-2xl border border-[#d8d0c0] bg-white px-4 py-3 text-sm text-[#20372d] outline-none ring-[#8aa363] focus:ring-2">
                  {followUpTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-[#20372d]" htmlFor="follow-up-due-date">Due date</label>
                <input id="follow-up-due-date" type="date" value={followUpDueDate} onChange={(event) => setFollowUpDueDate(event.target.value)} className="mt-2 w-full rounded-2xl border border-[#d8d0c0] bg-white px-4 py-3 text-sm text-[#20372d] outline-none ring-[#8aa363] focus:ring-2" />
              </div>
            </div>

            <label className="mt-5 block text-sm font-bold text-[#20372d]" htmlFor="follow-up-owner">Owner</label>
            <select id="follow-up-owner" value={followUpOwner} onChange={(event) => setFollowUpOwner(event.target.value)} className="mt-2 w-full rounded-2xl border border-[#d8d0c0] bg-white px-4 py-3 text-sm text-[#20372d] outline-none ring-[#8aa363] focus:ring-2">
              {followUpOwners.map((owner) => (
                <option key={owner} value={owner}>{owner}</option>
              ))}
            </select>

            <label className="mt-5 block text-sm font-bold text-[#20372d]" htmlFor="follow-up-note">Care note</label>
            <textarea id="follow-up-note" value={followUpNote} onChange={(event) => setFollowUpNote(event.target.value)} rows={4} placeholder="Describe the next safe spiritual support step." className="mt-2 w-full rounded-2xl border border-[#d8d0c0] bg-white px-4 py-3 text-sm leading-6 text-[#20372d] outline-none ring-[#8aa363] focus:ring-2" />

            <label className="mt-5 flex gap-3 rounded-2xl border border-[#e0d6c4] bg-[#fffaf0] p-4 text-sm leading-6 text-[#4f5e54]">
              <input type="checkbox" checked={hasFollowUpConsent} onChange={(event) => setHasFollowUpConsent(event.target.checked)} className="mt-1 h-4 w-4 accent-[#173b2d]" />
              <span>I confirm the resident&apos;s consent and care preferences support this follow-up, and any external contact still requires human review.</span>
            </label>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button type="button" onClick={closeFollowUp} className="rounded-full border border-[#cfc5b5] px-5 py-3 text-sm font-black text-[#44564c]">Cancel</button>
              <button type="submit" disabled={!hasFollowUpConsent || !followUpDueDate || !followUpNote.trim()} className="rounded-full bg-[#173b2d] px-6 py-3 text-sm font-black text-white shadow-md hover:bg-[#234b3b] disabled:cursor-not-allowed disabled:bg-[#aab3a8]">Add Follow-Up</button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}
