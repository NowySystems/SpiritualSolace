import { ChurchWorkAccessGate } from "@/components/ChurchWorkAccessGate";
import { RequestCareDemo } from "@/components/RequestCareDemo";

type RequestCarePageProps = {
  searchParams?: Promise<{
    demo?: string;
  }>;
};

export default async function RequestCarePage({ searchParams }: RequestCarePageProps) {
  const resolvedSearchParams = await searchParams;

  return (
    <ChurchWorkAccessGate>
      <RequestCareDemo autoStartDemo={resolvedSearchParams?.demo === "true"} />
    </ChurchWorkAccessGate>
  );
}
