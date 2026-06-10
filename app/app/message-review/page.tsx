import {
  getRequestById,
  getResponderById,
  solaceMessages
} from "@/lib/spiritual-solace-data";

const reviewStyles: Record<string, string> = {
  "Needs Review": "border-[#e8d9b7] bg-[#fff7df] text-[#7a5a1d]",
  Approved: "border-[#cfe2d0] bg-[#eef8ee] text-[#4f7457]",
  "Needs Edit": "border-[#ddd2ea] bg-[#f5f0fb] text-[#66547d]",
  Rejected: "border-[#e8c8c0] bg-[#fff1ee] text-[#8a4637]"
};

const riskStyles: Record<string, string> = {
  Low: "border-[#cfe2d0] bg-[#eef8ee] text-[#4f7457]",
  Medium: "border-[#e2d6b9] bg-[#fff9e8] text-[#735d2a]",
  Hold: "border-[#e8c8c0] bg-[#fff1ee] text-[#8a4637]"
};

const reviewChecklist = [
  "No advice about care decisions",
  "No promises about outcomes",
  "No pressure, solicitation, or debate",
  "Matches requested tradition and tone",
  "One-way comfort only",
  "Appropriate for facility-controlled delivery"
];

function getRiskLevel(status: string) {
  if (status === "Approved") return "Low";
  if (status === "Needs Review") return "Medium";
  return "Hold";
}

function getReviewEvidence(messageId: string, status: string) {
  const base = [
    "No care advice detected",
    "No outcome promise detected",
    "No solicitation or pressure language",
    "One-way comfort wording maintained"
  ];

  if (status === "Approved") {
    return [...base, "Ready for recipient view", "Decision recorded for audit trail"];
  }

  return [...base, "Requires staff decision before delivery", "Delivery held until review is complete"];
}

function getDecisionReason(status: string) {
  if (status === "Approved") {
    return "Message matches request context, respects boundaries, and is ready for one-way delivery.";
  }

  if (status === "Needs Review") {
    return "Message is calm and likely appropriate, but still requires staff review before delivery.";
  }

  return "Message should remain held until a facility reviewer makes a decision.";
}

export default function MessageReviewPage() {
  const needsReview = solaceMessages.filter((message) => message.status === "Needs Review").length;
  const approved = solaceMessages.filter((message) => message.status === "Approved").length;

  return (
    <div className="space-y-6 lg:space-y-7">
      <section className="rounded-[2rem] border border-[#dfd8cb] bg-gradient-to-br from-[#fffdf9] via-[#f8f3e9] to-[#eef4f0] p-7 shadow-[0_12px_32px_rgba(77,94,86,0.08)] lg:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#5f746d]">5:15 PM Pass 2 · Message Review</p>
        <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#1f3442]">Review evidence before one-way delivery</h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#4f6058]">
          This screen explains why a responder message can move forward, what risks were checked, what request context applies,
          and what decision remains before the recipient sees it.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-2xl border border-[#dfd8cb] bg-white/85 p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#6a7b74]">Submitted messages</p>
            <p className="mt-2 text-2xl font-semibold text-[#223746]">{solaceMessages.length}</p>
            <p className="mt-1 text-xs text-[#5f7069]">In demo review queue</p>
          </article>
          <article className="rounded-2xl border border-[#dfd8cb] bg-white/85 p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#6a7b74]">Needs review</p>
            <p className="mt-2 text-2xl font-semibold text-[#223746]">{needsReview}</p>
            <p className="mt-1 text-xs text-[#5f7069]">Held before delivery</p>
          </article>
          <article className="rounded-2xl border border-[#dfd8cb] bg-white/85 p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#6a7b74]">Approved</p>
            <p className="mt-2 text-2xl font-semibold text-[#223746]">{approved}</p>
            <p className="mt-1 text-xs text-[#5f7069]">Ready for recipient view</p>
          </article>
          <article className="rounded-2xl border border-[#dfd8cb] bg-white/85 p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#6a7b74]">Decision model</p>
            <p className="mt-2 text-2xl font-semibold text-[#223746]">Staff</p>
            <p className="mt-1 text-xs text-[#5f7069]">No autonomous delivery</p>
          </article>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
        <article className="rounded-3xl border border-[#dfd8cb] bg-white/85 p-6 shadow-[0_8px_24px_rgba(77,94,86,0.06)]">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#5f746d]">Review queue</p>
              <h3 className="mt-1 text-xl font-semibold text-[#223746]">Messages with safety evidence</h3>
            </div>
            <span className="rounded-full border border-[#d7d9cf] bg-[#f3f6f0] px-3 py-1.5 text-xs font-semibold text-[#556a62]">
              Demo actions disabled
            </span>
          </div>

          <div className="mt-5 space-y-4">
            {solaceMessages.map((message) => {
              const request = getRequestById(message.requestId);
              const responder = getResponderById(message.responderId);
              const riskLevel = getRiskLevel(message.status);
              const evidence = getReviewEvidence(message.id, message.status);

              return (
                <article key={message.id} className="rounded-2xl border border-[#e4ddd1] bg-[#faf7f0] p-4 shadow-sm">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-[#223746]">{message.id} · {request?.patientAlias ?? "Recipient"}</p>
                        <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${reviewStyles[message.status]}`}>
                          {message.status}
                        </span>
                        <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${riskStyles[riskLevel]}`}>
                          {riskLevel} risk
                        </span>
                      </div>
                      <p className="mt-1 text-sm font-medium text-[#5b6d65]">
                        From {responder?.name ?? "Unknown responder"} · {request?.requestType ?? "Support message"}
                      </p>
                    </div>
                    <p className="shrink-0 rounded-xl border border-[#dfd8cb] bg-white/80 px-3 py-2 text-xs font-medium text-[#60716a]">
                      {message.submittedAt}
                    </p>
                  </div>

                  <blockquote className="mt-4 rounded-2xl border border-[#e4ddd1] bg-white/80 p-4 text-sm leading-relaxed text-[#40534c]">
                    “{message.body}”
                  </blockquote>

                  <div className="mt-4 grid gap-3 text-sm lg:grid-cols-3">
                    <div className="rounded-xl border border-[#e6dfd4] bg-white/75 p-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#718078]">Request context</p>
                      <p className="mt-1 font-medium text-[#314550]">{request?.requestType ?? "Unknown"}</p>
                      <p className="mt-1 text-xs leading-relaxed text-[#5f7069]">{request?.traditionPreference ?? "Unknown"} · {request?.tonePreference ?? "Unknown"}</p>
                    </div>
                    <div className="rounded-xl border border-[#e6dfd4] bg-white/75 p-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#718078]">Delivery readiness</p>
                      <p className="mt-1 font-medium text-[#314550]">{message.status === "Approved" ? "Ready for recipient view" : "Hold for staff decision"}</p>
                      <p className="mt-1 text-xs leading-relaxed text-[#5f7069]">One-way temporary delivery only</p>
                    </div>
                    <div className="rounded-xl border border-[#e6dfd4] bg-white/75 p-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#718078]">Decision audit</p>
                      <p className="mt-1 font-medium text-[#314550]">{message.reviewedBy ?? "Not reviewed yet"}</p>
                      <p className="mt-1 text-xs leading-relaxed text-[#5f7069]">{getDecisionReason(message.status)}</p>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_0.9fr]">
                    <div className="rounded-xl border border-[#e6dfd4] bg-white/70 p-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#718078]">Review evidence</p>
                      <ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-[#4f6058]">
                        {evidence.map((item) => (
                          <li key={item}>✓ {item}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-xl border border-[#e6dfd4] bg-white/70 p-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#718078]">Safety notes</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {message.safetyNotes.map((note) => (
                          <span key={note} className="rounded-full border border-[#d8d3c7] bg-[#f8f4ec] px-2.5 py-1 text-[11px] font-semibold text-[#4f6058]">
                            {note}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button disabled className="rounded-xl border border-[#cfe2d0] bg-[#eef8ee] px-3 py-2 text-xs font-semibold text-[#4f7457]">
                      Approve demo
                    </button>
                    <button disabled className="rounded-xl border border-[#ddd2ea] bg-[#f5f0fb] px-3 py-2 text-xs font-semibold text-[#66547d]">
                      Request edit demo
                    </button>
                    <button disabled className="rounded-xl border border-[#e8c8c0] bg-[#fff1ee] px-3 py-2 text-xs font-semibold text-[#8a4637]">
                      Reject demo
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </article>

        <aside className="space-y-5">
          <article className="rounded-3xl border border-[#dfd8cb] bg-white/85 p-6 shadow-[0_8px_24px_rgba(77,94,86,0.06)]">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#5f746d]">Review checklist</p>
            <h3 className="mt-1 text-lg font-semibold text-[#223746]">Before delivery</h3>
            <ul className="mt-4 space-y-2 text-sm text-[#4f6058]">
              {reviewChecklist.map((item) => (
                <li key={item} className="rounded-xl border border-[#e4ddd1] bg-[#faf6ee] px-3 py-2 font-medium">
                  {item}
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-3xl border border-[#dfd8cb] bg-white/85 p-6 shadow-[0_8px_24px_rgba(77,94,86,0.06)]">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#5f746d]">Decision model</p>
            <h3 className="mt-1 text-lg font-semibold text-[#223746]">Non-autonomous control</h3>
            <ul className="mt-4 space-y-2 text-sm leading-relaxed text-[#4f6058]">
              <li>• The system prepares context and evidence.</li>
              <li>• Staff makes the delivery decision.</li>
              <li>• Every decision should create an audit event.</li>
              <li>• No outreach occurs without explicit approval.</li>
            </ul>
          </article>

          <article className="rounded-3xl border border-[#d8d3c7] bg-[#f6f1e7] p-6 shadow-[0_8px_20px_rgba(77,94,86,0.05)]">
            <h3 className="text-lg font-semibold text-[#223746]">Pass 2 status</h3>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-[#4f6058]">
              <li>• Risk labels added.</li>
              <li>• Review evidence added.</li>
              <li>• Request context strengthened.</li>
              <li>• Decision audit explanation added.</li>
            </ul>
          </article>
        </aside>
      </section>
    </div>
  );
}
