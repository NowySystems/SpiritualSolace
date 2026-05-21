export default function PatientViewPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-crcf-blue">Patient View</p>
        <h2 className="mt-2 text-2xl font-bold text-crcf-navy">Request spiritual support</h2>
        <p className="mt-2 text-sm text-slate-600">Warm, calm demo form for patients and families. Submission is local-only in this prototype.</p>
      </section>
      <section className="rounded-3xl border border-slate-200 bg-white p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm text-slate-700">Support type<select className="mt-1 w-full rounded-xl border p-2"><option>Prayer</option><option>Encouraging video</option><option>Calming audio</option><option>Text message</option></select></label>
          <label className="text-sm text-slate-700">Identity display<select className="mt-1 w-full rounded-xl border p-2"><option>Anonymous</option><option>First name only</option></select></label>
          <label className="text-sm text-slate-700">Requested audience<select className="mt-1 w-full rounded-xl border p-2"><option>Any approved responder</option><option>Specific approved organization</option></select></label>
          <label className="flex items-end gap-2 text-sm text-slate-700"><input type="checkbox" /> I consent to receive one-way temporary messages.</label>
        </div>
        <button disabled className="mt-5 rounded-full bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-600">Submit (demo only)</button>
      </section>
      <section className="rounded-3xl border border-slate-200 bg-white p-6">
        <h3 className="font-bold text-crcf-navy">Temporary message status</h3>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">Available now: supportive message expires in 10 hours.</div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">Expired: this temporary message has been removed.</div>
        </div>
      </section>
    </div>
  );
}
