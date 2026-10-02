import { ChurchWorkAccessGate } from "@/components/ChurchWorkAccessGate";
import { FacilityReviewWorkspace } from "@/components/FacilityReviewWorkspace";

export default function FacilityPortalPage() {
  return (
    <ChurchWorkAccessGate>
      <FacilityReviewWorkspace />
    </ChurchWorkAccessGate>
  );
}
