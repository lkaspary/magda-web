# Roadmap — Magda Kaspary Digital Ecosystem

_Last updated: 2026-08-11_

One Astro repo, one Cloudflare project, two hostnames: **magdakaspary.com** (personal brand) and **interdisciplinarist.com** (professional content & product funnel). Beehiiv handles email and subscriber management. Everything else is custom.

Deployment note: this project deploys via **Cloudflare Workers** (Workers Builds CI, triggered by GitHub pushes/PRs), using the `@astrojs/cloudflare` adapter — not the older standalone "Pages" product. Custom domains, preview URLs, and settings all live under **Cloudflare dashboard → Workers & Pages → magda-web**.

---

## Status at a glance

| Sprint | Status |
|---|---|
| Sprint 1 — launch-readiness (S1–S5) | ✅ **Done, merged, live** on magdakaspary.com |
| Sprint 2 — content fills (S6–S10) | ⬜ Not started — blocked on Magda's writing |
| Sprint 3 — interdisciplinarist.com routing (S11–S17) | 🟡 **Code done, in PR #2, awaiting your review + one manual step (S11)** |
| Test/staging environment | 🟡 **Code ready on `staging` branch, waiting on you to create the Cloudflare staging Worker project (A3–A5)** |
| Sprint 4 — freemium layer (S18–S21) | 🟡 **S18 + S21 code done, in PR #3 (stacked on PR #2), awaiting review + Beehiiv secrets. S19/S20 not started.** |
| Sprint 5 — premium + payments (S22–S26) | ⬜ Not started |
| Sprint 6 — polish + launch (S27–S30) | ⬜ Not started |
| New backlog (added this session) | ⬜ Favicon/logo, social card testing — see below |

**Nothing below marked "your action" has been done yet** — this section exists so you know exactly what's still sitting on your plate versus what Claude Code can pick up unattended.

---

## Your action, right now

These are the only things blocking progress that require you specifically (dashboard access, decisions, or content only Magda can write). Everything else in this doc is workable by Claude Code without you.

| # | Action | Why it's on you | Unblocks |
|---|---|---|---|
| **A1** | **Review & merge PR #2**: [github.com/lkaspary/magda-web/pull/2](https://github.com/lkaspary/magda-web/pull/2) | Touches the shared `Layout.astro` and adds a site-wide `middleware.ts`. It's been verified against Cloudflare's own preview builds (existing pages unaffected, new `/inter/*` pages render, 404s work), but I can't merge PRs myself. | Everything else in Sprint 3 |
| **A1b** | **Review & merge PR #3** (after A1): [github.com/lkaspary/magda-web/pull/3](https://github.com/lkaspary/magda-web/pull/3) — Beehiiv article gating (S18/S21). Stacked on PR #2 so the diff is scoped to just this session's work; retarget it to `main` once PR #2 lands. | Adds a new server-side integration (`/api/subscribe`) and a real behavior change (gated article content) | Sprint 4 completing |
| **A2 (S11)** | **Add `interdisciplinarist.com` as a custom domain** in Cloudflare dashboard → Workers & Pages → magda-web → Settings → Domains & Routes. Nameservers are already on Cloudflare (from earlier setup), so this should just be adding the domain and letting SSL auto-provision. | Needs your Cloudflare dashboard access | Real-domain testing of the interdisciplinarist routing (see caveat below) |
| **A3** | **Create a staging Cloudflare Worker project** connected to the same GitHub repo, production branch set to `staging` (already pushed and up to date with `main` + PR #2 + PR #3's branches). Zero-config, same framework preset as the existing `magda-web` project — no `wrangler.toml` needed. | Needs your Cloudflare dashboard access | A real, durable test environment for newsletters/gating/payments instead of relying on ephemeral PR preview URLs |
| **A4** | **Add two custom domains** to the new staging Worker: `staging.magdakaspary.com` and `staging.interdisciplinarist.com`. Both zones are already on Cloudflare. The second one is what actually exercises the interdisciplinarist hostname-rewrite logic end-to-end (the middleware checks for `interdisciplinarist.com` or a subdomain of it) — closes the A2 testing caveat below without touching the real interdisciplinarist.com domain. | Needs your Cloudflare dashboard access | End-to-end testing of routing + gating on real hostnames |
| **A5** | **Create a Beehiiv test publication** and set 4 secrets across the two Worker projects (Settings → Variables and Secrets on each): `BEEHIIV_API_KEY` + `BEEHIIV_PUBLICATION_ID` on **production** `magda-web` (your real publication's values — these don't exist yet, today's Beehiiv usage is client-side embed only) and the same two secret names on the **staging** project (the test publication's values instead). | Needs Beehiiv dashboard + Cloudflare dashboard access | Testing PR #3's gating/subscribe flow without touching real subscribers, and turning on the real integration once merged |
| **A6** | **Decide what to do with PR #1** — [github.com/lkaspary/magda-web/pull/1](https://github.com/lkaspary/magda-web/pull/1), "Add Cloudflare Workers configuration." This is a stale PR auto-opened by Cloudflare's own "Wrangler autoconfig" bot back in April, before Sprint 1 even started — nothing from this project touched it. It proposes committing a `wrangler.jsonc` to the repo (with `npx wrangler deploy` as the deploy command). That conflicts with the zero-config setup this whole roadmap assumes (see the Deployment note at the top), and since you're about to run **two** Worker projects off this repo (production + staging, A3), a single committed `wrangler.jsonc` could affect both unless it's written carefully — not something to merge on autopilot. Options: close it (keep the current zero-config setup, simplest), or merge it and let me adapt the staging setup around it (adds a config file to maintain, gains version-controlled build/deploy commands). No functional difference today either way — purely a "do you want this eventually or not" call. | Just needs a decision — either close it or tell me to merge + adapt around it | Keeps the repo's deployment story unambiguous before Sprint 5 adds more moving parts (Stripe webhooks, R2) |
| **M1** | Decide the first assessment topic/audience/outcome | Only you and Magda can decide this | Sprint 4 (S19) |
| **M2** | Write the interdisciplinarist.com positioning statement | The live landing page (in PR #2) currently uses placeholder copy pulled from the About page's "stopped moving between worlds..." line — it reads fine but isn't final | Replacing placeholder hero copy |
| **M3** | First 2–3 professional articles for interdisciplinarist.com | Content only Magda can write | Sprint 3 content (the `articles` collection exists and works — it's empty) |
| **M4** | Beehiiv: one list with tags, or two publications? | Affects subscriber tagging strategy | S21 — for now, the interdisciplinarist landing page reuses the same EN Beehiiv list as magdakaspary.com, per your own "one list" recommendation |
| **M5** | First workbook — topic, format, price | Doesn't need to be finished, just scoped | Sprint 5 (S25) |
| **M6** | Interdisciplinarist visual identity | ✅ **Decided and implemented**: same design tokens, violet (`#7348C8`) accent instead of teal | — |

**Caveat on A2**: the interdisciplinarist routing logic (middleware rewriting `interdisciplinarist.com/articles` → serves `/inter/articles` internally, clean URLs) has been verified two ways — logically, and by exploiting a coincidental hostname match on a Cloudflare preview URL during testing (documented in the PR). But no environment currently has a hostname that's *actually* `interdisciplinarist.com`, so this is the one piece of Sprint 3 that hasn't been execution-tested end-to-end. Worth a careful click-through the moment A2 is done.

---

## What Claude Code can pick up next (no blockers)

| # | Task | Notes |
|---|---|---|
| **New-1** | **Replace the favicon** | `public/favicon.svg` is still the default Astro rocket logo. Needs a real brand mark (monogram or icon) matching the teal/serif design system. Flagged by you, not started. |
| S6–S9 | Content fills | Still blocked on Magda's writing — nothing for Claude Code to do until essays exist |
| S10 | Wire homepage idea cards to real content | Blocked on S6–S9 |
| S19/S20 | Free assessment MVP + downloadable resource | S18's gate component (in PR #3) is reusable for both — S19 also needs a React (or similar) island added to the project first |
| S22–S26 | Stripe payments, premium gating, workbooks | Architecturally scoped in the Tooling section below, not started |
| S27–S30 | Polish + launch | Not started |

**Deferred by your request**: testing OG/Twitter/Facebook share cards (Twitter Card Validator, Facebook Sharing Debugger) — you asked to hold this until logins/accounts are figured out, so it's parked rather than dropped. Tracked as **New-2**.

---

## Sprint 1 — launch-readiness ✅ DONE

All five tasks shipped in commit `ac66eed` on `main`, live on magdakaspary.com, verified against production:

| # | Task | Result |
|---|---|---|
| S1 | Mobile hamburger menu | Shipped — accessible toggle, closes on Escape/link click |
| S2 | OG image + Twitter card meta | Shipped — generated a branded 1200×630 share image (`public/images/og-default.jpg`), wired `og:image`/`twitter:card` with per-page override support |
| S3 | Custom 404 page | Shipped — bilingual, detects EN/PT from the attempted URL |
| S4 | Link checker | Ran against live production — **zero real broken links** (the only flags were the not-yet-live interdisciplinarist.com placeholder links and a bot-blocked false positive on coachingfederation.org) |
| S5 | Accessibility audit | Ran `axe-core` against all 16 live pages, fixed everything found: duplicate/unlabeled nav+main landmarks, missing iframe titles, unlabeled contact-form fields, a heading-order skip |

---

## Sprint 3 — interdisciplinarist.com routing 🟡 IN PR #2

> Code is written and verified against Cloudflare's own preview builds. Not merged. See **A1** above.

| # | Task | Status |
|---|---|---|
| S11 | Add interdisciplinarist.com as custom domain in Cloudflare | ⬜ **Your action — A2 above** |
| S12 | Hostname-aware middleware (`src/middleware.ts`) | ✅ Built — detects request host, sets `Astro.locals.site`, rewrites clean URLs on the real domain |
| S13 | Branched Header/Footer | ✅ Built — `HeaderInter.astro` / `FooterInter.astro`, violet accent, own nav (Articles/Assessments/Workbooks/Subscribe) |
| S14 | Interdisciplinarist landing page | ✅ Built at `/inter` (or root, once A2 is done) — hero (placeholder copy, see M2), value prop, featured articles grid, Beehiiv embed |
| S15 | Article content collection | ✅ Built — `articles` collection in `content.config.ts`: title, excerpt, tags, publishDate, tier (free/preview/premium), featured. Empty until M3. |
| S16 | Article index + detail pages | ✅ Built — `/inter/articles` (with tag filtering) and `/inter/articles/[slug]`, reuses `EssayCard` |
| S17 | Cross-link wiring | ✅ No-op needed — magdakaspary.com's Writing page and footer already link to the correct `https://interdisciplinarist.com` absolute URL; the `externalUrl` schema field already routes correctly once real essays use it |

**Also fixed as part of this work** (not originally scoped, but required for multi-domain to function correctly at all): `Layout.astro` was hardcoded to build canonical/OG URLs against `magdakaspary.com`'s static site config, and unconditionally emitted EN/PT hreflang tags. Both would have been wrong on a second real domain. Now derives canonical/OG URLs from the actual request origin, and only emits hreflang tags when explicitly requested (`hreflang` prop, default `true`, set `false` on interdisciplinarist pages).

**Assessments and Workbooks nav links** point to minimal "coming soon" stub pages (`/inter/assessments`, `/inter/workbooks`) so the nav doesn't 404 — full build-out is Sprint 4 (S19) and Sprint 5 (S25).

---

## Sprint 4 (partial) — Beehiiv gating 🟡 IN PR #3

> Stacked on PR #2 (depends on the `articles` collection/pages it introduces). See **A1b** above.

| # | Task | Status |
|---|---|---|
| S18 | Email-gated content component | ✅ Built — `GatedContent.astro`. `free` tier renders untouched; `preview`/`premium` fade the content after ~16rem and show the article's `excerpt` + a subscribe form. `premium` is a placeholder gate (no payment check) until S23. |
| S21 | Beehiiv subscriber tagging | ✅ Built — every gate submit hits a new shared `POST /api/subscribe`, which tags the subscriber via Beehiiv's `utm_source` field (`article-reader` for now; `assessment-taker`/`workbook-sample` are already typed and ready for S19/S20 to reuse the same endpoint). |
| S19 | Free assessment MVP | ⬜ Not started — needs a React (or similar) island added to the project first |
| S20 | Free downloadable resource | ⬜ Not started — mostly asset/content work once S18 exists |

**Bug found and fixed along the way**: `src/middleware.ts`'s interdisciplinarist rewrite caught `/api/*` paths too, which would have silently 404'd `/api/subscribe` (and later S22's Stripe webhook, S19's assessment-scoring route) whenever called from the interdisciplinarist hostname. Latent since Sprint 3 shipped no real API calls from that hostname — now excluded from the rewrite.

**Beehiiv API note**: verified against Beehiiv's current v2 docs during implementation rather than assumed — there's no native "tag" field on subscription creation. `custom_fields` requires the field to already exist in the Beehiiv dashboard; `utm_source` is built-in and needs no setup, so that's what content-source tagging uses. If you later want native Beehiiv tags (not just UTM-based segments), that's a Beehiiv-dashboard automation (trigger on `utm_source` → add tag), not a code change.

---

## Testing environment 🟡 CODE READY, AWAITING A3–A5

A second, independent Cloudflare Worker project (not `wrangler.toml` environments — a fully separate zero-config project pointed at a different branch, per Cloudflare's supported multi-project-per-repo pattern) tracking the `staging` branch instead of `main`. Same repo, same build process, own domains, own secrets — zero risk to the production `magda-web` project's config.

- `staging` branch is pushed and currently contains: `main` + PR #2's Sprint 3 work + PR #3's Sprint 4 gating work + two staging-only dummy articles (`staging-test-free.md`, `staging-test-preview.md`, one per tier) for click-testing the gate. These two fixture articles are **staging-only** — they were committed directly to `staging`, not to either PR branch, so they won't reach production.
- Once you do **A3** (create the project) and **A4** (attach `staging.magdakaspary.com` + `staging.interdisciplinarist.com`), every future push to `staging` deploys automatically, same as `main` does today for production.
- **A5** wires up a Beehiiv test publication so staging signups never touch real subscribers — same secret names as production (`BEEHIIV_API_KEY`, `BEEHIIV_PUBLICATION_ID`), different values, set independently on each Worker project's dashboard.
- Recommended flow going forward: land new Sprint 4/5 feature branches on `staging` first (as this session did), click-test on the real staging domains, then merge to `main` once you're happy — instead of trusting PR preview builds straight into production.

---

## Everything else (Sprints 2, 4, 5, 6) — unchanged from original plan

### Sprint 2: Content fills (Magda writes → Leandro commits)

| # | Task | Owner | Notes |
|---|---|---|---|
| S6 | Write first essay — professional lens | Magda | Markdown file in `src/content/writing/en/`, frontmatter: `title`, `excerpt`, `tags: ['professional']`, `publishDate`, `featured: true` |
| S7 | Write first essay — personal-creative lens | Magda | Same format, `tags: ['personal-creative']` |
| S8 | Speaking page content (EN) | Magda | 3–5 talk topics, past events, testimonial/video, Cal.com CTA |
| S9 | Translate S6–S8 to Portuguese | Leandro | PT essays in `src/content/writing/pt/`, PT speaking page at `/pt/palestras.astro` |
| S10 | Wire homepage idea cards | Leandro | Replace "Coming soon ↗" with links to published essays/interdisciplinarist articles |

### Sprint 4: Freemium layer (Leandro — Claude Code)

| # | Task | Est. | Notes |
|---|---|---|---|
| S18 | Email-gated content component | 3h | ✅ Done, in PR #3 — see "Sprint 4 (partial)" section above |
| S19 | Free assessment MVP | 4–6h | React island, scored questionnaire, Beehiiv API tagging on email capture |
| S20 | Free downloadable resource | 1h | PDF sample, gated behind S18's component |
| S21 | Beehiiv subscriber tagging | 1h | ✅ Done, in PR #3 — see "Sprint 4 (partial)" section above |

### Sprint 5: Premium content + payments (Leandro — Claude Code)

| # | Task | Est. | Notes |
|---|---|---|---|
| S22 | Stripe Checkout integration | 3h | One-time purchases via Cloudflare Worker API route, webhook confirms |
| S23 | Premium article gating | 2h | Check Beehiiv premium sub or Stripe purchase before showing `tier: 'premium'` articles |
| S24 | Full assessment with report | 4h | Extended diagnostic, Stripe-gated, server-generated PDF |
| S25 | Workbook product pages | 2h | `/inter/workbooks/[slug].astro`, Stripe buy button |
| S26 | Digital delivery | 2h | Stripe webhook → Resend email with R2 signed download URL |

### Sprint 6: Polish + launch (Both)

| # | Task | Owner | Notes |
|---|---|---|---|
| S27 | PT content parity audit | Leandro | Especially new interdisciplinarist content |
| S28 | Sitemap submission to Google Search Console | Leandro | Both hostnames |
| S29 | Cloudflare Web Analytics on both hostnames | Leandro | Already enabled for magdakaspary.com |
| S30 | Magda reviews all pages, both languages | Magda | Final sign-off |

---

## New backlog (added this session)

| # | Task | Notes |
|---|---|---|
| New-1 | Replace favicon with a real logo/icon | `public/favicon.svg` is still the default Astro rocket. Needs a brand mark — could be a monogram in Cormorant Garamond, teal, matching the OG image style. Not started. |
| New-2 | Test OG/Twitter/Facebook share cards | Twitter Card Validator + Facebook Sharing Debugger. **Deliberately deferred** until logins/accounts exist, per your instruction — not urgent, just parked. |

---

## Tooling — what goes where

*(Unchanged from the original plan — still the accurate target architecture. See below for the pieces already built.)*

### Beehiiv — what it handles

| Capability | How it works | Plan needed |
|---|---|---|
| Newsletter delivery | Wired on both sites now — magdakaspary.com (form `ab3b485e`) and the interdisciplinarist landing page reuses the same EN list | Free (Launch) |
| Subscriber segmentation | Tag by content accessed, trigger automated sequences | Scale ($43/mo) |
| Paid subscriptions | Monthly/annual premium tier, 0% platform fee | Scale |
| Audience surveys | Simple onboarding-style forms | Scale |
| Digital products | Sell PDFs/templates directly, 0% commission | Scale |
| Metered paywall | N free premium posts before subscribe wall | Scale |

**Still recommended**: stay on Launch (free) until Sprint 4/5 activate paid subscriptions or tagging.

### Stripe, Cloudflare R2, Resend, assessment engine

No changes from the original plan — see Sprint 4/5 tables above for what each powers. None of this is built yet.

### What you're still NOT building

- ❌ No custom auth — Beehiiv premium subs + Stripe Checkout + email-gating cover it
- ❌ No second repo, no second deployment pipeline — one Astro project, one Cloudflare Workers project, two domains via `src/middleware.ts`
- ❌ No custom CMS — Astro content collections (now including `articles`, not just `writingEn`/`writingPt`)
- ❌ No Lemon Squeezy — Stripe Checkout + R2

---

## File and route structure — current state

```
src/
├── components/
│   ├── Header.astro / Footer.astro          # magdakaspary.com — EXISTS
│   ├── HeaderInter.astro / FooterInter.astro # interdisciplinarist.com — BUILT (PR #2)
│   ├── EssayCard.astro / TagCard.astro       # shared — EXISTS (EssayCard now takes optional `tier` badge, PR #3)
│   ├── GatedContent.astro                    # BUILT (PR #3) — S18 email gate for preview/premium tiers
├── content/
│   ├── writing/en/, writing/pt/              # EXISTS, empty (blocked on S6/S7)
│   ├── articles/                             # BUILT (PR #2), empty on main (blocked on M3)
│   │                                          # on `staging` only: 2 dummy test-fixture articles for gate QA
├── lib/
│   └── beehiiv.ts                            # BUILT (PR #3) — server-side subscribe + tag helper
├── layouts/
│   └── Layout.astro                          # UPDATED (PR #2) — domain-aware canonical/OG/hreflang
├── middleware.ts                             # BUILT (PR #2), FIXED (PR #3) — hostname detection + rewrite, excludes /api
├── env.d.ts                                  # BUILT (PR #2) — Astro.locals.site typing
├── pages/
│   ├── en/, pt/                              # EXISTS — magdakaspary.com
│   ├── inter/                                # BUILT (PR #2)
│   │   ├── index.astro                       # landing page
│   │   ├── articles/index.astro, [slug].astro # [slug] gates preview/premium via GatedContent (PR #3)
│   │   ├── assessments/index.astro           # stub
│   │   ├── workbooks/index.astro             # stub
│   ├── api/
│   │   ├── contact.ts                        # EXISTS
│   │   ├── subscribe.ts                      # BUILT (PR #3) — Beehiiv subscribe + tag endpoint
│   │   ├── checkout.ts, webhook.ts           # NOT BUILT — Sprint 5
│   │   ├── assessment-save.ts                # NOT BUILT — Sprint 4
│   └── 404.astro                             # BUILT (Sprint 1) — bilingual, detects lang from attempted URL
```

---

## Hostname routing — how it actually works now

```typescript
// src/middleware.ts (built in PR #2, fixed in PR #3)
const host = (ctx.request.headers.get('host') || '').split(':')[0].toLowerCase();
const isInter = host === 'interdisciplinarist.com' || host.endsWith('.interdisciplinarist.com');

ctx.locals.site = isInter ? 'interdisciplinarist' : 'magda';

// On the real domain, serve /inter/* content at the root path so URLs stay clean.
// /api is excluded — API routes aren't part of the /inter tree and must resolve
// at their real path (PR #3 fix: this was silently 404ing /api/subscribe).
if (isInter && !ctx.url.pathname.startsWith('/inter') && !ctx.url.pathname.startsWith('/api')) {
  const target = ctx.url.pathname === '/' ? '/inter' : `/inter${ctx.url.pathname}`;
  return ctx.rewrite(target);
}
```

Every `/inter/*` page computes `const base = Astro.locals.site === 'interdisciplinarist' ? '' : '/inter';` and builds its internal links from that — so the same code serves clean URLs on the real domain and `/inter`-prefixed URLs for pre-launch testing on magdakaspary.com, with no separate build or config needed.

One important limit discovered building this: `Layout.astro`'s canonical-URL logic can't just read `Astro.url.pathname` for pages served via the middleware rewrite (it reflects the rewritten path, not the public one), so `/inter/*` pages explicitly pass a `canonicalPath` prop instead. Existing magdakaspary.com pages are unaffected — they never rewrite, so `Astro.url.pathname` is already correct for them.

---

## Already completed

> Moved here to keep the active work at the top. (Sprint 1 details are in its own section above — kept there since it's the most recent and most relevant to verify.)

### Domain & deployment
- ✅ Cloudflare Workers project configured with `@astrojs/cloudflare` adapter (Workers Builds CI on GitHub push/PR)
- ✅ `site: 'https://magdakaspary.com'` in `astro.config.mjs`
- ✅ GoDaddy nameservers pointed to Cloudflare
- ✅ SSL auto-provisioned, `www` redirect to non-www

### Integrations
- ✅ Beehiiv newsletter embedded across both sites now (form `ab3b485e`)
- 🟡 Beehiiv server-side API (subscribe + tag by source) built in PR #3 — needs `BEEHIIV_API_KEY`/`BEEHIIV_PUBLICATION_ID` secrets (A5) before it's live
- ✅ Contact form via Resend (`/api/contact.ts`)
- ✅ Cloudflare Web Analytics enabled (magdakaspary.com only so far — S29 adds interdisciplinarist.com)
- ✅ Cal.com booking link on Work and Contact pages

### Content pages (EN + PT)
- ✅ Homepage, About, Work, Contact, Privacy Policy — full content
- ✅ Writing page — two-lens system, content collection schema with `externalUrl` support
- ✅ Tools page — two-lens layout, "coming soon" state
- ✅ Bilingual routing (EN/PT) with language toggle
- ✅ Custom 404 page (Sprint 1)

### Technical infrastructure
- ✅ Astro 6 + Tailwind CSS v4 + TypeScript
- ✅ i18n system (`utils.ts`, `en.ts`, `pt.ts`, route mapping)
- ✅ Content collections: `writingEn`, `writingPt`, `articles`
- ✅ Design system: teal + violet brand colors (both now in active use), serif/sans typography, `.card` component
- ✅ Full OG/Twitter meta with per-page override and domain-aware canonical URLs (Sprint 1 + Sprint 3)
- ✅ Sitemap integration with i18n support
- ✅ Mobile navigation on both sites (Sprint 1 + Sprint 3)
- ✅ Accessibility pass — landmarks, form labels, iframe titles, heading order (Sprint 1)

---

## Working with Claude Code

```bash
git clone https://github.com/lkaspary/magda-web.git
cd magda-web
npm install
npm run dev
```

**Note on this session's working environment**: the container this was built in has only ~2.6GB RAM, which isn't enough for the Cloudflare adapter's local Workers runtime (`workerd`) to start — so `npm run dev` and `npm run build` both crash there. That's a constraint of that specific container, not the project. Cloudflare's own build servers have no such issue (every PR build has passed cleanly). If you're running Claude Code from a normal laptop/desktop, this almost certainly won't apply to you — but if a future session hits the same wall, the workaround was verifying everything against Cloudflare's PR preview deploys instead of a local server.

This roadmap is the shared reference for chat, Claude Code, and Cowork sessions. Update status fields as items move — especially the "Status at a glance" and "Your action, right now" tables at the top, since those are what a new session should read first.
