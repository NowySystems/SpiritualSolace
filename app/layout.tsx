import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { ChurchWorkDemoBalloonAnimator } from "@/components/ChurchWorkDemoBalloonAnimator";
import { ChurchWorkDemoFlowSkipper } from "@/components/ChurchWorkDemoFlowSkipper";
import { ChurchWorkInstallPrompt } from "@/components/ChurchWorkInstallPrompt";
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
    icon: "/brand/churchwork-install-icon-v2-192.png",
    shortcut: "/brand/churchwork-install-icon-v2-192.png",
    apple: "/brand/churchwork-install-icon-v2-apple.png"
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
  viewportFit: "cover",
  themeColor: "#082838"
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <ChurchWorkPwaRegister />
        <ChurchWorkInstallPrompt />
        <ChurchWorkDemoFlowSkipper />
        <ChurchWorkDemoBalloonAnimator />
        {children}
      </body>
    </html>
  );
}
