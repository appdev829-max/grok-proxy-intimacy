import type { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  runtime: 'edge', // Edge runtime is better for streaming
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const GROK_API_KEY = process.env.GROK_API_KEY;
  if (!GROK_API_KEY) {
    return res.status(500).json({ error: 'Grok API key not configured' });
  }

  try {
    const { messages } = req.body;

    const response = await fetch('https://api.grok.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GROK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'grok-1',
        messages,
        stream: true, // 👈 enable streaming
      }),
    });

    if (!response.ok || !response.body) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: 'Grok API error', detail: errorText });
    }

    // Pipe Grok’s stream directly to the client
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    response.body.pipe(res);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to connect to Grok API', detail: String(error) });
  }
}