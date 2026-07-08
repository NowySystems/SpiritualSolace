import { ChurchWorkAccessGate } from "@/components/ChurchWorkAccessGate";
import { ChurchWorkPortalDashboard } from "@/components/ChurchWorkPortalDashboard";

export default function RequesterPortalPage() {
  return (
    <ChurchWorkAccessGate>
      <ChurchWorkPortalDashboard portal="requester" />
    </ChurchWorkAccessGate>
  );
}
