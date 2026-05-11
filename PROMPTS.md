# LLM Prompts

## Audit Summary Prompt

Used in: `lib/gemini.ts` → `generateAuditSummary()`
Model: `gemini-2.0-flash`

### Final Prompt

```
You are an AI spend analyst. Write a 100-word personalized summary for a startup audit.

Team size: {teamSize}
Primary use case: {useCase}
Current tools: {toolList}
Total monthly savings identified: ${monthlySavings}

Be specific, practical, and honest. If savings are low, acknowledge they're spending well. Do not mention Credex by name.
```

### Why this prompt works
- Constrains length (100 words) to keep the summary digestible on screen
- Gives the model all the context it needs without hallucination risk (no internet access required)
- "Do not mention Credex by name" keeps the summary neutral and trustworthy
- "Be honest" instruction prevents the model from manufacturing savings when there are none

### What didn't work
- Initial prompt asked for "recommendations" — the model duplicated the structured audit data below instead of writing a narrative paragraph
- Tried a separate system role — added latency with no quality improvement on a flash model, so moved persona to user message
