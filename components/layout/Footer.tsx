import { Zap } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/60 mt-auto">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded bg-green-600 text-white">
            <Zap className="h-3 w-3 fill-white" />
          </div>
          <span>AuditAI — Free AI spend audits for startups</span>
        </div>
        <span>
          Powered by{" "}
          <a
            href="https://credex.rocks"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground/70 hover:text-foreground transition-colors"
          >
            Credex
          </a>
        </span>
      </div>
    </footer>
  );
}
