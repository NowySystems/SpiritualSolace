import { createSupabaseServerClient } from "./server";

export async function checkSupabasePilotHealth() {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from("organizations")
    .select("id, name, slug, organization_type, status")
    .in("slug", ["churchwork", "grandview-post-acute", "hope-church"])
    .order("slug");

  return {
    ok: !error,
    organizations: data ?? [],
    error: error ? error.message : null
  };
}
