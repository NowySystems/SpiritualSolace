import { ChurchWorkAccessGate } from "@/components/ChurchWorkAccessGate";
import { FacilityPortalFinal } from "@/components/pilot-final/FacilityPortalFinal";

export default function FacilityPortalPage() {
  return (
    <ChurchWorkAccessGate>
      <FacilityPortalFinal />
    </ChurchWorkAccessGate>
  );
}
