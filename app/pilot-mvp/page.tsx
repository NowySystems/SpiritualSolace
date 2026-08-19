import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PilotWorkspace } from "@/components/PilotWorkspace";

const allowedRoles = new Set(["requester", "facility", "partner"]);
type RoleKey = "requester" | "facility" | "partner";

export default async function PilotMvpPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("churchwork_role_session")?.value;
  const role = cookieStore.get("churchwork_role")?.value;

  if (!session || !allowedRoles.has(role || "")) {
    redirect("/requester-login");
  }

  return <PilotWorkspace role={role as RoleKey} />;
}
