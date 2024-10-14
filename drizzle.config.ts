import { ENV } from "@/server/constants/env.constant";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/server/entities/*.entity.ts",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url: ENV.DB_URL || "",
  },
});
