/**
 * app/api/search/route.ts
 * POST /api/search
 * Body: { query: string, k?: number }
 * Returns: { results: SearchResult[] }
 *
 * Called by the agents tree's orchestrator tool to retrieve relevant corpus chunks.
 */

import { NextRequest } from "next/server";
import { z } from "zod";
import { search } from "@/lib/retrieval/store";

const SearchRequestSchema = z.object({
  query: z.string().min(1).max(500),
  k: z.number().int().min(1).max(20).optional().default(5),
});

export async function POST(req: NextRequest): Promise<Response> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = SearchRequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Invalid request", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { query, k } = parsed.data;

  try {
    const results = await search(query, k);
    return Response.json({ results });
  } catch (err) {
    console.error("[search route] Error:", err);
    return Response.json({ error: "Search failed" }, { status: 500 });
  }
}
