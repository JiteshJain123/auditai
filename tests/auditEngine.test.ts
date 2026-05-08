import { describe, it, expect } from "vitest";
import { runAudit } from "@/lib/auditEngine";
import type { AuditInput } from "@/types";

// ─── structural tests ─────────────────────────────────────────────────────────

describe("auditEngine — structural", () => {
  it("returns zero savings for empty tool list", () => {
    const input: AuditInput = { tools: [], teamSize: 5, useCase: "coding" };
    const result = runAudit(input);
    expect(result.totalMonthlySavings).toBe(0);
    expect(result.isAlreadyOptimal).toBe(true);
  });

  it("calculates annual savings as 12x monthly", () => {
    const input: AuditInput = {
      tools: [{ toolId: "cursor", plan: "business", monthlySpend: 400, seats: 10 }],
      teamSize: 10,
      useCase: "coding",
    };
    const result = runAudit(input);
    expect(result.totalAnnualSavings).toBe(result.totalMonthlySavings * 12);
  });

  it("includes a recommendation for each tool provided", () => {
    const input: AuditInput = {
      tools: [
        { toolId: "cursor", plan: "pro", monthlySpend: 40, seats: 2 },
        { toolId: "claude", plan: "team", monthlySpend: 150, seats: 5 },
      ],
      teamSize: 5,
      useCase: "coding",
    };
    const result = runAudit(input);
    expect(result.recommendations).toHaveLength(2);
  });

  it("flags isAlreadyOptimal when savings are less than $5", () => {
    const input: AuditInput = {
      tools: [{ toolId: "github-copilot", plan: "individual", monthlySpend: 10, seats: 1 }],
      teamSize: 1,
      useCase: "coding",
    };
    const result = runAudit(input);
    expect(result.isAlreadyOptimal).toBe(true);
  });

  it("sets createdAt as a valid ISO date string", () => {
    const input: AuditInput = { tools: [], teamSize: 1, useCase: "mixed" };
    const result = runAudit(input);
    expect(new Date(result.createdAt).toISOString()).toBe(result.createdAt);
  });
});

// ─── Cursor rules ─────────────────────────────────────────────────────────────

describe("auditEngine — Cursor", () => {
  it("recommends downgrade from Business to Pro for coding team", () => {
    const input: AuditInput = {
      tools: [{ toolId: "cursor", plan: "business", monthlySpend: 200, seats: 5 }],
      teamSize: 5,
      useCase: "coding",
    };
    const result = runAudit(input);
    const rec = result.recommendations[0];
    expect(rec.recommendedAction).toBe("downgrade");
    expect(rec.recommendedPlan).toBe("pro");
    expect(rec.monthlySavings).toBe(100); // (40-20) * 5 = 100
  });

  it("recommends switch from Business to Windsurf for non-coding team", () => {
    const input: AuditInput = {
      tools: [{ toolId: "cursor", plan: "business", monthlySpend: 200, seats: 5 }],
      teamSize: 5,
      useCase: "writing",
    };
    const result = runAudit(input);
    const rec = result.recommendations[0];
    // Windsurf Pro ($15 × 5 = $75) saves more than Cursor Pro ($20 × 5 = $100)
    expect(rec.recommendedAction).toBe("switch");
    expect(rec.recommendedTool).toBe("windsurf");
    expect(rec.monthlySavings).toBe(125); // 200 - 75 = 125
  });

  it("marks Cursor Hobby as optimal", () => {
    const input: AuditInput = {
      tools: [{ toolId: "cursor", plan: "hobby", monthlySpend: 0, seats: 1 }],
      teamSize: 1,
      useCase: "coding",
    };
    const result = runAudit(input);
    expect(result.recommendations[0].recommendedAction).toBe("optimal");
  });
});

// ─── GitHub Copilot rules ─────────────────────────────────────────────────────

describe("auditEngine — GitHub Copilot", () => {
  it("downgrades Enterprise to Business for teams under 50 seats", () => {
    const input: AuditInput = {
      tools: [{ toolId: "github-copilot", plan: "enterprise", monthlySpend: 390, seats: 10 }],
      teamSize: 10,
      useCase: "coding",
    };
    const result = runAudit(input);
    const rec = result.recommendations[0];
    expect(rec.recommendedAction).toBe("downgrade");
    expect(rec.recommendedPlan).toBe("business");
    expect(rec.monthlySavings).toBe(200); // (39-19) * 10 = 200
  });

  it("downgrades Business to Individual for teams of 3 or fewer", () => {
    const input: AuditInput = {
      tools: [{ toolId: "github-copilot", plan: "business", monthlySpend: 57, seats: 3 }],
      teamSize: 3,
      useCase: "coding",
    };
    const result = runAudit(input);
    const rec = result.recommendations[0];
    expect(rec.recommendedAction).toBe("downgrade");
    expect(rec.recommendedPlan).toBe("individual");
    expect(rec.monthlySavings).toBe(27); // (19-10) * 3 = 27
  });

  it("keeps Individual as optimal for solo developer", () => {
    const input: AuditInput = {
      tools: [{ toolId: "github-copilot", plan: "individual", monthlySpend: 10, seats: 1 }],
      teamSize: 1,
      useCase: "coding",
    };
    const result = runAudit(input);
    expect(result.recommendations[0].recommendedAction).toBe("optimal");
  });
});

// ─── Claude rules ─────────────────────────────────────────────────────────────

describe("auditEngine — Claude", () => {
  it("downgrades Max 20x to Max 5x for writing use case", () => {
    const input: AuditInput = {
      tools: [{ toolId: "claude", plan: "max-20x", monthlySpend: 200, seats: 1 }],
      teamSize: 1,
      useCase: "writing",
    };
    const result = runAudit(input);
    const rec = result.recommendations[0];
    expect(rec.recommendedAction).toBe("downgrade");
    expect(rec.recommendedPlan).toBe("max-5x");
    expect(rec.monthlySavings).toBe(100); // 200 - 100
  });

  it("downgrades Max 5x to Pro for research use case", () => {
    const input: AuditInput = {
      tools: [{ toolId: "claude", plan: "max-5x", monthlySpend: 100, seats: 1 }],
      teamSize: 1,
      useCase: "research",
    };
    const result = runAudit(input);
    const rec = result.recommendations[0];
    expect(rec.recommendedAction).toBe("downgrade");
    expect(rec.recommendedPlan).toBe("pro");
    expect(rec.monthlySavings).toBe(80); // 100 - 20
  });

  it("recommends Pro over Team when team size is under 5", () => {
    // Team min 5 seats × $30 = $150; Pro for 3 users = $60 → saves $90
    const input: AuditInput = {
      tools: [{ toolId: "claude", plan: "team", monthlySpend: 150, seats: 5 }],
      teamSize: 3,
      useCase: "mixed",
    };
    const result = runAudit(input);
    const rec = result.recommendations[0];
    expect(rec.recommendedAction).toBe("downgrade");
    expect(rec.recommendedPlan).toBe("pro");
    expect(rec.monthlySavings).toBe(90); // 150 - (3 × 20)
  });
});

// ─── API tools (Credex credits angle) ────────────────────────────────────────

describe("auditEngine — API tools", () => {
  it("recommends credits for Anthropic API spend over $100", () => {
    const input: AuditInput = {
      tools: [{ toolId: "anthropic-api", plan: "api", monthlySpend: 400, seats: 1 }],
      teamSize: 2,
      useCase: "coding",
    };
    const result = runAudit(input);
    expect(result.recommendations[0].recommendedAction).toBe("credits");
    expect(result.recommendations[0].monthlySavings).toBe(100); // 25% of 400
  });

  it("recommends credits for OpenAI API spend over $500 at 30% discount", () => {
    const input: AuditInput = {
      tools: [{ toolId: "openai-api", plan: "api", monthlySpend: 1000, seats: 1 }],
      teamSize: 5,
      useCase: "data",
    };
    const result = runAudit(input);
    expect(result.recommendations[0].recommendedAction).toBe("credits");
    expect(result.recommendations[0].monthlySavings).toBe(300); // 30% of 1000
  });

  it("marks small API spend as optimal", () => {
    const input: AuditInput = {
      tools: [{ toolId: "anthropic-api", plan: "api", monthlySpend: 50, seats: 1 }],
      teamSize: 1,
      useCase: "coding",
    };
    const result = runAudit(input);
    expect(result.recommendations[0].recommendedAction).toBe("optimal");
  });
});

// ─── Windsurf rules ───────────────────────────────────────────────────────────

describe("auditEngine — Windsurf", () => {
  it("downgrades Team to Pro saving $20/seat", () => {
    const input: AuditInput = {
      tools: [{ toolId: "windsurf", plan: "team", monthlySpend: 140, seats: 4 }],
      teamSize: 4,
      useCase: "coding",
    };
    const result = runAudit(input);
    const rec = result.recommendations[0];
    expect(rec.recommendedAction).toBe("downgrade");
    expect(rec.recommendedPlan).toBe("pro");
    expect(rec.monthlySavings).toBe(80); // (35-15) * 4
  });

  it("marks Windsurf Pro as optimal for coding team", () => {
    const input: AuditInput = {
      tools: [{ toolId: "windsurf", plan: "pro", monthlySpend: 60, seats: 4 }],
      teamSize: 4,
      useCase: "coding",
    };
    const result = runAudit(input);
    expect(result.recommendations[0].recommendedAction).toBe("optimal");
  });
});

// ─── multi-tool portfolio ─────────────────────────────────────────────────────

describe("auditEngine — multi-tool portfolio", () => {
  it("correctly aggregates savings across multiple tools", () => {
    const input: AuditInput = {
      tools: [
        { toolId: "cursor", plan: "business", monthlySpend: 200, seats: 5 },      // saves $100
        { toolId: "windsurf", plan: "team", monthlySpend: 175, seats: 5 },         // saves $100
        { toolId: "github-copilot", plan: "individual", monthlySpend: 50, seats: 5 }, // optimal
      ],
      teamSize: 5,
      useCase: "coding",
    };
    const result = runAudit(input);
    expect(result.totalMonthlySavings).toBe(200);
    expect(result.totalAnnualSavings).toBe(2400);
    expect(result.isAlreadyOptimal).toBe(false);
  });
});
