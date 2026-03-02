import { QdrantClient } from "@qdrant/js-client-rest";
import { env } from "./env";
import { logger } from "../utils/logger";

export const qdrantClient = new QdrantClient({
  url: env.QDRANT_URL,
  apiKey: env.QDRANT_API_KEY,
});

export const EMBEDDING_DIMENSION = 384; // sentence-transformers/all-MiniLM-L6-v2

export async function ensureCollection(): Promise<void> {
  const collectionName = env.QDRANT_COLLECTION;

  try {
    const collections = await qdrantClient.getCollections();
    const exists = collections.collections.some(
      (c) => c.name === collectionName
    );

    if (!exists) {
      await qdrantClient.createCollection(collectionName, {
        vectors: {
          size: EMBEDDING_DIMENSION,
          distance: "Cosine",
        },
      });
      logger.info(`Created Qdrant collection "${collectionName}" (${EMBEDDING_DIMENSION}d, Cosine)`);
    } else {
      logger.debug(`Qdrant collection "${collectionName}" already exists`);
    }
  } catch (error) {
    logger.error("Failed to ensure Qdrant collection:", error);
    throw error;
  }
}
