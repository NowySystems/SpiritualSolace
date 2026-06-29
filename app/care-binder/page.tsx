import { CareBinder } from "@/components/CareBinder";
import { ChurchWorkAccessGate } from "@/components/ChurchWorkAccessGate";

type CareBinderRoutePageProps = {
  searchParams?: {
    demo?: string;
  };
};

export default function CareBinderRoutePage({ searchParams }: CareBinderRoutePageProps) {
  return (
    <ChurchWorkAccessGate>
      <CareBinder autoStartDemo={searchParams?.demo === "true"} />
    </ChurchWorkAccessGate>
  );
}
