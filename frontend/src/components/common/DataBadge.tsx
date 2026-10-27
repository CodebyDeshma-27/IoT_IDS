import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type Tone = "demo" | "backend" | "pending" | "neutral";

const toneStyles: Record<Tone, string> = {
  demo: "border-warning/40 bg-warning/10 text-warning",
  backend: "border-info/40 bg-info/10 text-info",
  pending: "border-muted-foreground/30 bg-muted/40 text-muted-foreground",
  neutral: "border-border bg-secondary/60 text-secondary-foreground",
};

export function DataBadge({
  tone = "demo",
  label,
  hint,
  className,
}: {
  tone?: Tone;
  label: string;
  hint?: string;
  className?: string;
}) {
  const chip = (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-wide uppercase",
        toneStyles[tone],
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {label}
    </span>
  );

  if (!hint) return chip;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{chip}</TooltipTrigger>
      <TooltipContent className="max-w-64">{hint}</TooltipContent>
    </Tooltip>
  );
}
