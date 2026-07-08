import { ChurchWorkAccessGate } from "@/components/ChurchWorkAccessGate";
import { ChurchWorkAwesomeGuidedPortalDashboard } from "@/components/ChurchWorkAwesomeGuidedPortalDashboard";
import { ChurchWorkDemoAutoScroll } from "@/components/ChurchWorkDemoAutoScroll";

export default function RequesterPortalPage() {
  return (
    <ChurchWorkAccessGate>
      <ChurchWorkDemoAutoScroll>
        <ChurchWorkAwesomeGuidedPortalDashboard portal="requester" />
      </ChurchWorkDemoAutoScroll>
    </ChurchWorkAccessGate>
  );
}
