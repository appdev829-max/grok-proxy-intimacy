import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const GROK_API_KEY = process.env.GROK_API_KEY;
  if (!GROK_API_KEY) {
    res.status(500).json({ error: 'Grok API key not configured' });
    return;
  }

  try {
    const body = req.body; // <-- Vercel parses JSON for you

    const grokResponse = await fetch('https://api.grok.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GROK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'grok-1',
        messages: body.messages,
      }),
    });

    if (!grokResponse.ok) {
      const errorText = await grokResponse.text();
      res.status(grokResponse.status).json({ error: 'Grok API error', detail: errorText });
      return;
    }

    const data = await grokResponse.json();
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Proxy error', detail: String(error) });
  }
}