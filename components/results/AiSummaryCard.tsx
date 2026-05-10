import { Sparkles } from "lucide-react";

interface Props {
  summary: string;
}

export function AiSummaryCard({ summary }: Props) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">AI analysis</span>
      </div>
      <p className="text-sm leading-relaxed text-foreground">{summary}</p>
    </div>
  );
}
