/**
 * Action extractor sub-agent.
 * Pulls concrete civic actions from a council item and its sources:
 *   vote dates, public hearings, comment opportunities, contact info.
 *
 * Strictly neutral: lists actions (attend, vote, comment, contact) only.
 * Never includes a position ("vote yes/no on X" is forbidden).
 */

import { generateText } from "ai";
import { createGateway } from "@ai-sdk/gateway";
import type { Item, SearchResult, Action } from "@/lib/types/shared";

const SYSTEM_PROMPT = `You are a civic-action extractor for Cambridge, MA city council activity.

Your job: read the council item and its source documents, then extract every concrete civic action a resident can take.

Civic actions include (and are limited to):
- "vote": an upcoming election or ballot question (date + location)
- "attend": a public hearing, council meeting, or community meeting (date + location)
- "comment": a public-comment period (deadline + submission URL or address)
- "contact": a councilor, committee, or city office (name + contact URL or email)

Rules you must follow without exception:
- Never include a position or recommendation (e.g., "vote yes on X" is forbidden — only "vote on X by [date]").
- Only extract actions that are explicitly mentioned in the source material. Do not invent dates or contacts.
- If no actions are found, return an empty array.
- Dates should be ISO 8601 (YYYY-MM-DD) where possible, or a human-readable string like "Tuesday, May 6, 2026 at 6pm".
- Keep label short (≤ 10 words).

Your response must be valid JSON with this exact shape:
{
  "actions": [
    { "type": "attend"|"vote"|"comment"|"contact", "label": "<short label>", "date": "<optional>", "location": "<optional>", "url": "<optional>" }
  ]
}`;

function buildPrompt(item: Item, sources: SearchResult[]): string {
  const sourcesText = sources
    .map((s, i) => {
      const doc = s.doc;
      return `[${i + 1}] ${doc.title} (${doc.date})\n${s.chunk.text}`;
    })
    .join("\n\n---\n\n");

  return `Extract civic actions from this Cambridge city council item.

ITEM:
  ID: ${item.id}
  Title: ${item.title}
  Kind: ${item.kind}
  Date: ${item.date}
  Meeting: ${item.meeting ?? "N/A"}

SOURCE DOCUMENTS:
${sourcesText || "No sources provided."}

Return JSON only. Do not invent dates, times, locations, or contacts not present in the sources.`;
}

function getModel() {
  const apiKey = process.env.AI_GATEWAY_API_KEY;
  const gw = createGateway({ apiKey: apiKey ?? undefined });
  return gw("anthropic/claude-sonnet-4-6");
}

export async function extractActions(
  item: Item,
  sources: SearchResult[]
): Promise<Action[]> {
  const model = getModel();

  const { text } = await generateText({
    model,
    system: SYSTEM_PROMPT,
    prompt: buildPrompt(item, sources),
  });

  try {
    const cleaned = text.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();
    const parsed = JSON.parse(cleaned) as { actions: Action[] };
    return parsed.actions ?? [];
  } catch {
    console.warn("[actionExtractor] Failed to parse JSON response — returning empty actions");
    return [];
  }
}
