import { cn } from "@/lib/cn";

interface NavyHeroProps {
  children: React.ReactNode;
  /** "card" = rounded with shadow; "bleed" = full-bleed no radius */
  shape?: "card" | "bleed";
  className?: string;
}

/**
 * Midnight-navy hero block. The signature surface.
 * Use for hero sections, primary CTAs, the "today's briefing" card.
 */
export function NavyHero({ children, shape = "card", className }: NavyHeroProps) {
  return (
    <div
      className={cn(
        "bg-navy-gradient text-headline-dark",
        shape === "card" && "rounded-hero shadow-card-lift",
        "border border-white/[0.06]",
        className,
      )}
    >
      {children}
    </div>
  );
}
