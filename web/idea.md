# Idea: Civic Signal

> Product name locked: **Civic Signal**. iOS bundle id (reserved): `com.dufays.civicsignal`. Today the build ships as a web app on Next.js; the bundle id is held for a future native version.

> Keep people engaged with their local government — without telling them how to vote. And give the government a clean signal back about what residents actually think.

Theme fit ("Machines of Loving Grace"): an LLM that cares about *you specifically* — your block, your commute, your rent — and uses that care to strengthen democratic participation in both directions.

---

## The problem

People want to participate in local government but don't, because:
- **Time.** Bills are long, dense, and slow-moving. Tracking them is a part-time job.
- **Jargon.** Legalese, procedural votes, and bureaucratic structure make the content opaque even when you find it.
- **Relevance gap.** Even good summaries don't tell you which items actually affect *your* life — your commute, your rent, your kid's school.

Net effect: low turnout in local elections, low awareness of what local government is doing on residents' behalf, and a city council that hears mostly from the loudest voices instead of a representative cross-section.

## The thesis

An LLM is uniquely good at this job because it can (a) compress long documents into plain English, (b) cross-reference a user profile to surface personal relevance, and (c) explain *what* and *why* without telling anyone *what to do*. Pair that with a one-tap reaction button and you also get a clean, structured sentiment signal back to government — something city councils today get only via packed public-comment meetings or random emails.

## The product

Web app. **Cambridge, MA only** for v1 (single-city scope keeps corpus prep tight enough for a 2-hour demo).

1. **Profile.** User signs up with address + a few personal attributes (see Profile options below). Address drives neighborhood-level relevance; attributes drive issue-level relevance.
2. **Ingest.** Pull recent Cambridge city council agendas, orders, ordinances, committee reports, and any upcoming ballot questions.
3. **Personalize.** For each item, an agent decides: does this affect *this* user, and how? One-line "why this matters to you."
4. **Digest.** A short briefing surface: "Here's what your government is doing. Here's what's relevant to you. Here's what you can vote on or attend."
5. **Chat.** User can ask follow-ups: "Why is this being proposed?" "Who's against it?" "When is the vote?"
6. **Reflect.** After reading any item, the user can react (Support / Oppose / Unsure / Want more info, plus optional one-line free text). Reactions aggregate into a sentiment signal that goes back to council members.

## Hard principle: non-partisan

We do not tell the user how to vote, what to support, or what to oppose. We tell them what is happening and why it might matter to them. This is the product's spine — without it, this is just another opinion machine.

Operationally:
- Summaries are descriptive, never prescriptive.
- Where the source material has arguments on both sides, we surface both.
- Every factual claim cites the source bill / meeting record.
- "What you can do" lists civic actions (vote, attend, contact your rep) — never positions.
- A dedicated balance-check sub-agent reviews orchestrator output before it ships to the user.
- The feedback loop (below) is also neutral on our part: we transmit verbatim user sentiment to government; we don't editorialize or weight it.

## Constituent feedback loop

> Inform the citizen, transmit the signal back. Closes the democratic loop.

After any summary or chat exchange, the user sees a reaction strip: **Support / Oppose / Unsure / Want more info**, plus an optional one-line comment. We aggregate (anonymized, neighborhood-grouped) and surface back to council — initially as a public dashboard the council can read, eventually as a periodic email to councilors per item.

Why this matters:
- **Closes the loop.** Without it we're a one-way information pipe. With it, we're a two-way bridge — and "machines of loving grace" requires the loop, not just delivery.
- **Stays neutral on our side.** We don't tell the user what to think; we just give them a button to be heard. The data we send to government is verbatim sentiment, not our editorial.
- **Demo-ready.** "React → see your view land in the public sentiment dashboard" is a visceral, judge-friendly beat.

Risks to design around:
- **Social-proof nudging.** Showing aggregate reactions back to the user could push them toward the majority view. Default: hide aggregate from the reacting user; show only to the government and on a separately-accessed public dashboard.
- **Sybil / spam.** Without resident verification the signal is gameable. Punted for the demo; in production this needs address verification or city-issued SSO.
- **Selection bias.** Even verified, only the engaged-enough-to-react subset gets counted. We should label it as "voluntary sentiment from app users" — not "Cambridge residents think X."

## Profile options

| Tier | Fields | Trade-off |
|---|---|---|
| **Lean (3)** | Address; housing status (rent/own); commute mode (drive/transit/bike/walk) | 30-second signup, still strong personalization. **Recommended for the demo.** |
| **Balanced (5)** | Lean + household composition (solo / couple / parent K-12 / parent under-5 / multi-generational) + 1–3 issue tags from a fixed list (housing, climate, transit, schools, public safety, small business, civil liberties) | Best general-purpose. ~90-second signup. |
| **Rich (7+)** | Balanced + income bracket + age bracket + years in Cambridge | Sharpest personalization, real signup friction. Probably post-MVP. |

Note on Cambridge structure: Cambridge has **no city council districts** — 9 councilors elected at-large via ranked-choice (PR-STV, since 1941). So address doesn't pick "your representative" (all 9 are yours). Instead, address gives us neighborhood-level impact (your street, your school zone, your polling location), and the personalization sub-agent surfaces *which councilors voted how* on items that match your profile. This is actually a feature: at-large systems make accountability hard precisely because there's no single rep to call — we fix that by mapping votes to your interests. (Same shape for the School Committee: 7 seats — 6 elected at-large via PR-STV, plus the Mayor ex officio as the 7th member and chair.)

---

## Maps to the pre-baked architecture

| Layer | This product |
|---|---|
| Chat UI | Q&A about a specific bill or about "what's happening this week" |
| Sidebar | Upcoming items, next meeting/election dates, all 9 councilors with their relevant voting record |
| Orchestrator (Opus 4.7) | Routes between summarize → personalize → action → balance-check |
| Sub-agents (Sonnet 4.6) | (1) Plain-English summarizer, (2) Personal-relevance ranker, (3) Action extractor, (4) Balance/neutrality reviewer |
| Retrieval | Embedded corpus of recent Cambridge agenda items, ordinances, ballot questions |
| Corpus | ~25 real items: ~20 PDFs from the Jan 26, 2026 PrimeGov agenda + 3–5 older meetings from the IQM2 archive. See **Corpus & data sources** below. |
| Feedback signal | Reaction strip on every item; in-memory aggregator; sentiment dashboard view |

## Corpus & data sources

Cambridge migrated council systems on Jan 26, 2026. We pull from two places:

- **PrimeGov (current):** `https://cambridgema.primegov.com/public/portal` — the Jan 26, 2026 inaugural agenda alone has ~60 per-item PDF attachments (City Manager items, Policy Orders, Resolutions, Committee Reports). One regular Monday meeting fills our corpus with room to spare.
- **IQM2 (archive, 2016 – Jan 12, 2026):** `https://cambridgema.iqm2.com/Citizens/calendar.aspx` — per-meeting "Web Outline" pages link agendas, minutes, and final actions. Use for 3–5 older meetings to give the system some historical depth.
- **Open Data Portal:** `https://data.cambridgema.gov` — Socrata, PDDL-licensed, JSON/CSV API. Mostly tabular (voter turnout, election results, permits). **Not** narrative documents, so not corpus material — but useful for sidebar facts (e.g. last-election turnout for the user's neighborhood).
- **Election Commission:** `https://www.cambridgema.gov/Departments/electioncommission` — ballot question PDFs and candidate materials when an election is in flight.

**Best path to ~25 docs by 1pm:** hand-fetch ~20 PDFs from the Jan 26, 2026 PrimeGov agenda + 3–5 from recent IQM2 meetings. All public, no login, no API key. Total fetch ~10 minutes with a polite delay. Skip the open-data portal for the corpus itself.

**Scraping posture.** IQM2 explicitly permits polite crawlers (60s delay). PrimeGov's robots.txt is `Disallow: /` but the public PDFs are publicly intended; a one-time human-paced hand-fetch of ~20 documents is the same thing a curious resident would do, and is the right corner to cut for a 2-hour demo. For anything production-scale we'd ask Cambridge directly or wait for an official feed.

## Demo at 3:00 (2-min judge flow)

The three beats — in order. Personal relevance is the headline; chat Q&A and the feedback loop reinforce it.

1. **Setup.** Open the app — profile is already set up (Cambridge resident, renter, bikes, no kids).
2. **Beat 1 — Personal relevance.** Show the digest: 4–5 items this week, each with a one-line "why this matters to *you*." Click into a bike-lane ordinance: plain-English summary, citations, "you can speak at the council meeting on X."
3. **Beat 2 — Chat Q&A with balance.** Ask the chat: "Why is this controversial?" → balanced answer with arguments from both sides, every claim cited to the source.
4. **Beat 3 — Feedback loop.** Hit the reaction button (Support / Oppose / Unsure / Want more info) → see it logged, then flip to the sentiment dashboard view: "Here's what Cambridge users are saying back to council this week."
5. **Closer.** "We don't tell you how to vote. We tell you what your government is doing — and we tell your government what you think."

### Demo realism (2-hour build)

- "Weekly digest" is a static snapshot screen. No cron, no email — just "here's this week."
- Profile is one hardcoded persona. Signup flow is faked or trivial.
- Corpus is pre-loaded ~20–30 real documents. No live scraping during the demo.
- Sentiment dashboard is seeded with a handful of plausible reactions so the bars look populated when the live one lands.
- Real agent reasoning, real retrieval, real chat, real reaction → real bar movement. Everything else is window dressing.

---

## Locked

- ✅ **Jurisdiction:** Cambridge, MA only.
- ✅ **Headline demo beat:** personal relevance, with chat Q&A and the feedback loop as the supporting beats — all three on screen.
- ✅ **Profile for demo:** Lean (3 fields).
- ✅ **Non-partisan:** hard rule, enforced by balance sub-agent and by neutral framing of the feedback loop.
- ✅ **Corpus source:** PrimeGov (current, post-Jan 2026) + IQM2 (archive) — see Corpus & data sources.

## Open questions

1. **Election cycle reality.** Next Cambridge municipal election is **Nov 3, 2026** — six months out — and no major ballot questions are confirmed for it yet. The big recent ballot moment was the Nov 4, 2025 charter revision. So the "what can you vote on?" framing is thin in the immediate term. Options: (a) lean on "what can you attend / comment on" instead of "what can you vote on" for the demo, (b) include the historical Nov 2025 charter question to demo the ballot-question flow even though it's past, or (c) both.
2. **Personalization mechanism.** Is it a single sub-agent that reads (item + profile) → relevance score + one-liner? Or do we pre-filter with cheap tag-matching first and only run the agent on candidates? (Speed vs. nuance.)
3. **Hide-vs-show low-relevance items.** When the relevance ranker says "doesn't really affect you," do we hide the item, demote it, or show it with a "low relevance to you" badge? (Suppression risks creating a filter bubble; showing everything dilutes the magic.)
4. **Feedback aggregation visibility.** Confirm: aggregates are visible to councilors and on a separately-accessed public page, but *not* shown back to the user immediately after they react. Right call?
5. **Action depth.** "Vote on Nov X" + "council meeting Tues 6pm" is the floor. Should we also surface councilor contact info per item? (Still neutral: contact info isn't a position.)
6. **Public-comment integration.** Cambridge council meetings have a public-comment slot. Do we let users sign up to speak directly from the app (deep link to whatever Cambridge uses), or just tell them "be there at 6pm"?
