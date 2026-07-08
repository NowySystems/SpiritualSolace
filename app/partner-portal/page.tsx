import { ChurchWorkAccessGate } from "@/components/ChurchWorkAccessGate";
import { ChurchWorkDemoAutoScroll } from "@/components/ChurchWorkDemoAutoScroll";
import { ChurchWorkGuidedPortalDashboard } from "@/components/ChurchWorkGuidedPortalDashboard";

export default function PartnerPortalPage() {
  return (
    <ChurchWorkAccessGate>
      <ChurchWorkDemoAutoScroll>
        <ChurchWorkGuidedPortalDashboard portal="partner" />
      </ChurchWorkDemoAutoScroll>
    </ChurchWorkAccessGate>
  );
}
