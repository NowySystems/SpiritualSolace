import { approvedResponders, solaceRequests } from "@/lib/spiritual-solace-data";

const statusStyles: Record<string, string> = {
  Active: "border-[#cfe2d0] bg-[#eef8ee] text-[#4f7457]",
  Limited: "border-[#e2d6b9] bg-[#fff9e8] text-[#735d2a]",
  "Renewal Needed": "border-[#e8c8c0] bg-[#fff1ee] text-[#8a4637]",
  Paused: "border-[#ddd7d0] bg-[#f2f0ed] text-[#6a665f]"
};

function getResponderRequests(responderId: string) {
  return solaceRequests.filter((request) => request.assignedResponderId === responderId);
}

function getCoverageSummary() {
  const active = approvedResponders.filter((responder) => responder.status === "Active").length;
  const reviewRequired = approvedResponders.filter((responder) => responder.reviewRequired).length;
  const languages = new Set(approvedResponders.flatMap((responder) => responder.languages));
  const traditions = new Set(approvedResponders.map((responder) => responder.tradition));
  const assigned = solaceRequests.filter((request) => request.assignedResponderId).length;

  return { active, reviewRequired, languages: languages.size, traditions: traditions.size, assigned };
}

function getRoutingScore(responderId: string) {
  const responder = approvedResponders.find((item) => item.id === responderId);
  if (!responder) return 0;

  const checks = [
    responder.status === "Active" || responder.status === "Limited",
    responder.reviewRequired,
    responder.languages.includes("English"),
    responder.messageTypes.length > 0,
    getResponderRequests(responderId).length > 0
  ];

  return checks.filter(Boolean).length;
}

function getRoutingReasons(responderId: string) {
  const responder = approvedResponders.find((item) => item.id === responderId);
  const requests = getResponderRequests(responderId);

  if (!responder) return [];

  const reasons = [
    `${responder.tradition} coverage is available`,
    `${responder.messageTypes.slice(0, 2).join(" and ")} supported`,
    `${responder.languages.join(" / ")} language coverage`,
    responder.reviewRequired ? "Staff review required before delivery" : "Facility-controlled review path",
    requests.length ? `Assigned to ${requests.length} active demo request${requests.length === 1 ? "" : "s"}` : "Available for future routing"
  ];

  return reasons;
}

const coverageHealth = [
  { label: "Christian prayer", state: "Covered", note: "First Community Prayer Team supports prayer and encouragement." },
  { label: "Interfaith calming words", state: "Covered", note: "Interfaith Comfort Circle supports non-denominational comfort." },
  { label: "No specific tradition", state: "Covered", note: "Volunteer Encouragement Desk can handle general support." },
  { label: "Spanish language", state: "Limited", note: "Available through one approved support partner only." }
];

export default function ApprovedRespondersPage() {
  const summary = getCoverageSummary();

  return (
    <div className="space-y-6 lg:space-y-7">
      <section className="rounded-[2rem] border border-[#dfd8cb] bg-gradient-to-br from-[#fffdf9] via-[#f8f3e9] to-[#eef4f0] p-7 shadow-[0_12px_32px_rgba(77,94,86,0.08)] lg:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#5f746d]">5:07 PM Pass 2 · Approved Responders</p>
        <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#1f3442]">Responder routing intelligence</h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#4f6058]">
          This view explains not only who can respond, but why a responder is a safe fit for a request. The goal is clear routing evidence,
          coverage visibility, and staff-controlled message delivery.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <article className="rounded-2xl border border-[#dfd8cb] bg-white/85 p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#6a7b74]">Approved groups</p>
            <p className="mt-2 text-2xl font-semibold text-[#223746]">{approvedResponders.length}</p>
            <p className="mt-1 text-xs text-[#5f7069]">In demo directory</p>
          </article>
          <article className="rounded-2xl border border-[#dfd8cb] bg-white/85 p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#6a7b74]">Active now</p>
            <p className="mt-2 text-2xl font-semibold text-[#223746]">{summary.active}</p>
            <p className="mt-1 text-xs text-[#5f7069]">Available for routing</p>
          </article>
          <article className="rounded-2xl border border-[#dfd8cb] bg-white/85 p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#6a7b74]">Languages</p>
            <p className="mt-2 text-2xl font-semibold text-[#223746]">{summary.languages}</p>
            <p className="mt-1 text-xs text-[#5f7069]">Covered in directory</p>
          </article>
          <article className="rounded-2xl border border-[#dfd8cb] bg-white/85 p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#6a7b74]">Assigned</p>
            <p className="mt-2 text-2xl font-semibold text-[#223746]">{summary.assigned}</p>
            <p className="mt-1 text-xs text-[#5f7069]">Requests routed</p>
          </article>
          <article className="rounded-2xl border border-[#dfd8cb] bg-white/85 p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#6a7b74]">Review required</p>
            <p className="mt-2 text-2xl font-semibold text-[#223746]">{summary.reviewRequired}</p>
            <p className="mt-1 text-xs text-[#5f7069]">Before delivery</p>
          </article>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <aside className="space-y-5">
          <article className="rounded-3xl border border-[#dfd8cb] bg-white/85 p-6 shadow-[0_8px_24px_rgba(77,94,86,0.06)]">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#5f746d]">Coverage health</p>
            <h3 className="mt-1 text-xl font-semibold text-[#223746]">Can requests be routed?</h3>
            <div className="mt-4 space-y-3">
              {coverageHealth.map((item) => (
                <article key={item.label} className="rounded-2xl border border-[#e4ddd1] bg-[#faf6ee] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-[#223746]">{item.label}</p>
                    <span className="rounded-full border border-[#d8d3c7] bg-white/80 px-2.5 py-1 text-[11px] font-semibold text-[#61706a]">
                      {item.state}
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-[#5f7069]">{item.note}</p>
                </article>
              ))}
            </div>
          </article>

          <article className="rounded-3xl border border-[#dfd8cb] bg-white/85 p-6 shadow-[0_8px_24px_rgba(77,94,86,0.06)]">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#5f746d]">Routing checks</p>
            <h3 className="mt-1 text-lg font-semibold text-[#223746]">Canonical match evidence</h3>
            <ul className="mt-4 space-y-3 text-sm text-[#4f6058]">
              <li className="rounded-xl border border-[#e4ddd1] bg-[#faf6ee] px-3 py-2">Tradition or no-specific-tradition fit</li>
              <li className="rounded-xl border border-[#e4ddd1] bg-[#faf6ee] px-3 py-2">Requested message type allowed</li>
              <li className="rounded-xl border border-[#e4ddd1] bg-[#faf6ee] px-3 py-2">Language preference covered</li>
              <li className="rounded-xl border border-[#e4ddd1] bg-[#faf6ee] px-3 py-2">Responder status active or limited</li>
              <li className="rounded-xl border border-[#e4ddd1] bg-[#faf6ee] px-3 py-2">Human review rule applied</li>
            </ul>
          </article>
        </aside>

        <article className="rounded-3xl border border-[#dfd8cb] bg-white/85 p-6 shadow-[0_8px_24px_rgba(77,94,86,0.06)]">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#5f746d]">Responder directory</p>
              <h3 className="mt-1 text-xl font-semibold text-[#223746]">Why each responder can be selected</h3>
            </div>
            <span className="rounded-full border border-[#d7d9cf] bg-[#f3f6f0] px-3 py-1.5 text-xs font-semibold text-[#556a62]">
              Staff-only routing view
            </span>
          </div>

          <div className="mt-5 grid gap-4">
            {approvedResponders.map((responder) => {
              const assignedRequests = getResponderRequests(responder.id);
              const score = getRoutingScore(responder.id);
              const reasons = getRoutingReasons(responder.id);

              return (
                <article key={responder.id} className="rounded-2xl border border-[#e4ddd1] bg-[#faf7f0] p-4 shadow-sm">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-semibold text-[#223746]">{responder.name}</h4>
                        <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${statusStyles[responder.status]}`}>
                          {responder.status}
                        </span>
                        <span className="rounded-full border border-[#d8d3c7] bg-white/80 px-2.5 py-1 text-[11px] font-semibold text-[#61706a]">
                          {responder.tradition}
                        </span>
                      </div>
                      <p className="mt-1 text-sm font-medium text-[#5b6d65]">{responder.organization}</p>
                      <p className="mt-2 text-sm leading-relaxed text-[#4f6058]">{responder.notes}</p>
                    </div>
                    <div className="shrink-0 rounded-2xl border border-[#dfd8cb] bg-white/80 px-4 py-3 text-center shadow-sm">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#718078]">Routing score</p>
                      <p className="mt-1 text-2xl font-semibold text-[#223746]">{score}/5</p>
                      <p className="mt-1 text-[11px] text-[#60716a]">Verified {responder.lastVerified}</p>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-xl border border-[#e6dfd4] bg-white/75 p-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#718078]">Coverage</p>
                      <p className="mt-1 font-medium text-[#314550]">{responder.coverageArea}</p>
                    </div>
                    <div className="rounded-xl border border-[#e6dfd4] bg-white/75 p-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#718078]">Languages</p>
                      <p className="mt-1 font-medium text-[#314550]">{responder.languages.join(", ")}</p>
                    </div>
                    <div className="rounded-xl border border-[#e6dfd4] bg-white/75 p-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#718078]">Review rule</p>
                      <p className="mt-1 font-medium text-[#314550]">{responder.reviewRequired ? "Staff review required" : "Facility controlled"}</p>
                    </div>
                    <div className="rounded-xl border border-[#e6dfd4] bg-white/75 p-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#718078]">Assigned requests</p>
                      <p className="mt-1 font-medium text-[#314550]">{assignedRequests.length}</p>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_0.9fr]">
                    <div className="rounded-xl border border-[#e6dfd4] bg-white/70 p-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#718078]">Why selected</p>
                      <ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-[#4f6058]">
                        {reasons.map((reason) => (
                          <li key={reason}>✓ {reason}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-xl border border-[#e6dfd4] bg-white/70 p-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#718078]">Selected for</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {assignedRequests.length ? assignedRequests.map((request) => (
                          <span key={request.id} className="rounded-full border border-[#d8d3c7] bg-[#f8f4ec] px-2.5 py-1 text-[11px] font-semibold text-[#4f6058]">
                            {request.id} · {request.requestType}
                          </span>
                        )) : (
                          <span className="rounded-full border border-[#d8d3c7] bg-[#f8f4ec] px-2.5 py-1 text-[11px] font-semibold text-[#4f6058]">
                            Available for future routing
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 rounded-xl border border-[#e6dfd4] bg-white/70 p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#718078]">Allowed message types</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {responder.messageTypes.map((type) => (
                        <span key={type} className="rounded-full border border-[#d8d3c7] bg-[#f8f4ec] px-2.5 py-1 text-[11px] font-semibold text-[#4f6058]">
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </article>
      </section>
    </div>
  );
}
