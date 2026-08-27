-- Pin mutable search paths on legacy helper functions and reduce unnecessary RPC exposure.

alter function public.current_user_id() set search_path = '';
alter function public.set_updated_at() set search_path = '';
alter function public.slugify_facility_name(text) set search_path = '';

-- Trigger-only function: not a Data API RPC.
revoke execute on function public.set_updated_at() from public, anon, authenticated;

-- Utility functions remain available to signed-in/server code, but not anonymous callers.
revoke execute on function public.current_user_id() from public, anon;
revoke execute on function public.slugify_facility_name(text) from public, anon;

grant execute on function public.current_user_id() to authenticated, service_role;
grant execute on function public.slugify_facility_name(text) to authenticated, service_role;
