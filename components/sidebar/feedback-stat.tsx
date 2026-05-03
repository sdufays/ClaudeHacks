"use client";

interface FeedbackStatProps {
  reactionCount: number;
}

export function FeedbackStat({ reactionCount }: FeedbackStatProps) {
  return (
    <div className="rounded-card bg-card-white shadow-card-soft p-5 space-y-1">
      <p className="font-sans text-[11px] uppercase tracking-wide font-bold text-muted-light">
        Your activity this week
      </p>
      <p className="font-serif text-2xl text-headline-light">
        {reactionCount}
      </p>
      <p className="font-sans text-xs text-muted-light leading-snug">
        {reactionCount === 1 ? "reaction" : "reactions"} sent to council this week
      </p>
    </div>
  );
}
