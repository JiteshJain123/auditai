import type { AuditInput, AuditResult, ToolEntry, ToolRecommendation } from "@/types";
import { PRICING } from "./pricingData";

// ─── public entry point ───────────────────────────────────────────────────────

export function runAudit(input: AuditInput): AuditResult {
  const recommendations = input.tools.map((tool) => evaluateTool(tool, input));
  const totalMonthlySavings = recommendations.reduce((sum, r) => sum + r.monthlySavings, 0);

  return {
    input,
    recommendations,
    totalMonthlySavings,
    totalAnnualSavings: totalMonthlySavings * 12,
    isAlreadyOptimal: totalMonthlySavings < 5,
    createdAt: new Date().toISOString(),
  };
}

// ─── dispatcher ───────────────────────────────────────────────────────────────

function evaluateTool(tool: ToolEntry, input: AuditInput): ToolRecommendation {
  switch (tool.toolId) {
    case "cursor":         return evalCursor(tool, input);
    case "github-copilot": return evalGithubCopilot(tool, input);
    case "claude":         return evalClaude(tool, input);
    case "chatgpt":        return evalChatGPT(tool, input);
    case "anthropic-api":  return evalAnthropicApi(tool);
    case "openai-api":     return evalOpenAiApi(tool);
    case "gemini":         return evalGemini(tool, input);
    case "windsurf":       return evalWindsurf(tool);
    default:               return mkOptimal(tool);
  }
}

// ─── per-tool rules ───────────────────────────────────────────────────────────

function evalCursor(tool: ToolEntry, { useCase }: AuditInput): ToolRecommendation {
  const { plan, seats } = tool;

  if (plan === "business") {
    const toPro = mkDowngrade(
      tool, "pro",
      `Cursor Business ($40/seat) adds SSO and centralised billing — useful for IT-managed deployments or >10 seats. ` +
      `Pro ($20/seat) delivers the same completions, tab autocomplete, and agent mode for everyday development. ` +
      `Saves $${(40 - 20) * seats}/month.`
    );
    if (useCase !== "coding") {
      const toWindsurf = mkSwitch(
        tool, "windsurf", "pro",
        `Windsurf Pro ($15/seat) offers comparable AI coding assistance at 25% less than Cursor Pro. ` +
        `For a ${useCase}-focused team the marginal feature difference doesn't justify the premium. ` +
        `Saves $${(40 - 15) * seats}/month.`
      );
      return pickBest(toPro, toWindsurf);
    }
    return toPro;
  }

  if (plan === "pro" && useCase !== "coding" && seats >= 3) {
    return mkSwitch(
      tool, "windsurf", "pro",
      `Windsurf Pro ($15/seat) covers the same AI coding completions at $5/seat less than Cursor Pro. ` +
      `Saves $${5 * seats}/month across ${seats} seats.`
    );
  }

  return mkOptimal(tool);
}

function evalGithubCopilot(tool: ToolEntry, { useCase }: AuditInput): ToolRecommendation {
  const { plan, seats } = tool;

  if (plan === "enterprise" && seats < 50) {
    return mkDowngrade(
      tool, "business",
      `Copilot Enterprise ($39/seat) includes SAML SSO, model fine-tuning, and audit logs — features that require enterprise GitHub contracts to activate. ` +
      `Business ($19/seat) provides identical code completion, chat, and PR summaries for teams under 50 seats.`
    );
  }

  if (plan === "business") {
    if (seats <= 3) {
      return mkDowngrade(
        tool, "individual",
        `Copilot Business ($19/seat) is for teams needing org-level seat management and policy controls. ` +
        `Individual ($10/seat) gives ${seats} ${seats === 1 ? "developer" : "developers"} the identical in-editor experience without the admin overhead.`
      );
    }
    if (useCase !== "coding") {
      // Copilot is IDE-first; non-coding teams get better value from a general-purpose assistant
      const toClaudePro = mkSwitch(
        tool, "claude", "pro",
        `GitHub Copilot is optimised for code completion inside an IDE. ` +
        `For ${useCase} work, Claude Pro ($20/seat) offers superior long-context reasoning, document analysis, and multi-step tasks.`
      );
      if (toClaudePro.monthlySavings > 0) return toClaudePro;
    }
  }

  return mkOptimal(tool);
}

function evalClaude(tool: ToolEntry, { teamSize, useCase }: AuditInput): ToolRecommendation {
  const { plan, seats } = tool;

  if (plan === "max-20x") {
    // 20x multiplier is for extended agentic coding loops — rarely justified for other use cases
    if (useCase !== "coding") {
      return mkDowngrade(
        tool, "max-5x",
        `Claude Max 20x ($200/seat) is designed for extended agentic coding sessions that exhaust the 5x limit. ` +
        `For ${useCase} work, Max 5x ($100/seat) provides 5× the standard usage cap — far beyond typical ${useCase} workloads.`
      );
    }
    return mkDowngrade(
      tool, "max-5x",
      `Max 20x ($200/seat) is built for multi-hour autonomous agent loops. ` +
      `Max 5x ($100/seat) covers the vast majority of coding sessions at half the cost — upgrade only if you consistently hit the 5x ceiling.`
    );
  }

  if (plan === "max-5x") {
    if (useCase === "writing" || useCase === "research" || useCase === "data") {
      return mkDowngrade(
        tool, "pro",
        `Claude Pro ($20/seat) gives high-volume access to Claude Sonnet/Opus for ${useCase} tasks. ` +
        `The Max 5x multiplier ($100/seat) is for users who regularly exhaust Pro's daily limits — most ${useCase} workflows don't come close.`
      );
    }
  }

  if (plan === "team") {
    // Team requires a 5-seat minimum; small teams pay for unused seats
    const effectiveSeats = Math.max(5, seats);
    const teamCost = effectiveSeats * 30;
    const proCost = teamSize * 20;
    const savings = tool.monthlySpend - proCost;
    if (teamSize < 5 && savings >= 5) {
      return {
        toolId: tool.toolId,
        toolName: getToolName(tool.toolId),
        currentPlan: plan,
        currentSpend: tool.monthlySpend,
        recommendedAction: "downgrade",
        recommendedPlan: "pro",
        projectedSpend: proCost,
        monthlySavings: savings,
        reason:
          `Claude Team ($30/seat) enforces a 5-seat minimum. With ${teamSize} team members you're paying for ` +
          `${effectiveSeats - teamSize} unused ${effectiveSeats - teamSize === 1 ? "seat" : "seats"} ($${teamCost - proCost}/month). ` +
          `Individual Pro plans ($20/seat) for your actual ${teamSize} users saves $${savings}/month.`,
      };
    }
    // For teams ≥5, check if Pro is still cheaper
    if (seats >= 5) {
      return mkDowngrade(
        tool, "pro",
        `Claude Team ($30/seat) adds admin controls and audit logs. ` +
        `If your team doesn't need centrally managed billing or usage policies, Pro ($20/seat) delivers the same model access at $10/seat less.`
      );
    }
  }

  if (plan === "api" && tool.monthlySpend >= 100) {
    return mkCredits(
      tool, 0.25,
      `Anthropic API billed at retail rates. Credex sources discounted Claude API credits from organisations that over-purchased — typically 20–35% below list price.`
    );
  }

  return mkOptimal(tool);
}

function evalChatGPT(tool: ToolEntry, _input: AuditInput): ToolRecommendation {
  const { plan, seats } = tool;

  if (plan === "team" && seats <= 3) {
    return mkDowngrade(
      tool, "plus",
      `ChatGPT Team ($30/seat) adds an admin workspace and ensures prompts aren't used for model training — valuable if data privacy is a requirement. ` +
      `If that's not a hard constraint, Plus ($20/seat) delivers the same GPT-4o access at $10/seat less.`
    );
  }

  if (plan === "api" && tool.monthlySpend >= 100) {
    return mkCredits(
      tool, 0.25,
      `OpenAI API billed at retail rates. Credex sources discounted ChatGPT / OpenAI credits from organisations that over-purchased — typically 20–30% below list price.`
    );
  }

  return mkOptimal(tool);
}

function evalAnthropicApi(tool: ToolEntry): ToolRecommendation {
  if (tool.monthlySpend >= 500) {
    return mkCredits(
      tool, 0.30,
      `At $${tool.monthlySpend}/month on Anthropic API you're paying full retail. ` +
      `Credex specialises in discounted Claude credits from organisations that over-purchased — typical discount 25–35%. ` +
      `Book a consultation to see current inventory.`
    );
  }
  if (tool.monthlySpend >= 100) {
    return mkCredits(
      tool, 0.25,
      `Anthropic API billed at retail. Credex sources discounted Claude API credits at 20–30% below list price.`
    );
  }
  return mkOptimal(tool);
}

function evalOpenAiApi(tool: ToolEntry): ToolRecommendation {
  if (tool.monthlySpend >= 500) {
    return mkCredits(
      tool, 0.30,
      `At $${tool.monthlySpend}/month on OpenAI API you're paying full retail. ` +
      `Credex sources discounted OpenAI credits from organisations that over-purchased — typical discount 25–35%.`
    );
  }
  if (tool.monthlySpend >= 100) {
    return mkCredits(
      tool, 0.25,
      `OpenAI API billed at retail. Credex sources discounted credits at 20–30% below list price.`
    );
  }
  return mkOptimal(tool);
}

function evalGemini(tool: ToolEntry, { useCase }: AuditInput): ToolRecommendation {
  const { plan, seats } = tool;

  if (plan === "business") {
    const toAdvanced = mkDowngrade(
      tool, "advanced",
      `Gemini Business ($24/seat) adds Google Workspace org management. ` +
      `Advanced ($21.99/seat) delivers the same Gemini model access. Saves $${(2.01 * seats).toFixed(2)}/month.`
    );
    if (useCase === "coding") {
      const toWindsurf = mkSwitch(
        tool, "windsurf", "pro",
        `Windsurf Pro ($15/seat) is purpose-built for coding with AI. ` +
        `Gemini Business is a general assistant — a dedicated IDE tool delivers more value at lower cost for a ${seats}-person coding team.`
      );
      return pickBest(toAdvanced, toWindsurf);
    }
    return toAdvanced;
  }

  if (plan === "advanced" && useCase === "coding") {
    return mkSwitch(
      tool, "windsurf", "pro",
      `Windsurf Pro ($15/seat) is purpose-built for coding workflows. ` +
      `Gemini Advanced ($21.99/seat) is a general-purpose assistant — for coding tasks, a dedicated IDE assistant costs less and integrates directly with your editor.`
    );
  }

  return mkOptimal(tool);
}

function evalWindsurf(tool: ToolEntry): ToolRecommendation {
  const { plan, seats } = tool;

  if (plan === "team") {
    return mkDowngrade(
      tool, "pro",
      `Windsurf Team ($35/seat) adds admin controls, usage analytics, and centralised billing. ` +
      `For ${seats} ${seats === 1 ? "developer" : "developers"}, Pro ($15/seat) delivers the same AI completions and Flow agent — saving $${(35 - 15) * seats}/month.`
    );
  }

  return mkOptimal(tool);
}

// ─── builder helpers ──────────────────────────────────────────────────────────

function getToolName(toolId: string): string {
  return PRICING[toolId]?.name ?? toolId;
}

function getPlanPrice(toolId: string, planId: string): number {
  return PRICING[toolId]?.plans.find((p) => p.planId === planId)?.pricePerSeat ?? 0;
}

function mkOptimal(tool: ToolEntry): ToolRecommendation {
  return {
    toolId: tool.toolId,
    toolName: getToolName(tool.toolId),
    currentPlan: tool.plan,
    currentSpend: tool.monthlySpend,
    recommendedAction: "optimal",
    projectedSpend: tool.monthlySpend,
    monthlySavings: 0,
    reason: "Your current plan is well-matched to your team size and use case.",
  };
}

function mkDowngrade(tool: ToolEntry, toPlanId: string, reason: string): ToolRecommendation {
  const projected = getPlanPrice(tool.toolId, toPlanId) * tool.seats;
  const savings = Math.max(0, tool.monthlySpend - projected);
  if (savings < 5) return mkOptimal(tool);
  return {
    toolId: tool.toolId,
    toolName: getToolName(tool.toolId),
    currentPlan: tool.plan,
    currentSpend: tool.monthlySpend,
    recommendedAction: "downgrade",
    recommendedPlan: toPlanId,
    projectedSpend: projected,
    monthlySavings: savings,
    reason,
  };
}

function mkSwitch(tool: ToolEntry, toToolId: string, toPlanId: string, reason: string): ToolRecommendation {
  const projected = getPlanPrice(toToolId, toPlanId) * tool.seats;
  const savings = Math.max(0, tool.monthlySpend - projected);
  if (savings < 5) return mkOptimal(tool);
  return {
    toolId: tool.toolId,
    toolName: getToolName(tool.toolId),
    currentPlan: tool.plan,
    currentSpend: tool.monthlySpend,
    recommendedAction: "switch",
    recommendedTool: toToolId,
    recommendedPlan: toPlanId,
    projectedSpend: projected,
    monthlySavings: savings,
    reason,
  };
}

function mkCredits(tool: ToolEntry, discountPct: number, reason: string): ToolRecommendation {
  const projected = Math.round(tool.monthlySpend * (1 - discountPct));
  const savings = tool.monthlySpend - projected;
  if (savings < 5) return mkOptimal(tool);
  return {
    toolId: tool.toolId,
    toolName: getToolName(tool.toolId),
    currentPlan: tool.plan,
    currentSpend: tool.monthlySpend,
    recommendedAction: "credits",
    projectedSpend: projected,
    monthlySavings: savings,
    reason,
  };
}

function pickBest(a: ToolRecommendation, b: ToolRecommendation): ToolRecommendation {
  return b.monthlySavings > a.monthlySavings ? b : a;
}
