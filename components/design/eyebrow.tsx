import { cn } from "@/lib/cn";

interface EyebrowProps {
  children: React.ReactNode;
  /** Visual surface this eyebrow sits on. Picks the dot + text color. */
  tone?: "light" | "dark";
  className?: string;
}

/**
 * Editorial eyebrow: small accent dot + uppercase, kerned label.
 * The single most recognizable Inloopd-style motif.
 */
export function Eyebrow({ children, tone = "light", className }: EyebrowProps) {
  const isDark = tone === "dark";
  return (
    <div
      className={cn(
        "flex items-center gap-2.5 font-sans font-bold uppercase",
        "text-[13px] tracking-[1.6px]",
        isDark ? "text-[#F5F7FC]/70" : "text-muted-light",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "inline-block h-2 w-2 rounded-full",
          isDark ? "bg-accent-brand-dark" : "bg-accent-brand-light",
        )}
      />
      <span>{children}</span>
    </div>
  );
}
