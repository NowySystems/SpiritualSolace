import { approvedResponders, facilityRules, solaceMessages, solaceRequests } from "@/lib/spiritual-solace-data";

const ruleCategories = [
  {
    title: "Intake control",
    body: "Requests must include consent confirmation, message preference, and enough context for respectful routing without collecting unnecessary details."
  },
  {
    title: "Responder control",
    body: "Only approved responder groups may submit one-way comfort messages through the demo workflow."
  },
  {
    title: "Review control",
    body: "Staff review remains the default gate before a message can appear in the recipient-facing view."
  },
  {
    title: "Delivery control",
    body: "Messages are one-way, temporary, and do not create open conversation threads."
  }
];

const blockedPatterns = [
  "Care instructions or advice",
  "Promises about outcomes",
  "Pressure to convert or engage",
  "Public browsing of recipient requests",
  "Open-ended direct messaging",
  "Solicitation, fundraising, or promotion"
];

const enabledRules = facilityRules.filter((rule) => rule.status === "Enabled").length;
const reviewRequiredResponders = approvedResponders.filter((responder) => responder.reviewRequired).length;
const heldMessages = solaceMessages.filter((message) => message.status === "Needs Review").length;
const activeRequests = solaceRequests.filter((request) => request.status !== "Expired").length;

export default function FacilityRulesPage() {
  return (
    <div className="space-y-6 lg:space-y-7">
      <section className="rounded-[2rem] border border-[#dfd8cb] bg-gradient-to-br from-[#fffdf9] via-[#f8f3e9] to-[#eef4f0] p-7 shadow-[0_12px_32px_rgba(77,94,86,0.08)] lg:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#5f746d]">Module 6 · Facility Rules</p>
        <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#1f3442]">Facility-controlled policy and routing safeguards</h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#4f6058]">
          Facility rules define what the demo allows, what it blocks, which items require review, and how the one-way support
          workflow stays calm, accountable, and bounded.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-2xl border border-[#dfd8cb] bg-white/85 p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#6a7b74]">Enabled rules</p>
            <p className="mt-2 text-2xl font-semibold text-[#223746]">{enabledRules}</p>
            <p className="mt-1 text-xs text-[#5f7069]">Active demo controls</p>
          </article>
          <article className="rounded-2xl border border-[#dfd8cb] bg-white/85 p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#6a7b74]">Review responders</p>
            <p className="mt-2 text-2xl font-semibold text-[#223746]">{reviewRequiredResponders}</p>
            <p className="mt-1 text-xs text-[#5f7069]">Require staff gate</p>
          </article>
          <article className="rounded-2xl border border-[#dfd8cb] bg-white/85 p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#6a7b74]">Held messages</p>
            <p className="mt-2 text-2xl font-semibold text-[#223746]">{heldMessages}</p>
            <p className="mt-1 text-xs text-[#5f7069]">Awaiting decision</p>
          </article>
          <article className="rounded-2xl border border-[#dfd8cb] bg-white/85 p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#6a7b74]">Active requests</p>
            <p className="mt-2 text-2xl font-semibold text-[#223746]">{activeRequests}</p>
            <p className="mt-1 text-xs text-[#5f7069]">Within workflow</p>
          </article>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-3xl border border-[#dfd8cb] bg-white/85 p-6 shadow-[0_8px_24px_rgba(77,94,86,0.06)]">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#5f746d]">Rules registry</p>
              <h3 className="mt-1 text-xl font-semibold text-[#223746]">Active facility controls</h3>
            </div>
            <span className="rounded-full border border-[#d7d9cf] bg-[#f3f6f0] px-3 py-1.5 text-xs font-semibold text-[#556a62]">
              Demo policy layer
            </span>
          </div>

          <div className="mt-5 space-y-4">
            {facilityRules.map((rule) => (
              <article key={rule.id} className="rounded-2xl border border-[#e4ddd1] bg-[#faf7f0] p-4 shadow-sm">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-semibold text-[#223746]">{rule.name}</h4>
                      <span className="rounded-full border border-[#cfe2d0] bg-[#eef8ee] px-2.5 py-1 text-[11px] font-semibold text-[#4f7457]">
                        {rule.status}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-[#4f6058]">{rule.rule}</p>
                  </div>
                  <p className="shrink-0 rounded-xl border border-[#dfd8cb] bg-white/80 px-3 py-2 text-xs font-medium text-[#60716a]">
                    {rule.id}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </article>

        <aside className="space-y-5">
          <article className="rounded-3xl border border-[#dfd8cb] bg-white/85 p-6 shadow-[0_8px_24px_rgba(77,94,86,0.06)]">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#5f746d]">Control categories</p>
            <h3 className="mt-1 text-lg font-semibold text-[#223746]">How the rules apply</h3>
            <div className="mt-4 space-y-3">
              {ruleCategories.map((category) => (
                <article key={category.title} className="rounded-xl border border-[#e4ddd1] bg-[#faf6ee] p-3">
                  <p className="text-sm font-semibold text-[#314550]">{category.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-[#5f7069]">{category.body}</p>
                </article>
              ))}
            </div>
          </article>

          <article className="rounded-3xl border border-[#dfd8cb] bg-white/85 p-6 shadow-[0_8px_24px_rgba(77,94,86,0.06)]">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#5f746d]">Blocked patterns</p>
            <h3 className="mt-1 text-lg font-semibold text-[#223746]">Not allowed in MVP demo</h3>
            <ul className="mt-4 space-y-2 text-sm text-[#4f6058]">
              {blockedPatterns.map((pattern) => (
                <li key={pattern} className="rounded-xl border border-[#e4ddd1] bg-[#faf6ee] px-3 py-2 font-medium">
                  {pattern}
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-3xl border border-[#d8d3c7] bg-[#f6f1e7] p-6 shadow-[0_8px_20px_rgba(77,94,86,0.05)]">
            <h3 className="text-lg font-semibold text-[#223746]">Pass 1 status</h3>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-[#4f6058]">
              <li>• Old governance route replaced.</li>
              <li>• Canonical facility rules connected.</li>
              <li>• Allow/block model visible.</li>
              <li>• Review and routing rules tied to workflow data.</li>
            </ul>
          </article>
        </aside>
      </section>
    </div>
  );
}
