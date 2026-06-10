import { approvedResponders, solaceRequests } from "@/lib/spiritual-solace-data";

const statusStyles: Record<string, string> = {
  Active: "border-[#cfe2d0] bg-[#eef8ee] text-[#4f7457]",
  Limited: "border-[#e2d6b9] bg-[#fff9e8] text-[#735d2a]",
  "Renewal Needed": "border-[#e8c8c0] bg-[#fff1ee] text-[#8a4637]",
  Paused: "border-[#ddd7d0] bg-[#f2f0ed] text-[#6a665f]"
};

function getResponderRequestCount(responderId: string) {
  return solaceRequests.filter((request) => request.assignedResponderId === responderId).length;
}

function getCoverageSummary() {
  const active = approvedResponders.filter((responder) => responder.status === "Active").length;
  const reviewRequired = approvedResponders.filter((responder) => responder.reviewRequired).length;
  const languages = new Set(approvedResponders.flatMap((responder) => responder.languages));
  const traditions = new Set(approvedResponders.map((responder) => responder.tradition));

  return { active, reviewRequired, languages: languages.size, traditions: traditions.size };
}

export default function ApprovedRespondersPage() {
  const summary = getCoverageSummary();

  return (
    <div className="space-y-6 lg:space-y-7">
      <section className="rounded-[2rem] border border-[#dfd8cb] bg-gradient-to-br from-[#fffdf9] via-[#f8f3e9] to-[#eef4f0] p-7 shadow-[0_12px_32px_rgba(77,94,86,0.08)] lg:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#5f746d]">Module 2 · Approved Responders</p>
        <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#1f3442]">Trusted responder directory and routing layer</h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#4f6058]">
          Responder groups are the controlled bridge between a patient solace request and the one-way comfort message. This
          module shows who can respond, what they can provide, and where staff review is required before delivery.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
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
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#6a7b74]">Review required</p>
            <p className="mt-2 text-2xl font-semibold text-[#223746]">{summary.reviewRequired}</p>
            <p className="mt-1 text-xs text-[#5f7069]">Before patient delivery</p>
          </article>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-3xl border border-[#dfd8cb] bg-white/85 p-6 shadow-[0_8px_24px_rgba(77,94,86,0.06)]">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#5f746d]">Directory</p>
              <h3 className="mt-1 text-xl font-semibold text-[#223746]">Approved responder groups</h3>
            </div>
            <span className="rounded-full border border-[#d7d9cf] bg-[#f3f6f0] px-3 py-1.5 text-xs font-semibold text-[#556a62]">
              No public patient browsing
            </span>
          </div>

          <div className="mt-5 grid gap-4">
            {approvedResponders.map((responder) => (
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
                  <p className="shrink-0 rounded-xl border border-[#dfd8cb] bg-white/80 px-3 py-2 text-xs font-medium text-[#60716a]">
                    Verified {responder.lastVerified}
                  </p>
                </div>

                <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-xl border border-[#e6dfd4] bg-white/75 p-3">
                    <dt className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#718078]">Coverage</dt>
                    <dd className="mt-1 font-medium text-[#314550]">{responder.coverageArea}</dd>
                  </div>
                  <div className="rounded-xl border border-[#e6dfd4] bg-white/75 p-3">
                    <dt className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#718078]">Languages</dt>
                    <dd className="mt-1 font-medium text-[#314550]">{responder.languages.join(", ")}</dd>
                  </div>
                  <div className="rounded-xl border border-[#e6dfd4] bg-white/75 p-3">
                    <dt className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#718078]">Review rule</dt>
                    <dd className="mt-1 font-medium text-[#314550]">{responder.reviewRequired ? "Staff review required" : "Facility controlled"}</dd>
                  </div>
                  <div className="rounded-xl border border-[#e6dfd4] bg-white/75 p-3">
                    <dt className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#718078]">Assigned requests</dt>
                    <dd className="mt-1 font-medium text-[#314550]">{getResponderRequestCount(responder.id)}</dd>
                  </div>
                </dl>

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
            ))}
          </div>
        </article>

        <aside className="space-y-5">
          <article className="rounded-3xl border border-[#dfd8cb] bg-white/85 p-6 shadow-[0_8px_24px_rgba(77,94,86,0.06)]">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#5f746d]">Routing logic</p>
            <h3 className="mt-1 text-lg font-semibold text-[#223746]">Canonical match checks</h3>
            <ul className="mt-4 space-y-3 text-sm text-[#4f6058]">
              <li className="rounded-xl border border-[#e4ddd1] bg-[#faf6ee] px-3 py-2">Tradition or no-specific-tradition fit</li>
              <li className="rounded-xl border border-[#e4ddd1] bg-[#faf6ee] px-3 py-2">Requested message type allowed</li>
              <li className="rounded-xl border border-[#e4ddd1] bg-[#faf6ee] px-3 py-2">Language preference covered</li>
              <li className="rounded-xl border border-[#e4ddd1] bg-[#faf6ee] px-3 py-2">Responder status active or limited</li>
              <li className="rounded-xl border border-[#e4ddd1] bg-[#faf6ee] px-3 py-2">Facility review rule applied</li>
            </ul>
          </article>

          <article className="rounded-3xl border border-[#dfd8cb] bg-white/85 p-6 shadow-[0_8px_24px_rgba(77,94,86,0.06)]">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#5f746d]">Safety boundary</p>
            <h3 className="mt-1 text-lg font-semibold text-[#223746]">Responder limitations</h3>
            <ul className="mt-4 space-y-2 text-sm leading-relaxed text-[#4f6058]">
              <li>• No direct patient lookup.</li>
              <li>• No two-way messaging in MVP.</li>
              <li>• No medical advice or outcome promises.</li>
              <li>• No pressure, solicitation, or debate.</li>
              <li>• Staff review remains the default before delivery.</li>
            </ul>
          </article>

          <article className="rounded-3xl border border-[#d8d3c7] bg-[#f6f1e7] p-6 shadow-[0_8px_20px_rgba(77,94,86,0.05)]">
            <h3 className="text-lg font-semibold text-[#223746]">Pass 1 status</h3>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-[#4f6058]">
              <li>• Old source database route replaced.</li>
              <li>• Canonical responder records connected.</li>
              <li>• Routing fit checks visible.</li>
              <li>• Safety boundaries documented in-module.</li>
            </ul>
          </article>
        </aside>
      </section>
    </div>
  );
}
