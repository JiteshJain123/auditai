"use client";

import { useRouter } from "next/navigation";
import { Plus, Loader2 } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useAudit } from "@/hooks/useAudit";
import { ToolRow } from "./ToolRow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { PRICING } from "@/lib/pricingData";
import type { AuditInput, ToolEntry, UseCase } from "@/types";

interface FormState {
  tools: ToolEntry[];
  teamSize: number;
  useCase: UseCase;
}

const INITIAL_STATE: FormState = { tools: [], teamSize: 5, useCase: "coding" };

function defaultTool(): ToolEntry {
  const firstId = Object.keys(PRICING)[0] as ToolEntry["toolId"];
  return {
    toolId: firstId,
    plan: PRICING[firstId].plans[0].planId,
    monthlySpend: 0,
    seats: 1,
  };
}

const USE_CASE_LABELS: Record<UseCase, string> = {
  coding: "Coding",
  writing: "Writing",
  data: "Data analysis",
  research: "Research",
  mixed: "Mixed",
};

export function SpendForm() {
  const router = useRouter();
  const [form, setForm] = useLocalStorage<FormState>("audit-form-v1", INITIAL_STATE);
  const { loading, error, runAudit } = useAudit();

  function addTool() {
    setForm({ ...form, tools: [...form.tools, defaultTool()] });
  }

  function updateTool(index: number, updated: ToolEntry) {
    setForm({ ...form, tools: form.tools.map((t, i) => (i === index ? updated : t)) });
  }

  function removeTool(index: number) {
    setForm({ ...form, tools: form.tools.filter((_, i) => i !== index) });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.tools.length === 0) return;

    const input: AuditInput = {
      tools: form.tools,
      teamSize: form.teamSize,
      useCase: form.useCase,
    };

    const result = await runAudit(input);
    if (result?.auditId) {
      router.push(`/audit/${result.auditId}`);
    }
  }

  const canSubmit = form.tools.length > 0 && !loading;

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Tool list */}
      <div className="space-y-3 mb-4">
        {form.tools.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-10 text-center">
            <p className="text-sm text-muted-foreground mb-3">
              No tools added yet. Add the AI tools your team pays for.
            </p>
            <Button type="button" variant="outline" size="sm" onClick={addTool}>
              <Plus className="h-4 w-4 mr-1.5" />
              Add your first tool
            </Button>
          </div>
        ) : (
          <>
            {form.tools.map((tool, i) => (
              <ToolRow
                key={i}
                entry={tool}
                onChange={(updated) => updateTool(i, updated)}
                onRemove={() => removeTool(i)}
              />
            ))}
            <Button type="button" variant="outline" size="sm" onClick={addTool}>
              <Plus className="h-4 w-4 mr-1.5" />
              Add another tool
            </Button>
          </>
        )}
      </div>

      {/* Team context */}
      {form.tools.length > 0 && (
        <div className="mt-8 pt-6 border-t border-border">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
            About your team
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-sm">
            <div className="space-y-1.5">
              <Label htmlFor="teamSize">Team size</Label>
              <Input
                id="teamSize"
                type="number"
                min="1"
                max="10000"
                value={form.teamSize}
                onChange={(e) =>
                  setForm({ ...form, teamSize: parseInt(e.target.value) || 1 })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="useCase">Primary use case</Label>
              <Select
                id="useCase"
                value={form.useCase}
                onChange={(e) =>
                  setForm({ ...form, useCase: e.target.value as UseCase })
                }
              >
                {(Object.keys(USE_CASE_LABELS) as UseCase[]).map((key) => (
                  <option key={key} value={key}>
                    {USE_CASE_LABELS[key]}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="mt-4 text-sm text-destructive rounded-md bg-destructive/10 px-3 py-2">
          {error}
        </p>
      )}

      {/* Submit */}
      {form.tools.length > 0 && (
        <div className="mt-8">
          <Button type="submit" disabled={!canSubmit} size="lg" className="w-full sm:w-auto px-10">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analysing your stack…
              </>
            ) : (
              "Run my free audit →"
            )}
          </Button>
          <p className="mt-2 text-xs text-muted-foreground">
            No sign-up required. Results in under 5 seconds.
          </p>
        </div>
      )}
    </form>
  );
}
