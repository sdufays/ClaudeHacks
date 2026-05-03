/**
 * lib/retrieval/embed.ts
 * Chunks CorpusDocs and embeds them using AI Gateway openai/text-embedding-3-small.
 * Falls back to a deterministic mock embedding when AI_GATEWAY_API_KEY is absent
 * or when the embedding call fails, so the rest of the system runs offline.
 */

import { embedMany } from "ai";
import { createGateway } from "@ai-sdk/gateway";
import type { CorpusDoc, CorpusChunk } from "@/lib/types/shared";

// ---------- Chunking ----------

const TARGET_CHUNK_WORDS = 300; // ~300-word chunks
const OVERLAP_SENTENCES = 2;

function splitIntoSentences(text: string): string[] {
  // Simple sentence splitter: split on ". ", "! ", "? " followed by capital letter or end
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

function chunkText(text: string): string[] {
  const sentences = splitIntoSentences(text);
  const chunks: string[] = [];
  let current: string[] = [];
  let wordCount = 0;

  for (let i = 0; i < sentences.length; i++) {
    const sentence = sentences[i];
    const words = sentence.split(/\s+/).length;
    current.push(sentence);
    wordCount += words;

    if (wordCount >= TARGET_CHUNK_WORDS && i < sentences.length - 1) {
      chunks.push(current.join(" "));
      // Start next chunk with overlap
      current = sentences.slice(Math.max(0, i - OVERLAP_SENTENCES + 1), i + 1);
      wordCount = current.reduce((acc, s) => acc + s.split(/\s+/).length, 0);
    }
  }

  if (current.length > 0) {
    chunks.push(current.join(" "));
  }

  return chunks.filter((c) => c.trim().length > 0);
}

export function chunkDoc(doc: CorpusDoc): CorpusChunk[] {
  // Include title + metadata header in each chunk for context
  const header = `${doc.title} (${doc.date})`;
  const rawChunks = chunkText(doc.text);

  // If doc is short enough, treat as a single chunk
  if (rawChunks.length === 0) {
    return [
      {
        id: `${doc.id}__0`,
        docId: doc.id,
        text: `${header}\n\n${doc.text}`,
      },
    ];
  }

  return rawChunks.map((text, idx) => ({
    id: `${doc.id}__${idx}`,
    docId: doc.id,
    text: `${header}\n\n${text}`,
  }));
}

// ---------- Mock fallback embedding ----------

let _warnedAboutFallback = false;

function mockEmbedding(text: string): number[] {
  // Deterministic 384-dim vector derived from text characters.
  // Uses a simple hash spread across dimensions so similar texts get loosely similar vectors.
  const DIM = 384;
  const vec = new Array<number>(DIM).fill(0);

  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    // Spread character contribution across multiple dimensions
    const base = (i * 31 + code * 17) % DIM;
    vec[base] += Math.sin(code + i * 0.1);
    vec[(base + 97) % DIM] += Math.cos(code * 0.3);
    vec[(base + 191) % DIM] += (code % 10) * 0.01;
  }

  // L2-normalise
  const norm = Math.sqrt(vec.reduce((s, v) => s + v * v, 0)) || 1;
  return vec.map((v) => v / norm);
}

// ---------- Real embedding via AI Gateway ----------

function getGatewayEmbeddingModel() {
  const apiKey = process.env.AI_GATEWAY_API_KEY;
  if (!apiKey) return null;
  try {
    const gw = createGateway({ apiKey });
    return gw.embeddingModel("openai/text-embedding-3-small");
  } catch {
    return null;
  }
}

export async function embedChunks(chunks: CorpusChunk[]): Promise<CorpusChunk[]> {
  if (chunks.length === 0) return [];

  const model = getGatewayEmbeddingModel();

  if (!model) {
    if (!_warnedAboutFallback) {
      console.warn(
        "[embed] AI_GATEWAY_API_KEY not set — using deterministic mock embeddings. " +
          "Set the key for real semantic search."
      );
      _warnedAboutFallback = true;
    }
    return chunks.map((c) => ({ ...c, embedding: mockEmbedding(c.text) }));
  }

  try {
    const values = chunks.map((c) => c.text);
    const { embeddings } = await embedMany({ model, values });
    return chunks.map((c, i) => ({ ...c, embedding: embeddings[i] }));
  } catch (err) {
    if (!_warnedAboutFallback) {
      console.warn(
        "[embed] Embedding API call failed — falling back to deterministic mock embeddings:",
        err instanceof Error ? err.message : err
      );
      _warnedAboutFallback = true;
    }
    return chunks.map((c) => ({ ...c, embedding: mockEmbedding(c.text) }));
  }
}

/** Embed a single query string for search. */
export async function embedQuery(query: string): Promise<number[]> {
  const model = getGatewayEmbeddingModel();

  if (!model) {
    return mockEmbedding(query);
  }

  try {
    const { embeddings } = await embedMany({ model, values: [query] });
    return embeddings[0];
  } catch {
    return mockEmbedding(query);
  }
}
