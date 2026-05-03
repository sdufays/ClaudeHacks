# CLAUDE.md

## Mission

2-hour hackathon entry for **Spring Sprint** (theme: "Machines of Loving Grace"). What we're building gets decided at 1:00pm when the track drops. Until then, this is pre-baked architecture only — no domain locked in.

## Hard rules

- **Hack window is 1:00–3:00 PM. No feature code before 1:00.** Pre-1pm: scaffolding, downloads, planning. After 1:00: build.
- **No prior project code.** 100% new build. Documentation and scaffolding are fine.
- **`main` stays clean.** Feature work happens in worktrees under `trees/{ui,data,agents}/`. Merge into `feature/integration` for the demo.
- **Demo at 3:00 wins.** Optimize every choice for "is this on screen by 2:50?" not for production-readiness.

## Pre-baked architecture

Whatever the domain ends up being (governance, health, neuroscience, etc.), the skeleton stays the same. Decide corpus + prompts at 1:00, not the architecture.

```
User → Next.js chat UI
        ↓
    Orchestrator (Opus 4.7 via AI Gateway)
        ├── 3–4 specialized sub-agents (Sonnet 4.6)
        └── retrieval layer (hosted embeddings + in-memory store)
        ↓
    Streamed response with citations
```

### Tech stack

- **Frontend:** Next.js 16 App Router, TypeScript, Tailwind, shadcn/ui.
- **AI:** Vercel AI SDK v6 + AI Gateway. `"anthropic/claude-opus-4-7"` for orchestrator, `"anthropic/claude-sonnet-4-6"` for sub-agents. Plain `"provider/model"` strings — no provider-specific packages. Quality over latency for a one-shot demo; drop sub-agents to Haiku 4.5 only if a parallel fan-out gets noticeably slow.
- **Retrieval:** Hosted embeddings via AI Gateway (`openai/text-embedding-3-small`). In-memory vector store for ~30 docs is fine. Swap to Upstash if persistence matters.
- **Open-source model option:** SAM 3 / SAM 3D, TimesFM 2.5, BGE-M3, or TRIBE v2 if the track calls for one. Pull weights pre-1pm — they're heavy.
- **Deploy:** Vercel. `vercel deploy` from main; preview links per worktree.

### File layout (post-scaffold)

```
/
├── app/
│   ├── (chat)/page.tsx           # main chat UI               [ui]
│   └── api/
│       ├── chat/route.ts         # orchestrator endpoint      [agents]
│       └── search/route.ts       # retrieval endpoint         [data]
├── components/
│   ├── chat/                     # message list, composer     [ui]
│   └── sidebar/                  # context-specific sidebar   [ui]
├── lib/
│   ├── agents/                   # orchestrator + sub prompts [agents]
│   ├── retrieval/                # embeddings, search         [data]
│   ├── corpus/                   # corpus loaders             [data]
│   └── types/shared.ts           # cross-tree types — touch carefully
├── data/
│   └── corpus/                   # domain corpus (decided at 1:00)
└── CLAUDE.md
```

## Worktree layout

Three worktrees off `main`, each owned by a separate Claude Code session:

| Worktree           | Branch           | Owns                                                               | Role                                                |
| ------------------ | ---------------- | ------------------------------------------------------------------ | --------------------------------------------------- |
| `trees/ui/`        | `feature/ui`     | `app/(chat)/`, `components/chat/`, `components/sidebar/`           | Chat surface, sidebar, polish                       |
| `trees/data/`      | `feature/data`   | `lib/retrieval/`, `lib/corpus/`, `app/api/search/`, `data/corpus/` | Embed corpus, search API                            |
| `trees/agents/`    | `feature/agents` | `lib/agents/`, `app/api/chat/`                                     | Orchestrator, sub-agent prompts, AI Gateway wiring  |

Owners do not touch other worktrees' files. Shared types go in `lib/types/shared.ts` — coordinate via main if you change them.

Setup: `bash scripts/setup-worktrees.sh` from repo root.

## Conventions

- **TypeScript strict.** No `any`. Cross-tree types in `lib/types/shared.ts`.
- **Streaming everywhere.** All LLM calls use `streamText`; never `generateText` in user-facing paths.
- **Cite or shut up.** Any factual claim must include a `[source]` link to the corpus passage. Orchestrator refuses to answer if retrieval returns nothing.
- **No half-finished features.** If a sub-agent isn't working at 2:30, rip it out. Better to demo 1 working flow than 3 broken ones.
- **One PR-sized commit per worktree.** No feature flags, no backwards compat. Just ship.

## Pre-flight checklist (before 1:00pm)

- [ ] Scaffold Next.js: `npx create-next-app@latest . --typescript --tailwind --app --no-eslint`
- [ ] Install: `npm i ai @ai-sdk/anthropic @ai-sdk/openai zod`
- [ ] shadcn init: `npx shadcn@latest init`
- [ ] Add components: `npx shadcn@latest add button card scroll-area textarea`
- [ ] Set env: `AI_GATEWAY_API_KEY`; link Vercel project (`vercel link`)
- [ ] Verify dev server: `npm run dev`
- [ ] Pull open-source model weights if needed (TRIBE/SAM3D are GB-scale)
- [ ] Create worktrees: `bash scripts/setup-worktrees.sh`
- [ ] Open 3 Claude Code sessions, one per worktree

## At 1:00pm — lock the build

When the track drops, decide in this order:

1. **Domain & corpus** — what content does retrieval search over? Pre-stage 20–30 source documents into `data/corpus/`.
2. **Orchestrator prompt** — what's the agent's job? Frame in one sentence.
3. **Sub-agents** — typically 3–4 specialists (intake / retrieval / output, or domain-specific). Each gets a Sonnet call.
4. **Sidebar contents** — what live context sits next to the chat?
5. **Demo flow** — what does a judge see in 2 minutes? Write the script before writing code.

Update `app/(chat)/page.tsx` copy and the orchestrator prompt. Everything else stays.
