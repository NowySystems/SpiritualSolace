-- Preserve the existing RLS rules while preventing auth helpers from being re-evaluated per row.

alter policy profiles_select_own_or_admin
on public.profiles
using (
  id = (select auth.uid())
  or public.user_has_role(array['owner', 'platform_admin'])
);

alter policy profiles_update_own
on public.profiles
using (id = (select auth.uid()))
with check (id = (select auth.uid()));

alter policy role_memberships_select_own_or_admin
on public.role_memberships
using (
  user_id = (select auth.uid())
  or public.user_has_role(array['owner', 'platform_admin'])
);

alter policy care_requests_select_by_role
on public.care_requests
using (
  requester_user_id = (select auth.uid())
  or public.user_can_access_facility(
    facility_id,
    array['owner', 'platform_admin', 'facility_admin', 'facility_staff']
  )
  or public.partner_can_access_request(id)
);

alter policy care_requests_insert_requester_or_facility
on public.care_requests
with check (
  no_medical_information_acknowledged = true
  and (
    requester_user_id = (select auth.uid())
    or public.user_can_access_facility(
      facility_id,
      array['owner', 'platform_admin', 'facility_admin', 'facility_staff']
    )
  )
);

alter policy timeline_select_by_role_and_visibility
on public.timeline_events
using (
  exists (
    select 1
    from public.care_requests cr
    where cr.id = timeline_events.care_request_id
      and (
        (
          cr.requester_user_id = (select auth.uid())
          and timeline_events.visibility = any (array['requester', 'shared'])
        )
        or public.user_can_access_facility(
          cr.facility_id,
          array['owner', 'platform_admin', 'facility_admin', 'facility_staff']
        )
        or (
          public.partner_can_access_request(cr.id)
          and timeline_events.visibility = any (array['partner', 'shared'])
          and timeline_events.sharing_level = any (array['partner_safe', 'shared_timeline'])
        )
      )
  )
);

alter policy timeline_insert_facility_partner_or_requester
on public.timeline_events
with check (
  exists (
    select 1
    from public.care_requests cr
    where cr.id = timeline_events.care_request_id
      and (
        public.user_can_access_facility(
          cr.facility_id,
          array['owner', 'platform_admin', 'facility_admin', 'facility_staff']
        )
        or (
          public.partner_can_access_request(cr.id)
          and timeline_events.visibility = any (array['partner', 'shared'])
          and timeline_events.sharing_level = any (array['partner_safe', 'shared_timeline'])
        )
        or (
          cr.requester_user_id = (select auth.uid())
          and timeline_events.event_type = 'request_submitted'
          and timeline_events.non_medical_note is null
        )
      )
  )
);

alter policy audit_logs_insert_authenticated
on public.audit_logs
with check ((select auth.uid()) is not null);

alter policy policy_acceptances_insert_own
on public.policy_acceptances
with check (user_id = (select auth.uid()));

alter policy policy_acceptances_select_own_or_admin
on public.policy_acceptances
using (
  user_id = (select auth.uid())
  or public.user_has_role(array['owner', 'platform_admin'])
);

alter policy facility_invites_admin_select
on public.facility_user_invites
using (
  public.user_has_role(array['owner', 'platform_admin'])
  or public.user_can_access_facility(facility_id, array['facility_admin'])
  or lower(email) = lower(coalesce(((select auth.jwt()) ->> 'email'), ''))
);
