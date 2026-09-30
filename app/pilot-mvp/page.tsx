import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PilotWorkspace } from "@/components/PilotWorkspace";

export default async function PilotMvpPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("churchwork_role_session")?.value;
  const role = cookieStore.get("churchwork_role")?.value;

  if (!session || role !== "requester") {
    redirect(role === "facility" ? "/facility" : role === "partner" ? "/partner-portal" : "/requester-login");
  }

  return <PilotWorkspace />;
}
