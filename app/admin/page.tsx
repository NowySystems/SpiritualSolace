"use client";

import { AdminAuthGate } from "@/components/AdminAuthGate";
import { AdminPortalAccessHub } from "@/components/AdminPortalAccessHub";

export default function AdminPortalPage() {
  return <AdminAuthGate>{(session) => <AdminPortalAccessHub session={session} />}</AdminAuthGate>;
}
