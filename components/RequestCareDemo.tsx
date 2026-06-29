"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { driver, type DriveStep } from "driver.js";
import "driver.js/dist/driver.css";

type DemoRequestPayload = {
  requesterName: string;
  requesterContact: string;
  contactPreference: string;
  requesterZip: string;
  recipientName: string;
  relationship: string;
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

const careTypes = ["Prayer", "Visit", "Family support", "Pastoral follow-up", "Church connection", "Other"];
const urgencyOptions = ["Today", "This week", "Not urgent", "Unsure"];
const contactPreferences = ["Phone", "Email", "Text message", "Facility staff follow-up"];
const demoStages = ["Requester information", "Care need", "Human-reviewed next step", "Care team demo"];

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
    title: "Three-part story",
    description:
      "The demo moves from requester preview, to a future queue card, to the care team demo. This keeps the product story simple for a facility walkthrough."
  },
  {
    id: "requester-demo-flow",
    target: '[data-demo-target="requester-demo-flow"]',
    title: "Future platform flow",
    description:
      "Later, Supabase can turn this same intake shape into a reviewed care team queue item, then a Care Binder timeline action."
  },
  {
    id: "requester-demo-form",
    target: '[data-demo-target="requester-demo-form"]',
    title: "Simple care request shape",
    description:
      "Step 1 gathers a demo-only requester profile. The quick path asks for only contact essentials; the detailed path adds context a human reviewer can use later."
  },
  {
    id: "requester-demo-care-type",
    target: '[data-demo-target="requester-demo-care-type"]',
    title: "Template-friendly care type",
    description:
      "Care types map to reviewed templates and facility policy. This supports prayer, visits, family support, pastoral follow-up, and church connection without opening two-way chat."
  },
  {
    id: "requester-demo-payload",
    target: '[data-demo-target="requester-demo-payload"]',
    title: "What the care team would receive",
    description:
      "The right side shows the future care-team-aligned shape. It is the bridge between a requester need and the Care Binder workflow."
  },
  {
    id: "requester-demo-submit",
    target: '[data-demo-target="requester-demo-submit"]',
    title: "Preview the queue card",
    description:
      "Use this button to prepare a local preview card. After that, continue to the Care Binder demo to show how a care team reviews and acts."
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
  const [recipientName, setRecipientName] = useState("Mary Johnson");
  const [relationship, setRelationship] = useState("Daughter");
  const [locationName, setLocationName] = useState("Bethesda Senior Living");
  const [roomOrUnit, setRoomOrUnit] = useState("Room 214");
  const [careType, setCareType] = useState(careTypes[0]);
  const [urgency, setUrgency] = useState(urgencyOptions[0]);
  const [requesterName, setRequesterName] = useState("Sarah Johnson");
  const [contactPreference, setContactPreference] = useState(contactPreferences[0]);
  const [requesterContact, setRequesterContact] = useState("Demo phone number");
  const [requesterZip, setRequesterZip] = useState("38501");
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
      requesterName,
      requesterContact,
      contactPreference,
      requesterZip,
      recipientName,
      relationship,
      locationName,
      roomOrUnit,
      careType,
      urgency,
      notes,
      status: "demo-only",
      source: "requester-demo"
    }),
    [careType, contactPreference, locationName, notes, recipientName, relationship, requesterContact, requesterName, requesterZip, roomOrUnit, urgency]
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
          <strong className="text-[#173b2d]">Demo only:</strong> this preview uses local page state only. It does not call live APIs, create accounts, store requester profiles, auto-route to churches, or change any care team record.
        </section>

        <section className="mt-5 rounded-[1.6rem] border border-[#d8d0c0] bg-white/85 p-5 shadow-sm md:mt-6 md:rounded-[2rem] md:p-8">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div data-demo-target="requester-demo-hero">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#789052]">Gated requester preview</p>
              <h1 className="mt-3 font-serif text-4xl font-semibold leading-tight tracking-[-0.04em] text-[#102b3a] md:text-6xl">
                Show how someone asks for spiritual care.
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-[#4d5d55]">
                This side of ChurchWork is the front door for families, residents, staff, church members, or facility partners. Tonight it is only a guided preview: requester information stays in local page state, the ZIP code is demo-only, and every next step still requires human review.
              </p>
              <DemoStepper />
            </div>

            <aside data-demo-target="requester-demo-flow" className="rounded-[1.5rem] border border-[#d8d0c0] bg-[#173b2d] p-5 text-white shadow-lg md:rounded-[1.7rem] md:p-6">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#c8d9b3]">Future platform flow</p>
              <div className="mt-5 space-y-3 text-sm font-bold">
                <div className="rounded-2xl bg-white/10 p-4">Requester prepares care need</div>
                <div className="pl-4 text-[#c8d9b3]">↓</div>
                <div className="rounded-2xl bg-white/10 p-4">Supabase intake record</div>
                <div className="pl-4 text-[#c8d9b3]">↓</div>
                <div className="rounded-2xl bg-white/10 p-4">Care Queue card</div>
                <div className="pl-4 text-[#c8d9b3]">↓</div>
                <div className="rounded-2xl bg-white/10 p-4">Care Binder timeline and actions</div>
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
                In the live ChurchWork workflow, this would be routed into the care team queue for human review. In this pilot preview, it stays on this page only.
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

            <PayloadPreview payload={visiblePayload} />
          </section>
        ) : (
          <section className="mt-5 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
            <form data-demo-target="requester-demo-form" onSubmit={submitDemoRequest} className="rounded-[1.6rem] border border-[#d8d0c0] bg-[#fbf8f0] p-5 shadow-sm md:rounded-[2rem] md:p-8">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#789052]">Demo intake preview</p>
              <h2 className="mt-3 font-serif text-4xl font-semibold tracking-[-0.04em] text-[#102b3a]">Prepare a sample spiritual care request</h2>
              <p className="mt-3 text-sm leading-7 text-[#5d6b62]">
                These sample fields are intentionally simple. They collect just enough context for a human care coordinator to review the need and choose the next safe step.
              </p>

              <div className="mt-7 grid gap-5 md:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="recipient-name">Who needs care?</label>
                  <input id="recipient-name" value={recipientName} onChange={(event) => setRecipientName(event.target.value)} className={fieldClass} required />
                </div>
                <div>
                  <label className={labelClass} htmlFor="relationship">Relationship to requester</label>
                  <input id="relationship" value={relationship} onChange={(event) => setRelationship(event.target.value)} className={fieldClass} required />
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
                <div className="md:col-span-2 rounded-[1.5rem] border border-[#e2d7c5] bg-white p-5 shadow-sm">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#789052]">Step 1 · Requester Information</p>
                  <h3 className="mt-2 text-2xl font-bold tracking-[-0.03em] text-[#102b3a]">Choose the lightest safe profile.</h3>
                  <p className="mt-3 text-sm leading-7 text-[#5d6b62]">
                    Quick profile means name, contact preference, and a demo contact detail so a human reviewer knows who prepared the request. Detailed profile can later add ZIP-based partner context, but this MVP does not create accounts, store requester profiles, or auto-route anyone.
                  </p>
                  <div className="mt-5 grid gap-5 md:grid-cols-2">
                    <div>
                      <label className={labelClass} htmlFor="requester-name">Requester name</label>
                      <input id="requester-name" value={requesterName} onChange={(event) => setRequesterName(event.target.value)} className={fieldClass} required />
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
                      <label className={labelClass} htmlFor="requester-zip">ZIP code</label>
                      <input id="requester-zip" inputMode="numeric" maxLength={5} value={requesterZip} onChange={(event) => setRequesterZip(event.target.value)} className={fieldClass} aria-describedby="requester-zip-help" />
                      <p id="requester-zip-help" className="mt-2 text-xs font-semibold leading-5 text-[#7b6b55]">Demo-only for future nearby partner lookup. No live API call and no saved profile.</p>
                    </div>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass} htmlFor="notes">What is going on?</label>
                  <textarea id="notes" value={notes} onChange={(event) => setNotes(event.target.value)} rows={6} className={`${fieldClass} leading-6`} required />
                </div>
              </div>

              <div className="mt-6 rounded-[1.5rem] border border-[#d8d0c0] bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-[#789052]">Suggested nearby partners</p>
                    <h3 className="mt-2 text-xl font-bold text-[#102b3a]">Placeholder only</h3>
                  </div>
                  <span className="rounded-full bg-[#fff4df] px-3 py-1 text-xs font-black uppercase tracking-[0.1em] text-[#76501a]">No routing</span>
                </div>
                <p className="mt-3 text-sm leading-7 text-[#5d6b62]">
                  A future version may use ZIP {requesterZip || "—"} to help staff identify nearby churches or care partners. This demo does not call live directories, does not reveal partner availability, and does not automatically contact or route to any church.
                </p>
              </div>

              <div className="mt-6 rounded-2xl border border-[#eadfce] bg-[#fff8ed] p-4 text-sm leading-6 text-[#6b5b45]">
                This button only prepares a local preview card. It does not change any real care team record.
              </div>

              <div className="mt-6 flex justify-end">
                <button data-demo-target="requester-demo-submit" type="submit" className="w-full rounded-full bg-[#173b2d] px-7 py-3 text-sm font-black text-white shadow-md hover:bg-[#234b3b] sm:w-auto">
                  Preview Queue Card
                </button>
              </div>
            </form>

            <PayloadPreview payload={visiblePayload} />
          </section>
        )}
      </div>
    </main>
  );
}

function DemoStepper() {
  return (
    <div data-demo-target="requester-demo-stages" className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {demoStages.map((stage, index) => (
        <div key={stage} className="rounded-2xl border border-[#d8d0c0] bg-[#fffaf2] p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#789052]">Step {index + 1}</p>
          <p className="mt-2 text-sm font-bold text-[#20372d]">{stage}</p>
        </div>
      ))}
    </div>
  );
}

function PayloadPreview({ payload }: { payload: DemoRequestPayload }) {
  const rows: Array<[string, string]> = [
    ["recipientName", payload.recipientName],
    ["locationName", payload.locationName],
    ["roomOrUnit", payload.roomOrUnit || "Not provided"],
    ["careType", payload.careType],
    ["urgency", payload.urgency],
    ["requesterName", payload.requesterName],
    ["contactPreference", payload.contactPreference],
    ["requesterContact", payload.requesterContact],
    ["requesterZip", `${payload.requesterZip || "Not provided"} (demo-only / no lookup)`],
    ["status", payload.status],
    ["source", payload.source]
  ];

  return (
    <aside data-demo-target="requester-demo-payload" className="rounded-[1.6rem] border border-[#d8d0c0] bg-[#102b3a] p-5 text-white shadow-xl md:rounded-[2rem] md:p-8">
      <p className="text-xs font-black uppercase tracking-[0.22em] text-[#c8d9b3]">Care-team aligned shape</p>
      <h2 className="mt-3 font-serif text-3xl font-semibold tracking-[-0.04em]">What the care team would receive</h2>
      <p className="mt-4 text-sm leading-7 text-[#d4dedc]">
        These demo fields mirror the future intake record that can become a reviewed care queue item, then a Care Binder timeline entry after human action.
      </p>
      <div className="mt-6 divide-y divide-white/10 rounded-2xl border border-white/15 bg-white/5">
        {rows.map(([label, value]) => (
          <div key={label} className="grid gap-1 px-4 py-3 text-sm sm:grid-cols-[150px_1fr]">
            <span className="font-black text-[#c8d9b3]">{label}</span>
            <span className="text-[#eef5f2]">{value}</span>
          </div>
        ))}
      </div>
      <div className="mt-6 rounded-2xl border border-[#c8d9b3]/30 bg-[#c8d9b3]/10 p-4 text-sm leading-6 text-[#edf5e6]">
        Later, Supabase should own approved persistence, routing, status changes, assignment, and audit history after governance review. This preview intentionally keeps everything local and performs no partner lookup.
      </div>
    </aside>
  );
}
