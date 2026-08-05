import { ChurchWorkAccessGate } from "@/components/ChurchWorkAccessGate";
import { FacilityPortalFinal } from "@/components/pilot-final/FacilityPortalFinal";

export default function FacilityLoginPage() {
  return (
    <ChurchWorkAccessGate>
      <FacilityPortalFinal />
    </ChurchWorkAccessGate>
  );
}
