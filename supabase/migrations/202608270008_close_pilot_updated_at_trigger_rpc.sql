-- Trigger-only function: keep the trigger attached, but remove Data API execution.
revoke execute on function public.set_churchwork_pilot_requests_updated_at()
from public, anon, authenticated, service_role;
