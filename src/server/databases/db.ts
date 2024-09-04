import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";

export const connection = new Database(process.env.APP_DB_URL);

export const db = drizzle(connection);
