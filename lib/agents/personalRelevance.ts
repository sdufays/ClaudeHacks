/**
 * Personal relevance sub-agent.
 * Given a council item and a resident profile, returns a RelevanceLine:
 *   score 0–1 + one short "This affects you because…" sentence.
 *
 * Strictly non-partisan: reasons about factual impact, never editorializes.
 */

import { generateText } from "ai";
import { createGateway } from "@ai-sdk/gateway";
import type { Item, Profile, RelevanceLine } from "@/lib/types/shared";

const SYSTEM_PROMPT = `You are a personal-relevance ranker for Cambridge, MA city council activity.

Your job: given a council item and a resident profile, decide how relevant the item is to this specific resident.

Rules you must follow without exception:
- Reason about whether this item touches the user's housing, commute, household, or stated issue tags. Do not editorialize.
- Score 0–1 where 0 = completely irrelevant and 1 = directly affects the resident's daily life.
- The oneLiner must start with "This affects you because" or "Not directly relevant to your profile" (if score < 0.3).
- Keep the oneLiner to a single short sentence (≤ 20 words).
- Never tell the resident what to support, oppose, or do about the item. Only explain factual relevance.
- Do not mention partisan politics or take sides.

Your response must be valid JSON with this exact shape:
{
  "score": <number 0.0 to 1.0>,
  "oneLiner": "<single sentence>"
}`;

function buildPrompt(item: Item, profile: Profile): string {
  return `Assess the personal relevance of this Cambridge city council item for the resident described below.

ITEM:
  ID: ${item.id}
  Title: ${item.title}
  Kind: ${item.kind}
  Date: ${item.date}
  Summary: ${item.summary ?? "(no summary available)"}
  Topics: ${(item.topics ?? []).join(", ") || "N/A"}

RESIDENT PROFILE:
  Name: ${profile.name}
  Address: ${profile.address}
  Neighborhood: ${profile.neighborhood ?? "Cambridge, MA"}
  Housing status: ${profile.housing} (rent/own/other)
  Commute mode: ${profile.commute}
  Household: ${profile.household ?? "not specified"}
  Issue tags: ${(profile.issueTags ?? []).join(", ") || "none specified"}

Return JSON only.`;
}

function getModel() {
  const apiKey = process.env.AI_GATEWAY_API_KEY;
  const gw = createGateway({ apiKey: apiKey ?? undefined });
  return gw("anthropic/claude-sonnet-4-6");
}

export async function relevance(
  item: Item,
  profile: Profile
): Promise<RelevanceLine> {
  const model = getModel();

  const { text } = await generateText({
    model,
    system: SYSTEM_PROMPT,
    prompt: buildPrompt(item, profile),
  });

  try {
    const cleaned = text.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();
    const parsed = JSON.parse(cleaned) as { score: number; oneLiner: string };
    return {
      itemId: item.id,
      score: Math.max(0, Math.min(1, parsed.score)),
      oneLiner: parsed.oneLiner,
    };
  } catch {
    console.warn("[personalRelevance] Failed to parse JSON response — returning low relevance");
    return {
      itemId: item.id,
      score: 0,
      oneLiner: "Not directly relevant to your profile.",
    };
  }
}
