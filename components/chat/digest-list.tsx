import type { Item, RelevanceLine, Action } from "@/lib/types/shared";
import { DigestItem } from "@/components/chat/digest-item";

interface DigestListProps {
  items: Item[];
  relevanceMap: Record<string, RelevanceLine>;
  actionsMap: Record<string, Action[]>;
}

export function DigestList({ items, relevanceMap, actionsMap }: DigestListProps) {
  // Sort by relevance score descending
  const sorted = [...items].sort((a, b) => {
    const ra = relevanceMap[a.id]?.score ?? 0;
    const rb = relevanceMap[b.id]?.score ?? 0;
    return rb - ra;
  });

  return (
    <section aria-label="This week's council activity">
      <div className="space-y-5">
        {sorted.map((item) => {
          const relevance = relevanceMap[item.id];
          if (!relevance) return null;
          return (
            <DigestItem
              key={item.id}
              item={item}
              relevance={relevance}
              actions={actionsMap[item.id]}
            />
          );
        })}
      </div>
    </section>
  );
}
