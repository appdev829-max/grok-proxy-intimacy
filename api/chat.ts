import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    const echoRes = await fetch("https://httpbin.org/post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    const data = await echoRes.json();
    res.status(200).json({ echo: data.json });
  } catch (err) {
    res.status(500).json({ error: "Proxy error", details: err.message });
  }
}

