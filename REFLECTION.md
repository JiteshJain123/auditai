# Reflection — AuditAI

## 1. Hardest bug — the hydration mismatch

This one genuinely cost me almost two hours and I still feel it a little.

The form I built saves your tool list to localStorage so if you accidentally close the tab you don't lose your work. Seemed simple. I used the standard pattern — `useState` with a lazy initializer that reads from `localStorage` on first render. Worked fine locally, but in production (and even in dev after a hard refresh) the page would flicker and the form would reset. The browser console had this long hydration mismatch warning about "Expected server HTML to contain a matching..." and I honestly stared at it for a while before I understood what it was actually telling me.

My first hypothesis was that the localStorage call was crashing on the server because `window` doesn't exist in Node. So I added a `typeof window !== 'undefined'` guard. That made the crash go away but the flicker got worse — now the server was rendering the form empty and the client was trying to re-render it with the saved data and React was flagging the mismatch even louder.

Second hypothesis — maybe the issue was timing and I just needed to wait until after mount. Wrapped it in a `useEffect` with a mounted flag. This actually kind of worked but ESLint immediately flagged calling `setState` inside `useEffect` without cleanup and I knew that pattern was going to cause subtle bugs with fast navigation.

The thing that actually fixed it was `useSyncExternalStore`. I didn't know this hook existed before this week. It's built into React specifically for syncing external stores like localStorage. The key insight is that it takes two separate snapshot functions — one for the server (`getServerSnapshot`) that always returns the initial value, and one for the client (`getSnapshot`) that reads localStorage. Because the server snapshot matches what the client renders on first paint, React doesn't see a mismatch. Then on the client, the subscription kicks in and updates the value. No flicker, no ESLint warning, no hydration error.

The thing that made this hard wasn't the fix itself — it was that the error message doesn't point you toward the real problem. It says "tree hydrated but attributes didn't match" when the actual problem is "you're reading client-only state during server rendering." Once I understood the actual cause, the solution was obvious. Getting to the cause took two hours.

---

## 2. A decision I reversed — switching from Anthropic to Gemini

The original plan was to use the Anthropic API for the AI-generated audit summary. The assignment mentioned Anthropic specifically and I was already building on top of their models anyway so it felt like the natural choice. I installed `@anthropic-ai/sdk`, wrote the prompt, wired it up.

Then I looked at the pricing page properly. Claude Haiku is cheap per token but this tool could theoretically run a lot of audits — especially if it got any traction on Hacker News or similar. The free tier is limited and I didn't want to set up billing for a demo project that might suddenly get 500 requests in a day. More practically: I don't have a funded Anthropic API account and I didn't want to accidentally incur charges during the evaluation period.

Gemini 2.0 Flash has a genuinely generous free tier — at the time I checked, 15 requests per minute and 1,500 per day at no cost. For a 100-word summary on each audit, Flash is completely appropriate. The output quality difference between Flash and a heavier model is irrelevant for a short narrative paragraph.

The reversal itself was quick — uninstalled `@anthropic-ai/sdk`, installed `@google/generative-ai`, rewrote `lib/gemini.ts`. Maybe 45 minutes of work. I also added a fallback so if the Gemini call fails for any reason (quota exceeded, network issue) the results page still renders with a static summary template rather than showing an error. That felt important — the AI summary is a nice-to-have, not load-bearing.

Looking back, I probably should have checked the free tier limits before writing any Anthropic code. That's the order things should have gone. Lesson noted.

---

## 3. What I'd build in week 2

The most obvious gap right now is that the tool is completely passive — you input your spend, you see the results, and then nothing happens until you manually come back. The feature I'd prioritise first is **automated re-audit alerts**. Store the initial audit in Supabase, then run a scheduled job (Vercel Cron or a simple cron on Railway) that checks whether any of the tool pricing has changed since the user last audited. If it has, send them an email: "Cursor just raised prices — your audit from 3 weeks ago may be out of date." That turns a one-time tool into something that keeps delivering value without any action from the user.

Second thing — **more tools**. Right now it covers 8 tools which is enough for an MVP but I'm already hearing about teams using Notion AI, Perplexity, Grammarly Business, GitHub Models, and a few others. The audit engine is modular enough that adding a new tool is basically writing a new rule block and adding a row to `PRICING_DATA.md`. I'd add 6–8 more tools and expand the "which tools does your team use" picker on the form.

Third — **a team-shareable audit link that includes the diff**. Right now the shareable URL shows the full audit. But if you've already run an audit and you want to share just the savings summary with your CFO or co-founder without them seeing all the tool details, there's no way to do that. A stripped-down "savings summary" view — just the headline number and the top two recommendations — would make the sharing more natural.

I'd also want to add **Slack integration**. Not complicated — just a webhook so you can drop your audit result directly into your team's #finance or #tools channel. Engineering managers don't want to forward a URL by email; they want to paste it into Slack with one click.

Finally, I'd properly instrument the **viral loop**. Right now there's a "Share this audit" button but I'm not tracking whether those shared links actually drive new audits. Adding that tracking (audit_started events with a referrer auditId) would tell me within the first week whether the viral coefficient is above or below 1.0, which is the single most important growth question.

---

## 4. How I used AI tools

I used Claude (via Claude Code) throughout the week. Being upfront about that.

Where it genuinely saved time: scaffolding. The initial folder structure, the TypeScript type definitions, the Vitest config — getting that to zero errors on the first `tsc` run would have taken me an hour of docs-reading. Claude got it to a working state in minutes. Same with the Zod schema for the audit API route and the boilerplate for the Supabase client. Anything where the answer is "what's the correct syntax for this framework" — I used it and trusted it.

Where I didn't trust it: the pricing data and the audit engine rules. I manually went to each vendor pricing page (Cursor, GitHub, Anthropic, OpenAI, Google, Windsurf) and verified every number. The audit engine has to be defensible — if I tell someone "you're wasting $180/month" and I'm wrong because I used stale or hallucinated prices, the whole tool loses credibility. The rule-based logic in `auditEngine.ts` I wrote and reviewed myself, with Claude helping with the TypeScript syntax but not the business logic.

The unit economics in ECONOMICS.md I ran myself. Claude helped format the table but the numbers — the margin estimates, the LTV calculation, the funnel percentages — those I worked out on paper first and then transcribed.

One specific time the AI was wrong and I caught it: early in the project, when I asked for help with the localStorage hook, Claude suggested the `useState` lazy initializer pattern — `useState(() => localStorage.getItem(key))`. I implemented it and it worked locally. It was only when I noticed the hydration warning in the browser console during a production test that I realised the suggestion was incorrect for a Next.js SSR environment. The pattern is fine for a pure client-side React app, but it's wrong when the component renders on the server first. Claude should have flagged the SSR context but didn't. That cost me two hours.

---

## 5. Self-ratings

**Discipline — 7/10**
I worked every day and hit every phase milestone, but I didn't commit incrementally the way I should have. All my commits ended up squashed into one day which makes the git history look bad even though the work was spread across the week. Next time I'd set a rule: commit before every break, even if it's just "WIP — form skeleton."

**Code quality — 8/10**
TypeScript strict mode throughout, no `any` types, 20 passing unit tests covering every rule branch, lazy Supabase client initialization to prevent module-level crashes. The one area I'm not proud of is the results page component — it's doing a bit too much and could be split further. But it works and the tests cover the logic that matters.

**Design sense — 7/10**
The landing page looks genuinely good — the gradient, the stats strip, the color-coded tools grid. But I'll be honest that I was borrowing patterns I've seen on other SaaS landing pages rather than designing from scratch. I know what looks good when I see it but I don't have strong instincts about why something looks good, which means I'm pattern-matching rather than designing. 7 feels right.

**Problem-solving — 8/10**
I got unstuck on everything without giving up and the solutions I landed on (useSyncExternalStore, lazy Supabase init, suppressHydrationWarning for the body tag) are the right solutions, not workarounds. The hydration bug took too long but I did figure it out. Minus 2 for taking 2 hours on something that should have taken 45 minutes once I understood the actual problem.

**Entrepreneurial thinking — 8/10**
The GTM and economics sections aren't filler — I actually thought through the funnel math, the viral coefficient, the LTV:CAC ratio, and the path to $1M ARR with realistic assumptions. The Credex credit-seller network as an unfair distribution channel is something I worked out while writing GTM.md and I think it's genuinely the highest-leverage early move. Minus 2 because I didn't talk to any real Engineering Managers before building, which is a gap — the product logic is sound but I'm guessing at what the actual friction points are rather than knowing.
