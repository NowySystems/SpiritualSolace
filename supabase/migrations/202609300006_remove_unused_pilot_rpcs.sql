drop function if exists public.get_my_requester_facilities();
drop function if exists public.list_churchwork_pilot_organizations();
drop function if exists public.list_churchwork_route_partners();
drop function if exists public.list_churchwork_signup_organizations(text);
drop function if exists public.set_pilot_user_role(text,text,text,text);

-- Staff invitation/team-management support remains in the database for the planned
-- facility-admin and partner-admin team workflow. These obsolete platform-level
-- invitation entry points are not called by the current application.
drop function if exists public.create_churchwork_portal_invite(text,text,text,boolean);
drop function if exists public.list_churchwork_portal_invites();
drop function if exists public.revoke_churchwork_portal_invite(uuid);
