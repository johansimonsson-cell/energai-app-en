import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "npx tsx prisma/seed.ts",
  },
  datasource: {
    // Prisma CLI uses a local file for schema operations
    // Runtime uses TURSO_DATABASE_URL via the libsql adapter
    url: "file:./prisma/dev.db",
  },
});
