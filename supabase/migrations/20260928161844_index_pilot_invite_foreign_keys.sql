create index if not exists churchwork_portal_invites_org_idx
  on private.churchwork_portal_invites (organization_id);

create index if not exists churchwork_portal_invites_created_by_idx
  on private.churchwork_portal_invites (created_by);

create index if not exists churchwork_portal_invites_accepted_user_idx
  on private.churchwork_portal_invites (accepted_user_id)
  where accepted_user_id is not null;
