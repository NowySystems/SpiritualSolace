import { ChurchWorkAccessGate } from "@/components/ChurchWorkAccessGate";
import { ChurchWorkAwesomeGuidedPortalDashboard } from "@/components/ChurchWorkAwesomeGuidedPortalDashboard";
import { ChurchWorkDemoAutoScroll } from "@/components/ChurchWorkDemoAutoScroll";

export default function PartnerPortalPage() {
  return (
    <ChurchWorkAccessGate>
      <ChurchWorkDemoAutoScroll>
        <ChurchWorkAwesomeGuidedPortalDashboard portal="partner" />
      </ChurchWorkDemoAutoScroll>
    </ChurchWorkAccessGate>
  );
}
