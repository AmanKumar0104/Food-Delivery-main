import express from "express";
import { chatbotController, clearChatHistory, getQuickResponses } from "../controllers/chatbotController.js";

const chatbotRouter = express.Router();

// Chat endpoint
chatbotRouter.post("/chat", chatbotController);

// Clear chat history
chatbotRouter.post("/clear", clearChatHistory);

// Get quick response options
chatbotRouter.get("/quick-responses", getQuickResponses);

export default chatbotRouter;
