"use client";

import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { PRICING } from "@/lib/pricingData";
import type { ToolEntry, ToolId } from "@/types";

interface Props {
  entry: ToolEntry;
  onChange: (entry: ToolEntry) => void;
  onRemove: () => void;
}

const ALL_TOOLS = Object.values(PRICING);

export function ToolRow({ entry, onChange, onRemove }: Props) {
  const plans = PRICING[entry.toolId]?.plans ?? [];
  const currentPlan = plans.find((p) => p.planId === entry.plan);
  const isApi = currentPlan?.isApiPricing ?? false;

  function handleToolChange(toolId: ToolId) {
    const firstPlan = PRICING[toolId]?.plans[0];
    onChange({ ...entry, toolId, plan: firstPlan?.planId ?? "", seats: 1 });
  }

  function handlePlanChange(planId: string) {
    const plan = plans.find((p) => p.planId === planId);
    onChange({ ...entry, plan: planId, seats: plan?.isApiPricing ? 1 : entry.seats });
  }

  return (
    <div className="relative grid grid-cols-1 gap-3 rounded-xl border border-border bg-card p-4 sm:grid-cols-[1fr_1fr_140px_90px]">
      {/* Remove */}
      <button
        type="button"
        onClick={onRemove}
        aria-label="Remove tool"
        className="absolute right-3 top-3 rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      >
        <X className="h-4 w-4" />
      </button>

      {/* Tool */}
      <div className="space-y-1.5">
        <Label>Tool</Label>
        <Select
          value={entry.toolId}
          onChange={(e) => handleToolChange(e.target.value as ToolId)}
        >
          {ALL_TOOLS.map((t) => (
            <option key={t.toolId} value={t.toolId}>
              {t.name}
            </option>
          ))}
        </Select>
      </div>

      {/* Plan */}
      <div className="space-y-1.5">
        <Label>Plan</Label>
        <Select
          value={entry.plan}
          onChange={(e) => handlePlanChange(e.target.value)}
        >
          {plans.map((p) => (
            <option key={p.planId} value={p.planId}>
              {p.label}
              {p.pricePerSeat > 0 ? ` — $${p.pricePerSeat}/seat` : ""}
            </option>
          ))}
        </Select>
      </div>

      {/* Monthly spend */}
      <div className="space-y-1.5">
        <Label htmlFor={`spend-${entry.toolId}`}>Monthly spend ($)</Label>
        <Input
          id={`spend-${entry.toolId}`}
          type="number"
          min="0"
          step="1"
          placeholder="0"
          value={entry.monthlySpend === 0 ? "" : entry.monthlySpend}
          onChange={(e) =>
            onChange({ ...entry, monthlySpend: parseFloat(e.target.value) || 0 })
          }
        />
      </div>

      {/* Seats — hidden for API plans */}
      <div className="space-y-1.5">
        <Label htmlFor={`seats-${entry.toolId}`}>
          {isApi ? "Seats" : "Seats"}
        </Label>
        <Input
          id={`seats-${entry.toolId}`}
          type="number"
          min="1"
          step="1"
          placeholder="1"
          disabled={isApi}
          value={isApi ? 1 : entry.seats === 0 ? "" : entry.seats}
          onChange={(e) =>
            onChange({ ...entry, seats: parseInt(e.target.value) || 1 })
          }
          className={isApi ? "opacity-40 cursor-not-allowed" : ""}
        />
        {isApi && (
          <p className="text-xs text-muted-foreground">API pricing is usage-based</p>
        )}
      </div>
    </div>
  );
}
