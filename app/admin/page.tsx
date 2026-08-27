"use client";

import { AdminPortalAccessHub } from "@/components/AdminPortalAccessHub";
import { OperatorAccessManager } from "@/components/OperatorAccessManager";
import { OperatorAuditFeed } from "@/components/OperatorAuditFeed";

export default function AdminPortalPage() {
  return (
    <>
      <AdminPortalAccessHub />
      <OperatorAccessManager />
      <OperatorAuditFeed />
    </>
  );
}
