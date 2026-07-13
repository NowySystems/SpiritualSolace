import type { ReactNode } from "react";
import type { Metadata } from "next";
import { ChurchWorkDemoBalloonAnimator } from "@/components/ChurchWorkDemoBalloonAnimator";
import { ChurchWorkDemoControlsDock } from "@/components/ChurchWorkDemoControlsDock";
import { ChurchWorkDemoFlowSkipper } from "@/components/ChurchWorkDemoFlowSkipper";
import { ChurchWorkDemoRoleCue } from "@/components/ChurchWorkDemoRoleCue";
import "./globals.css";
import "./demo-polish.css";
import "./demo-focus-field.css";

export const metadata: Metadata = {
  title: "ChurchWork | Spiritual care operations for churches",
  description:
    "Spiritual care operations for churches, volunteers, and care teams coordinating prayer requests, visits, follow-ups, volunteer care, and church connections."
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <ChurchWorkDemoFlowSkipper />
        <ChurchWorkDemoBalloonAnimator />
        <ChurchWorkDemoRoleCue />
        <ChurchWorkDemoControlsDock />
        {children}
      </body>
    </html>
  );
}
