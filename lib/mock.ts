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
    id: "cambridge-st-zoning-compromise",
    kind: "ordinance",
    title:
      "Cambridge Street zoning compromise passes 6–3 — Inman Square capped at 6 stories",
    date: "2026-01-26",
    summary:
      "After months of debate, the City Council adopted a compromise rezoning of the Cambridge Street corridor. Inman Square is capped at 6 stories, while parts of Webster Avenue, Windsor Street, and the Lechmere edge are upzoned to 10 and 12 stories. The 6–3 vote followed amendments narrowing the heaviest density to transit-adjacent parcels.",
    sourceUrl:
      "https://www.cambridgeday.com/2026/01/26/cambridge-street-zoning-compromise-passes/",
    meeting: "Regular City Council Meeting, January 26 2026",
    topics: ["housing", "zoning"],
  },
  {
    id: "garden-st-bike-lanes",
    kind: "policy_order",
    title:
      "Garden Street stays one-way with separated bike lanes (5–4)",
    date: "2026-04-27",
    summary:
      "The Council voted 5–4 to keep Garden Street one-way with the existing separated bike lanes intact. The vote rejects a proposal to restore two-way car traffic, citing safety data from the protected-lane pilot. Opponents had argued the one-way change strained side-street traffic and emergency response.",
    sourceUrl:
      "https://www.cambridgeday.com/2026/04/27/garden-street-bike-lanes-vote/",
    meeting: "Regular City Council Meeting, April 27 2026",
    topics: ["transit", "climate"],
  },
  {
    id: "transfer-fee-authority",
    kind: "policy_order",
    title:
      "Council asks Beacon Hill for real-estate transfer-fee authority (up to 2% on $1M+ sales)",
    date: "2026-03-02",
    summary:
      "The Council passed a home-rule petition requesting the state legislature grant Cambridge authority to levy a transfer fee of up to 2% on residential sales above $1 million. Revenue would flow to the city's Affordable Housing Trust. The petition now goes to Beacon Hill, where similar requests from other municipalities have stalled.",
    sourceUrl:
      "https://www.cambridgeday.com/2026/03/02/transfer-fee-home-rule-petition/",
    meeting: "Regular City Council Meeting, March 2 2026",
    topics: ["housing"],
  },
  {
    id: "fy27-budget-finance-committee",
    kind: "city_manager_item",
    title:
      "FY27 budget — Cambridge's first ~$1B budget heads to Finance Committee",
    date: "2026-04-27",
    summary:
      "The City Manager's proposed FY27 budget — the first to exceed $1 billion in Cambridge history — was referred to the Finance Committee for hearings. Headline line items include increased affordable-housing investment, expanded early-childcare funding, and homelessness response. The Finance Committee will hold public hearings before the council's adoption vote.",
    sourceUrl:
      "https://www.cambridgema.gov/news/2026/04/fy27-budget-finance-committee-referral",
    meeting: "Regular City Council Meeting, April 27 2026",
    topics: ["housing", "schools", "public_safety"],
  },
  {
    id: "parking-permit-fee-increase",
    kind: "policy_order",
    title: "Resident parking-permit fee jumps from $25 to $75 (7–2)",
    date: "2026-03-30",
    summary:
      "The Council voted 7–2 to triple the annual resident parking-permit fee from $25 to $75. Supporters described the prior fee as far below the cost of administering the program; opponents raised affordability concerns for households without off-street parking. Revenue is directed to the city's Traffic, Parking and Transportation department.",
    sourceUrl:
      "https://www.cambridgeday.com/2026/03/30/resident-parking-permits-jump/",
    meeting: "Regular City Council Meeting, March 30 2026",
    topics: ["transit"],
  },
  {
    id: "city-manager-ice-order",
    kind: "city_manager_item",
    title:
      "City Manager executive order: bars ICE activity on city property",
    date: "2026-02-05",
    summary:
      "The City Manager issued an executive order prohibiting Immigration and Customs Enforcement from conducting enforcement activity on Cambridge city-owned property without a judicial warrant. The order codifies long-standing administrative practice and aligns with the city's sanctuary-city ordinance.",
    sourceUrl:
      "https://www.cambridgema.gov/news/2026/02/city-manager-executive-order-ice",
    meeting: "Executive Order, February 5 2026",
    topics: ["civil_liberties", "public_safety"],
  },
];

// ---------- Relevance lines ----------

export const MOCK_RELEVANCE: RelevanceLine[] = [
  {
    itemId: "cambridge-st-zoning-compromise",
    score: 0.96,
    oneLiner:
      "Inman Square — your neighborhood — is the part capped at 6 stories. The buildings going up around you for the next decade are decided by this vote.",
  },
  {
    itemId: "garden-st-bike-lanes",
    score: 0.97,
    oneLiner:
      "Garden Street is on your bike route. The 5–4 vote keeps the protected lane you already use.",
  },
  {
    itemId: "transfer-fee-authority",
    score: 0.78,
    oneLiner:
      "As a renter, this matters indirectly — if Beacon Hill grants the authority, the new revenue would fund the Affordable Housing Trust that subsidizes rentals.",
  },
  {
    itemId: "fy27-budget-finance-committee",
    score: 0.85,
    oneLiner:
      "The budget touches almost every line item that affects your life — housing, transit, climate. Public hearings are open before adoption.",
  },
  {
    itemId: "parking-permit-fee-increase",
    score: 0.18,
    oneLiner:
      "You bike and don't have a car — this won't hit you directly. It will affect car-owning neighbors on your block.",
  },
  {
    itemId: "city-manager-ice-order",
    score: 0.55,
    oneLiner:
      "Sets policy on a city-wide value many residents care about — context rather than direct daily impact.",
  },
];

// ---------- Actions ----------

export const MOCK_ACTIONS: Record<string, Action[]> = {
  "cambridge-st-zoning-compromise": [
    {
      type: "comment",
      label: "Read the final ordinance text",
      url: "https://www.cambridgeday.com/2026/01/26/cambridge-street-zoning-compromise-passes/",
    },
  ],
  "garden-st-bike-lanes": [
    {
      type: "attend",
      label: "Ride the protected lane — bring feedback to the next council session",
      location: "Garden Street, between Mass Ave and Concord Ave",
    },
  ],
  "transfer-fee-authority": [
    {
      type: "contact",
      label: "Email your state delegation in support or opposition",
      url: "https://malegislature.gov/Search/FindMyLegislator",
    },
  ],
  "fy27-budget-finance-committee": [
    {
      type: "attend",
      label: "Speak at a Finance Committee budget hearing",
      location: "Cambridge City Hall, 795 Massachusetts Ave",
      url: "https://www.cambridgema.gov/Departments/citycouncil",
    },
  ],
  "city-manager-ice-order": [
    {
      type: "comment",
      label: "Read the full executive order",
      url: "https://www.cambridgema.gov/news/2026/02/city-manager-executive-order-ice",
    },
  ],
};
