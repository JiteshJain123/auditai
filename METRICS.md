# Metrics — AuditAI

## North Star metric

**Qualified leads delivered to Credex per week**

Specifically: the count of email submissions where `totalMonthlySavings > $500/month`.

This is the right North Star because it's the single number that captures everything that matters simultaneously:
- It requires top-of-funnel traffic (someone has to find the tool)
- It requires the form to be compelling enough to complete (product UX)
- It requires the audit engine to surface meaningful savings (product accuracy)
- It requires the user to trust the tool enough to give their email (credibility)
- It filters for the users Credex can actually help (business alignment)

"Total audits completed" would be a vanity metric — a poorly targeted viral loop could drive thousands of audits from students or people with $0 AI spend. "Credex consultations booked" is a lagging indicator that depends on Credex's sales team, not the tool. Qualified leads is the handoff point — everything before it is AuditAI's job, everything after is Credex's.

---

## 3 input metrics that drive the North Star

**1. Audit completion rate**
`audits completed ÷ landing page visitors`

This is where most drop-off happens. If someone lands on the page but doesn't add a tool and submit, the funnel is broken. Target: >35%. Below 20% means the form is too intimidating or the value proposition isn't landing on the hero.

**2. High-savings audit rate**
`audits with savings > $500/mo ÷ total audits completed`

If this is below 20%, either the wrong audience is finding the tool (students, people with tiny AI spend) or the pricing data is stale and the engine is underestimating savings. Target: 25–35%. This number directly determines how many users ever see the Credex CTA.

**3. Email capture rate on high-savings audits**
`emails submitted ÷ high-savings audits shown`

These users have already seen their dollar amount. If they still don't convert, either the form is poorly placed, the copy isn't compelling, or they don't trust the tool with their email. Target: >20%. This is a product problem, fixable with copy and UX tweaks.

---

## What to instrument first

Before adding any analytics beyond these four events:

```
1. audit_started      — user adds their first tool to the form
2. audit_completed    — user clicks "Run my free audit" and gets results
3. lead_submitted     — user submits the email capture form
4. share_copied       — user clicks the "Share this audit" button
```

These four events map directly to the funnel. With just these, I can calculate:
- Audit completion rate (started → completed)
- Lead conversion rate (completed → submitted)
- Viral coefficient (share_copied ÷ completed × percentage that drives a new audit_started)

Instrument these with a single `fetch('/api/events', { body: { event, auditId } })` call — no third-party SDK needed at launch. Simpleanalytics or Plausible are fine for page-level traffic; the funnel events need to be in the database.

---

## Pivot trigger number

**If audit-to-qualified-lead rate falls below 1.5% after 500 audits, reconsider the distribution strategy.**

Calculation: 500 audits × 35% high-savings rate × 20% email rate × target = 35 qualified leads. If the actual number is below 7–8 (1.5% of 500), something is structurally wrong.

Most likely causes and responses:
- **Wrong audience finding the tool** (audit completion rate is high but high-savings rate is low) → change distribution channels, target engineering managers not developers
- **Trust gap** (high-savings rate is fine but email capture is low) → add more social proof, simplify the form, move the form above the fold on results
- **Pricing data stale** (savings engine is returning zeros for tools users actually pay a lot for) → update PRICING_DATA.md and rerun affected rules

"DAU" is not a metric for this tool. Most users audit once, share the link, maybe return when they hire more people. The right cadence metric is **weekly qualified leads**, not daily active users.
