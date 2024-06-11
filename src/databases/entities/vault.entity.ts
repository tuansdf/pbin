import { generateId } from "@/utils/crypto";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const VaultTable = sqliteTable("vault", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  publicId: text("public_id")
    .unique()
    .$defaultFn(() => generateId()),
  content: text("content"),
  password: text("password"),
  passwordConfig: text("password_config"),
});
