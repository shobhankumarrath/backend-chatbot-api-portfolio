import express from "express";
import cors from "cors";
import chatRoutes from "./routes/chatRoutes.js";
import dotenv from "dotenv";

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());

app.use("/chat", chatRoutes);
export default app;
