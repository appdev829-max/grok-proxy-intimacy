import fetch from "node-fetch";

export default async function handler(req, res) {
  const GROK_API_URL = "https://grok.api.x.ai/api/chat";
  const GROK_API_KEY = process.env.GROK_API_KEY;

  if (!GROK_API_KEY) {
    return res.status(500).json({ error: "Missing GROK_API_KEY" });
  }

  try {
    const grokRes = await fetch(GROK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROK_API_KEY}`,
      },
      body: JSON.stringify(req.body),
    });

    const data = await grokRes.json();
    res.status(grokRes.status).json(data);
  } catch (err) {
    res.status(500).json({ error: "Proxy error", details: err.message });
  }
}