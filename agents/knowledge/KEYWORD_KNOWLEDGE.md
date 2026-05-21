# Keyword Knowledge

## Funding Signal Terms

- grant
- funding opportunity
- notice of funding opportunity
- NOFO
- request for application
- RFA
- request for grant proposal
- RFGP
- request for proposal
- RFP
- call for proposals
- call for applications
- solicitation
- competitive grant
- discretionary grant
- cooperative agreement
- award opportunity
- appropriation
- appropriations
- charitable giving
- community benefit
- sponsorship application
- foundation application
- capacity-building grant
- pilot program funding

## Geography Terms

- Tennessee
- TN
- Upper Cumberland
- rural Tennessee
- Middle Tennessee
- Putnam County
- Cookeville
- medically underserved
- rural community
- HPSA
- MUA
- MUP

## Mission Terms

- healthcare access
- patient assistance
- community health
- rural health
- prevention
- screenings
- cancer support
- pediatric health
- hospice
- home health
- mental health
- diabetes
- heart health
- CPR training
- medical equipment
- DME
- mobility aid
- aging in place
- caregiver support
- health equity
- vulnerable populations

## CRCF 0.7 Keyword & Category Registry Notes

Module D uses `lib/keyword-registry.ts` as the local/static source of truth for keyword/category groups.

Each group includes:

- group id and group name
- category type and priority
- search terms and optional exclusion/noise terms
- related current CRCF assistance areas
- related strategic growth categories
- related source categories
- recommended source types
- example Funding Radar search phrase
- example future Grants.gov search phrase
- match explanation template
- recommended staff action

Governance posture:

- Local/static intelligence only.
- No live APIs.
- No live source calls.
- No scraping or crawling.
- No external data movement.
- No patient data or private donor data.
- Human owner review required before live, persistent, public-facing, external, or system-changing use.
