"use client";

import { FormEvent, useMemo, useState } from "react";

type TimelineEvent = {
  id: string;
  type: "VISIT" | "PRAYER" | "CHURCH" | "NOTE";
  title: string;
  detail: string;
  time: string;
};

type Resident = {
  id: string;
  name: string;
  room: string;
  faith: string;
  status: "Active" | "Monitoring" | "New";
  priority: string;
  summary: string;
  nextStep: string;
  needs: string[];
};

const residents: Resident[] = [
  {
    id: "jane-doe",
    name: "Jane Doe",
    room: "104B",
    faith: "Protestant",
    status: "Active",
    priority: "High comfort",
    summary: "Requests gentle prayer, familiar hymns, and short visits when awake.",
    nextStep: "Send a reviewed prayer request to her church care contact.",
    needs: ["Communion service", "Prayer support", "Weekly visit", "Family outreach"]
  },
  {
    id: "alex-lee",
    name: "Alex Lee",
    room: "108A",
    faith: "Catholic",
    status: "New",
    priority: "Intake needed",
    summary: "New resident. Staff should confirm preferred clergy contact before outreach.",
    nextStep: "Confirm consent and preferred parish contact.",
    needs: ["Clergy intro", "Consent review"]
  },
  {
    id: "mary-johnson",
    name: "Mary Johnson",
    room: "112C",
    faith: "Baptist",
    status: "Monitoring",
    priority: "Follow-up",
    summary: "Enjoys scripture readings and brief encouragement notes after therapy.",
    nextStep: "Schedule next volunteer visit window.",
    needs: ["Scripture reading", "Visit scheduling"]
  },
  {
    id: "robert-smith",
    name: "Robert Smith",
    room: "119A",
    faith: "Methodist",
    status: "Active",
    priority: "Routine",
    summary: "Prefers Sunday bulletin delivery and quiet pastoral check-ins.",
    nextStep: "Add a follow-up note after the next visit.",
    needs: ["Bulletin", "Pastoral check-in"]
  }
];

const initialTimeline: TimelineEvent[] = [
  {
    id: "visit-complete",
    type: "VISIT",
    title: "Volunteer visit completed",
    detail: "Sarah K. completed a short comfort visit and marked Jane receptive.",
    time: "Today · 9:20 AM"
  },
  {
    id: "prayer-logged",
    type: "PRAYER",
    title: "Prayer request logged",
    detail: "Staff prepared a Protestant prayer request for human review.",
    time: "Yesterday · 4:10 PM"
  },
  {
    id: "church-contact",
    type: "CHURCH",
    title: "Church contact made",
    detail: "First Assembly care team confirmed their weekly volunteer window.",
    time: "Jun 18 · 2:30 PM"
  },
  {
    id: "intake-note",
    type: "NOTE",
    title: "Initial spiritual care visit",
    detail: "Resident welcomed Protestant care connection and short prayer support.",
    time: "Jun 16 · 10:45 AM"
  }
];

const prayerTemplates = [
  {
    id: "comfort",
    label: "Comfort & peace",
    body: "Please pray for Jane Doe in Room 104B, asking for comfort, peace, and reassurance today. She welcomes Protestant prayer support and a gentle message of encouragement."
  },
  {
    id: "strength",
    label: "Strength for the week",
    body: "Please pray that Jane Doe feels steady, cared for, and strengthened this week. A short, warm note from the church care team would be appreciated."
  },
  {
    id: "family",
    label: "Family encouragement",
    body: "Please pray for Jane Doe and her family, asking that they feel supported, hopeful, and surrounded by compassionate care."
  }
];

const actionButtons = [
  "Schedule Visit",
  "Contact Church",
  "Assign Volunteer",
  "Add Follow-Up",
  "Add Note",
  "Message Care Team"
];

function eventStyles(type: TimelineEvent["type"]) {
  if (type === "PRAYER") return "border-[#d8c6ff] bg-[#f5efff] text-[#5b3d91]";
  if (type === "VISIT") return "border-[#bfe4c7] bg-[#effaf0] text-[#2f6f45]";
  if (type === "CHURCH") return "border-[#f3d59d] bg-[#fff8e8] text-[#806020]";
  return "border-[#cdd7df] bg-[#f5f8fa] text-[#405a6b]";
}

export default function CareBinderPage() {
  const [selectedId, setSelectedId] = useState("jane-doe");
  const [timeline, setTimeline] = useState(initialTimeline);
  const [recentActivity, setRecentActivity] = useState(initialTimeline.slice(0, 3));
  const [isPrayerOpen, setPrayerOpen] = useState(false);
  const [templateId, setTemplateId] = useState(prayerTemplates[0].id);
  const [prayerText, setPrayerText] = useState(prayerTemplates[0].body);
  const [hasConsent, setHasConsent] = useState(false);

  const selectedResident = useMemo(
    () => residents.find((resident) => resident.id === selectedId) ?? residents[0],
    [selectedId]
  );

  const chooseTemplate = (id: string) => {
    const template = prayerTemplates.find((item) => item.id === id) ?? prayerTemplates[0];
    setTemplateId(template.id);
    setPrayerText(template.body);
  };

  const submitPrayerRequest = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!hasConsent || !prayerText.trim()) return;

    const newEvent: TimelineEvent = {
      id: `prayer-${Date.now()}`,
      type: "PRAYER",
      title: "Prayer request sent for review",
      detail: prayerText.trim(),
      time: "Just now"
    };

    setTimeline((items) => [newEvent, ...items]);
    setRecentActivity((items) => [newEvent, ...items].slice(0, 3));
    setPrayerOpen(false);
    setHasConsent(false);
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] overflow-hidden rounded-[2rem] border border-[#d9d2c4] bg-[#ede6d8] shadow-[0_24px_70px_rgba(38,55,49,0.16)]">
      <div className="border-b border-[#214532]/20 bg-[#173b2d] px-5 py-3 text-white">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#c8d9b3]">Resident Care Binder</p>
            <h1 className="mt-1 text-xl font-semibold tracking-[-0.02em]">Spiritual Solace V1 Care Binder</h1>
          </div>
          <p className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-[#edf5e6]">Demo data only · human review required before external action</p>
        </div>
      </div>

      <div className="grid min-h-[760px] lg:grid-cols-[280px_minmax(0,1fr)_260px]">
        <aside className="border-b border-[#d8d0c0] bg-[#f5efe3] lg:border-b-0 lg:border-r">
          <div className="p-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-black uppercase tracking-[0.18em] text-[#53655b]">Care Queue</h2>
              <span className="rounded-full bg-[#dfe8d2] px-2.5 py-1 text-[11px] font-bold text-[#33523d]">{residents.length} active</span>
            </div>
            <input className="mt-4 w-full rounded-xl border border-[#d8d0c0] bg-white px-3 py-2 text-sm outline-none ring-[#8aa363] focus:ring-2" placeholder="Search residents..." />
            <div className="mt-4 space-y-2">
              {residents.map((resident) => (
                <button
                  key={resident.id}
                  onClick={() => setSelectedId(resident.id)}
                  className={`w-full rounded-2xl border p-3 text-left transition ${selectedResident.id === resident.id ? "border-[#8da167] bg-white shadow-md" : "border-transparent bg-white/55 hover:border-[#d8d0c0]"}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-[#1f342b]">{resident.name}</p>
                      <p className="mt-1 text-xs text-[#69766c]">Room {resident.room} · {resident.faith}</p>
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
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-serif text-4xl font-semibold tracking-[-0.04em] text-[#1e342b]">{selectedResident.name}</h2>
                  <span className="rounded-full bg-[#dff2df] px-3 py-1 text-xs font-black uppercase tracking-[0.1em] text-[#227343]">{selectedResident.status}</span>
                </div>
                <p className="mt-2 text-sm font-semibold text-[#5c6b62]">Room {selectedResident.room} · {selectedResident.faith} · Care Need: Spiritual support</p>
                <p className="mt-4 max-w-3xl text-base leading-7 text-[#44574f]">{selectedResident.summary}</p>
              </div>
              <div className="rounded-2xl border border-[#e1dacd] bg-[#f4efdf] p-4 lg:w-72">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#657568]">What should happen next?</p>
                <p className="mt-2 text-sm font-semibold leading-6 text-[#20372d]">{selectedResident.nextStep}</p>
              </div>
            </div>
          </section>

          <section className="mt-5 rounded-[1.7rem] border border-[#d9d1c2] bg-[#fbf8f0] p-6">
            <h3 className="text-sm font-black uppercase tracking-[0.18em] text-[#53655b]">Current Needs</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedResident.needs.map((need) => (
                <span key={need} className="rounded-full border border-[#ded3bc] bg-[#fffaf0] px-3 py-2 text-xs font-bold text-[#6d5c36]">{need}</span>
              ))}
              <button className="rounded-full border border-dashed border-[#b9ad97] px-3 py-2 text-xs font-bold text-[#647063]">+ Add need</button>
            </div>
          </section>

          <section className="mt-5 rounded-[1.7rem] border border-[#d9d1c2] bg-[#fbf8f0] p-6">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-sm font-black uppercase tracking-[0.18em] text-[#53655b]">Care Timeline</h3>
              <p className="text-xs font-semibold text-[#69766c]">Newest first</p>
            </div>
            <div className="mt-5 space-y-4">
              {timeline.map((item) => (
                <article key={item.id} className="grid gap-4 border-l-2 border-[#d9d1c2] pl-4 sm:grid-cols-[110px_1fr]">
                  <p className="text-xs font-bold text-[#69766c]">{item.time}</p>
                  <div>
                    <span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${eventStyles(item.type)}`}>{item.type}</span>
                    <h4 className="mt-2 font-bold text-[#1f342b]">{item.title}</h4>
                    <p className="mt-1 text-sm leading-6 text-[#506158]">{item.detail}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-5 grid gap-5 xl:grid-cols-2">
            <div className="rounded-[1.7rem] border border-[#d9d1c2] bg-[#fbf8f0] p-6">
              <h3 className="text-sm font-black uppercase tracking-[0.18em] text-[#53655b]">Church Connection</h3>
              <p className="mt-3 font-bold text-[#20372d]">First Assembly of God</p>
              <p className="mt-1 text-sm text-[#5f6d64]">Care contact: Pastor Michael Torres · Weekly volunteer: Sarah K.</p>
            </div>
            <div className="rounded-[1.7rem] border border-[#d9d1c2] bg-[#fffbea] p-6">
              <h3 className="text-sm font-black uppercase tracking-[0.18em] text-[#8a7335]">Important Note</h3>
              <p className="mt-3 text-sm leading-6 text-[#5f553c]">Confirm consent and use approved, non-clinical language before any external church or volunteer communication.</p>
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
              {actionButtons.map((action) => (
                <button key={action} className="w-full rounded-2xl border border-[#d8d0c0] bg-white/70 px-4 py-3 text-left text-sm font-bold text-[#20372d] hover:bg-white">
                  {action}
                  <span className="mt-1 block text-xs font-medium text-[#718075]">Scaffolded for V1 workflow</span>
                </button>
              ))}
            </div>

            <section className="mt-6">
              <h3 className="text-xs font-black uppercase tracking-[0.18em] text-[#53655b]">Recent Activity</h3>
              <div className="mt-3 space-y-2">
                {recentActivity.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-[#ded6c8] bg-white/65 p-3">
                    <p className="text-xs font-bold text-[#6d776d]">{item.time}</p>
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

            <label className="mt-5 block text-sm font-bold text-[#20372d]" htmlFor="prayer-text">Editable request text</label>
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
    </div>
  );
}
