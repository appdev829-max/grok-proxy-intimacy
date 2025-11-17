// api/chat.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const GROK_API_KEY = process.env.GROK_API_KEY;

  if (!GROK_API_KEY) {
    console.error('Missing GROK_API_KEY in environment variables');
    return res.status(500).json({ error: 'Grok API key not configured' });
  }

  console.log('GROK_API_KEY starts with:', GROK_API_KEY.slice(0, 5));

  try {
    const response = await fetch('https://api.grok.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GROK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'grok-1',
        messages: req.body.messages,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Grok API error:', errorText);
      return res.status(response.status).json({ error: 'Grok API error', detail: errorText });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ error: 'Failed to connect to Grok API', detail: String(error) });
  }
}
