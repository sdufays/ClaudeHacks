# Tagger Runbook

You are an LLM agent. Your job is to read Cambridge City Council PDFs in
`scrape/city_council/`, split each one into discrete items, tag each item
according to the controlled vocabulary, validate the result, and write
the output to `data/tagged/`.

Run this from the repo root: `/Users/kevinchafloque/Desktop/claude_hack/ClaudeHacks`.

All paths below are relative to the repo root.

## How to run this — orchestrator vs worker

You will operate in **two roles**:

1. **Orchestrator** (the agent reading this runbook first). Your job is
   to enumerate meetings and **spawn one subagent per meeting**, in
   parallel, then collect their summaries.
2. **Worker** (each spawned subagent). Each worker handles exactly one
   meeting end-to-end (read PDFs → split → tag → validate → write JSON).

### Orchestrator workflow

1. List `scrape/city_council/*.pdf`.
2. Group filenames by `(meetingDate, meetingId)` — pair Agenda with
   Final Actions. Each unique meeting ID = one work unit.
3. For each meeting **not already present** in `data/tagged/`, spawn a
   `general-purpose` subagent. Send all spawns **in a single message**
   so they run in parallel — do NOT await one before spawning the next.
4. Each subagent's prompt must be self-contained. Use this template:

   ```
   You are a tagger worker for one Cambridge City Council meeting.

   Read these files first, in order:
     1. lib/tagging/RUNBOOK.md (sections "Worker workflow" onward)
     2. lib/tagging/tagger-prompt.md
     3. lib/tagging/vocabulary.ts
     4. lib/tagging/types.ts

   Your meeting:
     meetingId: <ID>
     meetingDate: <YYYY-MM-DD>
     sourceFiles:
       - scrape/city_council/<agenda filename or "none">
       - scrape/city_council/<final actions filename or "none">

   Do the full Worker workflow for this one meeting. Write
   data/tagged/<meetingDate>_<meetingId>.json. When done, reply with
   exactly one line: the summary log from step 7.
   ```

5. While workers run, do nothing else. When all workers return, collect
   their summary lines and print a final report:

   ```
   N meetings tagged, M total items, K validation errors
   ```

6. If any worker reports validation errors or fails, list those meeting
   IDs and stop. Do not retry automatically — let the human inspect.

**Why subagents?** Each meeting is independent, PDFs are large, and
tagging is the bulk of the token cost. Running them serially would
multiply latency for no benefit. One subagent per meeting keeps each
context focused on a single PDF pair.

**Cap:** if there are more than 12 meetings to process, batch them in
groups of 8–12 spawns at a time to avoid resource contention.

## Ground rules

- **You ARE the tagger.** Tag selection is your judgment call. Deterministic
  code only validates your output.
- **Stay inside the controlled vocabulary.** If a concept does not have a
  legal tag, drop it. Do NOT invent tags.
- **Every tag needs a rationale** quoting or paraphrasing the source phrase
  that justifies it. Used downstream to catch hallucinations.
- **Idempotent.** If `data/tagged/<basename>.json` already exists for a PDF,
  skip it unless explicitly told to re-run.
- **Stop on validation failure.** Do not silently drop invalid tags — fix
  the prompt or the source extraction and re-run.

## Read these first (in order)

1. `lib/tagging/tagger-prompt.md` — your system prompt. The hard rules,
   output schema, per-namespace guidance, and four worked examples live
   here. Internalize this before tagging anything.
2. `lib/tagging/vocabulary.ts` — the closed list of legal
   `<namespace>.<key>` pairs and their value rules. This is the contract.
   When in doubt about whether a tag exists, grep this file.
3. `lib/tagging/types.ts` — the `CouncilItem` shape you are producing,
   plus `parseTag()` / `isValidTag()` (the validator).
4. `lib/types/shared.ts` — `UserProfile` (so you understand who the tags
   are matched against; you don't need to read profiles, just understand
   what fields exist).

## Files to process

Source PDFs live in `scrape/city_council/`. Filenames are
`YYYY-MM-DD_<Type>_<MeetingID>.pdf` where `<Type>` is `Agenda` or
`FinalActions`.

For each meeting ID, the Agenda and Final Actions PDFs are paired:

```
2026-03-25_Agenda_2121.pdf       ← what was proposed
2026-03-25_FinalActions_2121.pdf ← what happened (status, votes)
```

Some meetings have only one of the pair (e.g. `429`, `1656`). Process them
anyway, with `status` and `vote` left null when Final Actions is absent.

## Output location

Write one JSON file per meeting:

```
data/tagged/<YYYY-MM-DD>_<MeetingID>.json
```

If the directory does not exist, create it.

## Worker workflow

This is what each spawned subagent does for its single assigned meeting.

### 1. Read both PDFs

Use the Read tool. Read the Agenda first (full document — these are
short, usually under 30 pages), then the Final Actions. If the file is
large (>15 pages), use the `pages` parameter to read in chunks.

### 2. Split the Agenda into items

The Agenda is structured by Roman-numeral sections:

```
I.    ROLL CALL
II.   PLEDGE OF ALLEGIANCE
III.  PUBLIC COMMENTS / HEARING SCHEDULE
IV.   SUBMISSION OF THE RECORD
V.    CITY MANAGER'S AGENDA          ← contains CMA items
VI.   POLICY ORDERS                   ← contains POR items
VII.  CALENDAR (TABLED + UNFINISHED BUSINESS)
VIII. COMMUNICATIONS                  ← contains COM items
IX.   RESOLUTIONS                     ← contains RES items
X.    COMMITTEE REPORTS               ← contains CC items
XI.   COMMUNICATIONS FROM OTHER CITY OFFICERS  ← contains COF items
XII.  LATE AGENDA ITEMS REQUIRING SUSPENSION OF THE RULES PER RULE 36A
XIII. APPENDED INFORMATION (AWAITING REPORT LIST)  ← contains AR items
```

(Section numbers vary slightly meeting-to-meeting; trust the headers.)

Each numbered entry within a section is an item. The bold ID line at the
end of each entry (`CMA 2026-66`, `POR 2026-57`, `AR 2026-02`, etc.)
gives you the canonical `itemId`. Convert to dash-separated form:
`CMA 2026-66` → `CMA-2026-66`.

Section → `doc.kind`:

| Section | docKind |
|---|---|
| CITY MANAGER'S AGENDA | `CMA` |
| POLICY ORDERS | `POR` |
| RESOLUTIONS | `RES` |
| UNFINISHED BUSINESS (ordinances) | `ORD` |
| AWAITING REPORT LIST | `AR` |
| COMMUNICATIONS FROM OTHER CITY OFFICERS | `COF` |
| COMMUNICATIONS | `COM` |
| HEARING SCHEDULE | `HR` |
| COMMITTEE REPORTS | `CC` |
| SUBMISSION OF THE RECORD | `MIN` |

Skip ROLL CALL, PLEDGE OF ALLEGIANCE, ADJOURNMENT, and any empty
section. RESOLUTIONS containing only condolences / congratulatory items
should still be tagged (they are short — `topic.area:arts` or no topic
tag is fine; they will score very low for most users).

### 3. Reconcile with Final Actions

For each item ID extracted from the Agenda, find the matching entry in
Final Actions (same section, same item number, same ID). Merge:

- `body` from the Agenda (proposed text)
- `status` from Final Actions ("RESULT: Adopted [9-0-0]" → `adopted`)
- `vote` from Final Actions (parse YEAS / NAYS / PRESENT / ABSENT lists
  into councillor slugs — see `COUNCILLOR_SLUGS` in `vocabulary.ts`)
- `amendments` from any "as Amended" / "as Amended by Substitution" notes

Items that appear in Final Actions but not on the Agenda (typically
late-filed items under "LATE AGENDA ITEMS") still get a record — set
`body` to the Final Actions text and proceed.

If only one of (Agenda, Final Actions) is available for the meeting,
process whichever exists with the missing fields left null.

### 4. Tag each item

For each item, apply `lib/tagging/tagger-prompt.md`. Produce a JSON
object matching this schema (see also `CouncilItem` in `types.ts`):

```json
{
  "itemId": "POR-2026-32",
  "meetingId": 2121,
  "meetingDate": "2026-03-23",
  "docKind": "POR",
  "title": "<one-line, ≤120 chars>",
  "summary": "<2-3 sentences, plain English, resident-facing>",
  "body": "<verbatim source text>",
  "sponsors": ["simmons"],
  "status": "no_action",
  "vote": {
    "result": "Charter Right Exercised",
    "yeas": [], "nays": [], "absent": [], "present": []
  },
  "amendments": [],
  "history": [
    {"date": "2026-02-09", "action": "Charter Right Exercised by Councillor Simmons"},
    {"date": "2026-03-02", "action": "Placed on Table"},
    {"date": "2026-03-30", "action": "No Action Taken"}
  ],
  "tags": ["doc.kind:POR", "doc.item_id:POR-2026-32", ...],
  "rationale": {
    "doc.status:no_action": "NO ACTION TAKEN IN COUNCIL MARCH 30, 2026"
  },
  "citation": {
    "sourceFile": "scrape/city_council/2026-03-25_Agenda_2121.pdf",
    "page": 3,
    "anchor": "VI.6"
  }
}
```

The meeting date in `meetingDate` and `doc.meeting_date` is the **meeting
date** (often visible on the cover page as "MARCH 23, 2026"), NOT the
publish date in the filename. Re-read the cover page if unsure.

### 5. Validate

Before writing, run every tag through the validator. From the repo root:

```bash
npx tsx -e "
const { isValidTag } = require('./lib/tagging/types');
const tags = $TAGS_JSON_ARRAY;
const bad = tags.filter(t => !isValidTag(t));
if (bad.length) { console.error('INVALID:', bad); process.exit(1); }
console.log('ok');
"
```

If you don't have `tsx` installed, use the Bash tool to run it via
`npx --yes tsx`. If validation fails, fix the offending tag(s) and
revalidate. Do not write output until all tags pass.

### 6. Write output

Write one JSON file per meeting at:

```
data/tagged/<meetingDate>_<meetingId>.json
```

Format:

```json
{
  "meetingId": 2121,
  "meetingDate": "2026-03-23",
  "meetingType": "Regular Meeting",
  "sourceFiles": [
    "scrape/city_council/2026-03-25_Agenda_2121.pdf",
    "scrape/city_council/2026-03-25_FinalActions_2121.pdf"
  ],
  "items": [ /* array of CouncilItem objects */ ]
}
```

Pretty-print with 2-space indent. Keep items in agenda order (CMA →
POR → RES → ORD → AR → COF → COM → CC → HR → MIN).

### 7. Log a summary

After each meeting, print a one-line summary:

```
✓ 2026-03-23 (2121): 47 items tagged, 312 tags total, 0 validation errors
```

## Edge cases & gotchas

- **Meeting date vs publish date.** The PDF filename uses the publish
  date; the cover page has the actual meeting date. Use the meeting date
  in all tags and JSON output. Example: `2026-03-25_FinalActions_2121.pdf`
  is the **March 23** meeting.
- **Roundtable / Working meetings** (e.g. `2137` on April 6) are
  agenda-only and very short — typically a single COF item plus a
  presentation reference. Process them, but expect 1–3 items max.
- **Carryover items.** An item that was Charter Right'd or Tabled at a
  prior meeting often re-appears at a later one. Tag it on every
  appearance — the `history` array captures the lifecycle. Do NOT
  deduplicate across meetings.
- **Amendments by substitution** (`Adopted as Amended by Substitution`)
  mean the final language differs from the agenda body. Note this in
  `amendments` and use `doc.status:adopted_amended`.
- **Sponsors.** Sponsors appear before the bold ID line, in ALL CAPS.
  Convert to slugs from `COUNCILLOR_SLUGS` (e.g. "MAYOR SIDDIQUI" →
  `siddiqui`, "COUNCILLOR AL-ZUBI" → `al_zubi`).
- **PDFs with mostly images / scans.** If the Read tool returns sparse
  text, flag the file and skip — don't guess.
- **Dollar amounts** for `fiscal.amount_bucket`: pick the bucket from the
  primary appropriation amount in the item. If multiple amounts are
  mentioned (e.g. "rescind $2M and $400K, appropriate $900K"), use the
  appropriation amount, not the rescissions.

## Don'ts

- Don't read the user profile schema (`user-profile.md` lives in
  iMessage attachments, not the repo) — you don't need it. Just produce
  correct tags from the controlled vocabulary.
- Don't write code outside `data/tagged/`. Don't modify `lib/tagging/*`.
- Don't add new tags to the vocabulary on your own. If you discover a
  recurring concept that has no tag, log it in `data/tagged/_gaps.md`
  with three example items, and stop. A human will decide whether to
  extend the vocabulary.
- Don't summarize or editorialize. The `summary` field is plain English
  describing what the item does, not whether it's good or bad.

## Resume / re-run

To re-tag a single meeting, delete its file in `data/tagged/` and run
again. To re-tag everything from scratch, delete `data/tagged/` and run.
The runbook is idempotent given the same inputs and prompt.

## Done check

After processing all meetings, verify:

```bash
ls scrape/city_council/*.pdf | wc -l   # source files
ls data/tagged/*.json | wc -l          # one per unique meeting ID
```

Each unique meeting ID in `scrape/city_council/` should have exactly one
JSON output file. Mismatches mean a meeting was skipped — investigate.
