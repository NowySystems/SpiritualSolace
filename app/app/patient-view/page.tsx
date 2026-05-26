const processSteps = [
  "Share a support preference and comfort choices.",
  "Facility staff review requests when needed for safety and clarity.",
  "An approved responder sends one respectful one-way message.",
  "The temporary message expires automatically by design."
];

const spiritualOptions = ["Interfaith support", "Christian", "Jewish", "Muslim", "No specific tradition"];

export default function PatientViewPage() {
  return (
    <div className="space-y-6 lg:space-y-7">
      <section className="rounded-[2rem] border border-[#dfd8cb] bg-gradient-to-br from-[#fffdf9] via-[#f8f3e9] to-[#f0f4ee] p-7 shadow-[0_12px_32px_rgba(77,94,86,0.08)] lg:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#5f746d]">Patient View · Demo Preview</p>
        <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#1f3442]">Respectful one-way support with clear boundaries</h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#4f6058]">
          This experience is designed to feel calm and emotionally safe for patients and families, while preserving dignity,
          consent, and clear facility boundaries.
        </p>
      </section>

      <section className="rounded-3xl border border-[#dfd8cb] bg-white/85 p-6 shadow-[0_8px_22px_rgba(77,94,86,0.06)]">
        <h3 className="text-lg font-semibold text-[#223746]">How the support process works</h3>
        <ol className="mt-4 grid gap-3 md:grid-cols-2">
          {processSteps.map((step, index) => (
            <li key={step} className="rounded-2xl border border-[#e4ddd1] bg-[#faf6ee] p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6b7b74]">Step {index + 1}</p>
              <p className="mt-2 text-sm text-[#30434f]">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.2fr_1fr]">
        <article className="rounded-3xl border border-[#dfd8cb] bg-white/85 p-6 shadow-[0_8px_22px_rgba(77,94,86,0.06)]">
          <h3 className="text-lg font-semibold text-[#223746]">Temporary support request</h3>
          <p className="mt-2 text-sm text-[#566862]">Demo-only form preview. Submissions are disabled and nothing is sent.</p>

          <form className="mt-5 space-y-4" aria-label="Demo support request form">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#314550]">Support preference</label>
              <select disabled className="w-full rounded-xl border border-[#ddd6ca] bg-[#f8f3e9] px-3 py-2.5 text-sm text-[#475a53]">
                <option>Quiet encouragement</option>
                <option>Prayer-focused message</option>
                <option>Reflection and reassurance</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#314550]">Spiritual preference</label>
              <select disabled className="w-full rounded-xl border border-[#ddd6ca] bg-[#f8f3e9] px-3 py-2.5 text-sm text-[#475a53]">
                {spiritualOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#314550]">Comfort preference</label>
              <select disabled className="w-full rounded-xl border border-[#ddd6ca] bg-[#f8f3e9] px-3 py-2.5 text-sm text-[#475a53]">
                <option>Gentle and brief</option>
                <option>Hopeful and uplifting</option>
                <option>Grounding and peaceful</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#314550]">Optional note</label>
              <textarea
                disabled
                rows={4}
                placeholder="Share anything you want staff to consider for a respectful support message."
                className="w-full rounded-xl border border-[#ddd6ca] bg-[#f8f3e9] px-3 py-2.5 text-sm text-[#475a53] placeholder:text-[#8a968f]"
              />
            </div>

            <label className="flex items-start gap-2 rounded-xl border border-[#dfd8cb] bg-[#f6f8f3] p-3 text-sm text-[#4f6058]">
              <input type="checkbox" disabled checked readOnly className="mt-0.5" />
              <span>I understand this is one-way support and not an open chat experience.</span>
            </label>

            <button
              type="button"
              disabled
              className="rounded-xl border border-[#d8d2c6] bg-[#ece7dc] px-4 py-2.5 text-sm font-semibold text-[#6f7a74]"
            >
              Demo submit disabled
            </button>
          </form>
        </article>

        <article className="space-y-5">
          <div className="rounded-3xl border border-[#dfd8cb] bg-gradient-to-b from-[#f9f4ea] to-[#f3f6f0] p-6 shadow-[0_8px_22px_rgba(77,94,86,0.06)]">
            <h3 className="text-lg font-semibold text-[#223746]">Example one-way support preview</h3>
            <p className="mt-3 rounded-2xl border border-[#e4ddd1] bg-white/80 p-4 text-sm leading-relaxed text-[#41544d]">
              “Thinking of you today with care and respect. May you feel steady support, calm, and comfort in this moment.”
            </p>
            <p className="mt-3 text-xs text-[#62736c]">Preview only. This is not live messaging and does not open two-way conversation.</p>
          </div>

          <div className="rounded-3xl border border-[#d8d3c7] bg-[#f6f1e7] p-6 shadow-[0_8px_20px_rgba(77,94,86,0.05)]">
            <h3 className="text-lg font-semibold text-[#223746]">Temporary expiration by design</h3>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-[#4f6058]">
              <li>• Messages are temporary and expire automatically.</li>
              <li>• This is not ongoing communication or live chat.</li>
              <li>• Additional support requires a new request and review workflow.</li>
            </ul>
          </div>
        </article>
      </section>

      <section className="rounded-2xl border border-[#ddd6ca] bg-[#f7f2e8] px-5 py-4 text-sm text-[#4f6058] shadow-[0_6px_16px_rgba(77,94,86,0.05)]">
        <p className="font-medium">Demo-only notice</p>
        <p className="mt-1 text-xs leading-relaxed text-[#5f7069]">
          Static preview only. No uploads, no notifications, no backend connection, no persistence, and no production or HIPAA claims.
        </p>
      </section>
    </div>
  );
}
