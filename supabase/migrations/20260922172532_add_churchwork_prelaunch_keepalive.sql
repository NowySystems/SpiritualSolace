create or replace function public.churchwork_keepalive()
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select true;
$$;

revoke all on function public.churchwork_keepalive() from public;
revoke all on function public.churchwork_keepalive() from authenticated;
grant execute on function public.churchwork_keepalive() to anon;
