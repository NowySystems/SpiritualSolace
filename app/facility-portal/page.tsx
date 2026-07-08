import { ChurchWorkAccessGate } from "@/components/ChurchWorkAccessGate";
import { ChurchWorkGuidedPortalDashboard } from "@/components/ChurchWorkGuidedPortalDashboard";

export default function FacilityPortalPage() {
  return (
    <ChurchWorkAccessGate>
      <ChurchWorkGuidedPortalDashboard portal="facility" />
    </ChurchWorkAccessGate>
  );
}
