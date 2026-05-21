const ruleSections = [
  ["Identity display", "Anonymous and first-name modes visible in demo controls"],
  ["Message type settings", "Prayer, text, audio, and video shown with static toggles"],
  ["Review and moderation", "Review before delivery remains required"],
  ["Retention and expiration", "Temporary messages expire after configured demo windows"],
  ["Responder approval", "Only approved responders can receive assigned requests"],
  ["Urgent routing", "Priority requests route to internal review queue first"],
  ["Consent language", "Clear one-way temporary messaging consent copy is displayed"]
];

export default function FacilityRulesPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-crcf-blue">Facility Rules</p>
        <h2 className="mt-2 text-2xl font-bold text-crcf-navy">Demo configuration surface</h2>
        <p className="mt-2 text-sm text-slate-600">Visual settings only. This prototype does not apply live policy enforcement.</p>
      </section>
      <section className="grid gap-3 md:grid-cols-2">
        {ruleSections.map(([section, detail]) => (
          <article key={section} className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-xs uppercase tracking-[0.12em] text-slate-500">{section}</p>
            <p className="mt-2 text-sm font-medium text-slate-700">{detail}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
