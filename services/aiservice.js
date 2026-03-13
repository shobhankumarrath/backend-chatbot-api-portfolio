import { loadKnowledge } from "../utils/loadKnowledge.js";

export async function generateReply(message) {
  console.log("inside the aiservice");

  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not set");
  }

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

  const controller = new AbortController();
  const timeoutMs = 8000;
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
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
        signal: controller.signal,
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
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error(
        `Groq request timed out after ${timeoutMs}ms. Deployment likely hit function timeout.`,
      );
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
