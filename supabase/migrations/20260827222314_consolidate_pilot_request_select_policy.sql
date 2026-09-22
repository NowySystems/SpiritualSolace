-- Consolidate requester, facility, and partner SELECT visibility into one equivalent policy.
-- This preserves role visibility while avoiding three permissive policy evaluations per row.

drop policy if exists "Facility can read pilot review queue"
on public.churchwork_pilot_requests;

drop policy if exists "Partner can read approved pilot requests"
on public.churchwork_pilot_requests;

drop policy if exists "Requester can read own pilot requests"
on public.churchwork_pilot_requests;

create policy "Pilot requests visible to authorized role"
on public.churchwork_pilot_requests
for select
to authenticated
using (
  requester_user_id = (select auth.uid())
  or public.user_can_access_facility(
    facility_id,
    array['facility_admin', 'facility_staff']
  )
  or (
    status = any (
      array['approved_for_partner', 'partner_outcome_logged', 'requester_updated', 'closed']
    )
    and public.user_can_access_partner(
      partner_id,
      array['partner_admin', 'partner_user']
    )
  )
);
