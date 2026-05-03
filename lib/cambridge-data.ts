import type {
  Profile,
  Item,
  RelevanceLine,
  Action,
} from "@/lib/types/shared";

// SSR fallback profile. Real profile is read from localStorage on the client.
export const DEFAULT_PROFILE: Profile = {
  id: "default",
  name: "Alex",
  address: "23 Inman Street, Cambridge MA 02139",
  neighborhood: "Inman Square",
  housing: "rent",
  commute: "bike",
  household: "solo",
  issueTags: ["housing", "transit", "zoning"],
};

export const COUNCIL_ITEMS: Item[] = [
  {
    id: "cambridge-st-upzoning",
    kind: "ordinance",
    title: "Cambridge Street corridor zoning compromise passes 6–3",
    date: "2026-01-26",
    summary:
      "The Council approved a zoning petition for the Cambridge Street corridor by a 6–3 vote. Most of Inman Square stays capped at six stories, while selected parcels near Webster/Windsor and Lechmere can rise to twelve and ten stories respectively.",
    sourceUrl:
      "https://www.cambridgeday.com/2026/01/27/cambridge-street-compromise/",
    meeting: "Regular City Council Meeting, January 26 2026",
    topics: ["housing", "zoning"],
  },
  {
    id: "ice-executive-order",
    kind: "city_manager_item",
    title: "City Manager bars ICE activity on city property",
    date: "2026-02-05",
    summary:
      "City Manager Yi-An Huang signed an executive order barring city property from being used for federal civil immigration enforcement. The order reaffirms Cambridge's Welcoming Community Ordinance and directs police to protect residents' safety and constitutional rights.",
    sourceUrl:
      "https://www.cambridgema.gov/news/detail?path=%2Fsitecore%2Fcontent%2Fhome%2Fnews%2F2026%2F02%2Fcitymanagersignsexecutiveordermetromayorstoprotectresidentsandstandagainsticeactions",
    meeting: "Executive Order, February 5 2026",
    topics: ["civil_liberties", "public_safety"],
  },
  {
    id: "transfer-fee-petition",
    kind: "resolution",
    title: "Council asks state for real-estate transfer-fee authority",
    date: "2026-03-02",
    summary:
      "Council voted unanimously to submit a home-rule petition asking the Legislature to let Cambridge charge up to 2% on real estate transactions over $1 million. Revenue would fund affordable housing, though state approval is uncertain.",
    sourceUrl:
      "https://www.cambridgeday.com/2026/03/04/cambridge-real-estate-fee/",
    meeting: "Regular City Council Meeting, March 2 2026",
    topics: ["housing"],
  },
  {
    id: "parking-permit-fee",
    kind: "policy_order",
    title: "Resident parking permits set to jump from $25 to $75",
    date: "2026-03-30",
    summary:
      "Council voted 7–2 to ask the city manager to raise most resident parking permits from $25 to $75. The proposal adds a hardship discount and ends the blanket senior exemption; final changes still need to return to council before taking effect.",
    sourceUrl:
      "https://www.cambridgeday.com/2026/04/01/parking-pass-fee-increases/",
    meeting: "Regular City Council Meeting, March 30 2026",
    topics: ["transit"],
  },
  {
    id: "fy27-budget",
    kind: "city_manager_item",
    title: "FY27 budget — Cambridge's first $1B budget heads to Finance Committee",
    date: "2026-04-27",
    summary:
      "The City Manager submitted a proposed FY27 operating budget of about $1.03 billion. Council sent it to a second reading and Finance Committee hearings; schools, wages, infrastructure, climate resilience and transportation are the largest drivers.",
    sourceUrl:
      "https://www.cambridgema.gov/news/2026/04/cambridgecitymanageryianhuangsubmitsproposedfy27budgettocitycouncil",
    meeting: "Regular City Council Meeting, April 27 2026",
    topics: ["schools", "climate", "transit"],
  },
  {
    id: "garden-street-bike-lanes",
    kind: "policy_order",
    title: "Garden Street stays one-way with separated bike lanes",
    date: "2026-04-27",
    summary:
      "After heavy public comment, Council voted 5–4 to keep Garden Street one-way for most of its length with separated bike lanes on both sides. The vote reversed a prior move toward restoring two-way traffic and removing parking.",
    sourceUrl:
      "https://www.cambridgeday.com/2026/04/29/garden-street-tight-vote/",
    meeting: "Regular City Council Meeting, April 27 2026",
    topics: ["transit", "public_safety"],
  },
];

export const RELEVANCE_LINES: RelevanceLine[] = [
  {
    itemId: "cambridge-st-upzoning",
    score: 0.95,
    oneLiner:
      "This is your block. Most of Inman Square stays capped at six stories — but the Webster/Windsor parcels next to your bike route can now go to twelve.",
  },
  {
    itemId: "garden-street-bike-lanes",
    score: 0.92,
    oneLiner:
      "Direct hit on your commute. Garden Street keeps separated bike lanes both directions — the 5–4 vote means the protection holds for now.",
  },
  {
    itemId: "transfer-fee-petition",
    score: 0.85,
    oneLiner:
      "As a renter, this is the closest the city has come in years to a dedicated affordable-housing funding source — but Beacon Hill still has to approve it.",
  },
  {
    itemId: "fy27-budget",
    score: 0.78,
    oneLiner:
      "First $1B budget in city history. Climate resilience and transportation lines affect your commute; rental-assistance line items are inside the housing total.",
  },
  {
    itemId: "parking-permit-fee",
    score: 0.55,
    oneLiner:
      "You bike, so the fee doesn't hit you directly — but tripling the price changes who can afford to drive in your neighborhood.",
  },
  {
    itemId: "ice-executive-order",
    score: 0.4,
    oneLiner:
      "Doesn't tie to your block or commute, but reshapes how Cambridge police interact with federal agencies — worth knowing as a resident.",
  },
];

export const ACTIONS_BY_ITEM: Record<string, Action[]> = {
  "cambridge-st-upzoning": [
    {
      type: "comment",
      label: "Submit written comment to the Planning Board on implementation",
      url: "https://www.cambridgema.gov/Departments/communityDevelopment",
    },
    {
      type: "contact",
      label: "Contact your at-large councilors",
      url: "https://www.cambridgema.gov/citycouncil",
    },
  ],
  "garden-street-bike-lanes": [
    {
      type: "comment",
      label: "Comment to Traffic, Parking & Transportation",
      url: "https://www.cambridgema.gov/traffic",
    },
  ],
  "transfer-fee-petition": [
    {
      type: "contact",
      label: "Contact your state rep & senator on the home-rule petition",
      url: "https://malegislature.gov/Search/FindMyLegislator",
    },
  ],
  "fy27-budget": [
    {
      type: "attend",
      label: "Speak at the FY27 Finance Committee budget hearing",
      date: "2026-05-06",
      location: "Cambridge City Hall, 795 Massachusetts Ave — 6pm",
      url: "https://www.cambridgema.gov/citycouncil",
    },
    {
      type: "attend",
      label: "Second budget hearing",
      date: "2026-05-12",
      location: "Cambridge City Hall — 9am",
    },
  ],
  "parking-permit-fee": [
    {
      type: "attend",
      label: "Attend the next council meeting before the final fee vote",
      url: "https://www.cambridgema.gov/citycouncil",
    },
  ],
  "ice-executive-order": [
    {
      type: "contact",
      label: "Read the executive order in full",
      url: "https://www.cambridgema.gov/news/detail?path=%2Fsitecore%2Fcontent%2Fhome%2Fnews%2F2026%2F02%2Fcitymanagersignsexecutiveordermetromayorstoprotectresidentsandstandagainsticeactions",
    },
  ],
};
