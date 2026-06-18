const stages = ["Intake", "Match", "Review", "Fulfillment", "Record"];

type WorkflowRailProps = {
  current: string;
};

export function WorkflowRail({ current }: WorkflowRailProps) {
  const currentIndex = stages.findIndex((stage) => stage === current);

  return (
    <section className="rounded-[1.5rem] border border-white/10 bg-white/7 p-5 text-white">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-[#9fb36b]">Workflow position</p>
      <ol className="mt-5 space-y-0 border-l border-white/15">
        {stages.map((stage, index) => {
          const isDone = index < currentIndex;
          const isCurrent = index === currentIndex;
          const marker = isDone ? "✓" : isCurrent ? "●" : "○";

          return (
            <li key={stage} className="relative pb-5 pl-5 last:pb-0">
              <span className={`absolute -left-[8px] top-0 grid h-4 w-4 place-items-center rounded-full text-[9px] font-black ring-4 ring-[#0d2b3b] ${isCurrent ? "bg-[#9fb36b] text-[#0d2b3b]" : isDone ? "bg-white text-[#0d2b3b]" : "bg-white/20 text-white"}`}>{marker}</span>
              <p className="text-sm font-bold text-white">{stage}</p>
              <p className="mt-1 text-xs font-black uppercase tracking-[0.1em] text-[#d7e7b7]">{isCurrent ? "Current" : isDone ? "Done" : "Waiting"}</p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
