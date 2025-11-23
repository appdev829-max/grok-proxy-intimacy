export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const body = await req.json();
  return new Response(JSON.stringify({ echo: body }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}