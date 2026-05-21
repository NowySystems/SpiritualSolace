import type { ReactNode } from "react";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SpiritualSolace Demo Prototype",
  description:
    "Demo-only spiritual support request workflow shell with facility-controlled review and one-way temporary messaging."
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
