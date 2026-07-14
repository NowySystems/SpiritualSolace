import { pilotCareRequest } from "./data";
import { FacilitySidebar } from "./FacilitySidebar";
import { PilotTopBar } from "./PilotTopBar";
import { StatusPath } from "./StatusPath";

function MetricCard({ label, value, tone = "green" }: { label: string; value: string; tone?: "green" | "gold" | "teal" }) {
  const tones = {
    green: "bg-[#e7f1eb] text-[#0f6b54]",
    gold: "bg-[#fff4d7] text-[#7a5b20]",
    teal: "bg-[#e4f3f1] text-[#19726c]"
  };

  return (
    <article className="rounded-[1.25rem] border border-[#d9dfd7] bg-white p-5 shadow-sm shadow-[#0d2b3b]/5">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-[#506a49]">{label}</p>
      <p className={`mt-3 inline-flex rounded-full px-3 py-1 text-sm font-black ${tones[tone]}`}>{value}</p>
    </article>
  );
}

function ActionButton({ children, primary = false }: { children: string; primary?: boolean }) {
  return (
    <button
      type="button"
      className={`w-full rounded-xl px-4 py-3 text-left text-sm font-black transition ${
        primary
          ? "bg-[#0f3f35] text-white shadow-lg shadow-[#0f3f35]/18 hover:bg-[#082838]"
          : "border border-[#d9dfd7] bg-white text-[#0d2b3b] hover:bg-[#f8fbf8]"
      }`}
    >
      {children}
    </button>
  );
}

export function FacilityPortalFinal() {
  const request = pilotCareRequest;

  return (
    <main className="min-h-screen bg-[#edf4f0] text-[#0d2b3b]">
      <PilotTopBar role="facility" userName="Melissa Peterson" userContext="Facility reviewer" />

      <div className="flex">
        <FacilitySidebar />

        <section className="min-w-0 flex-1 px-5 py-6 md:px-8 lg:py-8">
          <div className="mx-auto max-w-[92rem] space-y-6">
            <div className="overflow-hidden rounded-[2rem] border border-[#d9dfd7] bg-white shadow-xl shadow-[#0d2b3b]/8">
              <div className="grid gap-6 border-b border-[#d9dfd7] bg-[#f8fbf8] p-6 md:p-8 xl:grid-cols-[1fr_24rem] xl:items-center">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-[#19726c]">Facility review console</p>
                  <h1 className="mt-4 font-serif text-4xl font-semibold tracking-[-0.05em] text-[#0d2b3b] md:text-5xl">
                    Review request before partner sharing.
                  </h1>
                  <p className="mt-4 max-w-3xl text-base leading-7 text-[#4f6259]">
                    Confirm the spiritual-care request, consent status, and sharing boundary before any partner receives approved context.
                  </p>
                </div>

                <div className="rounded-[1.5rem] bg-[#082838] p-6 text-white shadow-xl shadow-[#082838]/15">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#8dbd9e]">Next action</p>
                  <p className="mt-3 font-serif text-2xl font-semibold">Complete facility review</p>
                  <p className="mt-2 text-sm leading-6 text-[#d9e7df]">Approve what can be shared or mark consent needed.</p>
                </div>
              </div>

              <div className="p-5 md:p-7">
                <StatusPath currentStatus={request.currentStatus} />
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1fr_24rem]">
              <div className="space-y-6">
                <section className="rounded-[1.75rem] border border-[#d9dfd7] bg-white p-6 shadow-sm shadow-[#0d2b3b]/5">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-[#506a49]">Request snapshot</p>
                      <h2 className="mt-3 font-serif text-3xl font-semibold tracking-[-0.04em]">{request.personName}</h2>
                      <p className="mt-2 text-sm font-bold text-[#4f6259]">
                        {request.displayId} · Room {request.room} · {request.locationLabel}
                      </p>
                    </div>
                    <span className="rounded-full bg-[#fff4d7] px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-[#7a5b20]">Facility Review</span>
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-3">
                    <MetricCard label="Requested by" value={`${request.requestedBy.name} · ${request.requestedBy.relationship}`} tone="teal" />
                    <MetricCard label="Consent" value="Pending review" tone="gold" />
                    <MetricCard label="Partner sharing" value="Not shared" tone="green" />
                  </div>

                  <div className="mt-6 rounded-[1.35rem] border border-[#d9dfd7] bg-[#f8fbf8] p-5">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-[#506a49]">Structured request</p>
                    <p className="mt-3 text-lg font-black text-[#0d2b3b]">{request.requestType}</p>
                    <dl className="mt-5 grid gap-4 text-sm md:grid-cols-3">
                      <div>
                        <dt className="font-black text-[#63736b]">Preferred contact</dt>
                        <dd className="mt-1 font-semibold text-[#0d2b3b]">{request.preferredContact}</dd>
                      </div>
                      <div>
                        <dt className="font-black text-[#63736b]">Best time</dt>
                        <dd className="mt-1 font-semibold text-[#0d2b3b]">{request.bestContactTime}</dd>
                      </div>
                      <div>
                        <dt className="font-black text-[#63736b]">Submitted</dt>
                        <dd className="mt-1 font-semibold text-[#0d2b3b]">{request.createdAt}</dd>
                      </div>
                    </dl>
                  </div>
                </section>

                <section className="rounded-[1.75rem] border border-[#d9dfd7] bg-white p-6 shadow-sm shadow-[#0d2b3b]/5">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-[#506a49]">Activity record</p>
                      <h2 className="mt-2 font-serif text-2xl font-semibold">Visible facility timeline</h2>
                    </div>
                    <span className="rounded-full bg-[#e7f1eb] px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-[#0f6b54]">Audit-safe</span>
                  </div>

                  <div className="mt-6 space-y-4">
                    {request.timeline.map((event) => (
                      <article key={event.id} className="grid gap-4 rounded-[1.25rem] border border-[#d9dfd7] bg-[#f8fbf8] p-4 md:grid-cols-[10rem_1fr]">
                        <div>
                          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#506a49]">{event.actorRole}</p>
                          <p className="mt-2 text-sm font-bold text-[#63736b]">{event.occurredAt}</p>
                        </div>
                        <div>
                          <h3 className="font-black text-[#0d2b3b]">{event.title}</h3>
                          <p className="mt-1 text-sm font-semibold text-[#4f6259]">{event.actor}</p>
                          <p className="mt-2 text-sm leading-6 text-[#4f6259]">{event.summary}</p>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              </div>

              <aside className="space-y-5">
                <section className="rounded-[1.75rem] border border-[#d9dfd7] bg-white p-5 shadow-sm shadow-[#0d2b3b]/5">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#506a49]">Review actions</p>
                  <div className="mt-4 space-y-3">
                    <ActionButton primary>Complete facility review</ActionButton>
                    <ActionButton>Mark consent needed</ActionButton>
                    <ActionButton>Approve partner-ready context</ActionButton>
                    <ActionButton>Hold for internal follow-up</ActionButton>
                  </div>
                </section>

                <section className="rounded-[1.75rem] border border-[#eed9a8] bg-[#fffaf0] p-5 shadow-sm shadow-[#0d2b3b]/5">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#9a6b16]">Sharing boundary</p>
                  <dl className="mt-4 space-y-3 text-sm">
                    <div className="flex justify-between gap-4 border-b border-[#eadfbf] pb-3">
                      <dt className="font-semibold text-[#6d5c35]">Requester update</dt>
                      <dd className="font-black text-[#0f3f35]">Approved only</dd>
                    </div>
                    <div className="flex justify-between gap-4 border-b border-[#eadfbf] pb-3">
                      <dt className="font-semibold text-[#6d5c35]">Partner access</dt>
                      <dd className="font-black text-[#7a5b20]">Not yet</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="font-semibold text-[#6d5c35]">Medical details</dt>
                      <dd className="font-black text-[#0d2b3b]">Not collected</dd>
                    </div>
                  </dl>
                </section>

                <section className="rounded-[1.75rem] border border-[#d9dfd7] bg-[#f8fbf8] p-5 shadow-sm shadow-[#0d2b3b]/5">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#506a49]">Partner readiness</p>
                  <p className="mt-3 text-sm leading-6 text-[#4f6259]">Hope Church can receive this request only after facility review and consent boundaries are complete.</p>
                </section>
              </aside>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
