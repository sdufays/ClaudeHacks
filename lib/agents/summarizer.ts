/**
 * Summarizer sub-agent.
 * Converts a Cambridge council item + retrieval results into a plain-English
 * summary (≤3 paragraphs) with inline citations.
 *
 * Strictly non-partisan: describes what the item does and why it is proposed.
 * Never advocates, never predicts effects the source does not predict.
 */

import { generateText } from "ai";
import { createGateway } from "@ai-sdk/gateway";
import type { Item, SearchResult, Citation } from "@/lib/types/shared";

const SYSTEM_PROMPT = `You are a plain-English summarizer for Cambridge, MA city council activity.

Rules you must follow without exception:
- Write in plain English that any resident can understand. No jargon.
- Describe what the item does and why it is being proposed. Do not advocate. Do not predict effects unless the source explicitly predicts them.
- Never advise the reader how to vote, what to support, or what to oppose. Describe; do not prescribe.
- If the user asks for your opinion, decline politely and offer the relevant facts instead.
- Keep your summary to at most 3 short paragraphs.
- Cite every factual claim. After each cited fact, insert [N] where N is the 1-based index of the source you are drawing from.
- If the sources have arguments from multiple perspectives, surface all of them neutrally.
- Do not invent facts that are not in the provided sources.

Your response must be valid JSON with the shape:
{
  "summary": "<plain-text summary with [N] citation markers>",
  "citations": [
    { "itemId": "<id>", "itemTitle": "<title>", "excerpt": "<brief quoted excerpt>", "sourceUrl": "<url or empty string>" }
  ]
}`;

function buildPrompt(item: Item, sources: SearchResult[]): string {
  const sourcesText = sources
    .map((s, i) => {
      const doc = s.doc;
      return `[${i + 1}] Title: ${doc.title}\nDate: ${doc.date}\nURL: ${doc.sourceUrl ?? "N/A"}\nText: ${s.chunk.text}`;
    })
    .join("\n\n---\n\n");

  return `Summarize the following Cambridge city council item.

ITEM:
  ID: ${item.id}
  Kind: ${item.kind}
  Title: ${item.title}
  Date: ${item.date}
  Meeting: ${item.meeting ?? "N/A"}
  Topics: ${(item.topics ?? []).join(", ") || "N/A"}

SOURCE DOCUMENTS (cite these — do not invent other facts):
${sourcesText || "No sources provided — say so and decline to speculate."}`;
}

function getModel() {
  const apiKey = process.env.AI_GATEWAY_API_KEY;
  const gw = createGateway({ apiKey: apiKey ?? undefined });
  return gw("anthropic/claude-sonnet-4-6");
}

export async function summarize(
  item: Item,
  sources: SearchResult[]
): Promise<{ summary: string; citations: Citation[] }> {
  const model = getModel();

  const { text } = await generateText({
    model,
    system: SYSTEM_PROMPT,
    prompt: buildPrompt(item, sources),
  });

  try {
    // Strip markdown code fences if present
    const cleaned = text.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();
    const parsed = JSON.parse(cleaned) as {
      summary: string;
      citations: Citation[];
    };
    return parsed;
  } catch {
    // Fallback: return raw text with no citations
    console.warn("[summarizer] Failed to parse JSON response — returning raw text");
    return {
      summary: text,
      citations: [
        {
          itemId: item.id,
          itemTitle: item.title,
          sourceUrl: item.sourceUrl,
        },
      ],
    };
  }
}
