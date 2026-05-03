# User Profile Schema — Civic Signal

> Companion to `idea.md`. Defines every field we collect on a user, why we collect it, and how it's used by the relevance / digest agents. Fields here are a superset of the Lean (3) tier locked in `idea.md:65-71`. Surface them in the UI in the staged order below — **do not** dump all of these on a single signup screen.

## Design principles

- **Justify every field.** If we can't point to a specific relevance signal or product feature it powers, we don't ask.
- **Always optional unless flagged required.** Required fields: email, address, housing status, commute mode, consent. Everything else can be skipped, and the relevance agent must degrade gracefully when fields are missing.
- **Demographic fields are last and clearly optional.** Race, ethnicity, gender, income — collected, never required, always with a "Prefer not to say" option. Used to surface relevance for items that affect specific demographics (senior services, language access, family programs), not to editorialize.
- **Non-partisan spine holds.** We never ask party affiliation, ideology, or how the user would vote. See `AGENTS.md` hard rules.
- **Stored once, never displayed back as a label.** The user is not "a 45-year-old Black female renter." Profile fields feed the relevance agent and disappear from the UI.

---

## 1. Auth & Identity (required)

| Field | Type | Options / Format | Required | Why |
|---|---|---|---|---|
| `email` | string | RFC 5322 | ✅ | Auth (magic link), future digest delivery, account recovery. |
| `displayName` | string | 1–40 chars, first-name-only encouraged | ✅ | UI greeting ("Good morning, Emily"). Never exposed to other users or to council in feedback aggregates. |
| `passwordless` | bool | magic link by default | ✅ | No passwords for v1. |

## 2. Address & Location (required)

| Field | Type | Options / Format | Required | Why |
|---|---|---|---|---|
| `streetAddress` | string | free text, validated against Cambridge geocoder | ✅ | Block-level relevance ("your street is on the bike-lane proposal"). |
| `unit` | string | optional (apt #, unit) | ❌ | Multi-family housing items. |
| `zip` | string | 5-digit, validated as Cambridge ZIP (02138, 02139, 02140, 02141, 02142, 02163) | ✅ (derived from address) | Polling place, ZIP-level aggregates. |
| `neighborhood` | enum (derived) | Agassiz, Area 2/MIT, Cambridge Highlands, Cambridgeport, East Cambridge, Mid-Cambridge, Neighborhood Nine, North Cambridge, Riverside, Strawberry Hill, The Port, Wellington-Harrington, West Cambridge | ✅ (derived) | Neighborhood-grouped sentiment dashboard; school-zone items. |
| `yearsAtAddress` | enum | <1, 1–5, 5–15, 15+ | ❌ | Displacement / rent-control relevance signal. |

**Note on Cambridge structure:** no city council districts — all 9 councilors are at-large (PR-STV since 1941). Address never picks "your representative." It picks your block, school zone, and polling place. (See `idea.md:71`.)

## 3. Housing (required: status only)

| Field | Type | Options | Required | Why |
|---|---|---|---|---|
| `housingStatus` | enum | Rent / Own / Other (subletting, with family, student housing, unhoused, prefer not to say) | ✅ | Single biggest signal for housing, zoning, rent-control, eviction-protection items. |
| `housingType` | enum | Single-family / 2–4 unit / Multi-family (5+) / Condo / Dorm / Other | ❌ | Differentiates owner-occupied multi-family items, condo conversions, dorm-related zoning. |
| `landlordType` | enum (renters only) | Individual / Small landlord (<10 units) / Large property mgmt / University / Public housing / Prefer not to say | ❌ | Tenant-protection ordinances often scope by landlord size. |

## 4. Commute & Transportation (required: primary mode)

| Field | Type | Options | Required | Why |
|---|---|---|---|---|
| `primaryCommute` | enum | Drive / Transit / Bike / Walk / Mixed / Work from home / Not applicable | ✅ | Transit, bike-lane, parking, road-safety, complete-streets relevance. |
| `secondaryCommute` | enum | same options | ❌ | "Drive primarily, but bike on weekends" — captures bike-infra interest for a driver. |
| `transitLines` | multi-select | Red, Green-B, Green-C, Green-D, Green-E, 1, 47, 64, 66, 68, 69, 70, 71, 72, 73, 74, 75, 77, 78, 80, 83, 85, 86, 88, 91, 96, EZRide, other | ❌ | Service-change items; bus-route redesigns. |
| `accessibilityNeeds` | multi-select | Wheelchair / Stroller / Visual / Mobility / None / Prefer not to say | ❌ | Curb cuts, sidewalk repair, accessibility ordinances. |

## 5. Household

| Field | Type | Options | Required | Why |
|---|---|---|---|---|
| `composition` | enum | Solo / Couple / Parent (kids K-12) / Parent (under-5) / Multi-generational / Roommates / Other | ❌ | Schools, childcare, family-services, eldercare relevance. |
| `householdSize` | int | 1–10+ | ❌ | Affordable-housing size requirements. |
| `childrenAgeBuckets` | multi-select | 0–4, 5–10, 11–13, 14–18 | ❌ | School-committee items, daycare, after-school programs. |
| `schoolEnrollment` | multi-select | CPS (Cambridge Public Schools) / Charter / Private / Homeschool / N/A | ❌ | School-budget and CPS-specific items. |
| `pets` | multi-select | Dog / Cat / Other / None | ❌ | Dog parks, leash ordinances, off-leash hours. (Low-priority but cheap.) |

## 6. Issue interests

| Field | Type | Options (multi-select, max 5) | Required | Why |
|---|---|---|---|---|
| `topics` | multi-select | Housing & zoning / Climate & environment / Transit & transportation / Schools & education / Public safety / Small business & economy / Civil liberties / Parks & open space / Arts & culture / Public health / Immigration & sanctuary / Disability & accessibility | ❌ | Direct boost for the relevance ranker. Doubles as a soft topic filter on the digest. |

Topic taxonomy must match `lib/topics.ts` (used by `<TopicPill>` and `<AccentStripe>`).

## 7. Demographics (all optional, all "prefer not to say" available)

> **Why we collect these despite the friction:** specific items affect specific demographics — senior tax exemptions, language-access ordinances, BIPOC-targeted programs, family-leave for low-income workers. Collecting demographic fields lets the relevance agent surface these items to the people they'd actually affect. We never display these back as a label, never share them with council in any form that could de-anonymize, and never use them to editorialize.

| Field | Type | Options | Required | Why |
|---|---|---|---|---|
| `ageBracket` | enum | 18–24 / 25–34 / 35–44 / 45–54 / 55–64 / 65–74 / 75+ / Prefer not to say | ❌ | Senior services, youth programs, school-age items. |
| `gender` | enum | Woman / Man / Non-binary / Self-describe (free text) / Prefer not to say | ❌ | Items affecting specific gender programs (women's health, trans rights ordinances). |
| `raceEthnicity` | multi-select | American Indian or Alaska Native / Asian / Black or African American / Hispanic or Latino/a/e / Middle Eastern or North African / Native Hawaiian or Pacific Islander / White / Self-describe / Prefer not to say | ❌ | Programs targeting specific communities (e.g., MWBE certification, language access for specific languages, civil-rights ordinances). |
| `incomeBracket` | enum | <$25k / $25k–50k / $50k–75k / $75k–100k / $100k–150k / $150k–250k / $250k+ / Prefer not to say | ❌ | Means-tested programs, affordable-housing AMI thresholds, property-tax relief. |
| `yearsInCambridge` | enum | <1 / 1–5 / 5–15 / 15+ / Lifelong / Prefer not to say | ❌ | Historical context framing ("first revision since 2008…"). |
| `primaryLanguage` | enum | English / Spanish / Portuguese / Haitian Creole / Mandarin / Cantonese / Bengali / Amharic / Other / Prefer not to say | ❌ | Language-access ordinances; surface translated source material when available. Cambridge's top non-English languages per the city's language-access plan. |
| `educationLevel` | enum | High school or less / Some college / Associate's / Bachelor's / Graduate / Prefer not to say | ❌ | Adult-ed and workforce items. **Lower priority — consider cutting if the form feels too long.** |

## 8. Civic engagement context

| Field | Type | Options | Required | Why |
|---|---|---|---|---|
| `voterRegistered` | bool / "not eligible" | Yes / No / Not eligible (non-citizen) / Prefer not to say | ❌ | "What you can vote on" framing. Non-citizens still get full app value (attend, comment, contact) — just no ballot CTAs. |
| `priorEngagement` | multi-select | Attended a council meeting / Submitted public comment / Contacted a councilor / Volunteered for a campaign / Voted in last municipal election / None of the above | ❌ | Calibrates onboarding tone — first-timer gets "here's how public comment works"; veteran skips the explainer. |
| `citizenship` | enum | US citizen / Permanent resident / Other / Prefer not to say | ❌ | **Sensitive — collect only if we ship voter-eligibility CTAs.** Cambridge is a sanctuary city; this field carries real privacy weight. Consider deriving from `voterRegistered` instead. |

## 9. Workplace

| Field | Type | Options | Required | Why |
|---|---|---|---|---|
| `worksInCambridge` | bool | Yes / No / Mixed (hybrid) / Not employed | ❌ | Cambridge worker (vs. resident-only) is relevant for commercial zoning, business-improvement districts, parking-permit zones. |
| `workplaceZip` | string | 5-digit | ❌ | Workplace neighborhood for commute-route items. |
| `employerType` | enum | University (Harvard / MIT / Lesley / other) / Hospital / Tech / Bio/pharma / Government / Nonprofit / Small business / Self-employed / Other / Prefer not to say | ❌ | University-related items (PILOT payments, town-gown), hospital-zone items. |
| `studentStatus` | enum | Undergrad / Grad / Not a student | ❌ | Student-housing items, university-neighborhood ordinances. |

## 10. Consent (required)

| Field | Type | Required | Why |
|---|---|---|---|
| `consentSentimentSharing` | bool | ✅ | "I understand reactions I submit are aggregated anonymously and shared with city council." Backs the feedback-loop principle (`idea.md:48-62`). |
| `consentNeighborhoodAggregation` | bool | ✅ | "Aggregated reactions may be grouped by neighborhood (never by individual identity)." |
| `consentDataRetention` | bool | ✅ | Privacy policy + retention window acknowledgment. |
| `consentEmailDigest` | bool | ❌ | Optional weekly digest opt-in. |

---

## Signup flow staging (recommended)

Don't show this whole schema at once. Three steps, with a clear escape hatch after step 1:

**Step 1 — Required (30 seconds).** Email + display name → address → housing status → primary commute mode → consent checkboxes. User can stop here and get the Lean experience.

**Step 2 — Helpful (60 seconds, skippable).** Household composition + issue interests (1–5) + years in Cambridge.

**Step 3 — Optional demographics (skippable, prominently labeled).** Age, gender, race/ethnicity, income, language, voter registration. Each field is individually skippable. Header copy: *"These are optional. We use them only to surface items that specifically affect your community — never to label you, and never shared with council in any form that identifies you."*

Settings page exposes all fields for later editing — users who skip step 3 should see a gentle nudge in their first week ("Add your demographics to surface items affecting your community").

## Schema location

Add to `lib/types/shared.ts` as `UserProfile` (and `UserProfileLean` for the demo persona). Coordinate any change here with the agents tree (relevance sub-agent reads this directly) and the data tree (corpus tagging may key off topic taxonomy).

## What we explicitly do not collect

- Party affiliation, political ideology, voting history, candidate preferences.
- Religion.
- Sexual orientation (no current product feature justifies it).
- Health conditions (beyond accessibility-needs above).
- Phone number (email-only for v1).
- Social media handles.
- Biometric data.
