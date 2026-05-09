import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { runAudit } from "@/lib/auditEngine";
import { generateAuditSummary } from "@/lib/gemini";
import { getSupabaseAdmin } from "@/lib/supabase";
import { generateAuditId } from "@/lib/utils";

const toolEntrySchema = z.object({
  toolId: z.enum([
    "cursor", "github-copilot", "claude", "chatgpt",
    "anthropic-api", "openai-api", "gemini", "windsurf",
  ]),
  plan: z.string().min(1),
  monthlySpend: z.number().min(0),
  seats: z.number().int().min(1),
});

const auditInputSchema = z.object({
  tools: z.array(toolEntrySchema).min(1, "Add at least one tool"),
  teamSize: z.number().int().min(1),
  useCase: z.enum(["coding", "writing", "data", "research", "mixed"]),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = auditInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const result = runAudit(parsed.data);
  const aiSummary = await generateAuditSummary(result);
  const finalResult = { ...result, aiSummary };
  const auditId = generateAuditId();

  try {
    const db = getSupabaseAdmin();
    await db.from("audits").insert({ id: auditId, result: finalResult });
  } catch (err) {
    console.error("Failed to store audit:", err);
    // Non-fatal: return the result even if DB storage fails.
    // The shareable URL won't resolve, but the in-page flow still works.
  }

  return NextResponse.json({ ...finalResult, auditId });
}
