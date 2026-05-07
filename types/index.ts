export type UseCase = "coding" | "writing" | "data" | "research" | "mixed";

export type ToolId =
  | "cursor"
  | "github-copilot"
  | "claude"
  | "chatgpt"
  | "anthropic-api"
  | "openai-api"
  | "gemini"
  | "windsurf";

export interface ToolEntry {
  toolId: ToolId;
  plan: string;
  monthlySpend: number;
  seats: number;
}

export interface AuditInput {
  tools: ToolEntry[];
  teamSize: number;
  useCase: UseCase;
}

export interface ToolRecommendation {
  toolId: ToolId;
  toolName: string;
  currentPlan: string;
  currentSpend: number;
  recommendedAction: "downgrade" | "switch" | "credits" | "optimal";
  recommendedPlan?: string;
  recommendedTool?: string;
  projectedSpend: number;
  monthlySavings: number;
  reason: string;
}

export interface AuditResult {
  input: AuditInput;
  recommendations: ToolRecommendation[];
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  isAlreadyOptimal: boolean;
  aiSummary?: string;
  createdAt: string;
}

export interface Lead {
  email: string;
  companyName?: string;
  role?: string;
  teamSize?: number;
  auditId: string;
}

export interface StoredAudit {
  id: string;
  result: Omit<AuditResult, "input"> & { tools: ToolEntry[]; useCase: UseCase; teamSize: number };
  createdAt: string;
}
