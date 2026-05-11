# Dev Log — AuditAI

## Day 1 — 2026-05-08
**Hours worked:** 3
**What I did:** Initialized Next.js project with TypeScript, Tailwind v4, and shadcn-style UI components. Set up folder structure, TypeScript types, placeholder lib files (auditEngine, pricingData, supabase, resend, rateLimit). Created CI workflow (.github/workflows/ci.yml) and .env.example. Decided on Supabase over Firebase for real Postgres. Removed Prisma after realising it adds unnecessary complexity when Supabase has a direct REST client.
**What I learned:** Next.js 16 App Router uses async params (`params: Promise<{ id: string }>`) — the old sync pattern throws a warning. Tailwind v4 uses CSS-native config (`@import "tailwindcss"`, `@theme inline {}`) instead of tailwind.config.js — this broke several assumed class names until I read the v4 migration docs.
**Blockers / what I'm stuck on:** Need to research all 8 tool pricing pages before writing the audit engine — the numbers have to be defensible.
**Plan for tomorrow:** Research and verify all pricing data → write PRICING_DATA.md → implement full audit engine logic → write Vitest tests.

---

## Day 2 — 2026-05-09
**Hours worked:** 5
**What I did:** Researched and verified pricing for all 8 tools against their official pricing pages. Wrote PRICING_DATA.md with sources and verification dates. Implemented the full audit engine in `lib/auditEngine.ts` — rule-based logic for Cursor, GitHub Copilot, Claude, ChatGPT, Anthropic API, OpenAI API, Gemini, and Windsurf. Wrote 20 Vitest unit tests covering all rule branches. All 20 pass.
**What I learned:** Claude Team has a 5-seat minimum — a 3-person team on Team is paying for 2 ghost seats. This is the kind of non-obvious rule that makes the audit actually valuable. The audit engine should never use AI for math — hardcoded rules are auditable, AI outputs are not.
**Blockers / what I'm stuck on:** Deciding between Anthropic API and Gemini for the AI summary. Assignment prefers Anthropic but Gemini has a more generous free tier.
**Plan for tomorrow:** Switch to Gemini API for the summary. Build the spend input form with localStorage persistence.

---

## Day 3 — 2026-05-09
**Hours worked:** 4
**What I did:** Switched from Anthropic to Gemini 2.0 Flash for the AI-generated audit summary. Removed `@anthropic-ai/sdk`, installed `@google/generative-ai`, created `lib/gemini.ts` with a fallback summary for API failures. Built the spend input form (`SpendForm.tsx`, `ToolRow.tsx`) with dynamic plan selectors, monthly spend input, seats input, and localStorage persistence. Wired up `useLocalStorage` hook and `useAudit` hook. Built `POST /api/audit` route with Zod validation.
**What I learned:** `useLocalStorage` with a lazy `useState` initializer causes React hydration mismatches — the server renders empty state but the client reads localStorage and renders saved tools. Fixed with `useSyncExternalStore` which has separate server/client snapshot functions. ESLint in Next.js 16 blocks calling setState inside useEffect synchronously — the `useSyncExternalStore` approach avoids this entirely.
**Blockers / what I'm stuck on:** Hydration error took 2 hours to debug. The fix (`useSyncExternalStore`) is clean but non-obvious.
**Plan for tomorrow:** Build the results page — hero, per-tool cards, AI summary card, Credex CTA.

---

## Day 4 — 2026-05-09
**Hours worked:** 4
**What I did:** Built the full results page at `app/audit/[id]/page.tsx` — server component with `generateMetadata` for OG/Twitter tags, shareable URL. Built `ResultsHero`, `AiSummaryCard`, `ToolRecommendationCard`, `CredexCTA`, and `ShareButton` components. Fixed a Tailwind v4 issue where `border-l-4 border-l-green-500` conflicts with the base border colour shorthand — switched to a flex wrapper with a coloured `<div className="w-1 bg-green-500">` bar instead.
**What I learned:** In Tailwind v4, border-side utilities and the base border-color utility interact differently than v3. The coloured-div bar pattern is more reliable and visually equivalent. Also: Next.js `notFound()` requires a `not-found.tsx` colocated in the same route segment to customise the 404 — the root `not-found.tsx` is a fallback.
**Blockers / what I'm stuck on:** ESLint flagged an unused variable in `_input` even with the underscore convention — added `argsIgnorePattern: "^_"` to eslint.config.mjs.
**Plan for tomorrow:** Build lead capture form, wire into results page. Add loading skeleton.

---

## Day 5 — 2026-05-09
**Hours worked:** 3
**What I did:** Built `LeadCaptureForm` component with honeypot field, two variants (savings / notify), rate limit error handling, and success state. Wired it into the results page — savings variant below the Credex CTA for audits with savings, notify variant for already-optimal audits. Added `app/audit/[id]/loading.tsx` skeleton and `not-found.tsx` 404 page. Replaced default Next.js README with a full project README including the Decisions section.
**What I learned:** The honeypot approach is simpler and less intrusive than hCaptcha for a tool where user trust is critical. A visible CAPTCHA on a "free, no-login" tool sends the wrong signal. The Upstash rate limit + honeypot combo handles bot abuse without any UX cost to real users.
**Blockers / what I'm stuck on:** `supabaseUrl is required` error was crashing module evaluation when env vars were empty. Fixed by making the Supabase client lazy (created inside the function, not at module top level).
**Plan for tomorrow:** Landing page polish, tools coverage section, FAQ. Deploy to Vercel.

---

## Day 6 — 2026-05-09
**Hours worked:** 3
**What I did:** Major landing page UI overhaul — added gradient hero with animated badge, green accent text on the headline, stats strip, "How it works" cards with icons, colour-coded tools grid, FAQ accordion using native `<details>`. Upgraded the header to sticky with `backdrop-blur`, added green Zap icon logo. Updated `globals.css` with a subtly green-tinted palette so the theme has personality without being garish. Deployed to Vercel at https://auditai-alpha.vercel.app/.
**What I learned:** Sticky headers with `backdrop-blur` feel significantly more polished than static ones — single CSS change, large perceived quality improvement. Native `<details>` with a CSS `group-open:rotate-180` on the chevron works perfectly for an FAQ accordion with zero JavaScript.
**Blockers / what I'm stuck on:** Browser extensions (Grammarly, ColorZilla) inject attributes into `<body>` which React flags as hydration mismatches. Fixed with `suppressHydrationWarning` on the body tag — the recommended approach for extension-caused attribute differences.
**Plan for tomorrow:** Write all documentation MD files. Final check. Submit.

---

## Day 7 — 2026-05-09
**Hours worked:** 2
**What I did:** Wrote and completed all required documentation: README.md (with Decisions section), TESTS.md (all 20 tests documented), GTM.md, ECONOMICS.md, LANDING_COPY.md, METRICS.md. Verified production build passes (`next build` clean). Ran full test suite one final time — 20/20. Confirmed deployed URL is reachable and all 6 MVP features work end-to-end.
**What I learned:** Writing the economics section forced me to think through the actual conversion funnel numbers, which made the GTM distribution priorities much clearer. The viral coefficient (audit URL shared → new audit completed) is the single most important variable for whether this tool grows without paid acquisition.
**Blockers / what I'm stuck on:** Git history only shows commits from a compressed timeline — I should have committed more incrementally each day to show work-in-progress state.
**Plan for tomorrow:** Assignment submitted. Monitor Vercel for any runtime errors on the live URL.
