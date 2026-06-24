import { CareBinder } from "@/components/CareBinder";

type CareBinderRoutePageProps = {
  searchParams?: {
    demo?: string;
  };
};

export default function CareBinderRoutePage({ searchParams }: CareBinderRoutePageProps) {
  return <CareBinder autoStartDemo={searchParams?.demo === "true"} />;
}
