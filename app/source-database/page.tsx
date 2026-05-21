const responders = [
  ["Maya T.", "Community Care Network", "Responder", "Facility-approved", "Prayer, Text", "North Campus", "2026-08-15", "Approved"],
  ["Jordan R.", "Healing Voices", "Chaplain Partner", "Facility-approved", "Video, Audio", "Main Campus", "2026-06-30", "Needs Renewal"],
  ["Elena P.", "Calm Path Alliance", "Responder", "Suspended demo", "Text", "Main Campus", "2026-05-28", "Suspended"]
];

export default function ApprovedRespondersPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-crcf-blue">Approved Responders</p>
        <h2 className="mt-2 text-2xl font-bold text-crcf-navy">Responder access registry</h2>
        <p className="mt-2 text-sm text-slate-600">Responders cannot browse patients. They only receive assigned, eligible support requests.</p>
      </section>

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-600">
            <tr>
              {["Responder", "Organization", "Role", "Approval", "Allowed support types", "Allowed facilities", "Renewal date", "Renewal state"].map((header) => (
                <th key={header} className="px-4 py-3 text-left">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {responders.map((responder) => (
              <tr key={responder[0]}>{responder.map((cell) => <td key={cell} className="px-4 py-3 text-slate-700">{cell}</td>)}</tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
