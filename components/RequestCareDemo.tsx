"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { driver, type DriveStep } from "driver.js";
import "driver.js/dist/driver.css";

type DemoRequestPayload = {
  requesterProfileMode: string;
  requesterRole: string;
  requesterName: string;
  relationship: string;
  requesterContact: string;
  contactPreference: string;
  requesterZip: string;
  requesterAffiliation: string;
  recipientName: string;
  locationName: string;
  roomOrUnit: string;
  careType: string;
  urgency: string;
  notes: string;
  status: "demo-only";
  source: "requester-demo";
};

type RequesterTourStep = {
  id: string;
  target: string;
  title: string;
  description: string;
};

type NearbyPartner = {
  name: string;
  type: string;
  distance: string;
  focus: string;
  status: string;
};

const careTypes = ["Prayer", "Visit", "Family support", "Pastoral follow-up", "Church connection", "Other"];
const urgencyOptions = ["Today", "This week", "Not urgent", "Unsure"];
const contactPreferences = ["Phone", "Email", "Text message", "Facility staff follow-up"];
const requesterProfileModes = ["Quick: name + relationship", "Detailed: contact, ZIP, affiliation, permissions"];
const requesterRoles = ["Family member", "Resident", "Facility staff", "Church member", "Community partner", "Other"];
const demoStages = ["Requester info", "Care need", "Nearby partners", "Queue card", "Care team demo"];

const nearbyPartners: NearbyPartner[] = [
  {
    name: "Hope Baptist Church",
    type: "Church partner",
    distance: "1.8 mi",
    focus: "Prayer support, brief visits",
    status: "Suggested only"
  },
  {
    name: "First Assembly Care Team",
    type: "Ministry group",
    distance: "2.4 mi",
    focus: "Volunteer visits, family encouragement",
    status: "Facility approval needed"
  },
  {
    name: "Community Chaplain Network",
    type: "Care group",
    distance: "3.1 mi",
    focus: "Pastoral follow-up, grief support",
    status: "Future partner lookup"
  }
];

const requesterTourSteps: RequesterTourStep[] = [
  {
    id: "requester-demo-header",
    target: '[data-demo-target="requester-demo-header"]',
    title: "Requester-side preview",
    description:
      "This is the requester side of ChurchWork. It shows how a family member, resident, staff member, church member, or facility partner can prepare a care need for review."
  },
  {
    id: "requester-demo-safety",
    target: '[data-demo-target="requester-demo-safety"]',
    title: "Demo-only guardrail",
    description:
      "This preview uses local page state only. It demonstrates the future flow without turning on live intake, accounts, or conversation features."
  },
  {
    id: "requester-demo-hero",
    target: '[data-demo-target="requester-demo-hero"]',
    title: "The front door for care",
    description:
      "The requester experience is the compassionate front door. People do not need to know who to call. They provide enough context for a human care coordinator to review next steps."
  },
  {
    id: "requester-demo-stages",
    target: '[data-demo-target="requester-demo-stages"]',
    title: "Requester information comes first",
    description:
      "The first step is identifying who is making the request. ChurchWork can support a quick name-and-relationship flow or a deeper requester profile when a facility wants more context."
  },
  {
    id: "requester-demo-flow",
    target: '[data-demo-target="requester-demo-flow"]',
    title: "Future platform flow",
    description:
      "Later, Supabase can turn this same intake shape into a reviewed care team queue item, then a Care Binder timeline action."
  },
  {
    id: "requester-demo-profile",
    target: '[data-demo-target="requester-demo-profile"]',
    title: "Step 1: requester profile",
    description:
      "A requester profile can be lightweight or detailed. In this demo, it stays local and does not create an account, login, saved profile, inbox, or two-way conversation."
  },
  {
    id: "requester-demo-form",
    target: '[data-demo-target="requester-demo-form"]',
    title: "Step 2: care need",
    description:
      "After requester information, the form gathers the person, location, care type, urgency, and context so a facility care coordinator can review the next safe step."
  },
  {
    id: "requester-demo-care-type",
    target: '[data-demo-target="requester-demo-care-type"]',
    title: "Template-friendly care type",
    description:
      "Care types map to reviewed templates and facility policy. This supports prayer, visits, family support, pastoral follow-up, and church connection without opening two-way chat."
  },
  {
    id: "requester-demo-partners",
    target: '[data-demo-target="requester-demo-partners"]',
    title: "Future ZIP-based partner suggestions",
    description:
      "ZIP code can eventually suggest nearby churches and care groups. This demo only shows a placeholder list; nothing is looked up, selected, routed, or sent."
  },
  {
    id: "requester-demo-payload",
    target: '[data-demo-target="requester-demo-payload"]',
    title: "What the care team would receive",
    description:
      "The right side shows the future care-team-aligned shape. It is the bridge between a requester need and the Facility and Partner views."
  },
  {
    id: "requester-demo-submit",
    target: '[data-demo-target="requester-demo-submit"]',
    title: "Preview the queue card",
    description:
      "Use this button to prepare a local preview card. After that, continue to the Care Team Workspace demo to show how facility and partner lenses review and act."
  }
];

const fieldClass =
  "mt-2 min-h-12 w-full rounded-2xl border border-[#d8d0c0] bg-white px-4 py-3 text-base text-[#20372d] outline-none ring-[#8aa363]/20 transition focus:border-[#8aa363] focus:ring-4";
const labelClass = "block text-sm font-bold text-[#20372d]";

type RequesterDemoDriver = ReturnType<typeof driver>;

function createRequesterDriverSteps(): DriveStep[] {
  return requesterTourSteps.map((step) => ({
    element: step.target,
    popover: {
      title: step.title,
      description: step.description,
      side: "bottom",
      align: "start"
    }
  }));
}

function findRequesterTourStep(element?: Element): RequesterTourStep | undefined {
  if (!element) return undefined;

  return requesterTourSteps.find((step) => {
    try {
      return element.matches(step.target);
    } catch {
      return false;
    }
  });
}

function canUseBrowserSpeech() {
  return typeof window !== "undefined" && "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
}

function chooseFriendlyVoice() {
  if (!canUseBrowserSpeech()) return undefined;

  const voices = window.speechSynthesis.getVoices();
  return voices.find((voice) => /samantha|ava|jenny|aria|emma|natural|female|warm/i.test(`${voice.name} ${voice.voiceURI}`)) ?? voices.find((voice) => voice.lang.toLowerCase().startsWith("en")) ?? voices[0];
}

function stopRequesterNarration() {
  if (canUseBrowserSpeech()) window.speechSynthesis.cancel();
}

function speakRequesterTourStep(step?: RequesterTourStep, isMuted = false) {
  stopRequesterNarration();
  if (!step || isMuted || !canUseBrowserSpeech()) return;

  const utterance = new SpeechSynthesisUtterance(step.description);
  utterance.rate = 0.94;
  utterance.pitch = 1.02;
  utterance.volume = 0.86;
  const friendlyVoice = chooseFriendlyVoice();
  if (friendlyVoice) utterance.voice = friendlyVoice;

  window.speechSynthesis.speak(utterance);
}

export function RequestCareDemo({ autoStartDemo = false }: { autoStartDemo?: boolean }) {
  const [requesterProfileMode, setRequesterProfileMode] = useState(requesterProfileModes[0]);
  const [requesterRole, setRequesterRole] = useState(requesterRoles[0]);
  const [requesterName, setRequesterName] = useState("Sarah Johnson");
  const [relationship, setRelationship] = useState("Daughter");
  const [contactPreference, setContactPreference] = useState(contactPreferences[0]);
  const [requesterContact, setRequesterContact] = useState("Demo phone number");
  const [requesterZip, setRequesterZip] = useState("38501");
  const [requesterAffiliation, setRequesterAffiliation] = useState("No church affiliation provided yet");
  const [recipientName, setRecipientName] = useState("Mary Johnson");
  const [locationName, setLocationName] = useState("Bethesda Senior Living");
  const [roomOrUnit, setRoomOrUnit] = useState("Room 214");
  const [careType, setCareType] = useState(careTypes[0]);
  const [urgency, setUrgency] = useState(urgencyOptions[0]);
  const [notes, setNotes] = useState(
    "Mom asked for prayer and a short visit this week. Family would appreciate a gentle follow-up after the visit."
  );
  const [submittedPayload, setSubmittedPayload] = useState<DemoRequestPayload | null>(null);
  const [isVoiceMuted, setVoiceMuted] = useState(false);
  const driverRef = useRef<RequesterDemoDriver | null>(null);
  const activeTourStepRef = useRef<RequesterTourStep | undefined>(undefined);
  const hasAutoStartedDemoRef = useRef(false);

  const previewPayload = useMemo<DemoRequestPayload>(
    () => ({
      requesterProfileMode,
      requesterRole,
      requesterName,
      relationship,
      requesterContact,
      contactPreference,
      requesterZip,
      requesterAffiliation,
      recipientName,
      locationName,
      roomOrUnit,
      careType,
      urgency,
      notes,
      status: "demo-only",
      source: "requester-demo"
    }),
    [careType, contactPreference, locationName, notes, recipientName, relationship, requesterAffiliation, requesterContact, requesterName, requesterProfileMode, requesterRole, requesterZip, roomOrUnit, urgency]
  );

  const startGuidedDemo = useCallback(() => {
    stopRequesterNarration();
    driverRef.current?.destroy();
    activeTourStepRef.current = undefined;

    const tour = driver({
      showProgress: true,
      allowClose: true,
      overlayOpacity: 0.55,
      stagePadding: 8,
      nextBtnText: "Next",
      prevBtnText: "Back",
      doneBtnText: "Done",
      progressText: "Step {{current}} of {{total}}",
      onHighlighted: (element?: Element) => {
        const activeStep = findRequesterTourStep(element);
        activeTourStepRef.current = activeStep;
        speakRequesterTourStep(activeStep, isVoiceMuted);
      },
      onDestroyed: () => {
        stopRequesterNarration();
        driverRef.current = null;
      },
      steps: createRequesterDriverSteps()
    });

    driverRef.current = tour;
    tour.drive();
  }, [isVoiceMuted]);

  useEffect(() => {
    if (!autoStartDemo || hasAutoStartedDemoRef.current) return;

    hasAutoStartedDemoRef.current = true;
    const demoTimer = window.setTimeout(() => {
      startGuidedDemo();
    }, 500);

    return () => window.clearTimeout(demoTimer);
  }, [autoStartDemo, startGuidedDemo]);

  useEffect(() => {
    return () => {
      stopRequesterNarration();
      driverRef.current?.destroy();
    };
  }, []);

  function submitDemoRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmittedPayload(previewPayload);
  }

  function resetDemo() {
    setSubmittedPayload(null);
  }

  function replayNarration() {
    speakRequesterTourStep(activeTourStepRef.current, isVoiceMuted);
  }

  function toggleVoice() {
    const nextMuted = !isVoiceMuted;
    setVoiceMuted(nextMuted);
    if (nextMuted) stopRequesterNarration();
  }

  const visiblePayload = submittedPayload ?? previewPayload;

  return (
    <main className="min-h-screen bg-[#f7f3ea] px-4 py-5 text-[#102b3a] sm:px-6 md:py-8">
      <div className="mx-auto max-w-7xl">
        <header data-demo-target="requester-demo-header" className="flex flex-col gap-4 rounded-[1.6rem] border border-[#d8d0c0] bg-[#0d2b3b] p-5 text-white shadow-xl md:rounded-[2rem] md:p-6 lg:flex-row lg:items-center lg:justify-between">
          <Link href="/" className="flex items-center gap-3">
            <span className="text-4xl leading-none">🕊</span>
            <span>
              <span className="block text-3xl font-semibold leading-none tracking-[-0.04em]">
                Church<span className="text-[#9fb36b]">Work</span>
              </span>
              <span className="mt-1 block text-xs tracking-wide text-[#d4dedc]">Requester demo preview</span>
            </span>
          </Link>
          <div className="grid gap-3 sm:grid-cols-2 lg:flex lg:flex-wrap">
            <button type="button" onClick={startGuidedDemo} className="inline-flex justify-center rounded-full bg-white px-5 py-3 text-sm font-black text-[#173b2d] shadow-lg hover:bg-[#f0f5e8]">
              Start Guided Demo
            </button>
            <button type="button" onClick={toggleVoice} className="inline-flex justify-center rounded-full border border-white/35 px-5 py-3 text-sm font-black text-white hover:bg-white/10">
              {isVoiceMuted ? "Voice Off" : "Voice On"}
            </button>
            <button type="button" onClick={replayNarration} className="inline-flex justify-center rounded-full border border-white/35 px-5 py-3 text-sm font-black text-white hover:bg-white/10">
              Replay Voice
            </button>
            <Link href="/care-binder?demo=true" className="inline-flex justify-center rounded-full border border-white/35 px-5 py-3 text-sm font-black text-white hover:bg-white/10">
              View Care Team Demo
            </Link>
            <Link href="/" className="inline-flex justify-center rounded-full bg-[#86a45f] px-5 py-3 text-sm font-black text-white shadow-lg hover:bg-[#789752]">
              Back to Landing
            </Link>
          </div>
        </header>

        <section data-demo-target="requester-demo-safety" className="mt-5 rounded-[1.6rem] border border-[#ddb66c] bg-[#fff8ed] p-4 text-sm leading-7 text-[#6b5b45] shadow-sm md:mt-6 md:rounded-[2rem] md:p-5">
          <strong className="text-[#173b2d]">Demo only:</strong> this preview uses local page state only. It shows the future requester-to-care-team flow for pilot review. No requester account, saved profile, live lookup, routing, or two-way conversation is created.
        </section>

        <section className="mt-5 rounded-[1.6rem] border border-[#d8d0c0] bg-white/85 p-5 shadow-sm md:mt-6 md:rounded-[2rem] md:p-8">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div data-demo-target="requester-demo-hero">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#789052]">Gated requester preview</p>
              <h1 className="mt-3 font-serif text-4xl font-semibold leading-tight tracking-[-0.04em] text-[#102b3a] md:text-6xl">
                Start with who is asking for care.
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-[#4d5d55]">
                ChurchWork can begin with a quick requester name and relationship, or a deeper requester profile when a facility wants contact preference, role, ZIP, affiliation, and follow-up permissions. Tonight it remains a guided preview only.
              </p>
              <DemoStepper />
            </div>

            <aside data-demo-target="requester-demo-flow" className="rounded-[1.5rem] border border-[#d8d0c0] bg-[#173b2d] p-5 text-white shadow-lg md:rounded-[1.7rem] md:p-6">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#c8d9b3]">Future platform flow</p>
              <div className="mt-5 space-y-3 text-sm font-bold">
                <div className="rounded-2xl bg-white/10 p-4">Requester information first</div>
                <div className="pl-4 text-[#c8d9b3]">↓</div>
                <div className="rounded-2xl bg-white/10 p-4">Care need prepared</div>
                <div className="pl-4 text-[#c8d9b3]">↓</div>
                <div className="rounded-2xl bg-white/10 p-4">ZIP suggests nearby partners</div>
                <div className="pl-4 text-[#c8d9b3]">↓</div>
                <div className="rounded-2xl bg-white/10 p-4">Facility-reviewed queue card</div>
                <div className="pl-4 text-[#c8d9b3]">↓</div>
                <div className="rounded-2xl bg-white/10 p-4">Care Team Workspace lenses</div>
              </div>
            </aside>
          </div>
        </section>

        {submittedPayload ? (
          <section aria-live="polite" className="mt-5 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
            <div className="rounded-[1.6rem] border border-[#d8d0c0] bg-white p-5 shadow-sm md:rounded-[2rem] md:p-8">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#789052]">Demo confirmation</p>
              <h2 className="mt-3 font-serif text-4xl font-semibold tracking-[-0.04em] text-[#102b3a]">Preview queue card prepared</h2>
              <p className="mt-4 text-base leading-8 text-[#4d5d55]">
                In the live ChurchWork workflow, this would be routed into the facility-reviewed care team queue. In this pilot preview, it stays on this page only.
              </p>

              <div className="mt-6 rounded-[1.5rem] border border-[#d8d6d1] bg-[#f8fbf8] p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#4d5f6c]">Future care queue card</p>
                  <span className="rounded-full bg-[#fff4df] px-3 py-1 text-xs font-black uppercase tracking-[0.1em] text-[#76501a]">Demo only</span>
                </div>
                <h3 className="mt-3 text-2xl font-bold text-[#1e2b3f]">{submittedPayload.recipientName}</h3>
                <p className="mt-1 text-sm font-semibold text-[#65717a]">
                  {submittedPayload.locationName} {submittedPayload.roomOrUnit ? `· ${submittedPayload.roomOrUnit}` : ""}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-[#eef6f0] px-3 py-1 text-xs font-black uppercase tracking-[0.1em] text-[#315f44]">{submittedPayload.careType}</span>
                  <span className="rounded-full bg-[#fff4df] px-3 py-1 text-xs font-black uppercase tracking-[0.1em] text-[#76501a]">{submittedPayload.urgency}</span>
                  <span className="rounded-full bg-[#f4effc] px-3 py-1 text-xs font-black uppercase tracking-[0.1em] text-[#5b4a83]">New request</span>
                </div>
                <p className="mt-4 text-sm leading-7 text-[#4b5b66]">{submittedPayload.notes}</p>
                <p className="mt-4 text-xs font-bold text-[#65717a]">
                  Requested by {submittedPayload.requesterName} · {submittedPayload.relationship} · {submittedPayload.contactPreference}: {submittedPayload.requesterContact}
                </p>
                <p className="mt-2 text-xs font-bold text-[#65717a]">
                  Requester profile: {submittedPayload.requesterProfileMode} · {submittedPayload.requesterRole} · ZIP {submittedPayload.requesterZip}
                </p>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <Link href="/care-binder?demo=true" className="inline-flex justify-center rounded-full bg-[#173b2d] px-6 py-3 text-sm font-black text-white shadow-md hover:bg-[#234b3b]">
                  Continue to Care Team Demo
                </Link>
                <button type="button" onClick={resetDemo} className="rounded-full border border-[#cfc5b5] px-6 py-3 text-sm font-black text-[#44564c] hover:bg-[#fffaf0]">
                  Edit Demo Request
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <NearbyPartners zip={visiblePayload.requesterZip} />
              <PayloadPreview payload={visiblePayload} />
            </div>
          </section>
        ) : (
          <section className="mt-5 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
            <form data-demo-target="requester-demo-form" onSubmit={submitDemoRequest} className="rounded-[1.6rem] border border-[#d8d0c0] bg-[#fbf8f0] p-5 shadow-sm md:rounded-[2rem] md:p-8">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#789052]">Demo intake preview</p>
              <h2 className="mt-3 font-serif text-4xl font-semibold tracking-[-0.04em] text-[#102b3a]">Prepare a sample spiritual care request</h2>
              <p className="mt-3 text-sm leading-7 text-[#5d6b62]">
                The requester step comes first. A facility can allow quick requests with just a name and relationship, or collect a deeper requester profile before the care need is reviewed.
              </p>

              <section data-demo-target="requester-demo-profile" className="mt-7 rounded-[1.4rem] border border-[#d8d0c0] bg-white/80 p-5">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#789052]">Step 1 · Requester information</p>
                <h3 className="mt-2 text-2xl font-bold text-[#20372d]">Quick request or deeper profile</h3>
                <p className="mt-2 text-sm leading-6 text-[#5d6b62]">
                  This is not an account setup page yet. It shows that ChurchWork can start with only a name and relationship, or expand into a detailed requester profile when facility policy allows it.
                </p>
                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className={labelClass} htmlFor="requester-profile-mode">Requester profile depth</label>
                    <select id="requester-profile-mode" value={requesterProfileMode} onChange={(event) => setRequesterProfileMode(event.target.value)} className={fieldClass}>
                      {requesterProfileModes.map((option) => <option key={option}>{option}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="requester-role">Requester role</label>
                    <select id="requester-role" value={requesterRole} onChange={(event) => setRequesterRole(event.target.value)} className={fieldClass}>
                      {requesterRoles.map((option) => <option key={option}>{option}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="requester-name">Requester name</label>
                    <input id="requester-name" value={requesterName} onChange={(event) => setRequesterName(event.target.value)} className={fieldClass} required />
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="relationship">Relationship to person needing care</label>
                    <input id="relationship" value={relationship} onChange={(event) => setRelationship(event.target.value)} className={fieldClass} required />
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="contact-preference">Preferred follow-up method</label>
                    <select id="contact-preference" value={contactPreference} onChange={(event) => setContactPreference(event.target.value)} className={fieldClass}>
                      {contactPreferences.map((option) => <option key={option}>{option}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="requester-contact">Demo contact detail</label>
                    <input id="requester-contact" value={requesterContact} onChange={(event) => setRequesterContact(event.target.value)} className={fieldClass} required />
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="requester-zip">ZIP for future nearby partner lookup</label>
                    <input id="requester-zip" inputMode="numeric" value={requesterZip} onChange={(event) => setRequesterZip(event.target.value)} className={fieldClass} required />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass} htmlFor="requester-affiliation">Church, group, or facility affiliation</label>
                    <input id="requester-affiliation" value={requesterAffiliation} onChange={(event) => setRequesterAffiliation(event.target.value)} className={fieldClass} />
                  </div>
                </div>
                <div className="mt-5 rounded-2xl border border-[#eadfce] bg-[#fff8ed] p-4 text-sm leading-6 text-[#6b5b45]">
                  Future profile depth is facility-dependent. This demo does not create a login, save a profile, expose request history, or open a message thread.
                </div>
              </section>

              <section className="mt-7 rounded-[1.4rem] border border-[#d8d0c0] bg-[#fffaf2] p-5">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#789052]">Step 2 · Care need</p>
                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  <div>
                    <label className={labelClass} htmlFor="recipient-name">Who needs care?</label>
                    <input id="recipient-name" value={recipientName} onChange={(event) => setRecipientName(event.target.value)} className={fieldClass} required />
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="location-name">Facility or location</label>
                    <input id="location-name" value={locationName} onChange={(event) => setLocationName(event.target.value)} className={fieldClass} required />
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="room-or-unit">Room or unit</label>
                    <input id="room-or-unit" value={roomOrUnit} onChange={(event) => setRoomOrUnit(event.target.value)} className={fieldClass} />
                  </div>
                  <div data-demo-target="requester-demo-care-type">
                    <label className={labelClass} htmlFor="care-type">Type of care</label>
                    <select id="care-type" value={careType} onChange={(event) => setCareType(event.target.value)} className={fieldClass}>
                      {careTypes.map((option) => <option key={option}>{option}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="urgency">Urgency</label>
                    <select id="urgency" value={urgency} onChange={(event) => setUrgency(event.target.value)} className={fieldClass}>
                      {urgencyOptions.map((option) => <option key={option}>{option}</option>)}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass} htmlFor="notes">What is going on?</label>
                    <textarea id="notes" value={notes} onChange={(event) => setNotes(event.target.value)} rows={6} className={`${fieldClass} leading-6`} required />
                  </div>
                </div>
              </section>

              <div className="mt-6 rounded-2xl border border-[#eadfce] bg-[#fff8ed] p-4 text-sm leading-6 text-[#6b5b45]">
                This button only prepares a local preview card. It does not change any real care team record or send anything to a nearby church or group.
              </div>

              <div className="mt-6 flex justify-end">
                <button data-demo-target="requester-demo-submit" type="submit" className="w-full rounded-full bg-[#173b2d] px-7 py-3 text-sm font-black text-white shadow-md hover:bg-[#234b3b] sm:w-auto">
                  Preview Queue Card
                </button>
              </div>
            </form>

            <div className="space-y-6">
              <NearbyPartners zip={visiblePayload.requesterZip} />
              <PayloadPreview payload={visiblePayload} />
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function DemoStepper() {
  return (
    <div data-demo-target="requester-demo-stages" className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {demoStages.map((stage, index) => (
        <div key={stage} className="rounded-2xl border border-[#d8d0c0] bg-[#fffaf2] p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#789052]">Step {index + 1}</p>
          <p className="mt-2 text-sm font-bold text-[#20372d]">{stage}</p>
        </div>
      ))}
    </div>
  );
}

function NearbyPartners({ zip }: { zip: string }) {
  return (
    <aside data-demo-target="requester-demo-partners" className="rounded-[1.6rem] border border-[#d8d0c0] bg-white p-5 shadow-sm md:rounded-[2rem] md:p-6">
      <p className="text-xs font-black uppercase tracking-[0.22em] text-[#789052]">Future partner lookup</p>
      <h2 className="mt-3 font-serif text-3xl font-semibold tracking-[-0.04em] text-[#102b3a]">Suggested nearby churches & groups</h2>
      <p className="mt-4 text-sm leading-7 text-[#4d5d55]">
        ZIP {zip || "not provided"} would later drive a reviewed nearby partner search. This demo uses static examples only; no live lookup, auto-match, routing, or sharing happens here.
      </p>
      <div className="mt-5 space-y-3">
        {nearbyPartners.map((partner) => (
          <div key={partner.name} className="rounded-2xl border border-[#e5ddcf] bg-[#fbf8f0] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-black text-[#20372d]">{partner.name}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-[#789052]">{partner.type} · {partner.distance}</p>
              </div>
              <span className="rounded-full bg-[#fff4df] px-3 py-1 text-[11px] font-black uppercase tracking-[0.1em] text-[#76501a]">{partner.status}</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-[#5d6b62]">{partner.focus}</p>
          </div>
        ))}
      </div>
      <div className="mt-5 rounded-2xl border border-[#eadfce] bg-[#fff8ed] p-4 text-sm leading-6 text-[#6b5b45]">
        Future rule: ChurchWork suggests nearby partners; the facility approves what is shared and whether a partner sees the request.
      </div>
    </aside>
  );
}

function PayloadPreview({ payload }: { payload: DemoRequestPayload }) {
  const rows: Array<[string, string]> = [
    ["requesterProfileMode", payload.requesterProfileMode],
    ["requesterRole", payload.requesterRole],
    ["requesterName", payload.requesterName],
    ["relationship", payload.relationship],
    ["contactPreference", payload.contactPreference],
    ["requesterContact", payload.requesterContact],
    ["requesterZip", payload.requesterZip],
    ["requesterAffiliation", payload.requesterAffiliation || "Not provided"],
    ["recipientName", payload.recipientName],
    ["locationName", payload.locationName],
    ["roomOrUnit", payload.roomOrUnit || "Not provided"],
    ["careType", payload.careType],
    ["urgency", payload.urgency],
    ["status", payload.status],
    ["source", payload.source]
  ];

  return (
    <aside data-demo-target="requester-demo-payload" className="rounded-[1.6rem] border border-[#d8d0c0] bg-[#102b3a] p-5 text-white shadow-xl md:rounded-[2rem] md:p-8">
      <p className="text-xs font-black uppercase tracking-[0.22em] text-[#c8d9b3]">Care-team aligned shape</p>
      <h2 className="mt-3 font-serif text-3xl font-semibold tracking-[-0.04em]">What the care team would receive</h2>
      <p className="mt-4 text-sm leading-7 text-[#d4dedc]">
        These demo fields mirror the future intake record: requester information first, then the care need, then optional nearby partner suggestions after facility review.
      </p>
      <div className="mt-6 divide-y divide-white/10 rounded-2xl border border-white/15 bg-white/5">
        {rows.map(([label, value]) => (
          <div key={label} className="grid gap-1 px-4 py-3 text-sm sm:grid-cols-[170px_1fr]">
            <span className="font-black text-[#c8d9b3]">{label}</span>
            <span className="text-[#eef5f2]">{value}</span>
          </div>
        ))}
      </div>
      <div className="mt-6 rounded-2xl border border-[#c8d9b3]/30 bg-[#c8d9b3]/10 p-4 text-sm leading-6 text-[#edf5e6]">
        Later, Supabase should own requester profile depth, persistence, routing, status changes, assignment, audit history, and ZIP-based partner lookup. This preview intentionally keeps everything local.
      </div>
    </aside>
  );
}
