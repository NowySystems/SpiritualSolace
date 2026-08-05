import { ChurchWorkAccessGate } from "@/components/ChurchWorkAccessGate";
import { RequesterPortalFinal } from "@/components/pilot-final/RequesterPortalFinal";

export default function RequesterLoginPage() {
  return (
    <ChurchWorkAccessGate>
      <RequesterPortalFinal />
    </ChurchWorkAccessGate>
  );
}
