revoke all on function public.user_has_org_role(uuid, text[]) from public;
revoke all on function public.user_has_org_role(uuid, text[]) from anon;
grant execute on function public.user_has_org_role(uuid, text[]) to authenticated;

revoke all on function public.user_can_access_facility(uuid, text[]) from public;
revoke all on function public.user_can_access_facility(uuid, text[]) from anon;
grant execute on function public.user_can_access_facility(uuid, text[]) to authenticated;

revoke all on function public.user_can_access_partner(uuid, text[]) from public;
revoke all on function public.user_can_access_partner(uuid, text[]) from anon;
grant execute on function public.user_can_access_partner(uuid, text[]) to authenticated;
