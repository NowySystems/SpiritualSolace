import type { Metadata } from "next";
import { ChurchWorkLaunchDemo } from "@/components/ChurchWorkLaunchDemo";

export const metadata: Metadata = {
  title: "ChurchWork Guided Demo",
  description: "See how a spiritual-care request moves safely from requester to facility to church and back.",
  robots: {
    index: false,
    follow: false
  }
};

export default function ChurchWorkTourPage() {
  return <ChurchWorkLaunchDemo />;
}
