import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import chatRoutes from "./routes/chatRoutes.js";

const app = express();

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
});

app.use(limiter);
app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.status(200).json({
    ok: true,
    service: "portfolio-chatbot-api",
  });
});

app.use("/chat", chatRoutes);
export default app;
