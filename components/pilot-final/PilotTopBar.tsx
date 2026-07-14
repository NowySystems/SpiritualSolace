import type { PortalRole } from "./types";

type PilotTopBarProps = {
  role: PortalRole;
  userName: string;
  userContext: string;
};

const roleLabels: Record<PortalRole, string> = {
  requester: "Requester Portal",
  facility: "Facility Workspace",
  partner: "Partner Workspace"
};

export function PilotTopBar({ role, userName, userContext }: PilotTopBarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#082838] text-white shadow-lg shadow-[#0d2b3b]/15">
      <div className="mx-auto flex max-w-[118rem] items-center justify-between gap-6 px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-16 items-center justify-center rounded-2xl bg-white text-xl font-black text-[#0d2b3b] shadow-sm">CW</div>
          <div>
            <p className="font-serif text-2xl font-semibold tracking-[-0.03em]">Church<span className="text-[#8dbd9e]">Work</span></p>
            <p className="text-xs font-semibold text-[#d9e7df]">Spiritual-care operations</p>
          </div>
        </div>

        <div className="hidden rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm font-bold text-[#d9e7df] lg:block">
          {roleLabels[role]}
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden text-right md:block">
            <p className="text-sm font-black text-white">{userName}</p>
            <p className="text-xs font-semibold text-[#b9cac2]">{userContext}</p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#d6a943] text-sm font-black text-[#0d2b3b]">
            {userName.split(" ").map((part) => part[0]).join("").slice(0, 2)}
          </div>
        </div>
      </div>
    </header>
  );
}
