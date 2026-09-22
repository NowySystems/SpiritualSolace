-- Keep pilot role membership writes behind the existing SECURITY DEFINER RPCs.
-- Signed-in users only need SELECT to resolve their own active portal roles through RLS.
revoke all privileges on table public.role_memberships from anon, authenticated;
grant select on table public.role_memberships to authenticated;
