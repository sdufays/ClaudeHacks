/**
 * lib/retrieval/store.ts
 * In-memory vector store for Cambridge corpus chunks.
 *
 * On first call:
 *   1. Load corpus docs from data/corpus/
 *   2. Chunk each doc
 *   3. If data/corpus/.embeddings.json exists and is current, load cached embeddings.
 *      Otherwise embed all chunks and write the cache.
 *
 * search(query, k) returns the top-k SearchResults by cosine similarity.
 */

import fs from "fs/promises";
import path from "path";
import { cosineSimilarity } from "ai";
import { loadCorpus } from "@/lib/corpus/load";
import { chunkDoc, embedChunks, embedQuery } from "@/lib/retrieval/embed";
import type { CorpusChunk, CorpusDoc, SearchResult } from "@/lib/types/shared";

const CACHE_PATH = path.join(process.cwd(), "data", "corpus", ".embeddings.json");
const DEFAULT_K = 5;

interface CacheFile {
  /** ISO timestamp of when the cache was written */
  generatedAt: string;
  /** Number of docs at generation time — used to detect stale cache */
  docCount: number;
  chunks: CorpusChunk[];
}

interface StoreState {
  chunks: CorpusChunk[];
  docMap: Map<string, CorpusDoc>;
}

// ---------- Cache helpers ----------

async function readCache(): Promise<CacheFile | null> {
  try {
    const raw = await fs.readFile(CACHE_PATH, "utf-8");
    return JSON.parse(raw) as CacheFile;
  } catch {
    return null;
  }
}

async function writeCache(state: CacheFile): Promise<void> {
  try {
    await fs.writeFile(CACHE_PATH, JSON.stringify(state, null, 2), "utf-8");
  } catch (err) {
    console.warn("[store] Failed to write embedding cache:", err instanceof Error ? err.message : err);
  }
}

// ---------- Store initialisation ----------

async function buildStore(): Promise<StoreState> {
  const docs = await loadCorpus();
  const docMap = new Map<string, CorpusDoc>(docs.map((d) => [d.id, d]));

  // Try loading from cache first
  const cached = await readCache();
  if (cached && cached.docCount === docs.length && cached.chunks.length > 0) {
    console.log(
      `[store] Loaded ${cached.chunks.length} embedded chunks from cache (${cached.generatedAt})`
    );
    return { chunks: cached.chunks, docMap };
  }

  // Chunk all docs
  const rawChunks = docs.flatMap((doc) => chunkDoc(doc));
  console.log(`[store] Embedding ${rawChunks.length} chunks for ${docs.length} docs...`);

  // Embed (may fall back to mock)
  const embeddedChunks = await embedChunks(rawChunks);

  // Persist cache
  await writeCache({
    generatedAt: new Date().toISOString(),
    docCount: docs.length,
    chunks: embeddedChunks,
  });

  console.log(`[store] Embedded and cached ${embeddedChunks.length} chunks.`);
  return { chunks: embeddedChunks, docMap };
}

// Module-level singleton: resolves once per process lifetime.
let _storePromise: Promise<StoreState> | null = null;

function getStore(): Promise<StoreState> {
  if (!_storePromise) {
    _storePromise = buildStore();
  }
  return _storePromise;
}

// ---------- Public API ----------

/**
 * Search the corpus for chunks most similar to query.
 * Returns up to k results sorted by descending cosine similarity.
 */
export async function search(query: string, k: number = DEFAULT_K): Promise<SearchResult[]> {
  const [store, queryEmbedding] = await Promise.all([getStore(), embedQuery(query)]);

  const { chunks, docMap } = store;

  // Score all chunks
  const scored = chunks
    .filter((c) => c.embedding && c.embedding.length > 0)
    .map((chunk) => {
      const score = cosineSimilarity(queryEmbedding, chunk.embedding!);
      return { chunk, score };
    });

  // Sort descending
  scored.sort((a, b) => b.score - a.score);

  // Take top-k, deduplicate by doc (max 2 chunks per doc to improve coverage)
  const docChunkCount = new Map<string, number>();
  const results: SearchResult[] = [];

  for (const { chunk, score } of scored) {
    if (results.length >= k) break;
    const count = docChunkCount.get(chunk.docId) ?? 0;
    if (count >= 2) continue;
    const doc = docMap.get(chunk.docId);
    if (!doc) continue;
    results.push({ chunk, doc, score });
    docChunkCount.set(chunk.docId, count + 1);
  }

  return results;
}

/** Preload the store in the background (call from startup if desired). */
export function preloadStore(): void {
  getStore().catch((err) =>
    console.error("[store] Preload failed:", err instanceof Error ? err.message : err)
  );
}
