import { ChurchWorkAccessGate } from "@/components/ChurchWorkAccessGate";
import { ChurchWorkDemoAutoScroll } from "@/components/ChurchWorkDemoAutoScroll";
import { ChurchWorkGuidedPortalDashboard } from "@/components/ChurchWorkGuidedPortalDashboard";

export default function RequesterPortalPage() {
  return (
    <ChurchWorkAccessGate>
      <ChurchWorkDemoAutoScroll>
        <ChurchWorkGuidedPortalDashboard portal="requester" />
      </ChurchWorkDemoAutoScroll>
    </ChurchWorkAccessGate>
  );
}
