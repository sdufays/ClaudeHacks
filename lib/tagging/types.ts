import {
  COUNCILLOR_SLUGS,
  SLUG_RE,
  TAG_KEYS,
  TAG_NAMESPACES,
  type TagKey,
} from "./vocabulary";

export type Tag = `${TagKey}:${string}`;

export interface ParsedTag {
  namespace: (typeof TAG_NAMESPACES)[number];
  key: TagKey;
  value: string;
}

export function parseTag(raw: string): ParsedTag | null {
  const firstColon = raw.indexOf(":");
  if (firstColon < 0) return null;
  const keyPart = raw.slice(0, firstColon);
  const valuePart = raw.slice(firstColon + 1);
  if (!(keyPart in TAG_KEYS)) return null;
  const key = keyPart as TagKey;
  const namespace = key.split(".")[0] as ParsedTag["namespace"];
  if (!TAG_NAMESPACES.includes(namespace)) return null;
  if (!validateTagValue(key, valuePart)) return null;
  return { namespace, key, value: valuePart };
}

export function validateTagValue(key: TagKey, value: string): boolean {
  const spec = TAG_KEYS[key];
  if (spec === null) return SLUG_RE.test(value);
  if (spec === "iso_date") return /^\d{4}-\d{2}-\d{2}$/.test(value);
  if (spec === "composite") {
    if (key === "civic.councillor_vote") {
      const [slug, vote] = value.split(":");
      return (
        (COUNCILLOR_SLUGS as readonly string[]).includes(slug) &&
        ["yea", "nay", "absent", "present"].includes(vote)
      );
    }
    return false;
  }
  return (spec as readonly string[]).includes(value);
}

export function isValidTag(raw: string): raw is Tag {
  return parseTag(raw) !== null;
}

// ---------------------------------------------------------------------------
// Council item record — the unit the tagger emits one of per agenda/final-
// actions entry. Agenda + Final Actions for the same item collapse into one
// record (status/vote populated when Final Actions is available).
// ---------------------------------------------------------------------------

export interface VoteTally {
  result: string; // raw result text, e.g. "Adopted [9-0-0]"
  yeas: string[]; // councillor slugs
  nays: string[];
  absent: string[];
  present: string[];
}

export interface CouncilItem {
  itemId: string; // e.g. "POR-2026-32"
  meetingId: number; // e.g. 2121
  meetingDate: string; // YYYY-MM-DD
  docKind: (typeof TAG_KEYS)["doc.kind"][number];
  title: string;
  body: string;
  sponsors: string[]; // councillor slugs
  status: (typeof TAG_KEYS)["doc.status"][number] | null;
  vote: VoteTally | null;
  amendments: string[]; // free text descriptions of any amendments
  history: { date: string; action: string }[]; // for carryover/tabled items
  tags: Tag[];
  citation: {
    sourceFile: string; // path to original PDF
    page: number;
    anchor?: string; // section + item number
  };
}

// ---------------------------------------------------------------------------
// Tag-vector (used both for items and for expanded user profiles).
// ---------------------------------------------------------------------------

export interface TagVector {
  tags: Tag[];
  weights?: Partial<Record<Tag, number>>; // optional per-tag override
}
