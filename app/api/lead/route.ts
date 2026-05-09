import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { sendAuditConfirmationEmail } from "@/lib/resend";
import { checkRateLimit } from "@/lib/rateLimit";
import type { Lead } from "@/types";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const { success } = await checkRateLimit(ip);
  if (!success) {
    return NextResponse.json({ error: "Rate limited" }, { status: 429 });
  }

  const body: Lead & { honeypot?: string } = await req.json().catch(() => null);
  if (!body?.email) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Honeypot: bots fill hidden fields, real users don't
  if (body.honeypot) {
    return NextResponse.json({ ok: true }); // silently discard
  }

  const db = getSupabaseAdmin();
  await db.from("leads").insert({
    email: body.email,
    company_name: body.companyName,
    role: body.role,
    team_size: body.teamSize,
    audit_id: body.auditId,
  });

  // Fetch audit to get savings info for the email
  const { data: audit } = await db
    .from("audits")
    .select("result")
    .eq("id", body.auditId)
    .single();

  const monthlySavings = audit?.result?.totalMonthlySavings ?? 0;

  await sendAuditConfirmationEmail({
    to: body.email,
    auditId: body.auditId,
    monthlySavings,
    isHighSavings: monthlySavings > 500,
  });

  return NextResponse.json({ ok: true });
}
