import { generateReply } from "../services/aiservice.js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", async () => {
    try {
      const parsed = body ? JSON.parse(body) : {};
      const { message } = parsed;

      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }

      const reply = await generateReply(message);
      const formattedReply = reply.replace(/\n/g, "<br>");

      res.status(200).json({ reply: formattedReply });
    } catch (error) {
      console.error("Error in /api/chat handler:", error);
      res.status(500).json({
        error: "Internal Server Error",
        details: error.message,
      });
    }
  });
}
