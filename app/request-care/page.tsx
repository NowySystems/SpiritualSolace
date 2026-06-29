import { ChurchWorkAccessGate } from "@/components/ChurchWorkAccessGate";
import { RequestCareDemo } from "@/components/RequestCareDemo";

export default function RequestCarePage() {
  return (
    <ChurchWorkAccessGate>
      <RequestCareDemo />
    </ChurchWorkAccessGate>
  );
}
