"use client";

import { PilotAuthGate } from "@/components/PilotAuthGate";
import { PilotWorkspaceShell } from "@/components/PilotWorkspaceShell";
import { PolicyAcceptanceGate } from "@/components/PolicyAcceptanceGate";

export default function PilotPage() {
  return (
    <PilotAuthGate>
      {(session) => (
        <PolicyAcceptanceGate session={session}>
          <PilotWorkspaceShell session={session} />
        </PolicyAcceptanceGate>
      )}
    </PilotAuthGate>
  );
}
