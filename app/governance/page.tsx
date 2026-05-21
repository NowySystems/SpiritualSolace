import { PageHeader } from "@/components/PageHeader";

const safetyRules = [
  "No PHI, patient names, SSNs, or private medical details.",
  "No diagnosis fields, treatment fields, or medical advice.",
  "No API keys or credentials committed to this repository.",
  "No open chat, reply threads, or public responder directory.",
  "No unapproved responder access or external contact sharing.",
  "Human review is required before any external action.",
];

const productPosture = [
  "Demo only",
  "Facility-controlled",
  "Consent-first",
  "Temporary one-way messaging",
  "External actions disabled",
];

export default function GovernancePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Guardrails"
        title="Safety and operating rules"
        description="Use this page as the reference for prototype limits, data safety rules, and human-review requirements."
      />

      <section className="rounded-3xl bg-white p-6 shadow-panel ring-1 ring-slate-200">
        <h2 className="text-lg font-bold text-crcf-navy">Hard rules</h2>
        <ul className="mt-4 grid gap-3">
          {safetyRules.map((rule) => (
            <li key={rule} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
              {rule}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-panel ring-1 ring-slate-200">
        <h2 className="text-lg font-bold text-crcf-navy">Product posture</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {productPosture.map((item) => (
            <span key={item} className="rounded-full border border-slate-300 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
              {item}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
