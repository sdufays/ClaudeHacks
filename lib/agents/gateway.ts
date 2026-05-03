/**
 * lib/agents/gateway.ts
 * Centralised model factory for all agents.
 *
 * Uses @ai-sdk/anthropic and @ai-sdk/openai directly.
 * When AI_GATEWAY_API_KEY is set, routes through the Vercel AI Gateway
 * by pointing the providers at the gateway base URL.
 * Falls back to provider defaults (direct API) if only a provider key is set.
 */

import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenAI } from "@ai-sdk/openai";

const GATEWAY_BASE = "https://ai-gateway.vercel.sh/v1";

/**
 * Return a language model for the given Anthropic model ID.
 * Prefers AI Gateway if AI_GATEWAY_API_KEY is set; falls back to
 * ANTHROPIC_API_KEY direct if available.
 */
export function anthropicModel(modelId: string) {
  const gatewayKey = process.env.AI_GATEWAY_API_KEY;
  if (gatewayKey) {
    const provider = createAnthropic({
      baseURL: `${GATEWAY_BASE}/anthropic`,
      apiKey: gatewayKey,
    });
    return provider(modelId);
  }

  // Direct Anthropic fallback
  const provider = createAnthropic();
  return provider(modelId);
}

/**
 * Return an OpenAI embedding model.
 * Prefers AI Gateway; falls back to direct OPENAI_API_KEY.
 */
export function openAIEmbeddingModel(modelId: string) {
  const gatewayKey = process.env.AI_GATEWAY_API_KEY;
  if (gatewayKey) {
    const provider = createOpenAI({
      baseURL: `${GATEWAY_BASE}/openai`,
      apiKey: gatewayKey,
    });
    return provider.embedding(modelId);
  }

  const provider = createOpenAI();
  return provider.embedding(modelId);
}
