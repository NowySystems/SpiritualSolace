import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ChurchWorkMvpPage from "../mvp/page";

const allowedRoles = new Set(["requester", "facility", "partner"]);

export default async function PilotMvpPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("churchwork_role_session")?.value;
  const role = cookieStore.get("churchwork_role")?.value;

  if (!session || !allowedRoles.has(role || "")) {
    redirect("/requester-login");
  }

  return <ChurchWorkMvpPage />;
}
