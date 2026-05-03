/**
 * lib/corpus/load.ts
 * Reads all markdown documents from data/corpus/, parses frontmatter,
 * and returns a CorpusDoc[]. Cached after first load.
 */

import fs from "fs/promises";
import path from "path";
import type { CorpusDoc, ItemKind, IssueTag } from "@/lib/types/shared";

const CORPUS_DIR = path.join(process.cwd(), "data", "corpus");

/** Parse a simple YAML-like frontmatter block delimited by --- lines. */
function parseFrontmatter(raw: string): {
  meta: Record<string, string>;
  body: string;
} {
  const lines = raw.split("\n");
  if (lines[0].trim() !== "---") {
    return { meta: {}, body: raw };
  }

  const closeIdx = lines.findIndex((l, i) => i > 0 && l.trim() === "---");
  if (closeIdx === -1) {
    return { meta: {}, body: raw };
  }

  const metaLines = lines.slice(1, closeIdx);
  const body = lines.slice(closeIdx + 1).join("\n").trim();

  const meta: Record<string, string> = {};
  for (const line of metaLines) {
    const colon = line.indexOf(":");
    if (colon === -1) continue;
    const key = line.slice(0, colon).trim();
    const value = line.slice(colon + 1).trim();
    meta[key] = value;
  }

  return { meta, body };
}

function parseTopics(raw: string | undefined): IssueTag[] {
  if (!raw) return [];
  const valid: IssueTag[] = [
    "housing",
    "transit",
    "climate",
    "schools",
    "public_safety",
    "small_business",
    "civil_liberties",
    "zoning",
  ];
  return raw
    .split(",")
    .map((t) => t.trim() as IssueTag)
    .filter((t) => valid.includes(t));
}

async function readCorpus(): Promise<CorpusDoc[]> {
  let files: string[];
  try {
    files = await fs.readdir(CORPUS_DIR);
  } catch {
    console.warn("[corpus] data/corpus/ directory not found — returning empty corpus");
    return [];
  }

  const mdFiles = files.filter((f) => f.endsWith(".md") && f !== "README.md");
  const docs: CorpusDoc[] = [];

  for (const file of mdFiles) {
    const fullPath = path.join(CORPUS_DIR, file);
    try {
      const raw = await fs.readFile(fullPath, "utf-8");
      const { meta, body } = parseFrontmatter(raw);

      if (!meta.id || !meta.title || !meta.kind || !meta.date) {
        console.warn(`[corpus] Skipping ${file}: missing required frontmatter fields`);
        continue;
      }

      const doc: CorpusDoc = {
        id: meta.id,
        title: meta.title,
        kind: meta.kind as ItemKind,
        date: meta.date,
        text: body,
        sourceUrl: meta.sourceUrl,
        meeting: meta.meeting,
      };

      docs.push(doc);
    } catch (err) {
      console.warn(`[corpus] Failed to parse ${file}:`, err);
    }
  }

  // Sort by date descending (most recent first)
  docs.sort((a, b) => b.date.localeCompare(a.date));
  return docs;
}

// Module-level cache: resolves once and reuses across requests in the same process.
let _cache: Promise<CorpusDoc[]> | null = null;

export function loadCorpus(): Promise<CorpusDoc[]> {
  if (!_cache) {
    _cache = readCorpus();
  }
  return _cache;
}
