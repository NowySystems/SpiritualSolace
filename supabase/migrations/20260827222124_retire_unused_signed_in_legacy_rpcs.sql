-- Retire signed-in access to legacy RPCs that are not part of the current ChurchWork pilot path.
-- The functions remain available for deliberate future migration/rollout work, but are not Data API endpoints.

revoke execute on function public.claim_facility_invites()
from public, anon, authenticated, service_role;

revoke execute on function public.set_facility_user_role(uuid, text, text, text)
from public, anon, authenticated, service_role;

revoke execute on function public.get_facility_admin_snapshot()
from public, anon, authenticated, service_role;

revoke execute on function public.get_owner_admin_snapshot()
from public, anon, authenticated, service_role;

revoke execute on function public.sync_current_pilot_profile()
from public, anon, authenticated, service_role;
