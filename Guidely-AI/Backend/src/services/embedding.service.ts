import { InferenceClient } from "@huggingface/inference";
import { env } from "../config/env";
import { logger } from "../utils/logger";
import { AppError } from "../middleware/errorHandler";

const HF_EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2";

const hf = new InferenceClient(env.HUGGINGFACE_API_KEY);


export async function generateEmbedding(text: string): Promise<number[]> {
  if (!text.trim()) {
    throw new AppError("Cannot generate embedding for empty text", 400);
  }

  try {
    const result = await hf.featureExtraction({
      model: HF_EMBEDDING_MODEL,
      inputs: text.trim(),
    });

    // featureExtraction returns number[] | number[][] | number[][][]
    // For a single string input with this model, it returns number[]
    const embedding = result as number[];

    if (!Array.isArray(embedding) || embedding.length === 0) {
      throw new AppError("Empty embedding response from HuggingFace", 502);
    }

    return embedding;
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error("Embedding generation failed:", error);
    throw new AppError("Failed to generate embedding", 502);
  }
}


export async function generateEmbeddings(
  texts: string[]
): Promise<number[][]> {
  if (texts.length === 0) {
    return [];
  }

  const cleaned = texts.map((t) => t.trim()).filter((t) => t.length > 0);

  if (cleaned.length === 0) {
    throw new AppError("All provided texts are empty", 400);
  }

  try {
    const result = await hf.featureExtraction({
      model: HF_EMBEDDING_MODEL,
      inputs: cleaned,
    });

    // For batch input, featureExtraction returns number[][]
    const embeddings = result as number[][];

    if (!Array.isArray(embeddings) || embeddings.length === 0) {
      throw new AppError("Empty embedding response from HuggingFace", 502);
    }

    return embeddings;
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error("Batch embedding generation failed:", error);
    throw new AppError("Failed to generate embeddings", 502);
  }
}
