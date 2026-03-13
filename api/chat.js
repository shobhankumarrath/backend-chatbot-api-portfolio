import serverless from "serverless-http";
import express from "express";
import cors from "cors";
import chatRoutes from "../routes/chatRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

// This function is mounted at /api/chat on Vercel, so mount the router at /
app.use("/", chatRoutes);

export default serverless(app);

