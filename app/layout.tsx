import type { ReactNode } from "react";
import type { Metadata } from "next";
import { AppShell } from "@/components/AppShell";
import "./globals.css";

export const metadata: Metadata = {
  title: "SpiritualSolace Demo Prototype",
  description:
    "Demo-only spiritual support request workflow shell with facility-controlled review and one-way temporary messaging."
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
