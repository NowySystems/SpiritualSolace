const events = [
  ["2026-05-20 09:05", "REQ-2402", "Request created"],
  ["2026-05-20 09:06", "REQ-2402", "Rules applied"],
  ["2026-05-20 09:12", "REQ-2402", "Responder assigned"],
  ["2026-05-20 09:22", "MSG-8101", "Message submitted"],
  ["2026-05-20 09:34", "MSG-8101", "Message reviewed"],
  ["2026-05-20 09:36", "MSG-8101", "Message delivered"],
  ["2026-05-21 09:36", "MSG-8101", "Message expired and removed"]
];

export default function AuditLogPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-crcf-blue">Audit Log</p>
        <h2 className="mt-2 text-2xl font-bold text-crcf-navy">Demo timeline</h2>
        <p className="mt-2 text-sm text-slate-600">Static sample events for internal walkthroughs only.</p>
      </section>

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-600">
            <tr><th className="px-4 py-3 text-left">Time</th><th className="px-4 py-3 text-left">Reference</th><th className="px-4 py-3 text-left">Event</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">{events.map((event) => <tr key={event.join("-")}>{event.map((cell) => <td key={cell} className="px-4 py-3 text-slate-700">{cell}</td>)}</tr>)}</tbody>
        </table>
      </section>
    </div>
  );
}
