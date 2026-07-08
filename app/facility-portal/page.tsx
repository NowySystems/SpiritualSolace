import { ChurchWorkAccessGate } from "@/components/ChurchWorkAccessGate";
import { ChurchWorkPortalDashboard } from "@/components/ChurchWorkPortalDashboard";

export default function FacilityPortalPage() {
  return (
    <ChurchWorkAccessGate>
      <ChurchWorkPortalDashboard portal="facility" />
    </ChurchWorkAccessGate>
  );
}
