import { pilotCareRequest } from "./data";
import { PilotTopBar } from "./PilotTopBar";
import { RequesterIntakePanel } from "./RequesterIntakePanel";
import { StatusPath } from "./StatusPath";

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-[#d9dfd7] bg-[#f8fbf8] p-4">
      <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#e7f1eb] text-xs font-black text-[#0f6b54]">✓</span>
      <div>
        <p className="text-xs font-black uppercase tracking-[0.14em] text-[#506a49]">{label}</p>
        <p className="mt-1 text-sm font-bold text-[#0d2b3b]">{value}</p>
      </div>
    </div>
  );
}

export function RequesterPortalFinal() {
  const request = pilotCareRequest;
  const latestUpdate = request.approvedUpdates[0];

  return (
    <main className="min-h-screen bg-[#edf4f0] text-[#0d2b3b]">
      <PilotTopBar role="requester" userName="Jane Doe" userContext="Requester view" />

      <section className="mx-auto max-w-[86rem] px-6 py-8 lg:py-10">
        <div className="overflow-hidden rounded-[2rem] border border-[#d9dfd7] bg-white shadow-xl shadow-[#0d2b3b]/8">
          <div className="relative overflow-hidden border-b border-[#d9dfd7] bg-[#fffaf0] px-7 py-8 md:px-10 md:py-10">
            <div className="absolute right-8 top-6 hidden h-44 w-64 rounded-full bg-[#f4d58a]/30 blur-3xl md:block" />
            <div className="relative grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-center">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#9a6b16]">Requester portal</p>
                <h1 className="mt-4 max-w-3xl font-serif text-5xl font-semibold tracking-[-0.06em] text-[#0d2b3b] md:text-6xl">
                  Good evening, Sarah.
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-[#4f6259]">
                  Complete your profile, submit a structured spiritual-care request, and return here for approved updates.
                </p>
              </div>

              <div className="rounded-[1.5rem] bg-[#0f3f35] p-6 text-white shadow-xl shadow-[#0f3f35]/18">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#c7e2d0]">Signed in as</p>
                <p className="mt-3 text-xl font-black">Sarah K. · Daughter</p>
                <p className="mt-1 text-sm font-semibold text-[#d9e7df]">Family requester</p>
                <div className="mt-5 rounded-2xl bg-white/12 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#c7e2d0]">Current status</p>
                  <p className="mt-2 font-serif text-2xl font-semibold">Facility Review</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 p-5 md:p-7 lg:grid-cols-[1fr_22rem]">
            <div className="space-y-6">
              <RequesterIntakePanel />
              <StatusPath currentStatus={request.currentStatus} />

              <section className="rounded-[1.5rem] border border-[#d9dfd7] bg-white p-6 shadow-sm shadow-[#0d2b3b]/5">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-[#506a49]">Current request</p>
                    <h2 className="mt-3 font-serif text-3xl font-semibold tracking-[-0.04em] text-[#0d2b3b]">{request.personName}</h2>
                    <p className="mt-2 text-sm font-bold text-[#4f6259]">
                      Room {request.room} · {request.requestType}
                    </p>
                  </div>
                  <span className="rounded-full bg-[#e7f1eb] px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-[#0f6b54]">
                    Spiritual-care only
                  </span>
                </div>

                <div className="mt-6 grid gap-3 md:grid-cols-2">
                  <InfoRow label="Person" value={request.personName} />
                  <InfoRow label="Relationship" value={request.requestedBy.relationship} />
                  <InfoRow label="Request" value={request.requestType} />
                  <InfoRow label="Preferred contact" value={request.preferredContact} />
                  <InfoRow label="Best contact time" value={request.bestContactTime} />
                  <InfoRow label="Location" value={`Room ${request.room}`} />
                </div>
              </section>

              <section className="rounded-[1.5rem] border border-[#d9dfd7] bg-white p-6 shadow-sm shadow-[#0d2b3b]/5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-[#506a49]">Approved updates</p>
                    <h2 className="mt-2 font-serif text-2xl font-semibold text-[#0d2b3b]">Latest approved activity</h2>
                  </div>
                  <span className="rounded-full bg-[#f6f7f2] px-3 py-1 text-xs font-bold text-[#63736b]">Approved only</span>
                </div>

                <article className="mt-5 flex gap-4 rounded-2xl border border-[#d9dfd7] bg-[#f8fbf8] p-4">
                  <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-[#fff4d7] text-[#7a5b20]">
                    <span className="text-xs font-black">APR</span>
                    <span className="text-lg font-black">27</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-black text-[#0d2b3b]">{latestUpdate.title}</h3>
                      <span className="rounded-full bg-[#e7f1eb] px-2.5 py-1 text-[0.65rem] font-black uppercase tracking-[0.1em] text-[#0f6b54]">Approved</span>
                    </div>
                    <p className="mt-1 text-sm font-semibold text-[#4f6259]">{latestUpdate.approvedBy} · {latestUpdate.occurredAt}</p>
                    <p className="mt-2 text-sm leading-6 text-[#4f6259]">{latestUpdate.summary}</p>
                  </div>
                </article>
              </section>
            </div>

            <aside className="space-y-5">
              <section className="rounded-[1.5rem] border border-[#d9dfd7] bg-[#f8fbf8] p-5 shadow-sm shadow-[#0d2b3b]/5">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#506a49]">What happens next?</p>
                <p className="mt-3 text-sm leading-6 text-[#4f6259]">
                  The facility will complete review and confirm consent before any partner receives approved context.
                </p>
              </section>

              <section className="rounded-[1.5rem] border border-[#eed9a8] bg-[#fffaf0] p-5 shadow-sm shadow-[#0d2b3b]/5">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#9a6b16]">Need to update your request?</p>
                <p className="mt-3 text-sm leading-6 text-[#5f4b1f]">Contact the facility to request a change or ask a question.</p>
                <button type="button" className="mt-4 w-full rounded-xl border border-[#d6a943]/40 bg-white px-4 py-3 text-sm font-black text-[#0f3f35] shadow-sm hover:bg-[#fff4d7]">
                  Contact Facility
                </button>
              </section>

              <section className="rounded-[1.5rem] border border-[#d9dfd7] bg-white p-5 shadow-sm shadow-[#0d2b3b]/5">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#506a49]">Access boundary</p>
                <dl className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between gap-4 border-b border-[#edf1ed] pb-3">
                    <dt className="font-semibold text-[#63736b]">Requester view</dt>
                    <dd className="font-black text-[#0f3f35]">Approved updates</dd>
                  </div>
                  <div className="flex justify-between gap-4 border-b border-[#edf1ed] pb-3">
                    <dt className="font-semibold text-[#63736b]">Medical details</dt>
                    <dd className="font-black text-[#0d2b3b]">Not collected</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="font-semibold text-[#63736b]">Partner sharing</dt>
                    <dd className="font-black text-[#7a5b20]">Under review</dd>
                  </div>
                </dl>
              </section>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
