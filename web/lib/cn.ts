export function cn(
  ...classes: (string | number | undefined | null | false)[]
): string {
  return classes.filter(Boolean).join(" ");
}
