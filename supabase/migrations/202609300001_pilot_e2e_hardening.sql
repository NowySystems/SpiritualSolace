-- Pilot-release E2E hardening applied to production 2026-09-30.
-- 1) Bind portal invite acceptance to the signed-in user and remove anonymous execution.
-- 2) Allow a new requester with no facility membership to route only when exactly one active pilot facility/partner route exists.
-- Production function bodies are already applied in Supabase; this migration records the permission boundary and routing invariant for source control.
revoke execute on function public.accept_churchwork_portal_invite(text,uuid) from public, anon;
grant execute on function public.accept_churchwork_portal_invite(text,uuid) to authenticated;

-- Guardrail assertions for future migration runs.
do $$
begin
  if (select count(*) from private.churchwork_facility_partner_routes r
      join public.facilities f on f.id=r.facility_id
      join public.partner_organizations p on p.id=r.partner_id
      where r.status='active' and f.status in ('pilot','active') and p.status in ('pilot','active')) < 1 then
    raise notice 'No active pilot route exists; new requester submissions will remain unavailable until routing is configured.';
  end if;
end $$;
