-- Remove the original pre-pilot organization/care model. The current application
-- uses organizations + role_memberships, churchwork_pilot_requests, facilities,
-- care_partners, and facility_partner_routes instead.
drop table if exists public.care_actions;
drop table if exists public.care_recipients;
drop table if exists public.message_templates;
drop table if exists public.visit_windows;
drop table if exists public.organization_members;
drop function if exists public.user_has_org(uuid);
