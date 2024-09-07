import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/server/entities/*.entity.ts",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.APP_DB_URL || "",
  },
});
