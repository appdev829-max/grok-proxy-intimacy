export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const GROK_API_KEY = process.env.GROK_API_KEY;
  if (!GROK_API_KEY) {
    return new Response(JSON.stringify({ error: 'Grok API key not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await req.json();

    // --- Echo fallback for quick testing ---
    if (!body.messages) {
      return new Response(JSON.stringify({ echo: body }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // --- Grok API call with timeout ---
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

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
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!grokResponse.ok) {
      const errorText = await grokResponse.text();
      return new Response(JSON.stringify({ error: 'Grok API error', detail: errorText }), {
        status: grokResponse.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await grokResponse.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Proxy error', detail: String(error) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}