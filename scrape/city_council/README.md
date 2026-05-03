# Cambridge Council Corpus

Pre-staged corpus documents for Civic Signal, covering Cambridge, MA city council activity (2026).

## Format

Each file is Markdown with YAML-like frontmatter delimited by `---` lines:

```
---
id: kebab-case-unique-id
title: Full document title
kind: one of ItemKind (policy_order|city_manager_item|resolution|ordinance|committee_report|ballot_question|communication)
date: YYYY-MM-DD
sourceUrl: original URL for citation
meeting: Meeting name + date
topics: comma-separated IssueTag values (housing|transit|climate|schools|public_safety|small_business|civil_liberties|zoning)
---

Body text (200–500 words)
```

The loader at `lib/corpus/load.ts` parses these files into `CorpusDoc[]`.

## Documents

| File | Title | Date |
|------|-------|------|
| fy27-budget.md | FY27 City Manager Budget Submission | 2026-04-29 |
| cambridge-street-upzoning.md | Cambridge Street Corridor Upzoning 6-3 Vote | 2026-01-27 |
| sanctuary-city-amendments.md | Sanctuary City Ordinance Amendments | 2026-04-28 |
| x-platform-ban.md | City Departments Banned from X Platform | 2026-03-03 |
| multifamily-zoning-report.md | One Year After Multifamily Zoning Reform | 2026-03-26 |
| council-seated-siddiqui-mayor.md | Council Sworn In, Siddiqui Named Mayor | 2026-01-05 |
| bike-lane-policy-order.md | Protected Bike Lane Extension — Mass Ave | 2026-02-23 |
| rent-stabilization-resolution.md | Resolution — Rent Stabilization Enabling Legislation | 2026-02-09 |
| green-new-deal-committee-report.md | Green New Deal Year Three Implementation | 2026-04-13 |
| school-committee-universal-prek.md | Universal Pre-K Expansion to Age Three | 2026-03-16 |
