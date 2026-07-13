import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { ChurchWorkDemoBalloonAnimator } from "@/components/ChurchWorkDemoBalloonAnimator";
import { ChurchWorkDemoFlowSkipper } from "@/components/ChurchWorkDemoFlowSkipper";
import { ChurchWorkServiceWorkerRegistrar } from "@/components/ChurchWorkServiceWorkerRegistrar";
import "./globals.css";
import "./demo-polish.css";
import "./demo-focus-field.css";

export const metadata: Metadata = {
  title: "ChurchWork | Spiritual care operations for churches",
  description:
    "Spiritual care operations for churches, volunteers, and care teams coordinating prayer requests, visits, follow-ups, volunteer care, and church connections.",
  applicationName: "ChurchWork",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "ChurchWork",
    statusBarStyle: "black-translucent"
  },
  formatDetection: {
    telephone: false
  },
  icons: {
    icon: "/pwa/icon.svg",
    apple: "/pwa/icon.svg"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0d2b3b"
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <ChurchWorkServiceWorkerRegistrar />
        <ChurchWorkDemoFlowSkipper />
        <ChurchWorkDemoBalloonAnimator />
        {children}
      </body>
    </html>
  );
}
