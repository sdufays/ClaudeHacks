import { Eyebrow } from "@/components/design/eyebrow";
import { NavyHero } from "@/components/design/navy-hero";
import { TopicPill } from "@/components/design/topic-pill";
import { DigestList } from "@/components/chat/digest-list";
import { Chat } from "@/components/chat/chat";
import { SidebarClient } from "@/components/sidebar/sidebar-client";
import {
  COUNCIL_ITEMS,
  RELEVANCE_LINES,
  ACTIONS_BY_ITEM,
} from "@/lib/cambridge-data";

const relevanceMap = Object.fromEntries(
  RELEVANCE_LINES.map((r) => [r.itemId, r]),
);

const highRelevanceCount = RELEVANCE_LINES.filter((r) => r.score >= 0.7).length;

export default function DigestPage() {
  return (
    <div className="min-h-screen bg-mesh-light">
      <header className="border-b border-muted-light/10 bg-card-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-[1120px] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-serif text-xl font-bold text-headline-light tracking-tight">
              Civic Signal
            </span>
            <span className="font-sans text-xs text-muted-light">Cambridge</span>
          </div>
          <Eyebrow>Week of May 5, 2026</Eyebrow>
        </div>
      </header>

      <main className="mx-auto max-w-[1120px] px-6 py-10">
        <div className="flex flex-col-reverse gap-8 lg:flex-row lg:items-start lg:gap-12">
          <div className="flex-1 min-w-0 space-y-8">
            <NavyHero shape="card" className="p-10">
              <Eyebrow tone="dark">Tonight&rsquo;s Briefing</Eyebrow>
              <h1 className="mt-5 font-serif text-3xl leading-[1.1] text-headline-dark sm:text-4xl">
                This week in Cambridge &mdash; {COUNCIL_ITEMS.length} items,{" "}
                {highRelevanceCount}{" "}
                {highRelevanceCount === 1 ? "affects" : "affect"} you directly
              </h1>
              <p className="mt-4 max-w-xl font-sans text-sm leading-relaxed text-body-dark/80">
                Garden Street keeps its bike lanes 5&ndash;4, the Cambridge
                Street upzoning is final, and the city&rsquo;s first $1B budget
                heads to Finance Committee this week.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <TopicPill topic="housing" tone="dark" />
                <TopicPill topic="transit" tone="dark" />
                <TopicPill topic="zoning" tone="dark" />
                <TopicPill topic="climate" tone="dark" />
              </div>
            </NavyHero>

            <DigestList
              items={COUNCIL_ITEMS}
              relevanceMap={relevanceMap}
              actionsMap={ACTIONS_BY_ITEM}
            />

            <div className="bg-card-white rounded-card shadow-card-soft p-6 space-y-4">
              <div className="space-y-1">
                <h2 className="font-serif text-xl text-headline-light">
                  Ask about any item
                </h2>
                <p className="font-sans text-sm text-muted-light">
                  Every answer cites the source. We don&rsquo;t tell you what to think.
                </p>
              </div>
              <Chat />
            </div>
          </div>

          <div className="w-full lg:w-[320px] lg:shrink-0">
            <SidebarClient reactionCount={0} />
          </div>
        </div>
      </main>

      <footer className="mt-16 border-t border-muted-light/10 py-8">
        <div className="mx-auto max-w-[1120px] px-6 font-sans text-xs text-muted-light flex flex-col gap-1 sm:flex-row sm:justify-between">
          <span>Civic Signal &mdash; Cambridge, MA. We don&rsquo;t tell you how to vote.</span>
          <span>Data: Cambridge City Council public records.</span>
        </div>
      </footer>
    </div>
  );
}
