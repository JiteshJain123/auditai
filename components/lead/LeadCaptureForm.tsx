"use client";

import { useState } from "react";
import { Loader2, Mail, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  auditId: string;
  variant?: "savings" | "notify";
}

interface FormState {
  email: string;
  companyName: string;
  role: string;
}

export function LeadCaptureForm({ auditId, variant = "savings" }: Props) {
  const [form, setForm] = useState<FormState>({ email: "", companyName: "", role: "" });
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error" | "ratelimited">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const isNotify = variant === "notify";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.email) return;
    setStatus("loading");

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          companyName: form.companyName || undefined,
          role: form.role || undefined,
          auditId,
          honeypot,
        }),
      });

      if (res.status === 429) {
        setStatus("ratelimited");
        return;
      }
      if (!res.ok) {
        setErrorMsg("Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      setStatus("success");
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-5 text-sm">
        <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
        <div>
          <p className="font-medium text-foreground">
            {isNotify ? "You're on the list." : "Audit report sent."}
          </p>
          <p className="text-muted-foreground mt-0.5">
            {isNotify
              ? "We'll email you when new savings apply to your stack."
              : "Check your inbox for your full audit report and next steps."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Honeypot — hidden from real users, bots fill it */}
      <input
        type="text"
        name="website"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        tabIndex={-1}
        aria-hidden="true"
        autoComplete="off"
        className="hidden"
      />

      <div className="flex gap-2 flex-wrap sm:flex-nowrap">
        <div className="relative flex-1 min-w-0">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            type="email"
            required
            placeholder="work@company.com"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className={cn(
              "w-full rounded-lg border border-input bg-background pl-9 pr-3 py-2.5 text-sm",
              "placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring",
            )}
          />
        </div>
        <button
          type="submit"
          disabled={status === "loading" || !form.email}
          className={cn(
            "inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors shrink-0",
            "bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50 disabled:cursor-not-allowed",
          )}
        >
          {status === "loading" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isNotify ? (
            "Notify me"
          ) : (
            "Send my report"
          )}
        </button>
      </div>

      {/* Optional fields */}
      <div className="flex gap-2 flex-wrap sm:flex-nowrap">
        <input
          type="text"
          placeholder="Company (optional)"
          value={form.companyName}
          onChange={(e) => setForm((f) => ({ ...f, companyName: e.target.value }))}
          className={cn(
            "flex-1 min-w-0 rounded-lg border border-input bg-background px-3 py-2 text-sm",
            "placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring",
          )}
        />
        <input
          type="text"
          placeholder="Role (optional)"
          value={form.role}
          onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
          className={cn(
            "flex-1 min-w-0 rounded-lg border border-input bg-background px-3 py-2 text-sm",
            "placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring",
          )}
        />
      </div>

      {status === "ratelimited" && (
        <p className="text-xs text-amber-600">Too many requests. Please wait a minute and try again.</p>
      )}
      {status === "error" && (
        <p className="text-xs text-destructive">{errorMsg}</p>
      )}
    </form>
  );
}
