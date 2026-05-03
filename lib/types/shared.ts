/**
 * Cross-tree shared types. Touch with care — UI, data, and agents trees all import from here.
 *
 * Owner of breaking changes: coordinate via main.
 */

import type {
  DEMO_GENDER_VALUES,
  DEMO_LANGUAGE_VALUES,
  DEMO_RACE_VALUES,
  DEMO_TENURE_IN_CITY_VALUES,
  GEO_NEIGHBORHOOD_VALUES,
  GEO_ZIP_VALUES,
  HOUSEHOLD_COMPOSITION_VALUES,
  HOUSEHOLD_PETS_VALUES,
  HOUSEHOLD_SCHOOL_VALUES,
  HOUSING_LANDLORD_SIZE_VALUES,
  HOUSING_TYPE_VALUES,
  TOPIC_VALUES,
  TRANSPORT_ACCESSIBILITY_VALUES,
  TRANSPORT_MODE_VALUES,
  WORK_EMPLOYER_VALUES,
  WORK_STUDENT_VALUES,
} from "../tagging/vocabulary";

// ---------- Profile ----------

export type HousingStatus = "rent" | "own" | "other";
export type CommuteMode = "drive" | "transit" | "bike" | "walk" | "wfh";
export type Household =
  | "solo"
  | "couple"
  | "parent_k12"
  | "parent_under5"
  | "multigen";

export type IssueTag =
  | "housing"
  | "transit"
  | "climate"
  | "schools"
  | "public_safety"
  | "small_business"
  | "civil_liberties"
  | "zoning";

export interface Profile {
  id: string;
  name: string;
  address: string;
  neighborhood?: string;
  housing: HousingStatus;
  commute: CommuteMode;
  household?: Household;
  issueTags?: IssueTag[];
}

// ---------- Items (council activity) ----------

export type ItemKind =
  | "policy_order"
  | "city_manager_item"
  | "resolution"
  | "ordinance"
  | "committee_report"
  | "ballot_question"
  | "communication";

export interface Item {
  id: string;
  kind: ItemKind;
  title: string;
  /** ISO date string */
  date: string;
  /** Plain-English summary, populated by the summarizer sub-agent */
  summary?: string;
  /** Original source URL (PrimeGov / IQM2) */
  sourceUrl?: string;
  /** Raw text excerpt — used both for retrieval and for citation */
  sourceText?: string;
  meeting?: string;
  topics?: IssueTag[];
}

// ---------- Personal relevance ----------

export interface RelevanceLine {
  itemId: string;
  /** 0 = irrelevant, 1 = directly affects you */
  score: number;
  /** "This affects you because..." — one short sentence */
  oneLiner: string;
}

// ---------- Concrete civic actions ----------

export type ActionType = "vote" | "attend" | "comment" | "contact";

export interface Action {
  type: ActionType;
  label: string;
  /** ISO date or human-readable */
  date?: string;
  location?: string;
  url?: string;
}

// ---------- Citations (cite-or-shut-up) ----------

export interface Citation {
  itemId: string;
  itemTitle: string;
  excerpt?: string;
  sourceUrl?: string;
}

// ---------- Reactions (the feedback-to-gov loop) ----------

export type ReactionKind = "support" | "oppose" | "unsure" | "want_more_info";

export interface Reaction {
  itemId: string;
  kind: ReactionKind;
  comment?: string;
  /** ISO timestamp */
  timestamp: string;
}

export interface AggregateReactions {
  itemId: string;
  support: number;
  oppose: number;
  unsure: number;
  wantMoreInfo: number;
}

// ---------- Corpus + retrieval ----------

export interface CorpusDoc {
  id: string;
  title: string;
  kind: ItemKind;
  /** ISO date string */
  date: string;
  text: string;
  sourceUrl?: string;
  meeting?: string;
}

export interface CorpusChunk {
  id: string;
  docId: string;
  text: string;
  /** Hosted embedding (openai/text-embedding-3-small) */
  embedding?: number[];
}

export interface SearchResult {
  chunk: CorpusChunk;
  doc: CorpusDoc;
  score: number;
}

// ---------- Agent responses ----------

export interface AgentResponse {
  text: string;
  citations: Citation[];
  actions?: Action[];
  /** Set when the balance-checker rewrote the draft */
  balanced?: boolean;
}

// ---------- User profile schema ----------

// Full schema — see user-profile.md for prose justification of each field.
export interface UserProfile {
  // 1. Auth & identity
  email: string;
  displayName: string;

  // 2. Address & location
  streetAddress: string;
  unit?: string;
  zip: (typeof GEO_ZIP_VALUES)[number];
  neighborhood: (typeof GEO_NEIGHBORHOOD_VALUES)[number];
  yearsAtAddress?: "<1" | "1-5" | "5-15" | "15+";

  // 3. Housing
  housingStatus: "rent" | "own" | "other";
  housingType?: (typeof HOUSING_TYPE_VALUES)[number];
  landlordType?: (typeof HOUSING_LANDLORD_SIZE_VALUES)[number] | "prefer_not_to_say";

  // 4. Commute & transportation
  primaryCommute: (typeof TRANSPORT_MODE_VALUES)[number] | "mixed" | "wfh" | "n/a";
  secondaryCommute?: (typeof TRANSPORT_MODE_VALUES)[number] | "mixed" | "wfh" | "n/a";
  transitLines?: string[]; // free strings normalized to slugs (e.g. "red", "bus_77")
  accessibilityNeeds?: (typeof TRANSPORT_ACCESSIBILITY_VALUES)[number][];

  // 5. Household
  composition?: (typeof HOUSEHOLD_COMPOSITION_VALUES)[number];
  householdSize?: number;
  childrenAgeBuckets?: ("0-4" | "5-10" | "11-13" | "14-18")[];
  schoolEnrollment?: (typeof HOUSEHOLD_SCHOOL_VALUES)[number][];
  pets?: (typeof HOUSEHOLD_PETS_VALUES)[number][];

  // 6. Issue interests (max 5)
  topics?: (typeof TOPIC_VALUES)[number][];

  // 7. Demographics — all optional, all "prefer not to say" allowed
  ageBracket?: "18-24" | "25-34" | "35-44" | "45-54" | "55-64" | "65-74" | "75+";
  gender?: (typeof DEMO_GENDER_VALUES)[number] | "self_describe" | "prefer_not_to_say";
  raceEthnicity?: ((typeof DEMO_RACE_VALUES)[number] | "self_describe")[];
  incomeBracket?:
    | "<25k"
    | "25-50k"
    | "50-75k"
    | "75-100k"
    | "100-150k"
    | "150-250k"
    | "250k+";
  yearsInCambridge?: (typeof DEMO_TENURE_IN_CITY_VALUES)[number] | "<1" | "1-5" | "5-15" | "15+";
  primaryLanguage?: "english" | (typeof DEMO_LANGUAGE_VALUES)[number];
  educationLevel?:
    | "high_school_or_less"
    | "some_college"
    | "associates"
    | "bachelors"
    | "graduate";

  // 8. Civic engagement
  voterRegistered?: "yes" | "no" | "not_eligible" | "prefer_not_to_say";
  priorEngagement?: (
    | "attended_meeting"
    | "submitted_comment"
    | "contacted_councillor"
    | "volunteered_campaign"
    | "voted_municipal"
    | "none"
  )[];

  // 9. Workplace
  worksInCambridge?: "yes" | "no" | "hybrid" | "not_employed";
  workplaceZip?: string;
  employerType?: (typeof WORK_EMPLOYER_VALUES)[number];
  studentStatus?: (typeof WORK_STUDENT_VALUES)[number] | "not_a_student";

  // 10. Consent
  consentSentimentSharing: boolean;
  consentNeighborhoodAggregation: boolean;
  consentDataRetention: boolean;
  consentEmailDigest?: boolean;
}

// Lean tier — what we actually need for the demo persona.
export type UserProfileLean = Pick<
  UserProfile,
  | "email"
  | "displayName"
  | "streetAddress"
  | "zip"
  | "neighborhood"
  | "housingStatus"
  | "primaryCommute"
  | "topics"
  | "consentSentimentSharing"
  | "consentNeighborhoodAggregation"
  | "consentDataRetention"
>;
