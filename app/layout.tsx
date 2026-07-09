import type { ReactNode } from "react";
import type { Metadata } from "next";
import "./globals.css";
import "./demo-polish.css";

export const metadata: Metadata = {
  title: "ChurchWork | Spiritual care operations for churches",
  description:
    "Spiritual care operations for churches, volunteers, and care teams coordinating prayer requests, visits, follow-ups, volunteer care, and church connections."
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
