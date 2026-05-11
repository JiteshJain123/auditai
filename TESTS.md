# Tests — AuditAI

## How to run

```bash
npm run test          # run once
npm run test:watch    # watch mode
```

All tests are in `tests/auditEngine.test.ts` and run with Vitest in a Node environment.

---

## Test file: `tests/auditEngine.test.ts`

**20 tests across 6 describe blocks.** All tests cover the core audit engine (`lib/auditEngine.ts`) — the rule-based logic that evaluates each tool against real pricing data and the team's use case.

---

### Block 1 — Structural (5 tests)

| Test name | What it covers |
|-----------|---------------|
| `returns zero savings for empty tool list` | Empty tool array returns `totalMonthlySavings = 0` and `isAlreadyOptimal = true` |
| `calculates annual savings as 12x monthly` | `totalAnnualSavings` is always exactly `totalMonthlySavings * 12` |
| `includes a recommendation for each tool provided` | Every tool in the input maps to exactly one `ToolRecommendation` in the output |
| `flags isAlreadyOptimal when savings are less than $5` | The `isAlreadyOptimal` flag is true when total savings < $5 threshold |
| `sets createdAt as a valid ISO date string` | Output `createdAt` parses correctly as an ISO 8601 date |

---

### Block 2 — Cursor rules (3 tests)

| Test name | What it covers |
|-----------|---------------|
| `recommends downgrade from Business to Pro for coding team` | Cursor Business ($40/seat) → Pro ($20/seat) for a coding team; saves $100 on 5 seats |
| `recommends switch from Business to Windsurf for non-coding team` | Cursor Business → Windsurf Pro ($15/seat) for a writing team; saves $125 on 5 seats (better than Cursor Pro) |
| `marks Cursor Hobby as optimal` | Free plan with $0 spend returns `recommendedAction = "optimal"` |

---

### Block 3 — GitHub Copilot rules (3 tests)

| Test name | What it covers |
|-----------|---------------|
| `downgrades Enterprise to Business for teams under 50 seats` | Copilot Enterprise ($39) → Business ($19) for 10 seats; saves $200/mo |
| `downgrades Business to Individual for teams of 3 or fewer` | Copilot Business ($19) → Individual ($10) for 3 seats; saves $27/mo |
| `keeps Individual as optimal for solo developer` | Single seat Individual plan is correctly flagged as optimal |

---

### Block 4 — Claude rules (3 tests)

| Test name | What it covers |
|-----------|---------------|
| `downgrades Max 20x to Max 5x for writing use case` | Claude Max 20x ($200) → Max 5x ($100) for a writing team; saves $100/seat |
| `downgrades Max 5x to Pro for research use case` | Claude Max 5x ($100) → Pro ($20) for research; saves $80/seat |
| `recommends Pro over Team when team size is under 5` | Claude Team enforces a 5-seat minimum — 3-person team on Team plan pays for 2 unused seats; switches to individual Pro plans saving $90/mo |

---

### Block 5 — API tools / Credex credits angle (3 tests)

| Test name | What it covers |
|-----------|---------------|
| `recommends credits for Anthropic API spend over $100` | $400/mo Anthropic API → 25% discount via Credex credits; saves $100/mo |
| `recommends credits for OpenAI API spend over $500 at 30% discount` | $1,000/mo OpenAI API → 30% discount via Credex credits; saves $300/mo |
| `marks small API spend as optimal` | $50/mo Anthropic API (below $100 threshold) returns `optimal` — discount not worth the overhead |

---

### Block 6 — Windsurf rules (2 tests)

| Test name | What it covers |
|-----------|---------------|
| `downgrades Team to Pro saving $20/seat` | Windsurf Team ($35) → Pro ($15) for 4 seats; saves $80/mo |
| `marks Windsurf Pro as optimal for coding team` | Pro plan for a coding team is correctly flagged as optimal |

---

### Block 7 — Multi-tool portfolio (1 test)

| Test name | What it covers |
|-----------|---------------|
| `correctly aggregates savings across multiple tools` | 3-tool input: Cursor Business + Windsurf Team (each saves $100/mo) + Copilot Individual (optimal) → total $200/mo, $2,400/yr, `isAlreadyOptimal = false` |

---

## Coverage rationale

The audit engine has no external dependencies (no API calls, no DB) so every rule branch is unit-testable with pure inputs. The tests cover:
- The happy path for every tool that has downgrade/switch/credits logic
- The threshold boundary (`< $5` savings → optimal)
- Multi-tool aggregation math
- All output fields (savings, annual savings, createdAt, isAlreadyOptimal)

Tests deliberately do **not** mock the pricing data — `PRICING` is imported directly so any pricing change that breaks a savings calculation will immediately fail a test.
