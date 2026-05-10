import { TrendingDown, CheckCircle2, Sparkles } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { ShareButton } from "./ShareButton";

interface Props {
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  isAlreadyOptimal: boolean;
  toolCount: number;
  teamSize: number;
}

export function ResultsHero({
  totalMonthlySavings,
  totalAnnualSavings,
  isAlreadyOptimal,
  toolCount,
  teamSize,
}: Props) {
  if (isAlreadyOptimal) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-100">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
          <div className="flex-1">
            <span className="text-xs font-semibold uppercase tracking-widest text-green-600 mb-1 block">
              Stack optimized
            </span>
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              You&apos;re spending well.
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              No significant savings found across {toolCount} tool{toolCount !== 1 ? "s" : ""} for
              your {teamSize}-person team. Your current plans are well-matched to your use case.
            </p>
          </div>
          <ShareButton />
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 via-emerald-50/60 to-white p-8 overflow-hidden shadow-sm">
      <div className="pointer-events-none absolute -top-10 -right-10 h-48 w-48 rounded-full bg-green-400/15 blur-3xl" />

      <div className="relative flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600 text-white shadow-sm">
              <TrendingDown className="h-4 w-4" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-green-700">
              Savings identified
            </span>
          </div>

          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-5xl sm:text-6xl font-bold tracking-tight text-green-700">
              {formatCurrency(totalMonthlySavings)}
            </span>
            <span className="text-xl text-green-600 font-semibold">/mo</span>
          </div>

          <p className="text-green-600 font-semibold text-lg mb-4">
            {formatCurrency(totalAnnualSavings)}/year
          </p>

          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 border border-green-200 px-3 py-1 text-xs font-medium text-green-700">
              <Sparkles className="h-3 w-3" />
              {toolCount} tool{toolCount !== 1 ? "s" : ""} audited
            </span>
            <span className="inline-flex items-center rounded-full bg-green-100 border border-green-200 px-3 py-1 text-xs font-medium text-green-700">
              {teamSize}-person team
            </span>
          </div>
        </div>

        <div className="shrink-0">
          <ShareButton />
        </div>
      </div>
    </div>
  );
}
