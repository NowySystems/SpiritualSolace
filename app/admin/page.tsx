"use client";

import { AdminPortalAccessHub } from "@/components/AdminPortalAccessHub";
import { PilotAuthGate } from "@/components/PilotAuthGate";
import { PolicyAcceptanceGate } from "@/components/PolicyAcceptanceGate";

export default function AdminPortalPage() {
  return (
    <PilotAuthGate>
      {(session) => (
        <PolicyAcceptanceGate session={session}>
          <AdminPortalAccessHub session={session} />
        </PolicyAcceptanceGate>
      )}
    </PilotAuthGate>
  );
}
