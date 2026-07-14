import { pilotCareRequest } from "./data";
import { PilotTopBar } from "./PilotTopBar";
import { StatusPath } from "./StatusPath";

const assignments = [
  {
    id: "assignment-active",
    title: "Family encouragement & prayer support",
    person: "Jane Doe",
    location: "Grandview Post Acute · Room 104B",
    status: "Ready for assignment",
    timing: "Facility review pending final sharing approval"
  },
  {
    id: "assignment-scheduled",
    title: "Pastoral check-in",
    person: "Robert M.",
    location: "Grandview Post Acute · Room 212A",
    status: "Scheduled",
    timing: "Tomorrow · 2:30 PM"
  }
];

function PartnerMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#cfe0d8] bg-white p-4 shadow-sm shadow-[#0d2b3b]/5">
      <p className="text-xs font-black uppercase tracking-[0.15em] text-[#506a49]">{label}</p>
      <p className="mt-2 font-serif text-3xl font-semibold tracking-[-0.04em] text-[#0d2b3b]">{value}</p>
    </div>
  );
}

function AssignmentCard({ assignment, active = false }: { assignment: (typeof assignments)[number]; active?: boolean }) {
  return (
    <article
      className={`rounded-[1.35rem] border p-5 shadow-sm shadow-[#0d2b3b]/5 ${
        active ? "border-[#d6a943] bg-[#fffaf0]" : "border-[#d9dfd7] bg-white"
      }`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#506a49]">{assignment.status}</p>
          <h3 className="mt-2 font-serif text-2xl font-semibold tracking-[-0.04em] text-[#0d2b3b]">{assignment.person}</h3>
          <p className="mt-1 text-sm font-bold text-[#4f6259]">{assignment.title}</p>
        </div>
        <span className={`w-fit rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.1em] ${active ? "bg-[#d6a943] text-[#0d2b3b]" : "bg-[#e7f1eb] text-[#0f6b54]"}`}>
          {active ? "Current" : "Assigned"}
        </span>
      </div>
      <p className="mt-4 text-sm leading-6 text-[#4f6259]">{assignment.location}</p>
      <p className="mt-2 text-sm font-semibold text-[#63736b]">{assignment.timing}</p>
    </article>
  );
}

function ReportBackAction({ title, detail }: { title: string; detail: string }) {
  return (
    <button type="button" className="rounded-2xl border border-[#cfe0d8] bg-white p-4 text-left shadow-sm shadow-[#0d2b3b]/5 transition hover:border-[#0f6b54] hover:bg-[#f8fbf8]">
      <p className="text-sm font-black text-[#0d2b3b]">{title}</p>
      <p className="mt-1 text-xs leading-5 text-[#63736b]">{detail}</p>
    </button>
  );
}

export function PartnerPortalFinal() {
  const request = pilotCareRequest;
  const latestUpdate = request.approvedUpdates[0];

  return (
    <main className="min-h-screen bg-[#edf4f0] text-[#0d2b3b]">
      <PilotTopBar role="partner" userName="Hope Church" userContext="Partner workspace" />

      <section className="mx-auto max-w-[94rem] px-6 py-8 lg:py-10">
        <div className="grid gap-6 lg:grid-cols-[20rem_1fr]">
          <aside className="space-y-5">
            <section className="overflow-hidden rounded-[2rem] bg-[#0f3f35] text-white shadow-xl shadow-[#0f3f35]/20">
              <div className="border-b border-white/10 p-6">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#c7e2d0]">Partner workspace</p>
                <h1 className="mt-3 font-serif text-3xl font-semibold tracking-[-0.05em]">Hope Church</h1>
                <p className="mt-2 text-sm leading-6 text-[#d9e7df]">Approved spiritual-care assignments and report-back actions.</p>
              </div>
              <nav className="space-y-2 p-4">
                {["Assigned", "Scheduled", "Completed", "Needs follow-up"].map((item, index) => (
                  <button
                    key={item}
                    type="button"
                    className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-black transition ${
                      index === 0 ? "bg-white text-[#0d2b3b]" : "text-[#d9e7df] hover:bg-white/10"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </nav>
            </section>

            <section className="rounded-[1.5rem] border border-[#d9dfd7] bg-white p-5 shadow-sm shadow-[#0d2b3b]/5">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#506a49]">Access boundary</p>
              <p className="mt-3 text-sm leading-6 text-[#4f6259]">
                Partner view shows only facility-approved spiritual-care context. Medical information and internal facility notes are not shown.
              </p>
            </section>
          </aside>

          <div className="space-y-6">
            <section className="overflow-hidden rounded-[2rem] border border-[#d9dfd7] bg-white shadow-xl shadow-[#0d2b3b]/8">
              <div className="relative overflow-hidden border-b border-[#d9dfd7] bg-[#f8fbf8] px-7 py-8 md:px-10">
                <div className="absolute right-8 top-6 hidden h-44 w-72 rounded-full bg-[#8dbd9e]/25 blur-3xl md:block" />
                <div className="relative grid gap-8 lg:grid-cols-[1fr_24rem] lg:items-end">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-[#0f6b54]">Partner assignment queue</p>
                    <h2 className="mt-4 max-w-3xl font-serif text-5xl font-semibold tracking-[-0.06em] text-[#0d2b3b] md:text-6xl">
                      Approved care assignments.
                    </h2>
                    <p className="mt-4 max-w-2xl text-base leading-7 text-[#4f6259]">
                      Hope Church receives only approved context, accepts assignments, and reports care activity back to the facility.
                    </p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                    <PartnerMetric label="Assigned" value="2" />
                    <PartnerMetric label="Today" value="1" />
                    <PartnerMetric label="Follow-up" value="0" />
                  </div>
                </div>
              </div>

              <div className="grid gap-6 p-5 md:p-7 xl:grid-cols-[1fr_24rem]">
                <div className="space-y-6">
                  <section className="rounded-[1.5rem] border border-[#d9dfd7] bg-white p-6 shadow-sm shadow-[#0d2b3b]/5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#506a49]">Current assignment</p>
                        <h3 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.04em] text-[#0d2b3b]">{request.personName}</h3>
                        <p className="mt-1 text-sm font-bold text-[#4f6259]">{request.requestType}</p>
                      </div>
                      <span className="w-fit rounded-full bg-[#fff4d7] px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-[#7a5b20]">Awaiting final share</span>
                    </div>

                    <div className="mt-6">
                      <StatusPath currentStatus={request.currentStatus} />
                    </div>
                  </section>

                  <section className="grid gap-4 md:grid-cols-2">
                    {assignments.map((assignment, index) => (
                      <AssignmentCard key={assignment.id} assignment={assignment} active={index === 0} />
                    ))}
                  </section>

                  <section className="rounded-[1.5rem] border border-[#d9dfd7] bg-white p-6 shadow-sm shadow-[#0d2b3b]/5">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-[#506a49]">Approved context</p>
                    <div className="mt-5 grid gap-3 md:grid-cols-2">
                      <div className="rounded-2xl border border-[#d9dfd7] bg-[#f8fbf8] p-4">
                        <p className="text-xs font-black uppercase tracking-[0.14em] text-[#506a49]">Care focus</p>
                        <p className="mt-2 text-sm font-bold text-[#0d2b3b]">{request.requestType}</p>
                      </div>
                      <div className="rounded-2xl border border-[#d9dfd7] bg-[#f8fbf8] p-4">
                        <p className="text-xs font-black uppercase tracking-[0.14em] text-[#506a49]">Location</p>
                        <p className="mt-2 text-sm font-bold text-[#0d2b3b]">{request.locationLabel} · Room {request.room}</p>
                      </div>
                      <div className="rounded-2xl border border-[#d9dfd7] bg-[#f8fbf8] p-4">
                        <p className="text-xs font-black uppercase tracking-[0.14em] text-[#506a49]">Requester relationship</p>
                        <p className="mt-2 text-sm font-bold text-[#0d2b3b]">{request.requestedBy.relationship}</p>
                      </div>
                      <div className="rounded-2xl border border-[#d9dfd7] bg-[#f8fbf8] p-4">
                        <p className="text-xs font-black uppercase tracking-[0.14em] text-[#506a49]">Latest update</p>
                        <p className="mt-2 text-sm font-bold text-[#0d2b3b]">{latestUpdate.title}</p>
                      </div>
                    </div>
                  </section>
                </div>

                <aside className="space-y-5">
                  <section className="rounded-[1.5rem] border border-[#d6a943]/40 bg-[#fffaf0] p-5 shadow-sm shadow-[#0d2b3b]/5">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-[#9a6b16]">Next partner action</p>
                    <h3 className="mt-3 font-serif text-2xl font-semibold tracking-[-0.04em] text-[#0d2b3b]">Accept assignment after facility share.</h3>
                    <p className="mt-3 text-sm leading-6 text-[#5f4b1f]">This request is visible as a preview until the facility completes final sharing approval.</p>
                    <button type="button" className="mt-5 w-full rounded-xl bg-[#0f3f35] px-4 py-3 text-sm font-black text-white shadow-lg shadow-[#0f3f35]/15 hover:bg-[#082838]">
                      Accept Assignment
                    </button>
                  </section>

                  <section className="rounded-[1.5rem] border border-[#d9dfd7] bg-white p-5 shadow-sm shadow-[#0d2b3b]/5">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-[#506a49]">Report back</p>
                    <div className="mt-4 grid gap-3">
                      <ReportBackAction title="Visit scheduled" detail="Record a planned visit or spiritual-care touchpoint." />
                      <ReportBackAction title="Care completed" detail="Submit a facility-safe care outcome update." />
                      <ReportBackAction title="Needs follow-up" detail="Flag that the facility should review next steps." />
                    </div>
                  </section>

                  <section className="rounded-[1.5rem] border border-[#d9dfd7] bg-[#f8fbf8] p-5 shadow-sm shadow-[#0d2b3b]/5">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-[#506a49]">Partner-safe rule</p>
                    <p className="mt-3 text-sm leading-6 text-[#4f6259]">Do not add medical details, symptoms, medication, clinical notes, or emergency instructions.</p>
                  </section>
                </aside>
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
