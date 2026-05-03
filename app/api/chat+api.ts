/**
 * app/api/chat+api.ts
 * Expo Router API route — POST /api/chat
 *
 * Body: { messages: ModelMessage[], profile?: Profile }
 * Response: streamed UI message stream (AI SDK v6 format)
 *
 * Orchestrator (claude-opus-4-7) with tools:
 *   - searchCorpus({ query, k? })         → calls store.search() directly
 *   - summarizeItem({ itemId })            → calls summarizer sub-agent
 *   - getRelevance({ itemId })             → calls personalRelevance sub-agent
 *   - extractItemActions({ itemId })       → calls actionExtractor sub-agent
 *
 * After stream completes, balanceChecker runs once on assembled text.
 * Falls back to canned response when AI_GATEWAY_API_KEY is absent.
 *
 * Hard non-partisan rule: system prompt includes verbatim neutrality clauses.
 */

import { streamText, stepCountIs } from "ai";
import { z } from "zod";
import { anthropicModel } from "@/lib/agents/gateway";
import { search } from "@/lib/retrieval/store";
import { summarize } from "@/lib/agents/summarizer";
import { relevance } from "@/lib/agents/personalRelevance";
import { extractActions } from "@/lib/agents/actionExtractor";
import { reviewForBalance } from "@/lib/agents/balanceChecker";
import { DEMO_PROFILE } from "@/lib/mock";
import type { Profile, Item, SearchResult } from "@/lib/types/shared";

// ---------- Canned offline response ----------

const OFFLINE_RESPONSE = `Thank you for your question about Cambridge city government activity.

**Note: Running in offline demo mode** (no AI_GATEWAY_API_KEY configured).

Here is a brief overview of current Cambridge council activity:

The City Manager submitted Cambridge's **first-ever billion-dollar budget** (FY27) on April 29, 2026. [1] Key line items include $51 million for affordable housing, $16 million for homelessness services, and $5 million for early childcare for families with children too young for Universal Pre-K.

**Upcoming public hearings on the FY27 budget:**
- Tuesday, May 5, 2026 at 9:00 AM — General budget overview (City Hall)
- Wednesday, May 6, 2026 at 6:00 PM — Schools budget (Cambridge Rindge and Latin School)
- Tuesday, May 12, 2026 at 9:00 AM — Department-by-department review

The adoption vote is scheduled for **Monday, June 1, 2026**. Cambridge residents may speak at any public hearing or submit written comments to the City Clerk.

Other recent items include the Cambridge Street upzoning (passed 6-3, January 27, 2026), sanctuary-city ordinance amendments (adopted unanimously, April 28, 2026), and a policy order banning city department use of X (formerly Twitter) (March 3, 2026).

[1] Source: City of Cambridge, FY27 Budget Submission, https://www.cambridgema.gov/news/2026/04/cambridgecitymanageryianhuangsubmitsproposedfy27budgettocitycouncil

*I do not advise you how to vote on, support, or oppose any of these items — only what is happening and what civic actions are available to you.*`;

// ---------- In-memory item cache ----------

// Cache maps itemId → { item, sources } so sub-agents can look up by ID
const itemCache = new Map<
  string,
  { item: Item; sources: SearchResult[] }
>();

function storeInCache(results: SearchResult[]): void {
  for (const result of results) {
    const doc = result.doc;
    const item: Item = {
      id: doc.id,
      kind: doc.kind,
      title: doc.title,
      date: doc.date,
      sourceUrl: doc.sourceUrl,
      meeting: doc.meeting,
    };
    const existing = itemCache.get(doc.id);
    if (!existing) {
      itemCache.set(doc.id, { item, sources: [result] });
    } else {
      // Accumulate sources for richer sub-agent context
      const alreadyHas = existing.sources.some(
        (s) => s.chunk.id === result.chunk.id
      );
      if (!alreadyHas) {
        existing.sources.push(result);
      }
    }
  }
}

// ---------- System prompt ----------

function buildSystemPrompt(profile: Profile): string {
  return `You are a civic information assistant for Cambridge, MA residents. Your job is to help residents understand what their city council is doing, how it may affect them personally, and what civic actions are available to them.

HARD NON-PARTISAN RULES — you must follow these without exception:
- Never advise the user how to vote, what to support, or what to oppose. Describe; do not prescribe.
- Cite every factual claim with a source from the corpus. If the corpus has no relevant material, say so and decline to speculate.
- If the user asks for your opinion, decline politely and offer the relevant facts instead.
- Where the source material presents arguments from multiple perspectives, surface all of them neutrally.
- Do not invent facts that are not in the provided sources.

YOUR WORKFLOW:
1. Use the searchCorpus tool to find relevant council items for the user's question.
2. For each relevant item (up to 3), use summarizeItem to get a plain-English summary.
3. Use getRelevance to explain how each item may specifically affect this resident.
4. Use extractItemActions to list concrete civic actions (attend, comment, contact, vote).
5. Compose a clear, cited answer. Use [N] inline citation markers referencing corpus sources.

RESIDENT PROFILE (use this to personalise your response naturally, e.g. "as a Cambridge renter who bikes..."):
- Name: ${profile.name}
- Address: ${profile.address}
- Neighborhood: ${profile.neighborhood ?? "Cambridge, MA"}
- Housing status: ${profile.housing} (rent/own/other)
- Commute mode: ${profile.commute}
- Household: ${profile.household ?? "not specified"}
- Issue interests: ${(profile.issueTags ?? []).join(", ") || "none specified"}

Always end your response with a reminder that you do not advise on voting positions — only on what is happening and what civic participation is available.`;
}

// ---------- Request validation ----------

const MessageSchema = z.object({
  role: z.enum(["user", "assistant", "system"]),
  content: z.string(),
});

const ProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string(),
  neighborhood: z.string().optional(),
  housing: z.enum(["rent", "own", "other"]),
  commute: z.enum(["drive", "transit", "bike", "walk", "wfh"]),
  household: z
    .enum(["solo", "couple", "parent_k12", "parent_under5", "multigen"])
    .optional(),
  issueTags: z
    .array(
      z.enum([
        "housing",
        "transit",
        "climate",
        "schools",
        "public_safety",
        "small_business",
        "civil_liberties",
        "zoning",
      ])
    )
    .optional(),
});

const RequestSchema = z.object({
  messages: z.array(MessageSchema).min(1),
  profile: ProfileSchema.optional(),
});

// ---------- Offline streamed response ----------

async function offlineStreamResponse(): Promise<Response> {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      const text = OFFLINE_RESPONSE;
      const chunkSize = 60;
      let offset = 0;
      const interval = setInterval(() => {
        if (offset >= text.length) {
          clearInterval(interval);
          controller.close();
          return;
        }
        const chunk = text.slice(offset, offset + chunkSize);
        offset += chunkSize;
        // AI SDK v6 UI message stream format text delta
        controller.enqueue(encoder.encode(`0:${JSON.stringify(chunk)}\n`));
      }, 20);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Vercel-AI-Data-Stream": "v1",
    },
  });
}

// ---------- Handler ----------

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

  const { messages, profile: rawProfile } = parsed.data;
  const profile: Profile = (rawProfile as Profile | undefined) ?? DEMO_PROFILE;

  // Offline fallback: no API key
  const hasKey =
    !!process.env.AI_GATEWAY_API_KEY || !!process.env.ANTHROPIC_API_KEY;
  if (!hasKey) {
    console.warn(
      "[chat] AI_GATEWAY_API_KEY not set — serving canned offline response"
    );
    return offlineStreamResponse();
  }

  const model = anthropicModel("claude-opus-4-7");

  try {
    const result = streamText({
      model,
      system: buildSystemPrompt(profile),
      messages,
      stopWhen: stepCountIs(8),
      tools: {
        // ----- searchCorpus -----
        searchCorpus: {
          description:
            "Search the Cambridge city council corpus for items relevant to a query. " +
            "Returns the top-k most semantically similar chunks with their source documents.",
          inputSchema: z.object({
            query: z.string().describe("The search query"),
            k: z
              .number()
              .int()
              .min(1)
              .max(10)
              .optional()
              .default(5)
              .describe("Number of results to return (default 5)"),
          }),
          execute: async ({ query, k }) => {
            const results = await search(query, k ?? 5);
            storeInCache(results);
            return results.map((r) => ({
              itemId: r.doc.id,
              title: r.doc.title,
              date: r.doc.date,
              kind: r.doc.kind,
              score: r.score,
              excerpt: r.chunk.text.slice(0, 400),
              sourceUrl: r.doc.sourceUrl,
            }));
          },
        },

        // ----- summarizeItem -----
        summarizeItem: {
          description:
            "Get a plain-English summary of a specific council item. " +
            "Must call searchCorpus first so the item is in cache.",
          inputSchema: z.object({
            itemId: z.string().describe("The item ID from a prior searchCorpus call"),
          }),
          execute: async ({ itemId }) => {
            let cached = itemCache.get(itemId);
            if (!cached) {
              // Fallback: search scoped to the item ID
              const results = await search(itemId, 3);
              storeInCache(results);
              cached = itemCache.get(itemId);
              if (!cached) {
                return { error: `Item ${itemId} not found in corpus` };
              }
            }
            const { summary, citations } = await summarize(
              cached.item,
              cached.sources
            );
            return { summary, citations };
          },
        },

        // ----- getRelevance -----
        getRelevance: {
          description:
            "Get a personal relevance score and one-liner for a specific council item " +
            "based on the resident's profile. Must call searchCorpus first.",
          inputSchema: z.object({
            itemId: z.string().describe("The item ID from a prior searchCorpus call"),
          }),
          execute: async ({ itemId }) => {
            const cached = itemCache.get(itemId);
            if (!cached) {
              return {
                error: `Item ${itemId} not found in cache — call searchCorpus first`,
              };
            }
            const line = await relevance(cached.item, profile);
            return { score: line.score, oneLiner: line.oneLiner };
          },
        },

        // ----- extractItemActions -----
        extractItemActions: {
          description:
            "Extract concrete civic actions (attend, vote, comment, contact) " +
            "from a specific council item. Must call searchCorpus first.",
          inputSchema: z.object({
            itemId: z.string().describe("The item ID from a prior searchCorpus call"),
          }),
          execute: async ({ itemId }) => {
            const cached = itemCache.get(itemId);
            if (!cached) {
              return {
                error: `Item ${itemId} not found in cache — call searchCorpus first`,
              };
            }
            const actions = await extractActions(cached.item, cached.sources);
            return { actions };
          },
        },
      },

      onFinish: async ({ text }) => {
        // Run balance checker on the final assembled text
        // Use the most recently referenced item for context
        const firstCached = itemCache.values().next().value as
          | { item: Item; sources: SearchResult[] }
          | undefined;
        if (firstCached && text.length > 0) {
          try {
            const { changed } = await reviewForBalance(text, firstCached.item);
            if (changed) {
              console.log(
                "[chat] Balance checker flagged prescriptive language — output reviewed"
              );
            }
          } catch (err) {
            console.warn(
              "[chat] Balance checker failed (non-fatal):",
              err instanceof Error ? err.message : err
            );
          }
        }
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (err) {
    console.error(
      "[chat] Stream error:",
      err instanceof Error ? err.message : err
    );
    // Auth/key failures → offline fallback
    const msg = err instanceof Error ? err.message : String(err);
    if (
      msg.includes("401") ||
      msg.includes("403") ||
      msg.includes("auth") ||
      msg.includes("key")
    ) {
      console.warn("[chat] Auth error — falling back to offline response");
      return offlineStreamResponse();
    }
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
