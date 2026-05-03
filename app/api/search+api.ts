/**
 * app/api/search+api.ts
 * Expo Router API route — POST /api/search
 *
 * Body: { query: string, k?: number }
 * Response: { results: SearchResult[] }
 *
 * Performs semantic search over the Cambridge corpus using the in-memory
 * vector store (with offline mock-embedding fallback).
 */

import { z } from "zod";
import { search } from "@/lib/retrieval/store";

const RequestSchema = z.object({
  query: z.string().min(1, "query must be a non-empty string"),
  k: z.number().int().min(1).max(20).optional().default(5),
});

export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Bad request", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { query, k } = parsed.data;

  try {
    const results = await search(query, k);
    return Response.json({ results });
  } catch (err) {
    console.error("[search] Unexpected error:", err instanceof Error ? err.message : err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
