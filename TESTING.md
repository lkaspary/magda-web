# Testing manual — staging environment + wiring walkthrough

_Written 2026-08-11, after Sprint 3 (interdisciplinarist routing) + Sprint 4 partial (Beehiiv gating, PRs #2/#3)._

This is a step-by-step guide to standing up the staging environment and verifying everything built so far actually works — not just "the build passed," but "I clicked through it and it did the right thing." Re-run the relevant section any time new scaffolding lands before it's merged to `main`.

No coding knowledge required — every step is either a browser click-path or a copy-pasteable command.

---

## 0. Mental model — what you're testing and where

Two things exist right now:

1. **Production** — `magdakaspary.com` / `interdisciplinarist.com` (once A2 is done), built from the `main` branch. Nothing from this session is here yet — PRs #2/#3/#4 are unmerged.
2. **Staging** — a separate Cloudflare Worker project you're about to create (steps below), built from the `staging` branch, which already contains `main` + PR #2 + PR #3 + two dummy test articles. This is where you test.

Everything in this manual runs against **staging**, so nothing you do here touches real subscribers, real content, or real traffic.

---

## 1. One-time setup — creating the staging environment (~15–20 min)

Skip this section if you've already done it; jump to Section 2.

### 1a. Create the staging Worker project
1. Cloudflare dashboard → **Workers & Pages** → **Create**.
2. Connect to GitHub → select the `lkaspary/magda-web` repository (same repo, no new repo needed).
3. When asked for the production branch, choose **`staging`** (not `main`).
4. Build settings: leave as auto-detected (Cloudflare's framework preset recognizes Astro + the Cloudflare adapter automatically — same zero-config setup as the existing `magda-web` project). No `wrangler.toml` needed.
5. Deploy. First build takes a couple of minutes — watch it in the dashboard's build log.

### 1b. Add custom domains
1. On the new project → **Settings** → **Domains & Routes** → **Add**.
2. Add `staging.magdakaspary.com`.
3. Add `staging.interdisciplinarist.com` too — this second one matters: the routing logic (Section 3 below) only activates on a hostname that *is* `interdisciplinarist.com` or a subdomain of it. Without this domain, you can't actually test that logic on staging.
4. SSL auto-provisions for both (same as it did for magdakaspary.com originally) — give it a few minutes if a domain shows "pending" right after adding it.

### 1c. Create a Beehiiv test publication
1. Beehiiv dashboard → create a new publication. It doesn't need design, content, or a real name — it exists purely to hold test subscribers.
2. Once created, find its **Publication ID** (Settings → General, or the URL when you're inside the publication) and generate an **API key** (Settings → Integrations → API, or wherever your Beehiiv plan surfaces it).

### 1d. Set secrets
On the **staging** Worker project → Settings → Variables and Secrets → add:
| Name | Value |
|---|---|
| `BEEHIIV_API_KEY` | The test publication's API key |
| `BEEHIIV_PUBLICATION_ID` | The test publication's ID |

On the **production** `magda-web` project (same two names, real publication's values) — do this whenever you're ready to make Beehiiv gating live on `main`, not required just to test staging.

**Checkpoint**: visit `https://staging.magdakaspary.com` — you should see the normal homepage, unchanged. If you get a Cloudflare error page instead, the domain/SSL hasn't finished provisioning yet — wait a few minutes and retry.

---

## 2. Local dev — and why you'll skip it

`npm run dev` / `npm run build` require the Cloudflare adapter's local Workers runtime (`workerd`), which needs more RAM than this container has (~2.6GB, not enough). This is a constraint of *this specific machine*, not the project — if you're on a normal laptop, `npm install && npm run dev` should just work.

Either way, this manual is written around testing the actual deployed staging environment instead of local dev — it's more representative anyway, since it's the real Cloudflare runtime, real DNS, real domains.

---

## 3. Testing Sprint 3 — interdisciplinarist.com routing

**What you're checking**: the site correctly detects which "brand" it's serving based on hostname, and interdisciplinarist.com gets clean URLs (no `/inter` prefix showing).

| # | Step | Expected result |
|---|---|---|
| 3.1 | Visit `https://staging.magdakaspary.com` | Normal magdakaspary.com homepage — teal accent, existing nav. No visible change from production. |
| 3.2 | Visit `https://staging.magdakaspary.com/inter` | The interdisciplinarist landing page renders — violet accent header/footer, hero, featured articles grid, Beehiiv embed. |
| 3.3 | Visit `https://staging.interdisciplinarist.com` (root, no `/inter`) | **Same page as 3.2**, but the URL bar shows no `/inter` prefix. This is the middleware rewrite working — confirms the one piece of Sprint 3 that was never testable until now (no real interdisciplinarist hostname existed before). |
| 3.4 | Visit `https://staging.interdisciplinarist.com/articles` | Article index page, clean URL (not `/inter/articles`). |
| 3.5 | Visit `https://staging.interdisciplinarist.com/articles/does-not-exist` | Clean 404 page, not a raw error. |
| 3.6 | View page source on `https://staging.interdisciplinarist.com` (Ctrl/Cmd+U) | `<link rel="canonical">` points at `https://staging.interdisciplinarist.com/`, **no** `hreflang` tags present (interdisciplinarist.com doesn't have EN/PT alternates). |
| 3.7 | View page source on `https://staging.magdakaspary.com` | Canonical URL points at `staging.magdakaspary.com`, hreflang tags for EN/PT **are** present. |

If 3.3 shows the `/inter`-prefixed layout instead of clean URLs, the hostname isn't matching — double check the domain was added correctly in 1b and that you typed `staging.interdisciplinarist.com` (not the apex domain) in the browser.

---

## 4. Testing Sprint 4 — Beehiiv article gating

**What you're checking**: free articles show in full, preview/premium articles gate behind an email form, and submitting the form actually creates a subscriber in your Beehiiv **test** publication (not the real one).

Two dummy articles exist on staging for exactly this purpose — they won't appear on production:
- `[STAGING TEST] Free article — gating QA fixture` (`tier: free`)
- `[STAGING TEST] Preview article — gating QA fixture` (`tier: preview`)

| # | Step | Expected result |
|---|---|---|
| 4.1 | Visit `https://staging.interdisciplinarist.com/articles` | Both test articles listed. The preview one shows a small violet "Preview" badge next to its title; the free one shows no badge. |
| 4.2 | Open the **free** test article | Full content visible immediately, no form, no fade-out. Exactly like a normal article. |
| 4.3 | Open the **preview** test article | Content fades out after a few paragraphs, followed by the article's excerpt, a "Subscribe free to keep reading" message, and an email input + Subscribe button. |
| 4.4 | Enter a real or disposable email you can check, click **Subscribe** | Button briefly shows "Subscribing…", then the fade/form disappears and the rest of the article content reveals in place — **no page reload**. |
| 4.5 | Check the Beehiiv **test** publication's subscriber list | The email you entered appears as a subscriber, with `utm_source: article-reader`. If you don't see it, see Troubleshooting below. |
| 4.6 | Reload the preview article page | The gate reappears (this is a known, deliberate limitation — there's no "remember me" cookie yet, flagged in the roadmap as a follow-up, not a bug). |
| 4.7 | Try submitting an obviously invalid email (e.g. `notanemail`) | Inline red error message, form stays usable, no page reload. |
| 4.8 | Try submitting with the network offline (DevTools → Network → offline, or just kill your wifi briefly) | Inline error message ("Something went wrong…"), button re-enables, you can retry. |

### 4b. Testing the API directly (optional, more technical)

If you want to confirm the endpoint itself works independent of the UI:

```bash
curl -i -X POST https://staging.interdisciplinarist.com/api/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"your-test-email@example.com","source":"article-reader"}'
```

Expected: `HTTP/2 200` and `{"success":true}`. If you get a `500` with `"Server misconfiguration: missing Beehiiv credentials."`, the secrets from step 1d aren't set on the staging project yet.

**This same command run against `staging.magdakaspary.com/api/subscribe` should also return 200** — the endpoint isn't interdisciplinarist-specific.

**The important negative test** (this is the bug PR #3 fixed): before the fix, hitting `/api/subscribe` on the interdisciplinarist hostname would have 404'd because the middleware was rewriting all non-`/inter` paths, including API routes. Confirming 200 here on `staging.interdisciplinarist.com` is confirming that fix actually works, not just that it compiles.

---

## 5. Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Cloudflare error page on `staging.*` domains | SSL/DNS still provisioning | Wait 5–10 min after adding the domain, retry |
| `staging.interdisciplinarist.com` shows `/inter`-prefixed URLs instead of clean ones | Domain not actually added, or typo | Recheck Settings → Domains & Routes on the staging project |
| Subscribe form always errors with "missing Beehiiv credentials" | Secrets not set, or set on the wrong project | Confirm `BEEHIIV_API_KEY`/`BEEHIIV_PUBLICATION_ID` are on the **staging** project's Variables and Secrets, not production's |
| Subscribe form errors with a Beehiiv API error (4xx) | Wrong API key/publication ID pairing, or key lacks `subscriptions:write` scope | Regenerate the API key in Beehiiv, confirm it belongs to the test publication whose ID you used |
| Subscribed email doesn't show up in Beehiiv | Checked the wrong publication (real vs. test) | Double check you're looking at the **test** publication's subscriber list, not the real one |
| Staging build fails in Cloudflare | Check the build log in the dashboard — same build process as production, so a failure here means something in the code is actually broken (not a staging-specific issue) | Read the error, or flag it back to Claude Code with the build log link |

---

## 6. What's NOT tested here (by design)

- **Payments** — Stripe isn't wired yet (Sprint 5, S22). Nothing to test.
- **Premium enforcement** — the `premium` tier currently shows the same free-email gate as `preview`, with different copy. There's no real "did they pay" check yet (S23). Don't expect premium articles to behave differently from preview ones until that lands.
- **Assessments/workbooks** — still stub "coming soon" pages (S19/S25).
- **The "already subscribed" cookie** — deliberately not built this pass; the gate reappears on every reload (see 4.6).

---

## 7. After you're satisfied

Once staging checks out, promote to production in this order (mirrors the roadmap's "Your action, right now" table):
1. Merge PR #2 (Sprint 3 routing) to `main`.
2. Merge PR #3 (Beehiiv gating) to `main` — it's stacked on #2, so merge #2 first or it won't have a clean diff.
3. Do A2 (add `interdisciplinarist.com` as a real custom domain) and A5's production half (real Beehiiv secrets on the `magda-web` project) if you haven't already.
4. Repeat Sections 3–4 above against the real `interdisciplinarist.com` domain as a final production sanity check.
