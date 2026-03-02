import { Mentor } from "@prisma/client";
import { qdrantClient } from "../config/qdrant";
import { env } from "../config/env";
import { ensureCollection } from "../config/qdrant";
import { prisma } from "../config/prisma";
import { generateEmbedding, generateEmbeddings } from "./embedding.service";
import { logger } from "../utils/logger";
import { AppError } from "../middleware/errorHandler";

const MAX_HISTORY_PER_USER = 5;



interface MentorSearchResult {
  mentor: Mentor;
  similarityScore: number;
}




function composeMentorText(mentor: Mentor): string {
  return [
    `Name: ${mentor.name}`,
    `Bio: ${mentor.bio}`,
    `Skills: ${mentor.skills.join(", ")}`,
    `Expertise: ${mentor.expertise.join(", ")}`,
  ].join(" | ");
}

// Qdrant requires UUID or uint IDs — hash cuid strings via FNV-1a
function mentorIdToPointId(mentorId: string): number {
  let hash = 0x811c9dc5; // FNV offset basis (32-bit)
  for (let i = 0; i < mentorId.length; i++) {
    hash ^= mentorId.charCodeAt(i);
    hash = (hash * 0x01000193) >>> 0; // FNV prime, keep as unsigned 32-bit
  }
  return hash;
}




export async function upsertMentorEmbeddings(
  mentors: Mentor[]
): Promise<void> {
  if (mentors.length === 0) {
    logger.warn("No mentors to embed");
    return;
  }


  await ensureCollection();

  const texts = mentors.map(composeMentorText);
  const embeddings = await generateEmbeddings(texts);


  const BATCH_SIZE = 100;
  const collectionName = env.QDRANT_COLLECTION;

  for (let i = 0; i < mentors.length; i += BATCH_SIZE) {
    const batchMentors = mentors.slice(i, i + BATCH_SIZE);
    const points = batchMentors.map((mentor, idx) => ({
      id: mentorIdToPointId(mentor.id),
      vector: embeddings[i + idx],
      payload: {
        mentorId: mentor.id,
        name: mentor.name,
        email: mentor.email,
        skills: mentor.skills,
        expertise: mentor.expertise,
      },
    }));

    await qdrantClient.upsert(collectionName, {
      wait: true,
      points,
    });

    logger.info(
      `Upserted batch ${Math.floor(i / BATCH_SIZE) + 1} (${points.length} vectors)`
    );
  }

  logger.info(`Successfully upserted ${mentors.length} mentor embeddings`);
}




export async function searchMentors(
  query: string,
  topK = 5,
  userId?: string
): Promise<MentorSearchResult[]> {
  if (!query.trim()) {
    throw new AppError("Search query cannot be empty", 400);
  }


  const queryEmbedding = await generateEmbedding(query);


  const searchResults = await qdrantClient.search(env.QDRANT_COLLECTION, {
    vector: queryEmbedding,
    limit: topK,
    with_payload: true,
  });

  if (!searchResults || searchResults.length === 0) {
    return [];
  }


  const mentorIds = searchResults.map(
    (result) => (result.payload as Record<string, unknown>)["mentorId"] as string
  );

  const mentors = await prisma.mentor.findMany({
    where: { id: { in: mentorIds } },
  });


  const mentorMap = new Map(mentors.map((m: { id: string }) => [m.id, m]));


  const results: MentorSearchResult[] = searchResults
    .filter((result) => {
      const mentorId = (result.payload as Record<string, unknown>)["mentorId"] as string;
      return mentorMap.has(mentorId);
    })
    .map((result) => {
      const mentorId = (result.payload as Record<string, unknown>)["mentorId"] as string;
      return {
        mentor: mentorMap.get(mentorId) as Mentor,
        similarityScore: result.score,
      };
    });

  // Save to user search history (with FIFO eviction)
  if (userId) {
    const searchCount = await prisma.searchHistory.count({
      where: { userId },
    });

    if (searchCount >= MAX_HISTORY_PER_USER) {
      const toDelete = await prisma.searchHistory.findMany({
        where: { userId },
        orderBy: { createdAt: "asc" },
        take: searchCount - MAX_HISTORY_PER_USER + 1,
        select: { id: true },
      });
      await prisma.searchHistory.deleteMany({
        where: { id: { in: toDelete.map((s) => s.id) } },
      });
    }

    await prisma.searchHistory.create({
      data: {
        userId,
        query,
        topK,
        resultIds: results.map((r) => r.mentor.id),
      },
    });
  }

  logger.info(
    `Mentor search for "${query}" returned ${results.length} results`
  );
  return results;
}
