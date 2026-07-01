# ChurchWork Pilot Launch Checklist

Date: 2026-07-01

## Pre-launch blockers

ChurchWork Pilot #001 should not go live until these are complete.

### Entity and operations

- [ ] ChurchWork legal entity direction confirmed.
- [ ] Grandview facility-side admin identified.
- [ ] Hope Church partner-side admin identified.
- [ ] ChurchWork owner/platform admins identified.
- [ ] Support email selected.
- [ ] Pilot pause contact selected.
- [ ] User removal/offboarding process defined.

### Insurance

- [ ] General Liability quote requested.
- [ ] Technology E&O quote requested.
- [ ] Confirm whether Tech E&O includes limited privacy/data incident coverage.
- [ ] Cyber/privacy policy deferred or quoted as upgrade path.

### Policies

- [ ] Terms of Service drafted.
- [ ] Privacy Policy drafted.
- [ ] Pilot Participation Notice drafted.
- [ ] No Medical Information Policy drafted.
- [ ] Requester Acknowledgment drafted.
- [ ] Facility User Acknowledgment drafted.
- [ ] Partner Confidentiality Acknowledgment drafted.
- [ ] Data Retention Policy drafted.
- [ ] Incident Response Policy drafted.

### Backend and security

- [ ] Supabase project created or confirmed.
- [ ] Migration reviewed locally.
- [ ] Migration applied to test Supabase project.
- [ ] RLS enabled on every live table.
- [ ] No table allows broad public reads.
- [ ] No table allows broad public writes.
- [ ] Requester cannot enter notes.
- [ ] No medical fields exist in schema.
- [ ] Request creation requires no-medical-information acknowledgment.
- [ ] Role memberships tested for owner, facility, partner, and requester roles.
- [ ] Audit log insertion tested.
- [ ] Policy acceptance insertion tested.

### User flows

- [ ] Requester signup/sign-in path works.
- [ ] Requester structured request submission works.
- [ ] Grandview facility user can see requests.
- [ ] Grandview facility user can assign or mark request partner-ready.
- [ ] Hope Church partner user can see partner-safe request context.
- [ ] Hope Church partner user can log prayer/visit/follow-up.
- [ ] Timeline visibility is correct for requester, facility, partner, and owner roles.
- [ ] Shared logins are not used.

### Pilot materials

- [ ] Grandview packet language drafted.
- [ ] Flyer language drafted.
- [ ] QR code destination selected.
- [ ] QR code tested on mobile.
- [ ] Pilot feedback form drafted.
- [ ] Internal support instructions drafted.

## Launch principle

Do not launch the QR code broadly until structured requests, named-user access, RLS, policy acceptance, and role-based timeline visibility are working end to end.
