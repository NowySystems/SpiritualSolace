import { ChurchWorkAccessGate } from "@/components/ChurchWorkAccessGate";
import { PartnerPortalFinal } from "@/components/pilot-final/PartnerPortalFinal";

export default function PartnerPortalPage() {
  return (
    <ChurchWorkAccessGate>
      <PartnerPortalFinal />
    </ChurchWorkAccessGate>
  );
}
