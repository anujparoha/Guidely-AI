import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";
import { upsertMentorEmbeddings } from "../services/mentorSearch.service";



const prisma = new PrismaClient().$extends(withAccelerate());

async function embedMentors(): Promise<void> {
  console.log("🔄 Fetching all mentors from database...\n");

  const mentors = await (prisma as unknown as PrismaClient).mentor.findMany();

  if (mentors.length === 0) {
    console.log("⚠️  No mentors found. Run 'npm run seed' first.");
    return;
  }

  console.log(`📊 Found ${mentors.length} mentors. Generating embeddings...\n`);

  await upsertMentorEmbeddings(mentors);

  console.log("\n🎉 All mentor embeddings upserted to Qdrant successfully!");
}

embedMentors()
  .catch((error) => {
    console.error("❌ Embedding failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await (prisma as unknown as PrismaClient).$disconnect();
  });
