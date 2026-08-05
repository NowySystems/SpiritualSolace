import { ChurchWorkAccessGate } from "@/components/ChurchWorkAccessGate";
import { PartnerPortalFinal } from "@/components/pilot-final/PartnerPortalFinal";

export default function PartnerLoginPage() {
  return (
    <ChurchWorkAccessGate>
      <PartnerPortalFinal />
    </ChurchWorkAccessGate>
  );
}
