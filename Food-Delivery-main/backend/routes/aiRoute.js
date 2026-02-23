import express from "express";
import { chatWithAI, smartSearch, getRecommendations } from "../controllers/aiController.js";
import authMiddleware from "../middleware/auth.js";

const aiRouter = express.Router();

aiRouter.post("/chat", chatWithAI);
aiRouter.post("/search", smartSearch);
aiRouter.post("/recommend", authMiddleware, getRecommendations);

export default aiRouter;
