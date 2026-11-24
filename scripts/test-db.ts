// Quick connection test
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function test() {
  try {
    console.log("🔌 Connecting to Neon database...");
    await prisma.$connect();
    const result = await prisma.$queryRaw`SELECT 1 as ping`;
    console.log("✅ Database is CONNECTED!", result);
    await prisma.$disconnect();
  } catch (err) {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  }
}

test();
