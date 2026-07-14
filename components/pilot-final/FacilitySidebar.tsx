const queueItems = [
  { label: "My Queue", count: "12", active: true },
  { label: "Under Review", count: "4", active: false },
  { label: "Consent Needed", count: "3", active: false },
  { label: "Ready for Partner", count: "5", active: false },
  { label: "Assigned", count: "8", active: false }
];

const supportItems = ["Partner Sharing", "Consent Center", "Activity Record", "Facility Users"];

export function FacilitySidebar() {
  return (
    <aside className="hidden w-72 shrink-0 border-r border-white/10 bg-[#0f3f35] text-white lg:block">
      <div className="sticky top-[5rem] flex h-[calc(100vh-5rem)] flex-col p-5">
        <div className="rounded-[1.35rem] border border-white/12 bg-white/10 p-5">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#c7e2d0]">Facility</p>
          <h2 className="mt-3 font-serif text-2xl font-semibold tracking-[-0.04em]">Grandview Post Acute</h2>
          <p className="mt-2 text-sm leading-6 text-[#d9e7df]">Review requests, confirm consent, and approve what can be shared.</p>
        </div>

        <nav className="mt-6 space-y-2" aria-label="Facility queue navigation">
          {queueItems.map((item) => (
            <button
              key={item.label}
              type="button"
              className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-black transition ${
                item.active
                  ? "bg-white text-[#0f3f35] shadow-lg shadow-black/10"
                  : "text-[#d9e7df] hover:bg-white/10"
              }`}
            >
              <span>{item.label}</span>
              <span className={`rounded-full px-2 py-1 text-xs ${item.active ? "bg-[#e7f1eb] text-[#0f6b54]" : "bg-white/10 text-[#d9e7df]"}`}>
                {item.count}
              </span>
            </button>
          ))}
        </nav>

        <div className="mt-8 border-t border-white/10 pt-5">
          <p className="px-4 text-xs font-black uppercase tracking-[0.18em] text-[#8dbd9e]">Tools</p>
          <div className="mt-3 space-y-1">
            {supportItems.map((item) => (
              <button key={item} type="button" className="w-full rounded-xl px-4 py-2.5 text-left text-sm font-bold text-[#d9e7df] hover:bg-white/10">
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto rounded-[1.25rem] border border-[#d6a943]/25 bg-[#082838]/55 p-4">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#d6a943]">Pilot guardrail</p>
          <p className="mt-2 text-sm leading-6 text-[#d9e7df]">No medical details. Share only approved spiritual-care context.</p>
        </div>
      </div>
    </aside>
  );
}
