import type { APIRoute } from 'astro';
import { subscribeToBeehiiv, type BeehiivSource } from '../../lib/beehiiv';

const VALID_SOURCES: BeehiivSource[] = ['article-reader', 'assessment-taker', 'workbook-sample'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const POST: APIRoute = async ({ request }) => {
  let body: Record<string, string>;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid request body.' }, 400);
  }

  const email = body.email?.trim();
  const source = body.source as BeehiivSource;

  if (!email || !EMAIL_RE.test(email)) {
    return json({ error: 'A valid email is required.' }, 400);
  }
  if (!VALID_SOURCES.includes(source)) {
    return json({ error: 'Invalid subscription source.' }, 400);
  }

  const result = await subscribeToBeehiiv(email, source);
  if (!result.ok) {
    console.error('Beehiiv subscribe error:', result.error);
    return json({ error: 'Failed to subscribe. Please try again.' }, 500);
  }

  return json({ success: true }, 200);
};

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
