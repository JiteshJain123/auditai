export default function AuditLoading() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6 animate-pulse">
      {/* Back link skeleton */}
      <div className="h-4 w-32 rounded bg-muted" />

      {/* Hero skeleton */}
      <div className="rounded-2xl border border-border bg-card p-8 space-y-4">
        <div className="h-4 w-40 rounded bg-muted" />
        <div className="h-12 w-48 rounded bg-muted" />
        <div className="h-6 w-32 rounded bg-muted" />
        <div className="h-4 w-56 rounded bg-muted" />
      </div>

      {/* AI summary skeleton */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-3">
        <div className="h-4 w-24 rounded bg-muted" />
        <div className="h-4 w-full rounded bg-muted" />
        <div className="h-4 w-3/4 rounded bg-muted" />
      </div>

      {/* Cards skeleton */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-xl border border-border bg-card overflow-hidden flex">
          <div className="w-1 bg-muted shrink-0" />
          <div className="flex-1 p-5 space-y-3">
            <div className="flex justify-between">
              <div className="h-5 w-32 rounded bg-muted" />
              <div className="h-5 w-24 rounded bg-muted" />
            </div>
            <div className="h-4 w-full rounded bg-muted" />
            <div className="h-4 w-2/3 rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}
