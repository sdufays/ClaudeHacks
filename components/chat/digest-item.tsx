import type { Item, RelevanceLine, Action } from "@/lib/types/shared";
import { AccentStripe } from "@/components/design/accent-stripe";
import { Eyebrow } from "@/components/design/eyebrow";
import { TopicPill } from "@/components/design/topic-pill";
import { ReactionStrip } from "@/components/chat/reaction-strip";

const KIND_LABEL: Record<string, string> = {
  policy_order: "Policy Order",
  city_manager_item: "City Manager Item",
  resolution: "Resolution",
  ordinance: "Ordinance",
  committee_report: "Committee Report",
  ballot_question: "Ballot Question",
  communication: "Communication",
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

interface DigestItemProps {
  item: Item;
  relevance: RelevanceLine;
  actions?: Action[];
}

export function DigestItem({ item, relevance, actions }: DigestItemProps) {
  const primaryTopic = item.topics?.[0];

  return (
    <article className="bg-card-white rounded-card shadow-card-soft overflow-hidden">
      <AccentStripe topic={primaryTopic} className="p-6 pb-5">
        <div className="space-y-3">
          {/* Eyebrow */}
          <Eyebrow>
            {KIND_LABEL[item.kind] ?? item.kind} &middot; {formatDate(item.date)}
          </Eyebrow>

          {/* Headline */}
          <h2 className="font-serif text-xl leading-snug text-headline-light">
            {item.title}
          </h2>

          {/* Personal relevance line */}
          <p className="font-sans text-sm leading-relaxed text-body-light border-l-2 border-accent-brand-light/30 pl-3 italic">
            {relevance.oneLiner}
          </p>

          {/* Summary (if present) */}
          {item.summary && (
            <p className="font-sans text-sm leading-relaxed text-muted-light">
              {item.summary}
            </p>
          )}

          {/* Actions */}
          {actions && actions.length > 0 && (
            <div className="space-y-2 pt-1">
              {actions.map((action, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="mt-0.5 inline-block h-2 w-2 shrink-0 rounded-full bg-accent-brand-light" />
                  <div className="font-sans text-xs leading-relaxed text-body-light">
                    <span className="font-bold uppercase tracking-wide text-[10px] text-accent-brand-light mr-1.5">
                      {action.type}
                    </span>
                    {action.label}
                    {action.date && (
                      <span className="text-muted-light">
                        {" "}— {formatDate(action.date)}
                        {action.location && `, ${action.location}`}
                      </span>
                    )}
                    {action.url && (
                      <a
                        href={action.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-1.5 text-accent-brand-light underline underline-offset-2"
                      >
                        Details
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footer row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-muted-light/10">
            <div className="flex flex-wrap gap-1.5">
              {item.topics?.map((topic) => (
                <TopicPill key={topic} topic={topic} />
              ))}
            </div>
            {item.sourceUrl && (
              <a
                href={item.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-[11px] text-muted-light underline underline-offset-2 hover:text-body-light transition-colors"
              >
                Source
              </a>
            )}
          </div>

          {/* Reaction strip */}
          <div className="pt-2">
            <ReactionStrip itemId={item.id} />
          </div>
        </div>
      </AccentStripe>
    </article>
  );
}
