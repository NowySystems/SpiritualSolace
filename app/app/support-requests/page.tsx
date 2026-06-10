import {
  getResponderName,
  getRequestStats,
  messageTypes,
  solaceRequests,
  traditionPreferences
} from "@/lib/spiritual-solace-data";

const statusStyles: Record<string, string> = {
  "New": "border-[#d9d6c9] bg-[#f8f5ed] text-[#596961]",
  "Intake Review": "border-[#e8d9b7] bg-[#fff7df] text-[#7a5a1d]",
  "Routed": "border-[#cfdceb] bg-[#edf5ff] text-[#405c7d]",
  "Message Review": "border-[#ddd2ea] bg-[#f5f0fb] text-[#66547d]",
  "Delivered": "border-[#cfe2d0] bg-[#eef8ee] text-[#4f7457]",
  "Expired": "border-[#ddd7d0] bg-[#f2f0ed] text-[#6a665f]"
};

const priorityStyles: Record<string, string> = {
  "Routine": "border-[#d8d3c7] bg-white/70 text-[#61706a]",
  "Soon": "border-[#e2d6b9] bg-[#fff9e8] text-[#735d2a]",
  "Time Sensitive": "border-[#e8c8c0] bg-[#fff1ee] text-[#8a4637]"
};

export default function SupportRequestsPage() {
  const stats = getRequestStats();

  return (
    <div className="space-y-6 lg:space-y-7">
      <section className="rounded-[2rem] border border-[#dfd8cb] bg-gradient-to-br from-[#fffdf9] via-[#f8f3e9] to-[#eef4f0] p-7 shadow-[0_12px_32px_rgba(77,94,86,0.08)] lg:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#5f746d]">Module 1 · Support Requests</p>
        <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#1f3442]">Patient solace request intake queue</h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#4f6058]">
          Canonical request workflow for patients, family helpers, or approved staff helpers requesting one-way prayer,
          affirmation, encouragement, guidance, pep, or calming support. Demo data only; no real patient information.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-2xl border border-[#dfd8cb] bg-white/85 p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#6a7b74]">Total requests</p>
            <p className="mt-2 text-2xl font-semibold text-[#223746]">{stats.total}</p>
            <p className="mt-1 text-xs text-[#5f7069]">In demo queue</p>
          </article>
          <article className="rounded-2xl border border-[#dfd8cb] bg-white/85 p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#6a7b74]">Needs review</p>
            <p className="mt-2 text-2xl font-semibold text-[#223746]">{stats.needsReview}</p>
            <p className="mt-1 text-xs text-[#5f7069]">Intake or message review</p>
          </article>
          <article className="rounded-2xl border border-[#dfd8cb] bg-white/85 p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#6a7b74]">Routed</p>
            <p className="mt-2 text-2xl font-semibold text-[#223746]">{stats.routed}</p>
            <p className="mt-1 text-xs text-[#5f7069]">Assigned to responder</p>
          </article>
          <article className="rounded-2xl border border-[#dfd8cb] bg-white/85 p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#6a7b74]">Time sensitive</p>
            <p className="mt-2 text-2xl font-semibold text-[#223746]">{stats.timeSensitive}</p>
            <p className="mt-1 text-xs text-[#5f7069]">Prioritize staff review</p>
          </article>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-3xl border border-[#dfd8cb] bg-white/85 p-6 shadow-[0_8px_24px_rgba(77,94,86,0.06)]">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#5f746d]">Queue</p>
              <h3 className="mt-1 text-xl font-semibold text-[#223746]">Open solace requests</h3>
            </div>
            <span className="rounded-full border border-[#d7d9cf] bg-[#f3f6f0] px-3 py-1.5 text-xs font-semibold text-[#556a62]">
              Human review before delivery
            </span>
          </div>

          <div className="mt-5 space-y-4">
            {solaceRequests.map((request) => (
              <article key={request.id} className="rounded-2xl border border-[#e4ddd1] bg-[#faf7f0] p-4 shadow-sm">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-[#223746]">{request.id} · {request.patientAlias}</p>
                      <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${statusStyles[request.status]}`}>
                        {request.status}
                      </span>
                      <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${priorityStyles[request.priority]}`}>
                        {request.priority}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-[#4f6058]">{request.note}</p>
                  </div>
                  <p className="shrink-0 rounded-xl border border-[#dfd8cb] bg-white/80 px-3 py-2 text-xs font-medium text-[#60716a]">
                    {request.submittedAt}
                  </p>
                </div>

                <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2 xl:grid-cols-3">
                  <div className="rounded-xl border border-[#e6dfd4] bg-white/75 p-3">
                    <dt className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#718078]">Location</dt>
                    <dd className="mt-1 font-medium text-[#314550]">{request.location}</dd>
                  </div>
                  <div className="rounded-xl border border-[#e6dfd4] bg-white/75 p-3">
                    <dt className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#718078]">Request type</dt>
                    <dd className="mt-1 font-medium text-[#314550]">{request.requestType}</dd>
                  </div>
                  <div className="rounded-xl border border-[#e6dfd4] bg-white/75 p-3">
                    <dt className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#718078]">Responder</dt>
                    <dd className="mt-1 font-medium text-[#314550]">{getResponderName(request.assignedResponderId)}</dd>
                  </div>
                  <div className="rounded-xl border border-[#e6dfd4] bg-white/75 p-3">
                    <dt className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#718078]">Tradition</dt>
                    <dd className="mt-1 font-medium text-[#314550]">{request.traditionPreference}</dd>
                  </div>
                  <div className="rounded-xl border border-[#e6dfd4] bg-white/75 p-3">
                    <dt className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#718078]">Tone</dt>
                    <dd className="mt-1 font-medium text-[#314550]">{request.tonePreference}</dd>
                  </div>
                  <div className="rounded-xl border border-[#e6dfd4] bg-white/75 p-3">
                    <dt className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#718078]">Consent</dt>
                    <dd className="mt-1 font-medium text-[#314550]">{request.consentConfirmed ? "Confirmed" : "Needs confirmation"}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </article>

        <aside className="space-y-5">
          <article className="rounded-3xl border border-[#dfd8cb] bg-white/85 p-6 shadow-[0_8px_24px_rgba(77,94,86,0.06)]">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#5f746d]">Intake schema</p>
            <h3 className="mt-1 text-lg font-semibold text-[#223746]">Allowed request categories</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {messageTypes.map((type) => (
                <span key={type} className="rounded-full border border-[#d8d3c7] bg-[#f8f4ec] px-3 py-1.5 text-xs font-semibold text-[#4f6058]">
                  {type}
                </span>
              ))}
            </div>
          </article>

          <article className="rounded-3xl border border-[#dfd8cb] bg-white/85 p-6 shadow-[0_8px_24px_rgba(77,94,86,0.06)]">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#5f746d]">Routing preferences</p>
            <h3 className="mt-1 text-lg font-semibold text-[#223746]">Tradition options</h3>
            <ul className="mt-4 space-y-2 text-sm text-[#4f6058]">
              {traditionPreferences.map((preference) => (
                <li key={preference} className="rounded-xl border border-[#e4ddd1] bg-[#faf6ee] px-3 py-2 font-medium">
                  {preference}
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-3xl border border-[#d8d3c7] bg-[#f6f1e7] p-6 shadow-[0_8px_20px_rgba(77,94,86,0.05)]">
            <h3 className="text-lg font-semibold text-[#223746]">Pass 1 status</h3>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-[#4f6058]">
              <li>• Stub route replaced.</li>
              <li>• Canonical data layer connected.</li>
              <li>• Request queue and intake schema visible.</li>
              <li>• No live persistence or patient data.</li>
            </ul>
          </article>
        </aside>
      </section>
    </div>
  );
}
