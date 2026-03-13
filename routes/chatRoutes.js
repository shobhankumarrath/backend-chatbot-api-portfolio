import express from "express";
import { chatController } from "../controller/chatController.js";

const router = express.Router();
router.post("/", chatController);

export default router;
