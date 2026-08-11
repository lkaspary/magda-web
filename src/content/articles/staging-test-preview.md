---
title: "[STAGING TEST] Preview article — gating QA fixture"
excerpt: "Test fixture for the staging environment only. Confirms tier: 'preview' articles fade out and gate behind a Beehiiv email capture."
tags: ["test"]
publishDate: 2026-08-11
tier: preview
featured: false
---

This is a staging-only test fixture, not real content — used to verify that `tier: 'preview'` articles fade out after a few paragraphs and show a subscribe form.

## This part should be hidden until you subscribe

If you're reading this without having submitted an email, the gate isn't working — check the `GatedContent` component and the `/api/subscribe` response.

Submitting a test email here should create a subscriber in the **staging Beehiiv test publication** (not the real one) tagged with `utm_source: article-reader`.
