import type { IssueTag } from "@/lib/types/shared";
import { TOPIC_COLORS } from "@/lib/topics";
import { cn } from "@/lib/cn";

interface AccentStripeProps {
  children: React.ReactNode;
  /** Topic colors the 4pt bar. Omit for the default brand-accent navy. */
  topic?: IssueTag;
  tone?: "light" | "dark";
  className?: string;
}

/**
 * Magazine-style story block: a 4px vertical bar flush against the left edge.
 * Cheap, distinctive, very on-brand.
 */
export function AccentStripe({
  children,
  topic,
  tone = "light",
  className,
}: AccentStripeProps) {
  const stripeColor = topic
    ? tone === "dark"
      ? TOPIC_COLORS[topic].dark
      : TOPIC_COLORS[topic].light
    : tone === "dark"
      ? "#619EDB"
      : "#304D63";

  return (
    <div className={cn("flex items-stretch gap-5", className)}>
      <div
        aria-hidden
        className="w-[4px] shrink-0 rounded-full"
        style={{ backgroundColor: stripeColor }}
      />
      <div className="flex-1">{children}</div>
    </div>
  );
}
