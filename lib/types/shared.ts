/**
 * Cross-tree shared types. Touch with care — UI, data, and agents trees all import from here.
 *
 * Owner of breaking changes: coordinate via main.
 */

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
