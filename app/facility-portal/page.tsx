import { ChurchWorkAccessGate } from "@/components/ChurchWorkAccessGate";
import { ChurchWorkAwesomeGuidedPortalDashboard } from "@/components/ChurchWorkAwesomeGuidedPortalDashboard";
import { ChurchWorkDemoAutoScroll } from "@/components/ChurchWorkDemoAutoScroll";

export default function FacilityPortalPage() {
  return (
    <ChurchWorkAccessGate>
      <ChurchWorkDemoAutoScroll>
        <ChurchWorkAwesomeGuidedPortalDashboard portal="facility" />
      </ChurchWorkDemoAutoScroll>
    </ChurchWorkAccessGate>
  );
}
