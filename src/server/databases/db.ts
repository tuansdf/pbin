import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { ENV } from "@/shared/constants/env.constant";

export const connection = new Database(ENV.DB_URL);

export const db = drizzle(connection);
