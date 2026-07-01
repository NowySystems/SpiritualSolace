# ChurchWork Pilot Safe v1

Date: 2026-07-01

## Pilot #001

- Facility: Grandview Post Acute, 444 One Eleven Pl, Cookeville, TN
- Facility contact: Uriah / assigned Grandview facility-side user
- Partner organization: Hope Church
- Connector: Sam
- Status: facility side and partner church side are both interested

## Product posture

ChurchWork is moving from demo validation into a controlled pilot.

The demo is frozen. Pilot Safe v1 is about making the first live workflow secure, structured, and operational.

## Core model

ChurchWork has three paths and one shared timeline.

1. User / requester path
   - Creates a structured spiritual-care request.
   - No free-text notes.
   - No medical information.

2. Facility path
   - Grandview assigns facility-side users.
   - Facility users review, prioritize, coordinate, and manage requests.
   - Facility users may add non-medical coordination notes.

3. Partner path
   - Hope Church users receive partner-safe request context.
   - Partner users may log non-medical prayer, pastoral visit, and follow-up actions.

Shared object:

- Canonical care timeline.
- Filtered by role, visibility, and sharing level.

## Pilot workflow

1. Resident, family, facility staff, or church/community member scans QR code or visits the request link.
2. Requester identifies themselves through structured fields.
3. Requester selects spiritual-care need from approved options.
4. Requester confirms that no medical information is being submitted.
5. Request enters Grandview facility review queue.
6. Facility user reviews and marks the request ready for partner view when appropriate.
7. Hope Church sees partner-safe request context.
8. Hope Church logs prayer, planned visit, completed visit, or follow-up.
9. Timeline records the care story with role-based visibility.

## Requester intake rules

Requester intake must be structured.

Allowed requester fields:

- Requester role.
- Requester name.
- Relationship to resident/person needing care.
- Contact preference, if enabled.
- Resident/person name.
- Room or unit, optional.
- Spiritual-care request type.
- Priority.
- Acknowledgment that ChurchWork is not for medical information.

Requester intake must not include:

- Free-text notes.
- Diagnosis.
- Symptoms.
- Medication.
- Treatment details.
- Medical history.
- Chart notes.
- Insurance information.
- Clinical instructions.
- Emergency requests.

## Facility and partner note rules

Facility and partner users may enter non-medical coordination notes only.

Allowed note examples:

- Resident requested a pastoral visit this week.
- Prefers afternoon visit window.
- Hope Church visit planned.
- Prayer request logged.
- Follow-up requested next week.
- Visit completed.

Forbidden note examples:

- Diagnosis.
- Symptoms.
- Medication.
- Treatment details.
- Medical history.
- Chart notes.
- Clinical instructions.
- Insurance information.
- Hospitalization details.

## Security requirements before live QR distribution

Pilot Safe v1 is not live until these are true:

- Supabase Auth is active.
- No shared logins.
- Every facility and partner user has a named account.
- Row Level Security is enabled on every live table.
- Requesters can only access their own request confirmation or request state.
- Grandview users can only access Grandview facility data.
- Hope Church users can only access assigned partner-safe request context.
- No public resident directory exists.
- No medical fields exist in schema.
- Requester has no free-text note field.
- Policy acceptance is required before live use.
- Audit logs exist for important state changes.

## Initial roles

Platform / owner roles:

- owner
- platform_admin

Facility roles:

- facility_admin
- facility_staff

Partner roles:

- partner_admin
- partner_user

Requester role:

- requester

## First live scope

Included:

- One facility: Grandview Post Acute.
- One partner: Hope Church.
- Structured spiritual-care requests.
- Facility review queue.
- Partner-safe request view.
- Timeline events.
- Non-medical coordination notes for facility/partner users.
- Terms, privacy, no-medical-info policy, pilot acknowledgment, and confidentiality acknowledgment.

Excluded:

- Medical information collection.
- Free-text requester notes.
- Two-way messaging.
- Emergency handling.
- Open resident directory.
- Live nearby-church lookup.
- Auto-routing to churches.
- Multi-facility marketplace behavior.
- Donations inside the care flow.

## Success after 30 days

The first 30-day pilot succeeds if:

- Grandview can route spiritual-care requests without confusion.
- Hope Church can see and act on approved partner-safe requests.
- Facility and partner users understand their roles.
- No medical information is intentionally collected.
- Timeline entries reflect actual care actions.
- Feedback produces a clear next build list.
- Optional support payments, if enabled, stay separate from care access and care workflow.
