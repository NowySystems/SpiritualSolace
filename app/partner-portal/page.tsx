import { ChurchWorkAccessGate } from "@/components/ChurchWorkAccessGate";
import { ChurchWorkPortalDashboard } from "@/components/ChurchWorkPortalDashboard";

export default function PartnerPortalPage() {
  return (
    <ChurchWorkAccessGate>
      <ChurchWorkPortalDashboard portal="partner" />
    </ChurchWorkAccessGate>
  );
}
