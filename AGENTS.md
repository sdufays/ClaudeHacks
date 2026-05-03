<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Civic Signal — Cambridge

> iOS bundle id (reserved for future native): `com.dufays.civicsignal`. Today the build is web-only on Next.js.

A 2-hour hackathon build. Reads Cambridge city council activity, summarizes in plain English, surfaces personal relevance for the user, lets them react, and passes that signal back to government. **We don't tell users how to vote.**

Full product context: `idea.md`. Demo anchors / live moments to hit: `presentation-notes.md`.

## Hard rules

- **Cite or shut up.** Every factual claim links to a `Citation` with `itemTitle` + `sourceUrl` from the corpus. No citation → don't make the claim.
- **Non-partisan.** Descriptive, never prescriptive. The balance sub-agent reviews every orchestrator output before it ships.
- **Streaming everywhere.** AI SDK v6 `streamText` for every user-facing LLM call. Never `generateText` in a chat path.
- **No half-finished features.** If something isn't working at 2:30, rip it out.

## Tech stack (versions matter — override training-data assumptions)

- **Next.js 16** App Router, Turbopack default. Read the rules at the top of this file.
- **React 19**.
- **Tailwind 4** (no `tailwind.config.ts`). Tokens live in `app/globals.css` under `@theme`. Custom utilities use `@utility`.
- **AI SDK v6** (`ai`, `@ai-sdk/anthropic`, `@ai-sdk/openai`, `@ai-sdk/react`). Use plain `"provider/model"` strings via the AI Gateway — no provider-specific package wiring.
  - Orchestrator: `"anthropic/claude-opus-4-7"`
  - Sub-agents: `"anthropic/claude-sonnet-4-6"`
  - Embeddings: `"openai/text-embedding-3-small"`
- Env: `AI_GATEWAY_API_KEY` for AI Gateway access.

## Worktree layout

Three sibling worktrees off `main`. Each is owned by a separate agent — **do not touch other trees' files**.

| Worktree           | Branch           | Owns                                                                  | Role                                               |
| ------------------ | ---------------- | --------------------------------------------------------------------- | -------------------------------------------------- |
| `trees/ui/`        | `feature/ui`     | `app/(chat)/`, `components/chat/`, `components/sidebar/`              | Chat surface, digest, sidebar, profile            |
| `trees/data/`      | `feature/data`   | `lib/retrieval/`, `lib/corpus/`, `app/api/search/`, `data/corpus/`    | Embed Cambridge corpus, search API                |
| `trees/agents/`    | `feature/agents` | `lib/agents/`, `app/api/chat/`                                        | Orchestrator + 4 sub-agents, AI Gateway wiring    |

Shared types in `lib/types/shared.ts` — coordinate via main if you change them.
Design primitives in `components/design/` (`Eyebrow`, `NavyHero`, `TopicPill`, `AccentStripe`) — UI tree consumes these.

## Sub-agent breakdown (lives in `lib/agents/`)

1. **Summarizer** — plain-English summary of a council item, with citations.
2. **Personal relevance** — given `(item, profile)`, returns `{score, oneLiner}` per `RelevanceLine` in shared types.
3. **Action extractor** — pulls concrete civic actions (vote / attend / comment / contact) with dates + locations.
4. **Balance / neutrality reviewer** — reads draft orchestrator output, rewrites if it leans prescriptive or omits one side.

## Design system (Inloopd-inspired editorial)

The visual language: midnight-navy gradient hero, Newsreader serif headlines, Nunito rounded sans body, kerned uppercase eyebrows with a small accent dot, soft rounded corners (20–44px), 4pt left accent stripes for story blocks, topic pills at 12% alpha.

Tokens are wired in `app/globals.css`. Use the design primitives in `components/design/` rather than re-implementing — `<Eyebrow>`, `<NavyHero>`, `<TopicPill topic="housing">`, `<AccentStripe topic="transit">`. Topic colors live in `lib/topics.ts`.

Don't:
- Use sans-serif for headlines (always serif).
- Use sharp 90° corners (always soft radii).
- Use neon, glow, gradient text, or rainbow palettes.
- Add tag-line copy from `inloopd_claude_design_2md.md` — that doc is for visual inspiration only.
