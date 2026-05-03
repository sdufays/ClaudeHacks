/**
 * Mock data for the UI — Cambridge demo persona + council items.
 * UI-local; not exported from lib/types/shared.ts.
 */

import type {
  Profile,
  Item,
  RelevanceLine,
  Action,
} from "@/lib/types/shared";

// ---------- Demo profile ----------

export const DEMO_PROFILE: Profile = {
  id: "demo-user-1",
  name: "Alex",
  address: "23 Inman Street, Cambridge MA 02139",
  neighborhood: "Inman Square",
  housing: "rent",
  commute: "bike",
  household: "solo",
  issueTags: ["housing", "transit", "climate"],
};

// ---------- Council items ----------

export const MOCK_ITEMS: Item[] = [
  {
    id: "fy27-budget",
    kind: "city_manager_item",
    title: "FY27 Budget Proposal — Cambridge's first billion-dollar city budget",
    date: "2026-04-29",
    summary:
      "City Manager Yi-An Huang submitted Cambridge's first-ever budget exceeding $1 billion. The proposal includes $51 million for affordable housing programs, $16 million to address homelessness, and $5 million for early childcare (ages below Universal Pre-K eligibility). Public hearings are scheduled before the June 1 adoption vote.",
    sourceUrl:
      "https://www.cambridgema.gov/news/2026/04/cambridgecitymanageryianhuangsubmitsproposedfy27budgettocitycouncil",
    meeting: "City Manager Submission, April 29 2026",
    topics: ["housing", "transit", "schools"],
  },
  {
    id: "cambridge-st-upzoning",
    kind: "policy_order",
    title: "Cambridge Street upzoning passes 6-3",
    date: "2026-01-27",
    summary:
      "The City Council voted 6-3 to allow six-story buildings along Cambridge Street from Inman Square to Lechmere, a direct follow-on to the February 2025 multifamily zoning reform. Proponents cited the need for transit-oriented housing density; opponents raised concerns about neighborhood character and displacement.",
    sourceUrl:
      "https://www.thecrimson.com/article/2026/1/27/cambridge-street-height-increase/",
    meeting: "Regular City Council Meeting, January 27 2026",
    topics: ["housing", "zoning", "transit"],
  },
  {
    id: "sanctuary-city-amendments",
    kind: "ordinance",
    title: "Sanctuary-city ordinance amendments adopted unanimously",
    date: "2026-04-28",
    summary:
      "The Council unanimously adopted amendments strengthening Cambridge's sanctuary-city ordinance, barring city employees and resources from assisting federal immigration enforcement on city property. The amendments codify and expand existing administrative policy.",
    sourceUrl:
      "https://www.thecrimson.com/article/2026/4/28/sanctuary-city-amendments-adopted/",
    meeting: "Regular City Council Meeting, April 28 2026",
    topics: ["civil_liberties", "public_safety"],
  },
  {
    id: "x-ban",
    kind: "policy_order",
    title: "City departments banned from posting on X (formerly Twitter)",
    date: "2026-03-03",
    summary:
      "The Council passed a policy order directing all Cambridge city departments to cease official use of X (formerly Twitter), citing concerns about the platform's moderation policies and misinformation. Departments may migrate public communications to alternative platforms.",
    sourceUrl:
      "https://www.thecrimson.com/article/2026/3/3/cambridge-x-ban-vote/",
    meeting: "Regular City Council Meeting, March 3 2026",
    topics: ["civil_liberties", "small_business"],
  },
  {
    id: "multifamily-zoning-report",
    kind: "committee_report",
    title: "One year after the multifamily zoning overhaul — accountability report",
    date: "2026-03-26",
    summary:
      "A committee report reviewed the first year of Cambridge's 2025 multifamily zoning reform. The report documents new building permit applications by neighborhood, identifies areas where the reform has had limited uptake, and recommends further process improvements.",
    sourceUrl:
      "https://www.thecrimson.com/article/2026/3/26/cambridge-housing-development-report/",
    meeting: "Housing Committee Report, March 26 2026",
    topics: ["housing", "zoning"],
  },
  {
    id: "mayor-siddiqui",
    kind: "communication",
    title: "Mayor Sumbul Siddiqui sworn in as Cambridge's 2026 mayor",
    date: "2026-01-05",
    summary:
      "Councillor Sumbul Siddiqui was elected mayor by the newly sworn-in City Council, continuing her tenure as the first person of color elected to the office. The new council composition reflects the November 2025 ranked-choice results.",
    sourceUrl:
      "https://www.cambridgeday.com/2026/01/05/city-council-sworn-in-siddiqui-mayor/",
    meeting: "City Council Inaugural Meeting, January 5 2026",
    topics: ["public_safety", "civil_liberties"],
  },
];

// ---------- Relevance lines ----------

export const MOCK_RELEVANCE: RelevanceLine[] = [
  {
    itemId: "fy27-budget",
    score: 0.95,
    oneLiner:
      "As a renter, the $51M affordable housing line directly affects the rental market you live in — and the May 6 hearing at 6pm is open for public comment.",
  },
  {
    itemId: "cambridge-st-upzoning",
    score: 0.88,
    oneLiner:
      "This runs along your bike commute route through Inman Square — taller buildings will reshape the street and may bring new bike infrastructure.",
  },
  {
    itemId: "sanctuary-city-amendments",
    score: 0.45,
    oneLiner:
      "Affects city policy on public safety resources — relevant context even if not tied directly to your commute or housing.",
  },
  {
    itemId: "x-ban",
    score: 0.3,
    oneLiner:
      "Changes how city departments communicate publicly — worth knowing as a resident who tracks local news.",
  },
  {
    itemId: "multifamily-zoning-report",
    score: 0.75,
    oneLiner:
      "Tracks whether the 2025 zoning reform is actually producing housing in your neighborhood — directly relevant as a renter in Inman Square.",
  },
  {
    itemId: "mayor-siddiqui",
    score: 0.5,
    oneLiner:
      "Sets the council's leadership and priorities for the year — context for everything else on this digest.",
  },
];

// ---------- Actions ----------

export const MOCK_ACTIONS: Record<string, Action[]> = {
  "fy27-budget": [
    {
      type: "attend",
      label: "Speak at the FY27 budget public hearing",
      date: "2026-05-06",
      location: "Cambridge City Hall, 795 Massachusetts Ave — 6pm",
      url: "https://www.cambridgema.gov/news/2026/04/cambridgecitymanageryianhuangsubmitsproposedfy27budgettocitycouncil",
    },
    {
      type: "attend",
      label: "Second budget hearing",
      date: "2026-05-12",
      location: "Cambridge City Hall — 9am",
    },
  ],
  "cambridge-st-upzoning": [
    {
      type: "comment",
      label: "Submit written comment to the Planning Board",
      url: "https://www.cambridgema.gov/Departments/communityDevelopment",
    },
  ],
};
