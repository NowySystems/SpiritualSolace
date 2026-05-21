import { PageHeader } from "@/components/PageHeader";

const futureLearningInputs = [
  "useful / not useful",
  "high priority",
  "bad fit",
  "partner needed",
  "pursued / not pursued",
  "won / lost / pending",
  "source returned junk",
  "source returned strong lead",
  "reapplication window found",
  "eligibility changed",
  "deadline missed",
  "staff notes",
];

const futureMemoryRequirements = [
  "persistent storage",
  "review history",
  "source-check history",
  "staff feedback",
  "outcome tracking",
  "scheduled jobs for daily checks",
];

const governanceRequirements = [
  "Learning must be explainable.",
  "Learning must be auditable.",
  "Human review required.",
  "No uncontrolled external actions.",
  "No sensitive data exposure.",
  "No automatic applications/outreach.",
];

export default function LearningLoopPage() {
  return (
    <>
      <PageHeader
        eyebrow="Advisor Intelligence"
        title="Advisor Learning Loop"
        description="Future feedback memory shell for structured staff review decisions, grant outcomes, source quality patterns, daily updates, and reapplication history. This page does not store data or perform external actions."
      />

      <section className="mb-6 rounded-3xl border border-crcf-gold/40 bg-crcf-gold/15 p-6 text-crcf-navy">
        <p className="text-sm font-bold uppercase tracking-[0.18em]">
          Advisor Learning Loop
        </p>
        <h2 className="mt-2 text-2xl font-bold">
          Structured feedback, not guessing
        </h2>
        <p className="mt-3 text-sm font-semibold leading-6">
          The system should get smarter through structured staff feedback and
          real outcomes, not guessing.
        </p>
        <p className="mt-3 text-sm leading-6 text-slate-700">
          CRCF 2.2 adds only the architecture shell for future learning. It does
          not create persistent memory, write to a database, connect Firebase or
          Firestore, update source systems, send outreach, submit applications,
          generate fake opportunities, or invent learned insights.
        </p>
      </section>

      <section className="mb-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-crcf-blue">
          Future Learning Inputs
        </p>
        <h2 className="mt-2 text-xl font-bold text-crcf-navy">
          Staff-review signals to model later
        </h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {futureLearningInputs.map((input) => (
            <div
              key={input}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700"
            >
              {input}
            </div>
          ))}
        </div>
      </section>

      <section className="mb-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-crcf-blue">
          Future Memory Requirements
        </p>
        <h2 className="mt-2 text-xl font-bold text-crcf-navy">
          True learning needs approved infrastructure
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          True learning will require controlled infrastructure that is not part
          of this phase:
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {futureMemoryRequirements.map((requirement) => (
            <div
              key={requirement}
              className="rounded-2xl bg-crcf-sky/70 px-4 py-3 text-sm font-bold text-crcf-navy"
            >
              {requirement}
            </div>
          ))}
        </div>
      </section>

      <section className="mb-6 rounded-3xl border border-crcf-blue/20 bg-crcf-sky/60 p-6 text-crcf-navy">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-crcf-blue">
          Cross-Platform Pattern
        </p>
        <p className="mt-3 text-sm font-semibold leading-6">
          This learning-loop pattern should eventually apply to CRCF/GrantView,
          Bastion, Avora, and future platforms. Advisors should become smarter
          through structured, auditable feedback and outcomes.
        </p>
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-crcf-blue">
          Governance
        </p>
        <h2 className="mt-2 text-xl font-bold text-crcf-navy">
          Human-reviewed learning boundaries
        </h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {governanceRequirements.map((requirement) => (
            <div
              key={requirement}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700"
            >
              {requirement}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
