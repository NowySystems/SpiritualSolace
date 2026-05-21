const rules = [
  "Demo only",
  "No real patient data",
  "No diagnosis or treatment fields",
  "No medical advice",
  "One-way only",
  "No open chat",
  "No unapproved responder access",
  "No public responder directory",
  "No solicitation or fundraising",
  "No political messaging",
  "Temporary messages",
  "Facility-controlled rules",
  "Human review where required"
];

export default function GuardrailsPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-crcf-blue">Guardrails</p>
        <h2 className="mt-2 text-2xl font-bold text-crcf-navy">Plain-language prototype boundaries</h2>
        <p className="mt-2 text-sm text-slate-600">These constraints keep the demo clear, safe, and easy to review.</p>
      </section>
      <section className="rounded-3xl border border-slate-200 bg-white p-6">
        <ul className="grid gap-2 md:grid-cols-2">
          {rules.map((rule) => (
            <li key={rule} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">{rule}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
