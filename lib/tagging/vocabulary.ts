// Controlled tag vocabulary for Civic Signal.
// Single source of truth for both:
//   1. The LLM tagger (must emit only tags built from this file)
//   2. The profile expander (UserProfile -> Tag[])
//
// Tag format: "<namespace>.<key>:<value>"
//   - namespace + key are CLOSED. Adding one = code change here.
//   - <value> is either CLOSED (one of the *_VALUES arrays below)
//     or OPEN_SLUG (kebab-cased free string, validated by SLUG_RE).
//
// If a council item touches a concept with no matching tag, the tagger
// must drop it rather than invent a tag.

export const SLUG_RE = /^[a-z0-9](?:[a-z0-9_-]*[a-z0-9])?$/;

// ---------------------------------------------------------------------------
// geo.*
// ---------------------------------------------------------------------------

export const GEO_SCOPE_VALUES = [
  "citywide",
  "neighborhood",
  "block",
  "corridor",
  "landmark",
  "school_zone",
] as const;

// 13 Cambridge neighborhoods, exact match to UserProfile.neighborhood enum.
export const GEO_NEIGHBORHOOD_VALUES = [
  "agassiz",
  "area_2_mit",
  "cambridge_highlands",
  "cambridgeport",
  "east_cambridge",
  "mid_cambridge",
  "neighborhood_nine",
  "north_cambridge",
  "riverside",
  "strawberry_hill",
  "the_port",
  "wellington_harrington",
  "west_cambridge",
] as const;

export const GEO_ZIP_VALUES = [
  "02138",
  "02139",
  "02140",
  "02141",
  "02142",
  "02163",
] as const;

// Open slugs (validated by SLUG_RE):
//   geo.school_zone:<slug>     e.g. tobin_vassal, crls, king_open
//   geo.corridor:<slug>        e.g. brattle_st, mass_ave, jfk_st
//   geo.landmark:<slug>        e.g. science_park, city_hall, fitchburg_rail

// ---------------------------------------------------------------------------
// housing.*
// ---------------------------------------------------------------------------

export const HOUSING_TENURE_VALUES = ["rent", "own", "any"] as const;

export const HOUSING_TYPE_VALUES = [
  "single_family",
  "two_to_four_unit",
  "multi_5plus",
  "condo",
  "dorm",
  "public_housing",
] as const;

export const HOUSING_LANDLORD_SIZE_VALUES = [
  "individual",
  "small",
  "large",
  "university",
  "public",
] as const;

export const HOUSING_AFFORDABILITY_VALUES = [
  "inclusionary",
  "market",
  "public_housing",
  "ami_below_50",
  "ami_50_80",
  "ami_80_100",
  "ami_above_100",
] as const;

// ---------------------------------------------------------------------------
// transport.*
// ---------------------------------------------------------------------------

export const TRANSPORT_MODE_VALUES = [
  "drive",
  "transit",
  "bike",
  "walk",
  "accessibility",
] as const;

export const TRANSPORT_SUBJECT_VALUES = [
  "parking",
  "bike_lane",
  "bus_route",
  "rail",
  "sidewalk",
  "snow",
  "pedestrianization",
  "crosswalk",
  "traffic_calming",
  "complete_streets",
  "ev_charging",
] as const;

export const TRANSPORT_ACCESSIBILITY_VALUES = [
  "wheelchair",
  "stroller",
  "visual",
  "mobility",
] as const;

// Open slugs:
//   transport.line:<slug>      e.g. red, green_b, bus_77, ezride

// ---------------------------------------------------------------------------
// household.*
// ---------------------------------------------------------------------------

export const HOUSEHOLD_KIDS_VALUES = ["under_5", "k12", "none"] as const;

export const HOUSEHOLD_COMPOSITION_VALUES = [
  "solo",
  "couple",
  "parent",
  "multigen",
  "roommates",
] as const;

export const HOUSEHOLD_SCHOOL_VALUES = [
  "cps",
  "charter",
  "private",
  "homeschool",
] as const;

export const HOUSEHOLD_PETS_VALUES = ["dog", "cat", "other"] as const;

// ---------------------------------------------------------------------------
// topic.* (mirrors UserProfile.topics — keep in sync with lib/topics.ts)
// ---------------------------------------------------------------------------

export const TOPIC_VALUES = [
  "housing_zoning",
  "climate",
  "transit",
  "schools",
  "public_safety",
  "small_business",
  "civil_liberties",
  "parks",
  "arts",
  "public_health",
  "immigration",
  "disability",
] as const;

// ---------------------------------------------------------------------------
// demo.* — apply ONLY when an item demonstrably affects this group.
// Do not tag demo.* speculatively; treat as the most specific evidence bar.
// ---------------------------------------------------------------------------

export const DEMO_AGE_VALUES = ["youth", "family", "senior_65plus"] as const;

export const DEMO_GENDER_VALUES = ["women", "trans", "non_binary"] as const;

export const DEMO_RACE_VALUES = [
  "bipoc",
  "american_indian_alaska_native",
  "asian",
  "black",
  "hispanic_latino",
  "mena",
  "native_hawaiian_pacific_islander",
] as const;

export const DEMO_INCOME_VALUES = [
  "low",
  "means_tested",
  "high_income_impact",
] as const;

export const DEMO_TENURE_IN_CITY_VALUES = [
  "newcomer",
  "longtime",
  "lifelong",
] as const;

// Closed list mirrors UserProfile.primaryLanguage enum.
export const DEMO_LANGUAGE_VALUES = [
  "spanish",
  "portuguese",
  "haitian_creole",
  "mandarin",
  "cantonese",
  "bengali",
  "amharic",
  "other",
] as const;

// ---------------------------------------------------------------------------
// civic.*
// ---------------------------------------------------------------------------

export const CIVIC_FLAG_VALUES = [
  "voter_action_required",
  "public_comment_open",
  "first_timer_friendly",
  "ballot_question",
  "home_rule_petition",
] as const;

// Open slugs (composite values):
//   civic.councillor_vote:<councillor_slug>:<yea|nay|absent|present>

// ---------------------------------------------------------------------------
// work.*
// ---------------------------------------------------------------------------

export const WORK_AUDIENCE_VALUES = [
  "cambridge_workers",
  "small_business_owners",
] as const;

export const WORK_EMPLOYER_VALUES = [
  "university",
  "hospital",
  "tech",
  "biopharma",
  "government",
  "nonprofit",
  "small_business",
  "self_employed",
] as const;

export const WORK_STUDENT_VALUES = ["undergrad", "grad"] as const;

// ---------------------------------------------------------------------------
// fiscal.*
// ---------------------------------------------------------------------------

export const FISCAL_KIND_VALUES = [
  "water_sewer",
  "property_tax",
  "parking_fee",
  "permit_fee",
  "snow_assessment",
  "appropriation",
  "free_cash",
  "stabilization_fund",
  "federal_grant",
  "transfer_fee",
  "fine",
] as const;

export const FISCAL_AMOUNT_BUCKET_VALUES = [
  "under_100k",
  "100k_500k",
  "500k_1m",
  "1m_5m",
  "above_5m",
] as const;

// ---------------------------------------------------------------------------
// doc.*
// ---------------------------------------------------------------------------

export const DOC_KIND_VALUES = [
  "CMA",
  "POR",
  "RES",
  "ORD",
  "AR",
  "COF",
  "COM",
  "HR",
  "CC",
  "MIN",
] as const;

export const DOC_STATUS_VALUES = [
  "proposed",
  "adopted",
  "adopted_amended",
  "ordained",
  "tabled",
  "charter_right_exercised",
  "placed_on_file",
  "no_action",
  "report_accepted",
  "approved",
  "withdrawn",
  "referred",
] as const;

export const DOC_STAGE_VALUES = [
  "first_reading",
  "second_reading",
  "unfinished_business",
  "carryover",
  "tabled",
  "late_item",
] as const;

// Open slugs:
//   doc.item_id:<id>           e.g. POR-2026-32, CMA-2026-66, AR-2026-02
//   doc.meeting_date:<YYYY-MM-DD>
//   doc.sponsor:<councillor_slug>

// ---------------------------------------------------------------------------
// Councillor slugs (closed list — current 2026 Cambridge City Council)
// Used by doc.sponsor and civic.councillor_vote.
// ---------------------------------------------------------------------------

export const COUNCILLOR_SLUGS = [
  "siddiqui",
  "azeem",
  "al_zubi",
  "flaherty",
  "mcgovern",
  "nolan",
  "simmons",
  "sobrinho_wheeler",
  "zusy",
] as const;

// ---------------------------------------------------------------------------
// Tag-key registry — every legal "<namespace>.<key>" pair.
// The tagger MUST only emit keys listed here.
// "values" === null means open slug (validated by SLUG_RE).
// "values" === "composite" means a multi-segment value, validated by a
// dedicated parser; see parseTag() in ./types.ts.
// ---------------------------------------------------------------------------

export const TAG_KEYS = {
  // geo
  "geo.scope": GEO_SCOPE_VALUES,
  "geo.neighborhood": GEO_NEIGHBORHOOD_VALUES,
  "geo.zip": GEO_ZIP_VALUES,
  "geo.school_zone": null,
  "geo.corridor": null,
  "geo.landmark": null,

  // housing
  "housing.tenure": HOUSING_TENURE_VALUES,
  "housing.type": HOUSING_TYPE_VALUES,
  "housing.landlord_size": HOUSING_LANDLORD_SIZE_VALUES,
  "housing.affordability": HOUSING_AFFORDABILITY_VALUES,

  // transport
  "transport.mode": TRANSPORT_MODE_VALUES,
  "transport.subject": TRANSPORT_SUBJECT_VALUES,
  "transport.accessibility": TRANSPORT_ACCESSIBILITY_VALUES,
  "transport.line": null,

  // household
  "household.kids": HOUSEHOLD_KIDS_VALUES,
  "household.composition": HOUSEHOLD_COMPOSITION_VALUES,
  "household.school": HOUSEHOLD_SCHOOL_VALUES,
  "household.pets": HOUSEHOLD_PETS_VALUES,

  // topic
  "topic.area": TOPIC_VALUES,

  // demo
  "demo.age": DEMO_AGE_VALUES,
  "demo.gender": DEMO_GENDER_VALUES,
  "demo.race": DEMO_RACE_VALUES,
  "demo.income": DEMO_INCOME_VALUES,
  "demo.tenure_in_city": DEMO_TENURE_IN_CITY_VALUES,
  "demo.language": DEMO_LANGUAGE_VALUES,

  // civic
  "civic.flag": CIVIC_FLAG_VALUES,
  "civic.councillor_vote": "composite", // <slug>:<yea|nay|absent|present>

  // work
  "work.audience": WORK_AUDIENCE_VALUES,
  "work.employer": WORK_EMPLOYER_VALUES,
  "work.student": WORK_STUDENT_VALUES,

  // fiscal
  "fiscal.kind": FISCAL_KIND_VALUES,
  "fiscal.amount_bucket": FISCAL_AMOUNT_BUCKET_VALUES,

  // doc
  "doc.kind": DOC_KIND_VALUES,
  "doc.status": DOC_STATUS_VALUES,
  "doc.stage": DOC_STAGE_VALUES,
  "doc.item_id": null,
  "doc.meeting_date": "iso_date",
  "doc.sponsor": COUNCILLOR_SLUGS,
} as const;

export type TagKey = keyof typeof TAG_KEYS;

export const TAG_NAMESPACES = [
  "geo",
  "housing",
  "transport",
  "household",
  "topic",
  "demo",
  "civic",
  "work",
  "fiscal",
  "doc",
] as const;

// Default scoring weights per namespace, used by the relevance ranker.
// Higher = stronger "this affects you directly" signal.
export const NAMESPACE_WEIGHTS: Record<(typeof TAG_NAMESPACES)[number], number> = {
  geo: 3.0,
  fiscal: 2.5,
  housing: 2.5,
  transport: 2.0,
  household: 1.8,
  topic: 1.5,
  civic: 1.2,
  work: 1.0,
  demo: 0.8,
  doc: 0.0, // metadata, not a relevance signal on its own
};
