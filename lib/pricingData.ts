// All pricing verified against official vendor pages — see PRICING_DATA.md for URLs

export interface PlanPrice {
  planId: string;
  label: string;
  pricePerSeat: number; // USD/month
  minSeats?: number;
  maxSeats?: number;
  isApiPricing?: boolean;
}

export interface ToolPricing {
  toolId: string;
  name: string;
  plans: PlanPrice[];
}

export const PRICING: Record<string, ToolPricing> = {
  cursor: {
    toolId: "cursor",
    name: "Cursor",
    plans: [
      { planId: "hobby", label: "Hobby", pricePerSeat: 0 },
      { planId: "pro", label: "Pro", pricePerSeat: 20 },
      { planId: "business", label: "Business", pricePerSeat: 40 },
      { planId: "enterprise", label: "Enterprise", pricePerSeat: 0 }, // custom pricing
    ],
  },
  "github-copilot": {
    toolId: "github-copilot",
    name: "GitHub Copilot",
    plans: [
      { planId: "individual", label: "Individual", pricePerSeat: 10 },
      { planId: "business", label: "Business", pricePerSeat: 19 },
      { planId: "enterprise", label: "Enterprise", pricePerSeat: 39 },
    ],
  },
  claude: {
    toolId: "claude",
    name: "Claude",
    plans: [
      { planId: "free", label: "Free", pricePerSeat: 0 },
      { planId: "pro", label: "Pro", pricePerSeat: 20 },
      { planId: "max-5x", label: "Max (5x)", pricePerSeat: 100 },
      { planId: "max-20x", label: "Max (20x)", pricePerSeat: 200 },
      { planId: "team", label: "Team", pricePerSeat: 30, minSeats: 5 },
      { planId: "enterprise", label: "Enterprise", pricePerSeat: 0 },
      { planId: "api", label: "API Direct", pricePerSeat: 0, isApiPricing: true },
    ],
  },
  chatgpt: {
    toolId: "chatgpt",
    name: "ChatGPT",
    plans: [
      { planId: "free", label: "Free", pricePerSeat: 0 },
      { planId: "plus", label: "Plus", pricePerSeat: 20 },
      { planId: "team", label: "Team", pricePerSeat: 30, minSeats: 2 },
      { planId: "enterprise", label: "Enterprise", pricePerSeat: 0 },
      { planId: "api", label: "API Direct", pricePerSeat: 0, isApiPricing: true },
    ],
  },
  "anthropic-api": {
    toolId: "anthropic-api",
    name: "Anthropic API",
    plans: [
      { planId: "api", label: "API Direct", pricePerSeat: 0, isApiPricing: true },
    ],
  },
  "openai-api": {
    toolId: "openai-api",
    name: "OpenAI API",
    plans: [
      { planId: "api", label: "API Direct", pricePerSeat: 0, isApiPricing: true },
    ],
  },
  gemini: {
    toolId: "gemini",
    name: "Gemini",
    plans: [
      { planId: "free", label: "Free", pricePerSeat: 0 },
      { planId: "advanced", label: "Advanced (Pro)", pricePerSeat: 21.99 },
      { planId: "business", label: "Business", pricePerSeat: 24 },
      { planId: "enterprise", label: "Enterprise", pricePerSeat: 0 },
      { planId: "api", label: "API Direct", pricePerSeat: 0, isApiPricing: true },
    ],
  },
  windsurf: {
    toolId: "windsurf",
    name: "Windsurf",
    plans: [
      { planId: "free", label: "Free", pricePerSeat: 0 },
      { planId: "pro", label: "Pro", pricePerSeat: 15 },
      { planId: "team", label: "Team", pricePerSeat: 35 },
      { planId: "enterprise", label: "Enterprise", pricePerSeat: 0 },
    ],
  },
};
