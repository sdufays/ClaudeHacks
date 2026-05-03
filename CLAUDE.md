# CLAUDE.md

## Mission

This repo is a 2-hour hackathon entry for **Spring Sprint** (theme: "Machines of Loving Grace"). We are building **Entitled** — an AI agent that walks people through what they're owed by their government and how to claim it.

**Default domain: US Veterans Affairs benefits.** See "Pivot plan" below if the track changes.

## Hard rules

- **Hack window is 1:00–3:00 PM. No feature code before 1:00.** Pre-1pm: scaffolding, downloads, planning. After 1:00: build.
- **No prior project code.** This must be a 100% new build. Documentation and scaffolding are fine.
- **`main` stays clean.** Feature work happens in worktrees (`../ClaudeHacks-ui`, `-data`, `-agents`). Merge into `feature/integration` for the demo.
- **Demo at 3:00 wins.** Optimize every choice for "is this on screen by 2:50?" not for production-readiness.

## Default build: Entitled (VA benefits)

A chat agent that helps a US veteran:

1. Identify which VA benefits they're likely eligible for (Disability Comp, Education / GI Bill, Healthcare, Pension, Burial, Home Loan).
2. Walk through application steps and required documents.
3. Answer follow-up questions grounded in VA.gov source material.

The differentiator vs. ChatGPT is **groundedness + completeness**: every claim cites the VA source, and the orchestrator proactively asks intake questions to surface entitlements the user wouldn't think to ask about.

### Why VA over SNAP / asylum

- SNAP varies state-by-state — too much data variance to handle in 2 hours.
- Asylum is high-stakes — wrong info could harm someone; not a hackathon-appropriate demo.
- VA is federal-only, well-documented (VA.gov), and the "leaving money on the table" framing is concrete and judgeable.

## Architecture

```
User → Next.js chat UI
        ↓
    Orchestrator (Sonnet 4.6 via AI Gateway)
        ├── eligibility-agent (Haiku 4.5) — intake questions, rule checks
        ├── retrieval-agent  (Haiku 4.5) — searches VA corpus, returns cited passages
        └── application-agent(Haiku 4.5) — walks through forms, lists documents
        ↓
    Streamed response with citations + a "your entitlements" sidebar
```

### Tech stack

- **Frontend:** Next.js 16 App Router, TypeScript, Tailwind, shadcn/ui.
- **AI:** Vercel AI SDK v6 + AI Gateway. Use `"anthropic/claude-sonnet-4-6"` for the orchestrator and `"anthropic/claude-haiku-4-5"` for sub-agents (cheap + parallel). Plain `"provider/model"` strings — no provider-specific packages.
- **Retrieval:** For 2-hour scope, use hosted embeddings (`openai/text-embedding-3-small` via AI Gateway). Skip BGE-M3 self-hosting — multilingual isn't needed for VA. In-memory vector store is fine for ~30 documents.
- **Corpus:** Pre-download ~20–30 VA.gov benefit pages as Markdown into `data/corpus/va/` before 1pm. Each file: frontmatter with source URL, then content.
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
│   └── entitlements/             # sidebar                    [ui]
├── lib/
│   ├── agents/                   # orchestrator + sub prompts [agents]
│   ├── retrieval/                # embeddings, search         [data]
│   ├── corpus/                   # corpus loaders             [data]
│   └── types/shared.ts           # cross-tree types — touch carefully
├── data/
│   └── corpus/va/                # pre-downloaded VA pages
└── CLAUDE.md
```

## Worktree layout

Three worktrees off `main`, each owned by a separate Claude Code session:

| Worktree              | Branch           | Owns                                                         | Role                                              |
| --------------------- | ---------------- | ------------------------------------------------------------ | ------------------------------------------------- |
| `../ClaudeHacks-ui`     | `feature/ui`     | `app/(chat)/`, `components/chat/`, `components/entitlements/` | Chat surface, sidebar, polish                     |
| `../ClaudeHacks-data`   | `feature/data`   | `lib/retrieval/`, `lib/corpus/`, `app/api/search/`, `data/corpus/` | Embed corpus, search API                          |
| `../ClaudeHacks-agents` | `feature/agents` | `lib/agents/`, `app/api/chat/`                               | Orchestrator, sub-agent prompts, AI Gateway wiring |

Owners do not touch other worktrees' files. Shared types go in `lib/types/shared.ts` — coordinate via main if you change them.

Setup: `bash scripts/setup-worktrees.sh` from repo root.

## Pivot plan

If the track drops at 1:00 and Entitled doesn't fit, swap the domain — the architecture stays the same.

| Track                         | Swap                                                                          |
| ----------------------------- | ----------------------------------------------------------------------------- |
| **Health**                    | Domain → care eligible under your insurance; corpus → insurer benefit summaries |
| **Education**                 | Domain → financial aid + scholarships; corpus → FAFSA + state grants           |
| **Immigration** (low-stakes)  | Domain → naturalization process help; corpus → USCIS guides                    |
| **Housing**                   | Domain → tenant rights + housing assistance; corpus → state tenant law         |
| **Wow-factor / neuroscience** | Pivot entirely to the activation-steering "emotion dial" — different default build |

Only the corpus, the orchestrator's intake questions, and the sidebar labels change. UI shell, retrieval pipeline, sub-agent structure all stay.

## Conventions

- **TypeScript strict.** No `any`. Cross-tree types in `lib/types/shared.ts`.
- **Streaming everywhere.** All LLM calls use `streamText`; never `generateText` in user-facing paths.
- **Cite or shut up.** Any benefit claim must include a `[source]` link to the corpus passage. The orchestrator must refuse to answer if retrieval returns nothing.
- **No half-finished features.** If a sub-agent isn't working at 2:30, rip it out. Better to demo 1 working flow than 3 broken ones.
- **One PR-sized commit per worktree.** No feature flags, no backwards compat. Just ship.

## Pre-flight checklist (before 1:00pm)

- [ ] Scaffold Next.js: `npx create-next-app@latest . --typescript --tailwind --app --no-eslint`
- [ ] Install: `npm i ai @ai-sdk/anthropic @ai-sdk/openai zod`
- [ ] shadcn init: `npx shadcn@latest init`
- [ ] Add components: `npx shadcn@latest add button card scroll-area textarea`
- [ ] Set env: `AI_GATEWAY_API_KEY`; link Vercel project (`vercel link`)
- [ ] Verify dev server: `npm run dev`
- [ ] Pre-download VA corpus: ~20 VA.gov pages → `data/corpus/va/*.md` (script; cite source URL in frontmatter)
- [ ] Create worktrees: `bash scripts/setup-worktrees.sh`
- [ ] Open 3 Claude Code sessions, one per worktree

## Demo plan (target: 2:50pm)

1. **30s intro** — "We help people claim what they're already owed."
2. **2-min live demo** — A vet asks something vague: *"I served 4 years, what am I entitled to?"* Agent intakes, retrieves, surfaces 3 benefits, walks through one. Citations show.
3. **30s pivot story** — Same architecture works for any "entitlements" domain. Show the corpus folder.
4. **Stop at 3:00.** Don't blow the time budget.
