const queue = [
  ["MSG-8101", "REQ-2402", "Jordan R.", "Video", "00:44", "Pass", "Pending", "24 hours"],
  ["MSG-8102", "REQ-2404", "Maya T.", "Audio", "00:28", "Pass", "Approved", "12 hours"],
  ["MSG-8103", "REQ-2403", "Elena P.", "Text", "N/A", "Flag: contact share", "Needs edits", "24 hours"]
];

export default function MessageReviewPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-crcf-blue">Message Review</p>
        <h2 className="mt-2 text-2xl font-bold text-crcf-navy">Moderation queue</h2>
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-600">
              <tr>{["Message ID", "Request", "Responder", "Type", "Duration", "Policy status", "Review status", "Expiration", "Action"].map((h) => <th key={h} className="px-4 py-3 text-left">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {queue.map((row) => (
                <tr key={row[0]}>{row.map((c) => <td key={c} className="px-4 py-3 text-slate-700">{c}</td>)}<td className="space-x-2 px-4 py-3"><button disabled className="rounded-full border px-3 py-1 text-xs text-slate-500">Approve</button><button disabled className="rounded-full border px-3 py-1 text-xs text-slate-500">Reject</button></td></tr>
              ))}
            </tbody>
          </table>
        </div>

        <aside className="rounded-3xl border border-slate-200 bg-white p-6">
          <h3 className="font-bold text-crcf-navy">Safety panel</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            <li>• no medical advice</li>
            <li>• no solicitation/fundraising</li>
            <li>• no political content</li>
            <li>• no open chat</li>
            <li>• no external contact sharing</li>
          </ul>
        </aside>
      </section>
    </div>
  );
}
