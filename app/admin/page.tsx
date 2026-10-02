"use client";

import { AdminAuthGateV2 } from "@/components/AdminAuthGateV2";
import { AdminPortalAccessHub } from "@/components/AdminPortalAccessHub";

export default function AdminPortalPage() {
  return <AdminAuthGateV2>{(session) => <AdminPortalAccessHub session={session} />}</AdminAuthGateV2>;
}
