import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";

export default function AuditNotFound() {
  return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center">
      <div className="flex justify-center mb-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
          <SearchX className="h-7 w-7 text-muted-foreground" />
        </div>
      </div>
      <h1 className="text-2xl font-bold tracking-tight mb-2">Audit not found</h1>
      <p className="text-muted-foreground mb-8 leading-relaxed">
        This audit link may have expired or the ID is incorrect.
        Run a new audit — it only takes 30 seconds.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-lg bg-foreground text-background px-5 py-2.5 text-sm font-semibold hover:bg-foreground/90 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Start a new audit
      </Link>
    </div>
  );
}
