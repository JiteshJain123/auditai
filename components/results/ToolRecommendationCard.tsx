import { ArrowRight, CheckCircle2 } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { PRICING } from "@/lib/pricingData";
import type { ToolRecommendation } from "@/types";

interface Props {
  rec: ToolRecommendation;
}

const ACTION_CONFIG = {
  downgrade: { label: "Downgrade available", className: "bg-green-100 text-green-800" },
  switch:    { label: "Better alternative",  className: "bg-blue-100 text-blue-800"  },
  credits:   { label: "Credex credits",      className: "bg-purple-100 text-purple-800" },
  optimal:   { label: "Optimized",           className: "bg-muted text-muted-foreground" },
} as const;

function getRecommendedLabel(rec: ToolRecommendation): string {
  if (rec.recommendedAction === "optimal") return "Already optimal";
  if (rec.recommendedAction === "credits") return "Credex credits";

  const targetToolId = rec.recommendedTool ?? rec.toolId;
  const toolName = PRICING[targetToolId]?.name ?? targetToolId;
  const planLabel =
    PRICING[targetToolId]?.plans.find((p) => p.planId === rec.recommendedPlan)?.label ??
    rec.recommendedPlan ?? "";

  if (rec.recommendedAction === "switch") return `${toolName} ${planLabel}`;
  return planLabel;
}

function getCurrentPlanLabel(rec: ToolRecommendation): string {
  return (
    PRICING[rec.toolId]?.plans.find((p) => p.planId === rec.currentPlan)?.label ??
    rec.currentPlan
  );
}

export function ToolRecommendationCard({ rec }: Props) {
  const hasSavings = rec.monthlySavings > 0;
  const cfg = ACTION_CONFIG[rec.recommendedAction];

  return (
    <div className="flex rounded-xl border border-border bg-card overflow-hidden">
      {/* Left accent bar — green for savings, invisible for optimal */}
      <div className={cn("w-1 shrink-0", hasSavings ? "bg-green-500" : "bg-transparent")} />

      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3">
          <div>
            <h3 className="font-semibold text-base">{rec.toolName}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Current: {getCurrentPlanLabel(rec)}
            </p>
          </div>
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium shrink-0 ml-3",
              cfg.className
            )}
          >
            {cfg.label}
          </span>
        </div>

        {/* Spend row */}
        <div className="flex items-center gap-3 px-5 py-3 bg-muted/40 text-sm flex-wrap">
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">Current</p>
            <p className="font-semibold">
              {formatCurrency(rec.currentSpend)}
              <span className="font-normal text-muted-foreground">/mo</span>
            </p>
          </div>

          <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />

          <div>
            <p className="text-xs text-muted-foreground mb-0.5">
              {rec.recommendedAction === "optimal" ? "Keep as-is" : getRecommendedLabel(rec)}
            </p>
            <p className={cn("font-semibold", hasSavings && "text-green-700")}>
              {formatCurrency(rec.projectedSpend)}
              <span className="font-normal text-muted-foreground">/mo</span>
            </p>
          </div>

          {hasSavings ? (
            <div className="ml-auto text-right">
              <p className="text-xs text-muted-foreground mb-0.5">You save</p>
              <p className="font-bold text-green-700">
                {formatCurrency(rec.monthlySavings)}/mo
              </p>
              <p className="text-xs text-green-600">
                {formatCurrency(rec.monthlySavings * 12)}/yr
              </p>
            </div>
          ) : (
            <div className="ml-auto flex items-center gap-1 text-muted-foreground text-xs">
              <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
              Well optimized
            </div>
          )}
        </div>

        {/* Reason */}
        <p className="px-5 py-3 text-sm text-muted-foreground leading-relaxed">
          {rec.reason}
        </p>
      </div>
    </div>
  );
}
