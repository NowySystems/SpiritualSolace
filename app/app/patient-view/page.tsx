import {
  getResponderName,
  solaceMessages,
  solaceRequests,
  traditionPreferences
} from "@/lib/spiritual-solace-data";

const processSteps = [
  "Request comfort and share preferences.",
  "Facility team reviews the request when needed.",
  "An approved responder provides one respectful message.",
  "The message appears temporarily and then expires."
];

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

export default function PatientViewPage() {
  return (
    <div className="space-y-6 lg:space-y-7">
      <section className="rounded-[2rem] border border-[#dfd8cb] bg-gradient-to-br from-[#fffdf9] via-[#f8f3e9] to-[#f0f4ee] p-7 shadow-[0_12px_32px_rgba(77,94,86,0.08)] lg:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#5f746d]">Patient View · Pass 2</p>
        <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#1f3442]">A calm view for one-way comfort</h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#4f6058]">
          This screen shows how a recipient could request solace, see request progress, and receive one reviewed message without
          being pulled into chat, pressure, or follow-up obligations.
        </p>
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <article className="rounded-3xl border border-[#dfd8cb] bg-white/85 p-6 shadow-[0_8px_22px_rgba(77,94,86,0.06)]">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#5f746d]">Request status</p>
              <h3 className="mt-1 text-xl font-semibold text-[#223746]">Your solace request</h3>
            </div>
            <span className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${statusStyles[activeRequest.status]}`}>
              {activeRequest.status}
            </span>
          </div>

          <div className="mt-5 rounded-2xl border border-[#e4ddd1] bg-[#faf6ee] p-4">
            <p className="text-sm leading-relaxed text-[#40534c]">{activeRequest.note}</p>
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <div className="rounded-xl border border-[#e6dfd4] bg-white/75 p-3">
                <dt className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#718078]">Request type</dt>
                <dd className="mt-1 font-medium text-[#314550]">{activeRequest.requestType}</dd>
              </div>
              <div className="rounded-xl border border-[#e6dfd4] bg-white/75 p-3">
                <dt className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#718078]">Tone</dt>
                <dd className="mt-1 font-medium text-[#314550]">{activeRequest.tonePreference}</dd>
              </div>
              <div className="rounded-xl border border-[#e6dfd4] bg-white/75 p-3">
                <dt className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#718078]">Tradition</dt>
                <dd className="mt-1 font-medium text-[#314550]">{activeRequest.traditionPreference}</dd>
              </div>
              <div className="rounded-xl border border-[#e6dfd4] bg-white/75 p-3">
                <dt className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#718078]">Responder</dt>
                <dd className="mt-1 font-medium text-[#314550]">{getResponderName(activeRequest.assignedResponderId)}</dd>
              </div>
            </dl>
          </div>

          <ol className="mt-5 space-y-3">
            {processSteps.map((step, index) => (
              <li key={step} className="flex gap-3 rounded-2xl border border-[#e4ddd1] bg-white/75 p-4 text-sm text-[#30434f]">
                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#516476] text-xs font-bold text-white">{index + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </article>

        <article className="space-y-5">
          <div className="rounded-3xl border border-[#dfd8cb] bg-gradient-to-b from-[#f9f4ea] to-[#f3f6f0] p-6 shadow-[0_8px_22px_rgba(77,94,86,0.06)]">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#5f746d]">Reviewed message</p>
            <h3 className="mt-1 text-xl font-semibold text-[#223746]">A message for you</h3>
            <p className="mt-3 rounded-2xl border border-[#e4ddd1] bg-white/85 p-5 text-base leading-relaxed text-[#40534c]">
              “{deliveredMessage.body}”
            </p>
            <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <div className="rounded-xl border border-[#e6dfd4] bg-white/75 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#718078]">Delivery mode</p>
                <p className="mt-1 font-medium text-[#314550]">One-way comfort only</p>
              </div>
              <div className="rounded-xl border border-[#e6dfd4] bg-white/75 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#718078]">Temporary window</p>
                <p className="mt-1 font-medium text-[#314550]">Expires after facility window</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-[#d8d3c7] bg-[#f6f1e7] p-6 shadow-[0_8px_20px_rgba(77,94,86,0.05)]">
            <h3 className="text-lg font-semibold text-[#223746]">What this does and does not do</h3>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-[#4f6058]">
              <li>• You do not need to reply.</li>
              <li>• This does not open a public conversation.</li>
              <li>• This is not care advice or emergency support.</li>
              <li>• More support can be requested through a new reviewed request.</li>
            </ul>
          </div>
        </article>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-3xl border border-[#dfd8cb] bg-white/85 p-6 shadow-[0_8px_22px_rgba(77,94,86,0.06)]">
          <h3 className="text-lg font-semibold text-[#223746]">Temporary support request</h3>
          <p className="mt-2 text-sm text-[#566862]">Demo-only form preview. Submissions are disabled and nothing is sent.</p>

          <form className="mt-5 space-y-4" aria-label="Demo support request form">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#314550]">Support preference</label>
              <select disabled className="w-full rounded-xl border border-[#ddd6ca] bg-[#f8f3e9] px-3 py-2.5 text-sm text-[#475a53]">
                <option>Prayer</option>
                <option>Affirmation</option>
                <option>Encouragement</option>
                <option>Guidance</option>
                <option>Calming words</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#314550]">Spiritual preference</label>
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
                placeholder="Share only what you want staff to consider for a respectful comfort message."
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
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#5f746d]">Pass 2 status</p>
          <h3 className="mt-1 text-lg font-semibold text-[#223746]">Patient view now follows the workflow</h3>
          <ul className="mt-4 space-y-2 text-sm leading-relaxed text-[#4f6058]">
            <li>• Canonical request data connected.</li>
            <li>• Reviewed message preview connected.</li>
            <li>• Request status and responder context visible.</li>
            <li>• One-way and temporary boundaries reinforced.</li>
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
