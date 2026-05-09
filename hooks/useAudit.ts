"use client";

import { useState } from "react";
import type { AuditInput, AuditResult } from "@/types";

export type AuditResponse = AuditResult & { auditId: string };

export function useAudit() {
  const [result, setResult] = useState<AuditResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function runAudit(input: AuditInput): Promise<AuditResponse | null> {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error ?? "Audit failed");
      }
      const data: AuditResponse = await res.json();
      setResult(data);
      return data;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { result, loading, error, runAudit };
}
