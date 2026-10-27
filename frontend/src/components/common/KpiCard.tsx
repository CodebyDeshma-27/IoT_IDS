import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function KpiCard({
  label,
  value,
  unit,
  hint,
  icon: Icon,
  tone = "default",
  footnote,
}: {
  label: string;
  value: string;
  unit?: string;
  hint?: string;
  icon?: LucideIcon;
  tone?: "default" | "positive" | "warning" | "danger";
  footnote?: string;
}) {
  const toneText = {
    default: "text-foreground",
    positive: "text-success",
    warning: "text-warning",
    danger: "text-destructive",
  }[tone];

  const body = (
    <div className="panel group relative overflow-hidden p-4">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{label}</p>
        {Icon ? <Icon className="size-4 shrink-0 text-primary/80" aria-hidden /> : null}
      </div>
      <p className={cn("num mt-3 text-2xl font-semibold", toneText)}>
        {value}
        {unit ? <span className="ml-1 text-sm text-muted-foreground">{unit}</span> : null}
      </p>
      {footnote ? <p className="mt-1.5 text-[11px] text-muted-foreground">{footnote}</p> : null}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
    </div>
  );

  if (!hint) return body;
  return (
    <Tooltip>
      <TooltipTrigger asChild>{body}</TooltipTrigger>
      <TooltipContent className="max-w-64">{hint}</TooltipContent>
    </Tooltip>
  );
}
