-- Retire legacy self-service privilege paths that conflict with current ChurchWork access policy.
-- Facility access is invite/admin-approved; owner/admin bootstrap is already established.

revoke execute on function public.create_facility_account(text, text, text, text, text)
  from public, anon, authenticated;

revoke execute on function public.claim_churchwork_bootstrap_admin()
  from public, anon, authenticated;
