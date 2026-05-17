import type { APIRoute } from 'astro';
import { Resend } from 'resend';

const TOPIC_LABELS: Record<string, string> = {
  coaching: 'Coaching',
  speaking: 'Speaking',
  book: 'Book a Talk',
  general: 'General',
};

export const POST: APIRoute = async ({ request, locals }) => {
  let body: Record<string, string>;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid request body.' }, 400);
  }

  const { name, email, topic, message } = body;
  if (!name?.trim() || !email?.trim() || !topic?.trim() || !message?.trim()) {
    return json({ error: 'All fields are required.' }, 400);
  }

  const apiKey =
    import.meta.env.RESEND_API_KEY ??
    (locals as { runtime?: { env?: Record<string, string> } }).runtime?.env?.RESEND_API_KEY;

  if (!apiKey) {
    return json({ error: 'Server misconfiguration: missing API key.' }, 500);
  }

  const resend = new Resend(apiKey);
  const topicLabel = TOPIC_LABELS[topic] ?? topic;

  const { error } = await resend.emails.send({
    from: 'Magda Kaspary <hello@magdakaspary.com>',
    to: ['magdakaspary@outlook.com'],
    replyTo: email,
    subject: `New message from ${name} — ${topicLabel}`,
    html: `
      <table style="font-family:sans-serif;font-size:15px;line-height:1.7;color:#2c2b29;max-width:580px;border-collapse:collapse">
        <tr><td style="padding:0 0 20px">
          <h2 style="margin:0;font-size:20px;color:#1b6b7a">New contact form submission</h2>
        </td></tr>
        <tr><td style="padding:4px 0"><strong>Name:</strong> ${name}</td></tr>
        <tr><td style="padding:4px 0"><strong>Email:</strong> <a href="mailto:${email}" style="color:#1b6b7a">${email}</a></td></tr>
        <tr><td style="padding:4px 0"><strong>Inquiry type:</strong> ${topicLabel}</td></tr>
        <tr><td style="padding:20px 0 4px"><strong>Message:</strong></td></tr>
        <tr><td style="padding:8px 16px;background:#f7f5f2;border-left:3px solid #1b6b7a;white-space:pre-wrap">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</td></tr>
      </table>
    `,
  });

  if (error) {
    console.error('Resend error:', error);
    return json({ error: 'Failed to send email. Please try again.' }, 500);
  }

  return json({ success: true }, 200);
};

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
