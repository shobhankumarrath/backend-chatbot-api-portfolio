import { generateReply } from "../services/aiservice.js";

export async function chatController(req, res) {
  try {
    console.log("Request received:", req.body);

    const { message } = req.body;
    if (!message) {
      return res.status(400).json({
        message: "Message is required",
      });
    }
    const reply = await generateReply(message);

    const formattedReply = reply.replace(/\n/g, "<br>");

    res.status(200).json({
      reply: formattedReply,
    });
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Error",
      details: error.message,
    });
  }
}
