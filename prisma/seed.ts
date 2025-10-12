import { config } from "dotenv";
config();

import { execSync } from "child_process";

async function main() {
  console.log("🌱 Starting complete database seeding...\n");

  const seeds = [
    "seed-products.ts",
    "seed-customers.ts",
    "seed-orders.ts",
    "seed-reviews.ts",
  ];

  for (const seed of seeds) {
    console.log(`\n📦 Running ${seed}...`);
    try {
      execSync(`ts-node prisma/${seed}`, { stdio: "inherit" });
    } catch (error) {
      console.error(`❌ Error in ${seed}:`, error);
      process.exit(1);
    }
  }

  console.log("\n✅ All seeds completed successfully! 🎉");
}

main();
