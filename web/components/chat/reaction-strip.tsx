"use client";

import { useState } from "react";
import type { ReactionKind } from "@/lib/types/shared";
import { cn } from "@/lib/cn";

interface ReactionStripProps {
  itemId: string;
}

const REACTIONS: { kind: ReactionKind; label: string }[] = [
  { kind: "support", label: "Support" },
  { kind: "oppose", label: "Oppose" },
  { kind: "unsure", label: "Unsure" },
  { kind: "want_more_info", label: "Want more info" },
];

const REACTION_COLORS: Record<ReactionKind, string> = {
  support: "#297A5C",
  oppose: "#943347",
  unsure: "#8F6B24",
  want_more_info: "#24578F",
};

export function ReactionStrip({ itemId }: ReactionStripProps) {
  const [selected, setSelected] = useState<ReactionKind | null>(null);

  function handleSelect(kind: ReactionKind) {
    setSelected((prev) => (prev === kind ? null : kind));
  }

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="React to this item">
      {REACTIONS.map(({ kind, label }) => {
        const isSelected = selected === kind;
        const color = REACTION_COLORS[kind];
        return (
          <button
            key={kind}
            onClick={() => handleSelect(kind)}
            aria-pressed={isSelected}
            className={cn(
              "inline-flex items-center rounded-full px-3 py-1",
              "font-sans text-[12px] font-bold uppercase tracking-[1.2px]",
              "border transition-all duration-150 cursor-pointer",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
            )}
            style={
              isSelected
                ? {
                    backgroundColor: color,
                    borderColor: color,
                    color: "#FFFFFF",
                  }
                : {
                    backgroundColor: `${color}1A`,
                    borderColor: `${color}40`,
                    color,
                  }
            }
          >
            {label}
          </button>
        );
      })}
      {selected && (
        <span
          className="self-center font-sans text-[11px] text-muted-light"
          aria-live="polite"
        >
          Recorded — your view is shared with council.
        </span>
      )}
    </div>
  );
}
