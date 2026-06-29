# ChurchWork Product Direction

ChurchWork should not split into separate facility portal and church/partner portal applications yet.

Build ChurchWork as one controlled **Care Team Workspace** with role-based views on top of the same Supabase backend and the same Care Binder foundation.

## Core model

- Same app.
- Same Supabase backend.
- Same Care Binder foundation.
- Different visible actions and details based on user role.

## Primary views

### Owner View

For Cole and Sam.

Owner View can:

- Approve beta users.
- Revoke beta access.
- Assign users to organizations.
- See demo and pilot organizations.
- Verify who can access the beta.
- Manage facility/church pairings later.

### Facility View

For hospital, facility, and hospice staff.

Facility View can:

- Create care recipients.
- Create care requests.
- Verify consent.
- Set sharing level.
- Approve what can be shared externally.
- See the full internal timeline.
- Hand off approved requests to a church or partner care team.

### Partner View

For pastors, clergy, volunteers, and church admins.

Partner View can:

- See approved requests only.
- See only details allowed by consent and sharing level.
- Accept or assign care actions.
- Use approved message templates.
- View visit windows.
- Mark visits, messages, and follow-ups completed.
- Add care notes to the timeline.

## Product language

Do not call these separate portals in the UI yet.

Use language like:

- Care Team Workspace.
- Facility View.
- Partner View.
- Owner View.

## Access rule

Beta approval gets a user into ChurchWork.

Organization membership decides what they can see.

Role decides what actions they can take.

## Supabase direction

Keep the current demo safe. Do not remove or overwrite the working hardcoded demo.

Do not seed demo care recipients yet unless explicitly requested.

The current Supabase setup is foundation only:

- Auth user.
- Demo organization.
- Owner membership.
- Starter templates.
- Visit windows.

The next future backend addition should support:

- `platform_admins`.
- `beta_access`.

## Product feel

ChurchWork should feel like infrastructure for compassion: secure, calm, human-reviewed, consent-aware, and built to route care to real people without replacing compassion.
