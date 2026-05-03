import type { IssueTag } from "@/lib/types/shared";
import { TOPIC_COLORS, TOPIC_LABEL } from "@/lib/topics";
import { cn } from "@/lib/cn";

interface TopicPillProps {
  topic: IssueTag;
  tone?: "light" | "dark";
  className?: string;
}

/**
 * Capsule chip in a topic color: bg = color @ 12% alpha, text = full color.
 */
export function TopicPill({ topic, tone = "light", className }: TopicPillProps) {
  const c = TOPIC_COLORS[topic];
  const color = tone === "dark" ? c.dark : c.light;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-sans font-bold uppercase",
        "px-3 py-1 text-[11px] tracking-[1.4px]",
        className,
      )}
      style={{
        backgroundColor: `${color}1F`, // ~12% alpha
        color,
      }}
    >
      {TOPIC_LABEL[topic]}
    </span>
  );
}
