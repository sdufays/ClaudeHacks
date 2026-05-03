export interface ChatReply {
  id: string;
  prompt: string;
  matchers: string[];
  reply: string;
  sources: { itemId: string; title: string; url: string }[];
}

export const CHAT_REPLIES: ChatReply[] = [
  {
    id: "garden-street-controversy",
    prompt: "Why is the Garden Street bike-lane vote controversial?",
    matchers: ["garden", "bike lane", "5-4", "5–4", "controversial"],
    reply:
      "The 5–4 vote split the council along a familiar fault line. Supporters argued the separated lanes are working: collisions on Garden Street have dropped since installation, and reverting to two-way traffic would mean removing the protection bicyclists rely on between Porter and Harvard Squares [1]. Opponents — backed by a packed public-comment session — argued the one-way design pushes through-traffic onto neighboring residential streets and that some elderly and disabled residents have lost convenient parking. The motion to keep the current configuration passed 5–4 [1]; a prior motion moving toward two-way traffic had been on the table earlier in the spring, which is why this vote is being read as a reversal rather than a new policy.",
    sources: [
      {
        itemId: "garden-street-bike-lanes",
        title: "Garden Street stays one-way with separated bike lanes",
        url: "https://www.cambridgeday.com/2026/04/29/garden-street-tight-vote/",
      },
    ],
  },
  {
    id: "cambridge-st-block-impact",
    prompt: "What does the Cambridge Street upzoning mean for my block?",
    matchers: ["cambridge street", "upzoning", "my block", "inman", "six stor", "12 stor", "twelve stor"],
    reply:
      "The compromise that passed 6–3 on January 26 keeps most of Inman Square — including the residential blocks around Inman Street — capped at six stories [1]. The taller envelopes (twelve stories near Webster/Windsor, ten stories near Lechmere) apply to specific parcels along the corridor, not to the side streets. So for your block specifically: the existing scale stays, but you should expect more six-story projects along Cambridge Street itself over the next several years, and the two taller-allowed nodes will likely see large mixed-use proposals first. Proponents framed this as transit-oriented density; opponents on the council raised displacement and neighborhood-character concerns and voted no [1]. The Planning Board still reviews each individual project, and that's where block-level objections (shadow, traffic, parking) get heard.",
    sources: [
      {
        itemId: "cambridge-st-upzoning",
        title: "Cambridge Street corridor zoning compromise passes 6–3",
        url: "https://www.cambridgeday.com/2026/01/27/cambridge-street-compromise/",
      },
    ],
  },
  {
    id: "transfer-fee-feasibility",
    prompt: "Can the city actually charge a real-estate transfer fee?",
    matchers: ["transfer fee", "real estate", "real-estate", "home rule", "home-rule", "beacon hill", "2%"],
    reply:
      "Not yet — and not without Beacon Hill. The unanimous March 2 vote was a home-rule petition, which means Cambridge is asking the state Legislature for permission to charge up to 2% on real-estate transactions over $1 million [1]. Under Massachusetts law, cities can't impose new taxes on real-estate transfers without that state authorization. Several other Massachusetts municipalities (including Boston, Somerville, and Provincetown) have filed similar petitions in recent years; none have been signed into law. So the realistic timeline is: the petition sits with the Legislature, gets bundled with a broader housing bill or stalls, and only then does it come back to Cambridge for implementation [1]. Supporters see it as the only meaningful new affordable-housing revenue source on the table; critics — including some real-estate trade groups — argue it would slow high-end transactions and could push costs down to buyers.",
    sources: [
      {
        itemId: "transfer-fee-petition",
        title: "Council asks state for real-estate transfer-fee authority",
        url: "https://www.cambridgeday.com/2026/03/04/cambridge-real-estate-fee/",
      },
    ],
  },
];

const FALLBACK_REPLY = `I can answer in detail about three items in this week's briefing — pick a suggested question above to ask about the Garden Street bike-lane vote, the Cambridge Street upzoning, or the real-estate transfer-fee petition.`;

export function findReply(question: string): ChatReply | null {
  const q = question.toLowerCase();
  let best: { reply: ChatReply; hits: number } | null = null;
  for (const r of CHAT_REPLIES) {
    const hits = r.matchers.filter((m) => q.includes(m.toLowerCase())).length;
    if (hits > 0 && (!best || hits > best.hits)) best = { reply: r, hits };
  }
  return best?.reply ?? null;
}

export function fallbackReply(): string {
  return FALLBACK_REPLY;
}
