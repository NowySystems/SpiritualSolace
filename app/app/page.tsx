import { CareBinder } from "@/components/CareBinder";
import { ChurchWorkAccessGate } from "@/components/ChurchWorkAccessGate";

export default function CareBinderAppPage() {
  return (
    <ChurchWorkAccessGate>
      <CareBinder />
    </ChurchWorkAccessGate>
  );
}
