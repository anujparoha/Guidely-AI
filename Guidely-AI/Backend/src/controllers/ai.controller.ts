import { Request, Response, NextFunction } from "express";
import { streamChat, generateRoadmap, summarizeSession } from "../services/ai.service";
import { searchMentors } from "../services/mentorSearch.service";
import { prisma } from "../config/prisma";
import { logger } from "../utils/logger";

export async function chatHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { conversationId, message } = req.body as {
      conversationId: string;
      message: string;
    };

    const userId = req.user!.id;
    await streamChat(conversationId, message, res, userId);
  } catch (error) {
    if (res.headersSent) {
      logger.error("Streaming error:", error);
      res.end();
      return;
    }
    next(error);
  }
}

export async function roadmapHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { goal, currentSkills, timeline } = req.body as {
      goal: string;
      currentSkills: string[];
      timeline: string;
    };

    const userId = req.user!.id;
    const roadmap = await generateRoadmap(goal, currentSkills, timeline, userId);

    res.status(200).json({
      success: true,
      data: roadmap,
    });
  } catch (error) {
    next(error);
  }
}

export async function summarizeHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { transcript } = req.body as { transcript: string };

    const userId = req.user!.id;
    const summary = await summarizeSession(transcript, userId);

    res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (error) {
    next(error);
  }
}

export async function searchMentorsHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { query, topK } = req.body as { query: string; topK?: number };

    const userId = req.user?.id;
    const results = await searchMentors(query, topK, userId);

    res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error) {
    next(error);
  }
}

// ────────────────────────────────────
// History endpoints
// ────────────────────────────────────

export async function getConversationByIdHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.id;
    const id = req.params.id as string;

    const conversation = await prisma.conversation.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!conversation || conversation.menteeId !== userId) {
      res.status(404).json({
        success: false,
        error: "Conversation not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    next(error);
  }
}

export async function getConversationsHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.id;

    const conversations = await prisma.conversation.findMany({
      where: { menteeId: userId },
      orderBy: { updatedAt: "desc" },
      include: {
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    res.status(200).json({
      success: true,
      data: conversations,
    });
  } catch (error) {
    next(error);
  }
}

export async function getRoadmapsHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.id;

    const roadmaps = await prisma.savedRoadmap.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      success: true,
      data: roadmaps,
    });
  } catch (error) {
    next(error);
  }
}

export async function getSummariesHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.id;

    const summaries = await prisma.savedSummary.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      success: true,
      data: summaries,
    });
  } catch (error) {
    next(error);
  }
}

export async function getSearchHistoryHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.id;

    const searches = await prisma.searchHistory.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      success: true,
      data: searches,
    });
  } catch (error) {
    next(error);
  }
}
