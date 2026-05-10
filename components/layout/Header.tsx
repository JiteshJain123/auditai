import Link from "next/link";
import { Zap } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-green-600 text-white shadow-sm transition-transform group-hover:scale-105">
            <Zap className="h-3.5 w-3.5 fill-white" />
          </div>
          <span className="font-bold text-base tracking-tight">AuditAI</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link
            href="/"
            className="rounded-md px-3 py-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
          >
            Free audit
          </Link>
        </nav>
      </div>
    </header>
  );
}
