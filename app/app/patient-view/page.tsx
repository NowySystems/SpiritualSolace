import {
  getResponderName,
  solaceMessages,
  solaceRequests,
  traditionPreferences
} from "@/lib/spiritual-solace-data";

const activeRequest = solaceRequests[2];
const deliveredMessage = solaceMessages.find((message) => message.status === "Approved") ?? solaceMessages[0];

const statusStyles: Record<string, string> = {
  "New": "border-[#d9d6c9] bg-[#f8f5ed] text-[#596961]",
  "Intake Review": "border-[#e8d9b7] bg-[#fff7df] text-[#7a5a1d]",
  "Routed": "border-[#cfdceb] bg-[#edf5ff] text-[#405c7d]",
  "Message Review": "border-[#ddd2ea] bg-[#f5f0fb] text-[#66547d]",
  "Delivered": "border-[#cfe2d0] bg-[#eef8ee] text-[#4f7457]",
  "Expired": "border-[#ddd7d0] bg-[#f2f0ed] text-[#6a665f]"
};

const comfortSteps = [
  { label: "Request received", note: "Your preference and tone were saved for review.", state: "Complete" },
  { label: "Responder selected", note: "A trusted support group was matched to the request.", state: "Complete" },
  { label: "Message review", note: "A staff review keeps the message one-way and appropriate.", state: "In progress" },
  { label: "Temporary delivery", note: "The message appears here when review is complete.", state: "Next" }
];

const reassuranceItems = [
  "You do not have to respond.",
  "You do not have to explain more than you want to.",
  "This does not open a public conversation.",
  "The message is reviewed before it appears here."
];

export default function PatientViewPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 lg:space-y-7">
      <section className="overflow-hidden rounded-[2.4rem] border border-[#dfd8cb] bg-gradient-to-br from-[#fffdf9] via-[#f8f1e5] to-[#eaf3f0] shadow-[0_18px_44px_rgba(77,94,86,0.1)]">
        <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="p-7 lg:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5f746d]">5:25 PM Pass 3 · Patient Experience</p>
            <h2 className="mt-4 max-w-2xl text-4xl font-semibold leading-tight text-[#1f3442] lg:text-5xl">
              You asked for comfort. We’re taking care with it.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[#4f6058]">
              This quiet view lets a recipient see that their request was received, matched, reviewed, and delivered without needing to carry a conversation.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <span className={`rounded-full border px-4 py-2 text-sm font-semibold ${statusStyles[activeRequest.status]}`}>
                {activeRequest.status}
              </span>
              <span className="rounded-full border border-[#d8d3c7] bg-white/75 px-4 py-2 text-sm font-semibold text-[#566862]">
                One-way support
              </span>
              <span className="rounded-full border border-[#d8d3c7] bg-white/75 px-4 py-2 text-sm font-semibold text-[#566862]">
                No reply needed
              </span>
            </div>
          </div>

          <div className="flex items-center bg-white/45 p-7 lg:p-10">
            <article className="w-full rounded-[2rem] border border-[#e4ddd1] bg-white/85 p-6 shadow-[0_10px_28px_rgba(77,94,86,0.08)]">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#5f746d]">Current status</p>
              <h3 className="mt-2 text-2xl font-semibold text-[#223746]">Your request is being handled carefully.</h3>
              <p className="mt-3 text-sm leading-6 text-[#566862]">
                A responder has been selected. The message is held until the facility review step is complete.
              </p>
              <div className="mt-5 rounded-2xl border border-[#e6dfd4] bg-[#faf6ee] p-4 text-sm text-[#40534c]">
                <p className="font-semibold text-[#223746]">What you asked for</p>
                <p className="mt-2 leading-relaxed">{activeRequest.requestType} · {activeRequest.tonePreference} · {activeRequest.traditionPreference}</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <article className="rounded-3xl border border-[#dfd8cb] bg-white/85 p-6 shadow-[0_8px_22px_rgba(77,94,86,0.06)]">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#5f746d]">Progress</p>
          <h3 className="mt-1 text-xl font-semibold text-[#223746]">What happens next</h3>

          <ol className="mt-5 space-y-3">
            {comfortSteps.map((step, index) => (
              <li key={step.label} className="flex gap-3 rounded-2xl border border-[#e4ddd1] bg-[#faf6ee] p-4 text-sm text-[#30434f]">
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#516476] text-xs font-bold text-white">{index + 1}</span>
                <span>
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-[#223746]">{step.label}</span>
                    <span className="rounded-full border border-[#d8d3c7] bg-white/75 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#61706a]">{step.state}</span>
                  </span>
                  <span className="mt-1 block leading-relaxed text-[#5f7069]">{step.note}</span>
                </span>
              </li>
            ))}
          </ol>
        </article>

        <article className="space-y-5">
          <div className="rounded-[2rem] border border-[#dfd8cb] bg-gradient-to-b from-[#f9f4ea] to-[#f3f6f0] p-6 shadow-[0_8px_22px_rgba(77,94,86,0.06)]">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#5f746d]">Reviewed comfort message</p>
            <h3 className="mt-1 text-2xl font-semibold text-[#223746]">A message for you</h3>
            <p className="mt-4 rounded-[1.5rem] border border-[#e4ddd1] bg-white/90 p-6 text-lg leading-8 text-[#40534c]">
              “{deliveredMessage.body}”
            </p>
            <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
              <div className="rounded-xl border border-[#e6dfd4] bg-white/75 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#718078]">Responder</p>
                <p className="mt-1 font-medium text-[#314550]">{getResponderName(activeRequest.assignedResponderId)}</p>
              </div>
              <div className="rounded-xl border border-[#e6dfd4] bg-white/75 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#718078]">Delivery</p>
                <p className="mt-1 font-medium text-[#314550]">One-way only</p>
              </div>
              <div className="rounded-xl border border-[#e6dfd4] bg-white/75 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#718078]">Window</p>
                <p className="mt-1 font-medium text-[#314550]">Temporary</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-[#d8d3c7] bg-[#f6f1e7] p-6 shadow-[0_8px_20px_rgba(77,94,86,0.05)]">
            <h3 className="text-lg font-semibold text-[#223746]">A few simple reminders</h3>
            <ul className="mt-3 grid gap-2 text-sm leading-relaxed text-[#4f6058] sm:grid-cols-2">
              {reassuranceItems.map((item) => (
                <li key={item} className="rounded-xl border border-[#e4ddd1] bg-white/55 px-3 py-2">• {item}</li>
              ))}
            </ul>
          </div>
        </article>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-3xl border border-[#dfd8cb] bg-white/85 p-6 shadow-[0_8px_22px_rgba(77,94,86,0.06)]">
          <h3 className="text-lg font-semibold text-[#223746]">Request another comfort message</h3>
          <p className="mt-2 text-sm text-[#566862]">Demo-only form preview. Submissions are disabled and nothing is sent.</p>

          <form className="mt-5 space-y-4" aria-label="Demo support request form">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#314550]">What kind of support would help right now?</label>
              <select disabled className="w-full rounded-xl border border-[#ddd6ca] bg-[#f8f3e9] px-3 py-2.5 text-sm text-[#475a53]">
                <option>Prayer</option>
                <option>Affirmation</option>
                <option>Encouragement</option>
                <option>Guidance</option>
                <option>Calming words</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#314550]">Spiritual or tradition preference</label>
              <select disabled className="w-full rounded-xl border border-[#ddd6ca] bg-[#f8f3e9] px-3 py-2.5 text-sm text-[#475a53]">
                {traditionPreferences.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#314550]">Optional note</label>
              <textarea
                disabled
                rows={4}
                placeholder="Share only what feels comfortable."
                className="w-full rounded-xl border border-[#ddd6ca] bg-[#f8f3e9] px-3 py-2.5 text-sm text-[#475a53] placeholder:text-[#8a968f]"
              />
            </div>

            <label className="flex items-start gap-2 rounded-xl border border-[#dfd8cb] bg-[#f6f8f3] p-3 text-sm text-[#4f6058]">
              <input type="checkbox" disabled checked readOnly className="mt-0.5" />
              <span>I understand this is one-way support and not an open chat experience.</span>
            </label>

            <button type="button" disabled className="rounded-xl border border-[#d8d2c6] bg-[#ece7dc] px-4 py-2.5 text-sm font-semibold text-[#6f7a74]">
              Demo submit disabled
            </button>
          </form>
        </article>

        <article className="rounded-3xl border border-[#dfd8cb] bg-white/85 p-6 shadow-[0_8px_22px_rgba(77,94,86,0.06)]">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#5f746d]">Pass 3 status</p>
          <h3 className="mt-1 text-lg font-semibold text-[#223746]">Patient view is now emotionally centered</h3>
          <ul className="mt-4 space-y-2 text-sm leading-relaxed text-[#4f6058]">
            <li>• Hero reframed around reassurance.</li>
            <li>• Progress timeline made clearer and calmer.</li>
            <li>• Reviewed message given more visual focus.</li>
            <li>• Boundaries rewritten for recipient comfort.</li>
          </ul>
        </article>
      </section>

      <section className="rounded-2xl border border-[#ddd6ca] bg-[#f7f2e8] px-5 py-4 text-sm text-[#4f6058] shadow-[0_6px_16px_rgba(77,94,86,0.05)]">
        <p className="font-medium">Demo-only notice</p>
        <p className="mt-1 text-xs leading-relaxed text-[#5f7069]">
          Static preview only. No uploads, no notifications, no live persistence, and no production or HIPAA claims.
        </p>
      </section>
    </div>
  );
}
