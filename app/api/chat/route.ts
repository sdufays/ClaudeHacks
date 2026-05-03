/**
 * POST /api/chat — Civic Signal orchestrator endpoint.
 *
 * Accepts: { messages: ModelMessage[], profile?: Profile }
 * Returns: UI message stream (toUIMessageStreamResponse) for useChat.
 *
 * Orchestrator model: anthropic/claude-opus-4-7 via AI Gateway.
 * Sub-agents (summarize, relevance, actions): anthropic/claude-sonnet-4-6.
 * Balance check (balanceChecker): runs once after the full response is assembled.
 *
 * Offline fallback: if AI_GATEWAY_API_KEY is missing, streams a canned
 * demo response about the FY27 Cambridge budget.
 */

import { streamText, tool, stepCountIs } from "ai";
import type { ModelMessage } from "ai";
import { createGateway } from "@ai-sdk/gateway";
import { z } from "zod";
import type { NextRequest } from "next/server";
import type {
  Profile,
  SearchResult,
  Item,
} from "@/lib/types/shared";
import { summarize } from "@/lib/agents/summarizer";
import { relevance } from "@/lib/agents/personalRelevance";
import { extractActions } from "@/lib/agents/actionExtractor";
import { reviewForBalance } from "@/lib/agents/balanceChecker";

// ------------------------------------------------------------------ //
// Demo profile (used when no profile is provided in the request body)
// Cambridge renter, bikes, no kids — matches the UI mock
// ------------------------------------------------------------------ //
const DEMO_PROFILE: Profile = {
  id: "demo",
  name: "Cambridge Resident",
  address: "100 Main St, Cambridge, MA 02139",
  neighborhood: "Cambridgeport",
  housing: "rent",
  commute: "bike",
  household: "solo",
  issueTags: ["housing", "transit", "climate"],
};

// ------------------------------------------------------------------ //
// In-memory item cache so orchestrator tools can retrieve items by id
// after a searchCorpus call
// ------------------------------------------------------------------ //
const itemCache = new Map<string, { item: Item; sources: SearchResult[] }>();

// ------------------------------------------------------------------ //
// Model helpers
// ------------------------------------------------------------------ //
let _apiKeyWarned = false;

function getOrchestratorModel() {
  const apiKey = process.env.AI_GATEWAY_API_KEY;
  if (!apiKey && !_apiKeyWarned) {
    console.warn(
      "[chat/route] AI_GATEWAY_API_KEY is not set — using offline fallback"
    );
    _apiKeyWarned = true;
  }
  const gw = createGateway({ apiKey: apiKey ?? undefined });
  return gw("anthropic/claude-opus-4-7");
}

// ------------------------------------------------------------------ //
// Search helper — calls the data-tree /api/search endpoint
// ------------------------------------------------------------------ //
async function callSearch(
  query: string,
  k = 5
): Promise<SearchResult[]> {
  const base =
    process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  try {
    const res = await fetch(`${base}/api/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, k }),
    });
    if (!res.ok) {
      console.warn(`[chat/route] /api/search returned ${res.status}`);
      return [];
    }
    return (await res.json()) as SearchResult[];
  } catch (err) {
    console.warn("[chat/route] /api/search fetch failed:", err);
    return [];
  }
}

// ------------------------------------------------------------------ //
// System prompt builder
// ------------------------------------------------------------------ //
function buildSystemPrompt(profile: Profile): string {
  return `You are Civic Signal, an AI assistant that helps Cambridge, MA residents understand what their city council is doing — in plain English, with citations, and without political bias.

HARD RULES (never break these):
- Never advise the user how to vote, what to support, or what to oppose. Describe; do not prescribe.
- Cite every factual claim with a source from the corpus. If the corpus has no relevant material, say so and decline to speculate.
- If the user asks for your opinion, decline politely and offer the relevant facts instead.
- Where sources present multiple perspectives (for and against), surface all of them neutrally.
- Do not invent dates, names, votes, or facts not present in your search results.
- Every inline citation must use the format [N] where N corresponds to the numbered source.

YOUR WORKFLOW:
1. When the user asks about council activity, call searchCorpus to find relevant documents.
2. For top results, call summarizeItem to get a plain-English summary with citations.
3. Call getRelevance to assess how this affects the user's specific situation.
4. Call extractItemActions to surface concrete civic actions (attend, comment, contact, vote).
5. Compose a streamed answer that naturally weaves together: context → what it means for you → what you can do. Use inline [N] citations throughout.

RESIDENT PROFILE (use this to personalize your answer naturally):
  Name: ${profile.name}
  Address: ${profile.address}
  Neighborhood: ${profile.neighborhood ?? "Cambridge"}
  Housing: ${profile.housing === "rent" ? "renter" : profile.housing === "own" ? "homeowner" : "other housing situation"}
  Commute: ${profile.commute}
  Household: ${profile.household ?? "not specified"}
  Issue tags: ${(profile.issueTags ?? []).join(", ") || "none"}

You may naturally reference the user's profile when it is relevant (e.g., "As a Cambridge renter who bikes to work…"), but do not over-personalize.`;
}

// ------------------------------------------------------------------ //
// Offline fallback streamed response
// ------------------------------------------------------------------ //
function offlineFallbackResponse(): Response {
  const body = `Cambridge City Manager Yi-An Huang submitted the proposed FY27 budget on April 29, 2026 — the first billion-dollar budget in Cambridge history [1].

Key headline figures: $51 million for affordable housing programs, $16 million for homelessness services, and $5 million for early childcare for children too young for Universal Pre-K [1].

As a Cambridge renter who bikes to work, the affordable housing and transit line items are directly relevant to your situation. There are three upcoming public hearings where residents can speak: Tuesday May 5 at 9am, Wednesday May 6 at 6pm (focused on schools), and Tuesday May 12 at 9am. The adoption vote is scheduled for Monday, June 1, 2026 [1].

[1] FY27 Budget Submission — Cambridge City Manager's Office (cambridgema.gov)

---
⚠️ *Offline mode — AI_GATEWAY_API_KEY not configured. This is a demo fallback response.*`;

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(body));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

// ------------------------------------------------------------------ //
// Route handler
// ------------------------------------------------------------------ //
export async function POST(req: NextRequest): Promise<Response> {
  const apiKey = process.env.AI_GATEWAY_API_KEY;

  if (!apiKey) {
    return offlineFallbackResponse();
  }

  let messages: ModelMessage[] = [];
  let profile: Profile = DEMO_PROFILE;

  try {
    const body = (await req.json()) as {
      messages?: ModelMessage[];
      profile?: Profile;
    };
    messages = body.messages ?? [];
    profile = body.profile ?? DEMO_PROFILE;
  } catch {
    return new Response("Invalid JSON body", { status: 400 });
  }

  const model = getOrchestratorModel();
  const system = buildSystemPrompt(profile);

  const result = streamText({
    model,
    system,
    messages,
    stopWhen: stepCountIs(8),
    tools: {
      // -------- searchCorpus --------
      searchCorpus: tool({
        description:
          "Search the Cambridge city council corpus for relevant documents. Returns a list of matching chunks with their parent documents.",
        inputSchema: z.object({
          query: z.string().describe("The search query"),
          k: z
            .number()
            .optional()
            .describe("Number of results to return (default 5)"),
        }),
        execute: async ({ query, k }) => {
          const results = await callSearch(query, k ?? 5);

          // Populate item cache
          for (const r of results) {
            const doc = r.doc;
            const item: Item = {
              id: doc.id,
              kind: doc.kind,
              title: doc.title,
              date: doc.date,
              sourceUrl: doc.sourceUrl,
              sourceText: r.chunk.text,
              meeting: doc.meeting,
            };
            const existing = itemCache.get(doc.id);
            if (existing) {
              existing.sources.push(r);
            } else {
              itemCache.set(doc.id, { item, sources: [r] });
            }
          }

          if (results.length === 0) {
            return {
              results: [],
              message:
                "No relevant documents found in the corpus for that query.",
            };
          }

          return {
            results: results.map((r, i) => ({
              index: i + 1,
              itemId: r.doc.id,
              title: r.doc.title,
              kind: r.doc.kind,
              date: r.doc.date,
              score: r.score,
              excerpt: r.chunk.text.slice(0, 300),
            })),
          };
        },
      }),

      // -------- summarizeItem --------
      summarizeItem: tool({
        description:
          "Get a plain-English summary of a Cambridge council item with inline citations. Call this after searchCorpus.",
        inputSchema: z.object({
          itemId: z.string().describe("The item ID from searchCorpus results"),
        }),
        execute: async ({ itemId }) => {
          const cached = itemCache.get(itemId);
          if (!cached) {
            return {
              error: `Item ${itemId} not found in cache. Call searchCorpus first.`,
            };
          }
          const { item, sources } = cached;
          try {
            const result = await summarize(item, sources);
            return { summary: result.summary, citations: result.citations };
          } catch (err) {
            console.error("[summarizeItem] error:", err);
            return { error: "Summarizer failed — try rephrasing the query." };
          }
        },
      }),

      // -------- getRelevance --------
      getRelevance: tool({
        description:
          "Get the personal relevance score and one-liner for a council item given the user's profile.",
        inputSchema: z.object({
          itemId: z.string().describe("The item ID from searchCorpus results"),
        }),
        execute: async ({ itemId }) => {
          const cached = itemCache.get(itemId);
          if (!cached) {
            return {
              error: `Item ${itemId} not found in cache. Call searchCorpus first.`,
            };
          }
          const { item } = cached;
          try {
            const line = await relevance(item, profile);
            return { score: line.score, oneLiner: line.oneLiner };
          } catch (err) {
            console.error("[getRelevance] error:", err);
            return { error: "Relevance agent failed." };
          }
        },
      }),

      // -------- extractItemActions --------
      extractItemActions: tool({
        description:
          "Extract concrete civic actions (attend, vote, comment, contact) for a council item.",
        inputSchema: z.object({
          itemId: z.string().describe("The item ID from searchCorpus results"),
        }),
        execute: async ({ itemId }) => {
          const cached = itemCache.get(itemId);
          if (!cached) {
            return {
              error: `Item ${itemId} not found in cache. Call searchCorpus first.`,
            };
          }
          const { item, sources } = cached;
          try {
            const actions = await extractActions(item, sources);
            return { actions };
          } catch (err) {
            console.error("[extractItemActions] error:", err);
            return { actions: [] };
          }
        },
      }),
    },

    // Run balance checker on the final assembled text
    onFinish: async ({ text }) => {
      if (!text) return;
      // For the top item in the cache (most recent search), check balance
      const firstCached = itemCache.values().next().value;
      if (!firstCached) return;
      try {
        const { balanced, changed } = await reviewForBalance(
          text,
          firstCached.item
        );
        if (changed) {
          console.log("[chat/route] Balance checker rewrote the response.");
          // Note: we can't retroactively modify the stream in onFinish.
          // The balanced text is logged for monitoring; in a production
          // setup this would be stored and the next request would benefit.
          console.log("[chat/route] Balanced version:", balanced.slice(0, 200));
        }
      } catch (err) {
        console.warn("[chat/route] Balance checker error (non-fatal):", err);
      }
    },
  });

  return result.toUIMessageStreamResponse();
}
