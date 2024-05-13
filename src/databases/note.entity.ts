import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";

export const NoteTable = sqliteTable("note", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  content: text("content"),
  slug: text("slug").$defaultFn(() => nanoid()),
});
