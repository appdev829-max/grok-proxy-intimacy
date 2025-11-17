export default async function handler(req, res) {
  try {
    const response = await fetch("https://api.grok.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROK_API_KEY}`
      },
      body: JSON.stringify({
        model: "grok-1",
        messages: req.body.messages
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Grok API error:", errorText);
      return res.status(response.status).json({ error: "Grok API error", detail: errorText });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).json({ error: "Failed to connect to Grok API" });
  }
}



