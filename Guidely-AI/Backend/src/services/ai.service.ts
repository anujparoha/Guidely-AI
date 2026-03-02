import { Response } from "express";
import { ChatCompletionMessageParam } from "groq-sdk/resources/chat/completions";
import { groq } from "../config/groq";
import { prisma } from "../config/prisma";
import { Prisma } from "@prisma/client";
import { logger } from "../utils/logger";
import { AppError } from "../middleware/errorHandler";

const MAX_HISTORY_MESSAGES = 20;
const MAX_HISTORY_CHARS = 12_000; // ~3000 tokens (4 chars ≈ 1 token)
const MAX_HISTORY_PER_USER = 5;

const CHAT_MODEL = "llama-3.3-70b-versatile";

const MENTOR_SYSTEM_PROMPT = `You are an expert AI career mentor with deep knowledge across technology, business, and professional development. Your role is to:

1. Provide thoughtful, personalized career guidance
2. Help mentees identify their strengths and growth areas
3. Suggest actionable steps for skill development
4. Share industry insights and trends
5. Encourage and motivate while being honest and realistic

Communication style:
- Be warm, professional, and encouraging
- Give specific, actionable advice rather than vague suggestions
- Use examples and analogies to explain complex concepts
- Ask clarifying questions when needed
- Break down complex topics into digestible pieces

Always prioritize the mentee's long-term growth over short-term fixes.`;



async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  baseDelay = 1000
): Promise<T> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === retries) throw error;
      const delay = baseDelay * Math.pow(2, attempt - 1);
      logger.warn(`Retry attempt ${attempt}/${retries} after ${delay}ms`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw new Error("Retry logic exhausted");
}


// Trims history to token budget, keeping most recent messages
function trimHistory(
  messages: ChatCompletionMessageParam[]
): ChatCompletionMessageParam[] {
  let totalChars = 0;
  const trimmed: ChatCompletionMessageParam[] = [];


  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];
    const content = typeof msg.content === "string" ? msg.content : "";
    if (totalChars + content.length > MAX_HISTORY_CHARS) break;
    totalChars += content.length;
    trimmed.unshift(msg);
  }

  return trimmed;
}

/**
 * Evicts oldest conversations for a user if at or above the cap.
 * Called before creating a new conversation.
 */
async function evictOldConversations(userId: string): Promise<void> {
  const count = await prisma.conversation.count({
    where: { menteeId: userId },
  });

  if (count >= MAX_HISTORY_PER_USER) {
    const toDelete = await prisma.conversation.findMany({
      where: { menteeId: userId },
      orderBy: { createdAt: "asc" },
      take: count - MAX_HISTORY_PER_USER + 1,
      select: { id: true },
    });

    await prisma.conversation.deleteMany({
      where: { id: { in: toDelete.map((c) => c.id) } },
    });

    logger.info(
      `Evicted ${toDelete.length} old conversation(s) for user ${userId}`
    );
  }
}


export async function streamChat(
  conversationId: string,
  userMessage: string,
  res: Response,
  userId: string
): Promise<void> {

  let conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
        take: MAX_HISTORY_MESSAGES,
      },
    },
  });

  if (conversation && conversation.menteeId !== userId) {
    res.status(403).json({
      success: false,
      error: "You don't have access to this conversation.",
    });
    return;
  }

  if (!conversation) {
    // Evict oldest if user is at the cap
    await evictOldConversations(userId);

    conversation = await prisma.conversation.create({
      data: {
        id: conversationId,
        menteeId: userId,
        title: userMessage.slice(0, 50) || "New Conversation",
      },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
          take: MAX_HISTORY_MESSAGES,
        },
      },
    });
    logger.info(`Created new conversation ${conversationId} for user ${userId}`);
  }


  const historyMessages: ChatCompletionMessageParam[] = conversation.messages.map(
    (msg: { role: string; content: string }) => ({
      role: msg.role.toLowerCase() as "user" | "assistant" | "system",
      content: msg.content,
    })
  );

  const trimmedHistory = trimHistory(historyMessages);


  await prisma.message.create({
    data: {
      conversationId,
      role: "USER",
      content: userMessage,
    },
  });


  const messages: ChatCompletionMessageParam[] = [
    { role: "system", content: MENTOR_SYSTEM_PROMPT },
    ...trimmedHistory,
    { role: "user", content: userMessage },
  ];


  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();


  let fullResponse = "";

  const stream = await withRetry(() =>
    groq.chat.completions.create({
      model: CHAT_MODEL,
      messages,
      stream: true,
      temperature: 0.7,
      max_tokens: 2048,
    })
  );

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) {
      fullResponse += content;
      res.write(`data: ${JSON.stringify({ content })}\n\n`);
    }
  }


  res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
  res.end();


  await prisma.message.create({
    data: {
      conversationId,
      role: "ASSISTANT",
      content: fullResponse,
    },
  });

  logger.info(`Chat streamed for conversation ${conversationId}`);
}



interface RoadmapPhase {
  phase: string;
  topics: string[];
  resources: string[];
}

interface RoadmapOutput {
  title: string;
  duration: string;
  phases: RoadmapPhase[];
}


export async function generateRoadmap(
  goal: string,
  currentSkills: string[],
  timeline: string,
  userId: string
): Promise<RoadmapOutput> {
  const systemPrompt = `You are an expert learning advisor. Generate a detailed, structured learning roadmap.

You MUST respond with ONLY valid JSON (no markdown, no explanation) matching this exact structure:
{
  "title": "string - descriptive title for the roadmap",
  "duration": "string - total estimated duration",
  "phases": [
    {
      "phase": "string - phase name with number",
      "topics": ["string - specific topics to learn"],
      "resources": ["string - specific resources (courses, books, tutorials)"]
    }
  ]
}

Guidelines:
- Create 3-6 phases based on the timeline
- Each phase should have 3-5 topics and 2-4 resources
- Resources should be real, well-known learning materials
- Consider the current skill level when ordering phases
- Be specific with topic names, not generic`;

  const userPrompt = `Create a learning roadmap for the following:
Goal: ${goal}
Current Skills: ${currentSkills.join(", ")}
Timeline: ${timeline}`;

  const completion = await withRetry(() =>
    groq.chat.completions.create({
      model: CHAT_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.6,
      max_tokens: 3000,
    })
  );

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new AppError("Failed to generate roadmap: empty response", 502);
  }

  const parsed = JSON.parse(content) as RoadmapOutput;


  if (!parsed.title || !parsed.duration || !Array.isArray(parsed.phases)) {
    throw new AppError("Invalid roadmap structure from AI", 502);
  }

  // Save to user history (with FIFO eviction)
  const roadmapCount = await prisma.savedRoadmap.count({
    where: { userId },
  });

  if (roadmapCount >= MAX_HISTORY_PER_USER) {
    const toDelete = await prisma.savedRoadmap.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
      take: roadmapCount - MAX_HISTORY_PER_USER + 1,
      select: { id: true },
    });
    await prisma.savedRoadmap.deleteMany({
      where: { id: { in: toDelete.map((r: { id: any; }) => r.id) } },
    });
  }

  await prisma.savedRoadmap.create({
    data: {
      userId,
      goal,
      currentSkills,
      timeline,
      result: parsed as unknown as Prisma.InputJsonValue,
    },
  });

  logger.info(`Roadmap generated and saved: "${parsed.title}" for user ${userId}`);
  return parsed;
}



interface SessionSummaryOutput {
  summary: string;
  keyTakeaways: string[];
  actionItems: string[];
}


export async function summarizeSession(
  transcript: string,
  userId: string
): Promise<SessionSummaryOutput> {
  const systemPrompt = `You are an expert at summarizing mentoring sessions. Analyze the provided transcript and extract key information.

You MUST respond with ONLY valid JSON (no markdown, no explanation) matching this exact structure:
{
  "summary": "string - a comprehensive 2-4 sentence summary of the session",
  "keyTakeaways": ["string - important insights or learnings from the session"],
  "actionItems": ["string - specific action items or next steps discussed"]
}

Guidelines:
- Summary should capture the main theme and outcomes
- Include 3-5 key takeaways
- Include 2-5 action items with specific, actionable language
- Use professional language
- Focus on actionable insights`;

  const completion = await withRetry(() =>
    groq.chat.completions.create({
      model: CHAT_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Please summarize this mentoring session transcript:\n\n${transcript}` },
      ],
      response_format: { type: "json_object" },
      temperature: 0.4,
      max_tokens: 1500,
    })
  );

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new AppError("Failed to summarize session: empty response", 502);
  }

  const parsed = JSON.parse(content) as SessionSummaryOutput;


  if (
    !parsed.summary ||
    !Array.isArray(parsed.keyTakeaways) ||
    !Array.isArray(parsed.actionItems)
  ) {
    throw new AppError("Invalid summary structure from AI", 502);
  }

  // Save to user history (with FIFO eviction)
  const summaryCount = await prisma.savedSummary.count({
    where: { userId },
  });

  if (summaryCount >= MAX_HISTORY_PER_USER) {
    const toDelete = await prisma.savedSummary.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
      take: summaryCount - MAX_HISTORY_PER_USER + 1,
      select: { id: true },
    });
    await prisma.savedSummary.deleteMany({
      where: { id: { in: toDelete.map((s: { id: any; }) => s.id) } },
    });
  }

  await prisma.savedSummary.create({
    data: {
      userId,
      transcript,
      result: parsed as unknown as Prisma.InputJsonValue,
    },
  });

  logger.info(`Session summarized and saved for user ${userId}`);
  return parsed;
}
