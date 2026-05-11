# Unit Economics — AuditAI

## What a converted Credex lead is worth

A Credex customer buys discounted AI credits — typically Cursor, Claude, or ChatGPT Enterprise — at 20–35% below retail. Credex's margin on a transaction is the spread between the buy price (from companies offloading unused credits) and the sell price (to the startup).

**Estimated deal math:**
- Average startup buying AI credits: $8,000–$15,000 per transaction (a 10-person team buying 6 months of Cursor Business = $40/seat × 10 × 6 = $2,400; larger teams and API credits push this higher)
- Conservative average transaction: **$6,000**
- Credex gross margin (spread): **~25%** = $1,500 per deal
- Repeat purchase rate: Estimated 60% rebuy within 6 months, so LTV ≈ $1,500 × 1.6 = **$2,400 LTV per customer**

These are estimates. The actual margin depends on Credex's buy-side relationships and negotiated pricing, which I don't have visibility into.

---

## CAC by channel

| Channel | Est. CAC | Reasoning |
|---------|----------|-----------|
| Show HN / Hacker News | **$0** | Organic post, no spend. Time cost only. |
| Twitter thread (organic) | **$0** | Organic distribution via shares |
| Indie Hackers post | **$0** | Organic community post |
| Credex's existing credit seller network | **~$50** | Time to draft and send outreach to existing contacts |
| Cold LinkedIn/X DM outreach | **~$80** | ~2 hours of outreach per 10 DMs, 5% response, 20% of responses convert = 1 customer per 100 DMs |
| Paid social (hypothetical) | **$300–600** | Not recommended at this stage — organic channels have better targeting for this audience |

**Effective blended CAC at launch: ~$30–50** (mostly organic, small time cost)

At $2,400 LTV and $40 CAC, **LTV:CAC = 60:1**. Even with very conservative assumptions (LTV = $500, CAC = $200), the economics are strong.

---

## Conversion funnel math

```
Cold visitor lands on auditai-alpha.vercel.app
         │
         ▼
    Completes audit            ~40% of visitors
         │
         ▼
    Sees results page          100% of completers
         │
         ▼
    Submits email (lead)       ~15% of completers  →  6% of visitors
         │
         ▼
    High-savings lead          ~30% of email leads (savings >$500/mo)
    sees Credex CTA
         │
         ▼
    Books consultation         ~20% of high-savings leads
         │
         ▼
    Closes as customer         ~35% of consultations
```

**Per 1,000 visitors:**
- 400 complete audit
- 60 submit email
- 18 are high-savings leads
- 3.6 book a consultation → round to **3–4 consultations per 1,000 visitors**
- 1.2 close → **~1 new Credex customer per 1,000 visitors**

At $2,400 LTV and 1 customer per 1,000 visitors: **$2.40 revenue per visitor**. This makes paid acquisition viable at CPCs well above the industry average.

---

## Path to $1M ARR in 18 months

**Target:** $1,000,000 ARR = ~$83,000/month recurring revenue

Credex's model is transactional, not subscription, so "ARR" here means annualised transaction revenue. Assuming customers rebuy twice per year:

- Customers needed: $1M ARR ÷ ($2,400 LTV × 2 transactions/year) = **~208 active customers**
- Audits needed to generate 208 customers: 208 ÷ 0.0012 (1.2 customers per 1,000 visitors) = **~173,000 total audits** over 18 months
- Audits per month needed by month 18: ~15,000/month

**What has to be true for this to work:**

1. **Organic viral coefficient > 1.0** — Each audit result URL that gets shared needs to drive more than 1 new audit. The OG preview showing a dollar amount is the hook. If the average audit drives 1.4 new visitors who complete audits, the top-of-funnel becomes self-sustaining.

2. **High-savings audit rate stays above 25%** — The economics depend on enough audits showing >$500/mo savings to trigger the Credex CTA. If teams are mostly well-optimised, conversion to consultation drops.

3. **Credex closes consultations at 35%+** — This is a Credex sales problem, not an AuditAI problem, but the tool needs to deliver warm, pre-qualified leads (people who have already seen their savings number) rather than cold leads.

4. **AuditAI becomes the default answer** to "how do I benchmark my AI spend" — one strong Show HN, a few Twitter threads citing real audit data, and distribution through Credex's credit-seller network should establish this within the first 90 days.

**Approximate monthly breakdown:**

| Month | Audits/mo | Customers acquired | Cumulative customers | Monthly revenue |
|-------|-----------|-------------------|---------------------|-----------------|
| 3     | 2,000     | 2                 | 6                   | $14,400/yr run rate |
| 6     | 5,000     | 6                 | 24                  | $57,600/yr |
| 12    | 10,000    | 12                | 84                  | $201,600/yr |
| 18    | 15,000    | 18                | 210                 | $1,008,000/yr ✓ |

These numbers are directionally right, not precision forecasts. The key variable is viral coefficient — if the audit URL gets shared at scale, the cost to reach 15k audits/month drops to near zero.
