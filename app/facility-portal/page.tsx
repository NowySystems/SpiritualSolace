import { ChurchWorkAccessGate } from "@/components/ChurchWorkAccessGate";
import { ChurchWorkDemoAutoScroll } from "@/components/ChurchWorkDemoAutoScroll";
import { ChurchWorkGuidedPortalDashboard } from "@/components/ChurchWorkGuidedPortalDashboard";

export default function FacilityPortalPage() {
  return (
    <ChurchWorkAccessGate>
      <ChurchWorkDemoAutoScroll>
        <ChurchWorkGuidedPortalDashboard portal="facility" />
      </ChurchWorkDemoAutoScroll>
    </ChurchWorkAccessGate>
  );
}
