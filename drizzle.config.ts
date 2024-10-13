import { defineConfig } from "drizzle-kit";
import { ENV } from "@/shared/constants/env.constant";

export default defineConfig({
  schema: "./src/server/entities/*.entity.ts",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url: ENV.DB_URL || "",
  },
});
