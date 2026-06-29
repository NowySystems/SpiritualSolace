import { CareBinder } from "@/components/CareBinder";
import { ChurchWorkAccessGate } from "@/components/ChurchWorkAccessGate";

type CareBinderRoutePageProps = {
  searchParams?: Promise<{
    demo?: string;
  }>;
};

export default async function CareBinderRoutePage({ searchParams }: CareBinderRoutePageProps) {
  const resolvedSearchParams = await searchParams;

  return (
    <ChurchWorkAccessGate>
      <CareBinder autoStartDemo={resolvedSearchParams?.demo === "true"} />
    </ChurchWorkAccessGate>
  );
}
