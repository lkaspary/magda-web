# Roadmap — Magda Kaspary Digital Ecosystem

_Last updated: 2026-08-10_

One Astro repo, one Cloudflare project, two hostnames: **magdakaspary.com** (personal brand) and **interdisciplinarist.com** (professional content & product funnel). Beehiiv handles email and subscriber management. Everything else is custom.

Deployment note: this project deploys via **Cloudflare Workers** (Workers Builds CI, triggered by GitHub pushes/PRs), using the `@astrojs/cloudflare` adapter — not the older standalone "Pages" product. Custom domains, preview URLs, and settings all live under **Cloudflare dashboard → Workers & Pages → magda-web**.

---

## Status at a glance

| Sprint | Status |
|---|---|
| Sprint 1 — launch-readiness (S1–S5) | ✅ **Done, merged, live** on magdakaspary.com |
| Sprint 2 — content fills (S6–S10) | ⬜ Not started — blocked on Magda's writing |
| Sprint 3 — interdisciplinarist.com routing (S11–S17) | 🟡 **Code done, in PR #2, awaiting your review + one manual step (S11)** |
| Sprint 4 — freemium layer (S18–S21) | ⬜ Not started |
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
| **A2 (S11)** | **Add `interdisciplinarist.com` as a custom domain** in Cloudflare dashboard → Workers & Pages → magda-web → Settings → Domains & Routes. Nameservers are already on Cloudflare (from earlier setup), so this should just be adding the domain and letting SSL auto-provision. | Needs your Cloudflare dashboard access | Real-domain testing of the interdisciplinarist routing (see caveat below) |
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
| S18–S26 | Freemium/premium layer, assessments, payments | Architecturally scoped in the Tooling section below, not started |
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
| S18 | Email-gated content component | 3h | Preview + blur behind Beehiiv subscribe form |
| S19 | Free assessment MVP | 4–6h | React island, scored questionnaire, Beehiiv API tagging on email capture |
| S20 | Free downloadable resource | 1h | PDF sample, gated behind S18's component |
| S21 | Beehiiv subscriber tagging | 1h | Tag by content accessed: `article-reader`, `assessment-taker`, `workbook-sample` |

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
│   ├── EssayCard.astro / TagCard.astro       # shared — EXISTS
├── content/
│   ├── writing/en/, writing/pt/              # EXISTS, empty (blocked on S6/S7)
│   ├── articles/                             # BUILT (PR #2), empty (blocked on M3)
├── layouts/
│   └── Layout.astro                          # UPDATED (PR #2) — domain-aware canonical/OG/hreflang
├── middleware.ts                             # BUILT (PR #2) — hostname detection + rewrite
├── env.d.ts                                  # BUILT (PR #2) — Astro.locals.site typing
├── pages/
│   ├── en/, pt/                              # EXISTS — magdakaspary.com
│   ├── inter/                                # BUILT (PR #2)
│   │   ├── index.astro                       # landing page
│   │   ├── articles/index.astro, [slug].astro
│   │   ├── assessments/index.astro           # stub
│   │   ├── workbooks/index.astro             # stub
│   ├── api/
│   │   ├── contact.ts                        # EXISTS
│   │   ├── checkout.ts, webhook.ts           # NOT BUILT — Sprint 5
│   │   ├── assessment-save.ts                # NOT BUILT — Sprint 4
│   └── 404.astro                             # BUILT (Sprint 1) — bilingual, detects lang from attempted URL
```

---

## Hostname routing — how it actually works now

```typescript
// src/middleware.ts (built, in PR #2)
const host = (ctx.request.headers.get('host') || '').split(':')[0].toLowerCase();
const isInter = host === 'interdisciplinarist.com' || host.endsWith('.interdisciplinarist.com');

ctx.locals.site = isInter ? 'interdisciplinarist' : 'magda';

// On the real domain, serve /inter/* content at the root path so URLs stay clean.
if (isInter && !ctx.url.pathname.startsWith('/inter')) {
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
