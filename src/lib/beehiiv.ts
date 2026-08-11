import { env as cfEnv } from 'cloudflare:workers';

// Content source driving both the welcome-email UTM tag and, eventually,
// which gated component (article/assessment/workbook) triggered the signup.
export type BeehiivSource = 'article-reader' | 'assessment-taker' | 'workbook-sample';

export async function subscribeToBeehiiv(
  email: string,
  source: BeehiivSource
): Promise<{ ok: true } | { ok: false; error: string }> {
  const apiKey = import.meta.env.BEEHIIV_API_KEY ?? (cfEnv as Record<string, string>).BEEHIIV_API_KEY;
  const publicationId =
    import.meta.env.BEEHIIV_PUBLICATION_ID ?? (cfEnv as Record<string, string>).BEEHIIV_PUBLICATION_ID;

  if (!apiKey || !publicationId) {
    return { ok: false, error: 'Server misconfiguration: missing Beehiiv credentials.' };
  }

  // Beehiiv's subscription-create endpoint has no "tags" field — tagging by
  // content source is done via utm_source (a built-in field, unlike
  // custom_fields which must already exist in the publication's dashboard).
  const res = await fetch(`https://api.beehiiv.com/v2/publications/${publicationId}/subscriptions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      email,
      reactivate_existing: true,
      send_welcome_email: true,
      utm_source: source,
    }),
  });

  if (!res.ok) {
    return { ok: false, error: `Beehiiv API error (${res.status})` };
  }

  return { ok: true };
}
