import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { ChurchWorkDemoBalloonAnimator } from "@/components/ChurchWorkDemoBalloonAnimator";
import { ChurchWorkDemoFlowSkipper } from "@/components/ChurchWorkDemoFlowSkipper";
import { ChurchWorkPwaRegister } from "@/components/ChurchWorkPwaRegister";
import "./globals.css";
import "./demo-polish.css";
import "./demo-focus-field.css";
import "./pwa.css";

export const metadata: Metadata = {
  title: "ChurchWork | Spiritual care operations for churches",
  description:
    "Spiritual care operations for churches, volunteers, and care teams coordinating prayer requests, visits, follow-ups, volunteer care, and church connections.",
  applicationName: "ChurchWork",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/brand/churchwork-corner-logo.png",
    shortcut: "/brand/churchwork-corner-logo.png",
    apple: "/brand/churchwork-corner-logo.png"
  },
  appleWebApp: {
    capable: true,
    title: "ChurchWork",
    statusBarStyle: "black-translucent"
  },
  formatDetection: {
    telephone: false
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#082838"
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <ChurchWorkPwaRegister />
        <ChurchWorkDemoFlowSkipper />
        <ChurchWorkDemoBalloonAnimator />
        {children}
      </body>
    </html>
  );
}
