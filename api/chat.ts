import fetch from "node-fetch";

export default async function handler(req, res) {
  const mockResponse = {
    id: "chatcmpl-mock123",
    object: "chat.completion",
    created: Math.floor(Date.now() / 1000),
    model: "grok-1",
    choices: [
      {
        index: 0,
        message: {
          role: "assistant",
          content: `Hi Jonas! You said: "${req.body?.messages?.[0]?.content}". Here's a mock Grok reply.`
        },
        finish_reason: "stop"
      }
    ],
    usage: {
      prompt_tokens: 10,
      completion_tokens: 12,
      total_tokens: 22
    }
  };

  res.status(200).json(mockResponse);
}