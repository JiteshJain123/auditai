import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getSupabaseAdmin } from "@/lib/supabase";
import { formatCurrency } from "@/lib/utils";
import { ResultsHero } from "@/components/results/ResultsHero";
import { AiSummaryCard } from "@/components/results/AiSummaryCard";
import { ToolRecommendationCard } from "@/components/results/ToolRecommendationCard";
import { CredexCTA } from "@/components/results/CredexCTA";
import { LeadCaptureForm } from "@/components/lead/LeadCaptureForm";
import type { AuditResult } from "@/types";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const db = getSupabaseAdmin();
  const { data } = await db.from("audits").select("result").eq("id", id).single();
  if (!data) return { title: "Audit not found — AuditAI" };

  const savings: number = data.result?.totalMonthlySavings ?? 0;
  const title =
    savings > 0
      ? `AI Spend Audit — ${formatCurrency(savings)}/mo in savings found`
      : "AI Spend Audit — Your stack is optimized";
  const description =
    savings > 0
      ? `This team could save ${formatCurrency(savings)}/month on AI tools. See the full breakdown.`
      : "AI spend audit complete. No significant savings found — this team is spending efficiently.";

  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function PublicAuditPage({ params }: Props) {
  const { id } = await params;
  const db = getSupabaseAdmin();
  const { data } = await db.from("audits").select("result").eq("id", id).single();

  if (!data) notFound();

  const result = data.result as AuditResult;
  const { recommendations, totalMonthlySavings, totalAnnualSavings, isAlreadyOptimal, aiSummary, input } = result;

  const savingsRecs = recommendations.filter((r) => r.monthlySavings > 0);
  const optimalRecs = recommendations.filter((r) => r.monthlySavings === 0);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Start a new audit
      </Link>

      {/* Hero — big savings number */}
      <ResultsHero
        totalMonthlySavings={totalMonthlySavings}
        totalAnnualSavings={totalAnnualSavings}
        isAlreadyOptimal={isAlreadyOptimal}
        toolCount={recommendations.length}
        teamSize={input.teamSize}
      />

      {/* AI summary */}
      {aiSummary && <AiSummaryCard summary={aiSummary} />}

      {/* Savings recommendations */}
      {savingsRecs.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-3">
            Savings breakdown
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              {formatCurrency(totalMonthlySavings)}/mo · {formatCurrency(totalAnnualSavings)}/yr
            </span>
          </h2>
          <div className="space-y-3">
            {savingsRecs.map((rec) => (
              <ToolRecommendationCard key={rec.toolId} rec={rec} />
            ))}
          </div>
        </section>
      )}

      {/* Optimal tools */}
      {optimalRecs.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-3">Already optimized</h2>
          <div className="space-y-3">
            {optimalRecs.map((rec) => (
              <ToolRecommendationCard key={rec.toolId} rec={rec} />
            ))}
          </div>
        </section>
      )}

      {/* Credex CTA for high-savings audits */}
      {totalMonthlySavings > 500 && (
        <CredexCTA monthlySavings={totalMonthlySavings} />
      )}

      {/* Lead capture — savings variant */}
      {!isAlreadyOptimal && (
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-semibold text-base mb-1">Get your report by email</h3>
          <p className="text-sm text-muted-foreground mb-4">
            We&apos;ll send you a copy of this audit plus a summary of your savings opportunities.
          </p>
          <LeadCaptureForm auditId={id} variant="savings" />
        </div>
      )}

      {/* Already-optimal nudge + notify capture */}
      {isAlreadyOptimal && (
        <div className="rounded-xl border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground mb-4">
            We&apos;ll keep an eye on pricing changes.{" "}
            <span className="font-medium text-foreground">
              Drop your email below and we&apos;ll notify you when new savings apply to your stack.
            </span>
          </p>
          <LeadCaptureForm auditId={id} variant="notify" />
        </div>
      )}
    </div>
  );
}
