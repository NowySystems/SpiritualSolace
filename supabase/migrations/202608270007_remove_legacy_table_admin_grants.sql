-- Remove non-application table privileges from public app roles.
-- RLS does not protect TRUNCATE, and client roles do not need TRIGGER or REFERENCES privileges.

revoke truncate, references, trigger on table
  public.audit_logs,
  public.care_actions,
  public.care_recipients,
  public.care_requests,
  public.facilities,
  public.facility_user_invites,
  public.message_templates,
  public.organization_members,
  public.organizations,
  public.partner_organizations,
  public.policy_acceptances,
  public.policy_documents,
  public.profiles,
  public.request_partner_assignments,
  public.template_actions,
  public.timeline_events,
  public.visit_windows
from anon, authenticated;
