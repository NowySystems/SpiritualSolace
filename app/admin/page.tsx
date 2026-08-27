"use client";

import { AdminPortalAccessHub } from "@/components/AdminPortalAccessHub";
import { OperatorAccessManager } from "@/components/OperatorAccessManager";

export default function AdminPortalPage() {
  return (
    <>
      <AdminPortalAccessHub />
      <OperatorAccessManager />
    </>
  );
}
