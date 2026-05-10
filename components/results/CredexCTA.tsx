import { formatCurrency } from "@/lib/utils";
import { Zap } from "lucide-react";

interface Props {
  monthlySavings: number;
}

export function CredexCTA({ monthlySavings }: Props) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-800 text-white p-8">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10">
          <Zap className="h-5 w-5 text-yellow-400" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-zinc-300 mb-1">
            Significant savings identified
          </p>
          <h2 className="text-2xl font-bold mb-3">
            Capture {formatCurrency(monthlySavings)}/mo through Credex
          </h2>
          <p className="text-zinc-300 leading-relaxed mb-6 max-w-lg">
            Credex sources discounted AI infrastructure credits — Cursor, Claude, ChatGPT
            Enterprise, and others — from companies that overforecast or pivoted. The
            discount is real and substantial. Book a free consultation to see what&apos;s
            available for your stack.
          </p>
          <a
            href="https://credex.rocks"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-lg bg-white text-zinc-900 px-6 py-2.5 text-sm font-semibold hover:bg-zinc-100 transition-colors"
          >
            Book a free consultation →
          </a>
        </div>
      </div>
    </div>
  );
}
