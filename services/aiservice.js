import { loadKnowledge } from "../utils/loadKnowledge.js";
export async function generateReply(message) {
  console.log("inside the aiservice");
  const knowledge = loadKnowledge();
  const prompt = `
  You are an AI assistant on a developer portfolio website.

Rules:
- Answer clearly and concisely
- Use plain text only
- DO NOT use HTML tags like <br> or <b>
- Use bullet points with "-" if needed

Developer information:

    ${knowledge}

    user Question:
    ${message}
    `;

  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: prompt,
          },
        ],
      }),
    },
  );
  const data = await response.json();

  console.log("Groq response:", data);

  if (!data.choices) {
    throw new Error("AI response error: " + JSON.stringify(data));
  }
  const reply = data.choices[0].message.content;
  const cleanReply = reply.replace(/<[^>]*>/g, "");
  return cleanReply;
}
