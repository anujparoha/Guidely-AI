import { Router } from "express";
import { z } from "zod";
import { validate } from "../middleware/validate";
import {
  chatHandler,
  roadmapHandler,
  summarizeHandler,
  searchMentorsHandler,
  getConversationByIdHandler,
  getConversationsHandler,
  getRoadmapsHandler,
  getSummariesHandler,
  getSearchHistoryHandler,
} from "../controllers/ai.controller";

const router = Router();

const chatSchema = z.object({
  conversationId: z.string().min(1, "conversationId is required"),
  message: z.string().min(1, "message is required").max(5000, "message too long"),
});

const roadmapSchema = z.object({
  goal: z.string().min(1, "goal is required").max(500),
  currentSkills: z
    .array(z.string().min(1))
    .min(1, "at least one skill is required")
    .max(20),
  timeline: z.string().min(1, "timeline is required").max(100),
});

const summarizeSchema = z.object({
  transcript: z
    .string()
    .min(50, "transcript must be at least 50 characters")
    .max(50000, "transcript too long"),
});

const searchMentorsSchema = z.object({
  query: z.string().min(1, "query is required").max(500),
  topK: z.number().int().min(1).max(20).optional().default(5),
});

// AI action routes (all require auth — applied at app level)
router.post("/chat", validate(chatSchema), chatHandler);
router.post("/roadmap", validate(roadmapSchema), roadmapHandler);
router.post("/summarize", validate(summarizeSchema), summarizeHandler);
router.post("/search-mentors", validate(searchMentorsSchema), searchMentorsHandler);

// History routes
router.get("/conversations", getConversationsHandler);
router.get("/conversations/:id", getConversationByIdHandler);
router.get("/roadmaps", getRoadmapsHandler);
router.get("/summaries", getSummariesHandler);
router.get("/search-history", getSearchHistoryHandler);

export default router;
