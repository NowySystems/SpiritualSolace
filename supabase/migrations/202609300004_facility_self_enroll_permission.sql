-- Permit confirmed signed-in users to create their own facility workspace.
revoke all on function public.create_facility_account(text,text,text,text,text) from public, anon;
grant execute on function public.create_facility_account(text,text,text,text,text) to authenticated;
