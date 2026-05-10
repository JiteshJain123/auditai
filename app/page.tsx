import { SpendForm } from "@/components/form/SpendForm";
import { ChevronDown, TrendingDown, Link2, BarChart3 } from "lucide-react";

const TOOLS = [
  { name: "Cursor", category: "Coding", color: "bg-violet-100 text-violet-700" },
  { name: "GitHub Copilot", category: "Coding", color: "bg-violet-100 text-violet-700" },
  { name: "Windsurf", category: "Coding", color: "bg-violet-100 text-violet-700" },
  { name: "Claude", category: "Assistant", color: "bg-orange-100 text-orange-700" },
  { name: "ChatGPT", category: "Assistant", color: "bg-orange-100 text-orange-700" },
  { name: "Gemini", category: "Assistant", color: "bg-blue-100 text-blue-700" },
  { name: "Anthropic API", category: "API", color: "bg-zinc-100 text-zinc-700" },
  { name: "OpenAI API", category: "API", color: "bg-zinc-100 text-zinc-700" },
];

const FAQ = [
  {
    q: "Is this actually free?",
    a: "Yes — no sign-up, no credit card, no catch. The audit runs entirely in your browser and takes under 30 seconds.",
  },
  {
    q: "How accurate are the savings numbers?",
    a: "We verify pricing directly against each vendor's official pricing page. Savings are calculated against real plan costs and your actual team size — not marketing estimates.",
  },
  {
    q: "What happens with my data?",
    a: "Your audit is stored so you can share the link with your team. We never sell your data. If you submit your email, it's used only to send you the audit report.",
  },
  {
    q: "What is Credex?",
    a: "Credex sources discounted AI credits from companies that over-purchased — Cursor, Claude, ChatGPT Enterprise, and others. For large-spend audits we surface this as an additional savings path.",
  },
];

const HOW_IT_WORKS = [
  {
    icon: BarChart3,
    step: "1",
    title: "Enter your tools",
    desc: "Add each AI subscription — plan, monthly cost, and number of seats.",
  },
  {
    icon: TrendingDown,
    step: "2",
    title: "Get your audit",
    desc: "Our engine checks every tool against current pricing and your team's actual usage pattern.",
  },
  {
    icon: Link2,
    step: "3",
    title: "Share the report",
    desc: "Get a unique link to share with your finance team or leadership.",
  },
];

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:py-20">

      {/* Hero */}
      <div className="mb-14 relative">
        {/* Subtle glow blobs */}
        <div className="pointer-events-none absolute -top-24 -left-16 h-80 w-80 rounded-full bg-green-400/10 blur-3xl" />
        <div className="pointer-events-none absolute top-10 right-0 h-64 w-64 rounded-full bg-emerald-300/8 blur-3xl" />

        <div className="relative">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3.5 py-1 text-xs font-medium text-green-700 mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            Free · No sign-up · Results in 30 seconds
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-5 leading-[1.1]">
            Stop overpaying for<br />
            <span className="text-green-600">AI tools.</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
            Enter your team&apos;s AI subscriptions and get an instant audit — exactly where
            you&apos;re overspending, what to switch, and how much you&apos;ll save each month.
          </p>

          {/* Stats strip */}
          <div className="mt-10 flex flex-wrap gap-8">
            {[
              { label: "Avg. annual savings", value: "$2,400+" },
              { label: "AI tools covered", value: "8" },
              { label: "Time to audit", value: "<30s" },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-2xl font-bold tracking-tight">{value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form card */}
      <div className="rounded-2xl border border-border bg-card shadow-md shadow-black/5 p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">Your AI stack</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Add each tool your team pays for. Form saves automatically.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-green-50 border border-green-200 px-3 py-1 text-xs font-medium text-green-700">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            Free audit
          </div>
        </div>
        <SpendForm />
      </div>

      {/* How it works */}
      <div className="mt-20">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-6">
          How it works
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {HOW_IT_WORKS.map(({ icon: Icon, step, title, desc }) => (
            <div
              key={step}
              className="rounded-xl border border-border bg-card p-5 space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-white text-xs font-bold shrink-0">
                  {step}
                </div>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-sm">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tools we cover */}
      <div className="mt-20">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
          Tools we cover
        </p>
        <p className="text-sm text-muted-foreground mb-5">
          Pricing verified against official vendor pages and updated regularly.
        </p>
        <div className="flex flex-wrap gap-2">
          {TOOLS.map(({ name, category, color }) => (
            <span
              key={name}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-2 text-sm font-medium shadow-sm"
            >
              {name}
              <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${color}`}>
                {category}
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-20">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-6">
          FAQ
        </p>
        <div className="divide-y divide-border rounded-xl border border-border overflow-hidden">
          {FAQ.map(({ q, a }) => (
            <details key={q} className="group bg-card">
              <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-sm font-medium select-none list-none hover:bg-muted/40 transition-colors gap-4">
                <span>{q}</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-200 group-open:rotate-180" />
              </summary>
              <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border/50 pt-3">
                {a}
              </p>
            </details>
          ))}
        </div>
      </div>

    </div>
  );
}
