import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AuditResult } from "@/types";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateAuditSummary(result: AuditResult): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const response = await model.generateContent(buildPrompt(result));
    return response.response.text().trim();
  } catch {
    return fallbackSummary(result);
  }
}

function buildPrompt(result: AuditResult): string {
  const toolList = result.recommendations
    .map((r) => `${r.toolName} (${r.currentPlan}): $${r.currentSpend}/mo`)
    .join(", ");

  return `You are an AI spend analyst. Write a 100-word personalized summary for a startup audit.

Team size: ${result.input.teamSize}
Primary use case: ${result.input.useCase}
Current tools: ${toolList}
Total monthly savings identified: $${result.totalMonthlySavings}

Be specific, practical, and honest. If savings are low, acknowledge they're spending well. Do not mention Credex by name.`;
}

function fallbackSummary(result: AuditResult): string {
  if (result.isAlreadyOptimal) {
    return `Your team of ${result.input.teamSize} is spending efficiently on AI tools for ${result.input.useCase} work. Your current stack appears well-optimized for your use case and team size. Keep an eye on usage as your team grows — plan thresholds can shift quickly.`;
  }
  return `Your team of ${result.input.teamSize} has an opportunity to save $${result.totalMonthlySavings}/month ($${result.totalAnnualSavings}/year) on AI tools. The biggest wins come from right-sizing plans to your actual seat count and use case. Review the recommendations below for specific actions you can take this week.`;
}
