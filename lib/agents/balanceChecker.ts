/**
 * Balance / neutrality reviewer sub-agent.
 * Reads orchestrator output and rewrites any sentences that read as advice,
 * prescription, or one-sided framing.
 *
 * If the draft is already clean, returns { balanced: draft, changed: false }.
 * Preserves all facts and citation markers exactly.
 */

import { generateText } from "ai";
import { createGateway } from "@ai-sdk/gateway";
import type { Item } from "@/lib/types/shared";

const SYSTEM_PROMPT = `You are a neutrality reviewer for civic information about Cambridge, MA city council activity.

Your job: read a draft summary and decide whether it is neutral, descriptive, and non-partisan.

Rules you must follow without exception:
- Rewrite any sentence that reads as advice, prescription, or one-sided framing.
- Preserve all facts, [N] citation markers, and specific details exactly — do not add or remove cited facts.
- Do not editorialize, editorialize, or take a position yourself.
- If the draft is already balanced and neutral, return it unchanged.
- Never advise the reader how to vote, what to support, or what to oppose.
- Flag and correct: "You should...", "This will hurt...", "This is dangerous...", "Everyone should...", phrases that predict outcomes as certainties when the sources only predict them as possibilities.
- If one major perspective present in the sources is missing from the draft, add a brief neutral description of it.

Your response must be valid JSON with this exact shape:
{
  "balanced": "<the reviewed or rewritten text>",
  "changed": true|false
}`;

function buildPrompt(draft: string, item: Item): string {
  return `Review this draft summary of a Cambridge city council item for neutrality and balance.

ITEM CONTEXT:
  Title: ${item.title}
  Kind: ${item.kind}
  Date: ${item.date}

DRAFT TO REVIEW:
${draft}

If the draft is already balanced and neutral, return it unchanged with changed: false.
If you find prescriptive language or one-sided framing, rewrite those sentences neutrally and return changed: true.
Preserve all [N] citation markers exactly.

Return JSON only.`;
}

function getModel() {
  const apiKey = process.env.AI_GATEWAY_API_KEY;
  const gw = createGateway({ apiKey: apiKey ?? undefined });
  return gw("anthropic/claude-sonnet-4-6");
}

export async function reviewForBalance(
  draft: string,
  item: Item
): Promise<{ balanced: string; changed: boolean }> {
  const model = getModel();

  const { text } = await generateText({
    model,
    system: SYSTEM_PROMPT,
    prompt: buildPrompt(draft, item),
  });

  try {
    const cleaned = text.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();
    const parsed = JSON.parse(cleaned) as { balanced: string; changed: boolean };
    return {
      balanced: parsed.balanced ?? draft,
      changed: parsed.changed ?? false,
    };
  } catch {
    console.warn("[balanceChecker] Failed to parse JSON response — returning original draft");
    return { balanced: draft, changed: false };
  }
}
