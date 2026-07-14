import { ChurchWorkAccessGate } from "@/components/ChurchWorkAccessGate";
import { RequesterPortalFinal } from "@/components/pilot-final/RequesterPortalFinal";

export default function RequesterPortalPage() {
  return (
    <ChurchWorkAccessGate>
      <RequesterPortalFinal />
    </ChurchWorkAccessGate>
  );
}
