import { statusSteps } from "./data";
import type { CareRequestStatus } from "./types";

const statusOrder: CareRequestStatus[] = [
  "request_submitted",
  "facility_review",
  "consent_needed",
  "ready_for_partner",
  "outcome_recorded"
];

type StatusPathProps = {
  currentStatus: CareRequestStatus;
};

export function StatusPath({ currentStatus }: StatusPathProps) {
  const currentIndex = Math.max(0, statusOrder.indexOf(currentStatus));

  return (
    <div className="cw-status-path rounded-[1.4rem] border border-[#d9dfd7] bg-white p-5 shadow-sm shadow-[#0d2b3b]/5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[0.7rem] font-black uppercase tracking-[0.18em] text-[#7a5b20]">Current status</p>
          <h3 className="mt-2 font-serif text-2xl font-semibold tracking-[-0.03em] text-[#0d2b3b]">
            {statusSteps[currentIndex]?.label ?? "Request submitted"}
          </h3>
        </div>
        <span className="rounded-full bg-[#fff1c4] px-3 py-1 text-[0.68rem] font-black uppercase tracking-[0.12em] text-[#7a5b20]">
          In progress
        </span>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-5">
        {statusSteps.map((step, index) => {
          const isComplete = index < currentIndex;
          const isCurrent = index === currentIndex;
          return (
            <div key={step.key} className="relative">
              <div className="flex items-center gap-2">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-black ${
                    isComplete
                      ? "border-[#0f6b54] bg-[#0f6b54] text-white"
                      : isCurrent
                        ? "border-[#d6a943] bg-[#fff4d7] text-[#7a5b20] shadow-[0_0_0_0.35rem_rgba(214,169,67,0.18)]"
                        : "border-[#cfd8d2] bg-white text-[#8a978f]"
                  }`}
                >
                  {isComplete ? "✓" : index + 1}
                </span>
                {index < statusSteps.length - 1 ? <span className="hidden h-px flex-1 bg-[#d9dfd7] md:block" /> : null}
              </div>
              <p className={`mt-2 text-xs font-bold ${isCurrent ? "text-[#0d2b3b]" : "text-[#63736b]"}`}>{step.shortLabel}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
