const requests = [
  ["REQ-2401", "Anonymous", "Prayer", "Any approved responder", "Routine", "Applied", "Awaiting responder"],
  ["REQ-2402", "Ava", "Encouragement video", "Specific organization", "Priority", "Applied", "Under review"],
  ["REQ-2403", "Anonymous", "Faith reflection", "Any approved responder", "Routine", "Applied", "Matched"],
  ["REQ-2404", "Noah", "Calming audio", "Specific organization", "Priority", "Applied", "Message pending review"],
  ["REQ-2405", "Anonymous", "Text note", "Any approved responder", "Routine", "Applied", "Delivered"],
];

export default function SupportRequestsPage() { return <div className="space-y-6"><section className="rounded-3xl border border-slate-200 bg-white p-6"><p className="text-xs uppercase tracking-[0.2em] text-crcf-blue font-semibold">Support Requests</p><h2 className="text-2xl font-bold text-crcf-navy mt-2">Demo Intake Queue</h2><p className="text-sm text-slate-600 mt-2">Static prototype list. Identity is anonymous or first-name only.</p></section><section className="overflow-hidden rounded-3xl border border-slate-200 bg-white"><table className="min-w-full text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-600"><tr>{["Request ID","Patient display","Support type","Requested audience","Urgency","Facility rule status","Current status","Action"].map(h=><th key={h} className="px-3 py-3 text-left">{h}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{requests.map((r)=><tr key={r[0]}>{r.map((c)=><td key={c} className="px-3 py-3 text-slate-700">{c}</td>)}<td className="px-3 py-3"><button disabled className="rounded-full border border-slate-300 px-3 py-1 text-xs text-slate-500">Local demo only</button></td></tr>)}</tbody></table></section></div>; }
