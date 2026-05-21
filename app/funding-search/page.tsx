const requests = [
  ["REQ-2401", "Anonymous", "Prayer", "Any approved responder", "Routine", "Applied", "Awaiting responder"],
  ["REQ-2402", "Ava", "Encouraging video", "Specific organization", "Priority", "Applied", "Under review"],
  ["REQ-2403", "Anonymous", "Faith reflection", "Any approved responder", "Routine", "Applied", "Matched"],
  ["REQ-2404", "Noah", "Calming audio", "Specific organization", "Priority", "Applied", "Message pending review"],
  ["REQ-2405", "Anonymous", "Text note", "Any approved responder", "Routine", "Applied", "Delivered"]
];

export default function SupportRequestsPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-crcf-blue">Support Requests</p>
        <h2 className="mt-2 text-2xl font-bold text-crcf-navy">Demo intake queue</h2>
        <p className="mt-2 text-sm text-slate-600">Static non-PHI demo records only. Identity is anonymous or first-name only.</p>
      </section>

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-600">
            <tr>
              {["Request ID", "Display name", "Support type", "Requested audience", "Urgency", "Rule status", "Current status", "Action"].map((header) => (
                <th key={header} className="px-4 py-3 text-left">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {requests.map((request) => (
              <tr key={request[0]} className="align-top">
                {request.map((cell) => (
                  <td key={cell} className="px-4 py-3 text-slate-700">{cell}</td>
                ))}
                <td className="px-4 py-3">
                  <button disabled className="rounded-full border border-slate-300 px-3 py-1 text-xs text-slate-500">Local demo only</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
