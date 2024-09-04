import { generateId } from "@/shared/utils/crypto";
import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const VaultTable = sqliteTable(
  "vault",
  {
    id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    publicId: text("public_id")
      .unique()
      .$defaultFn(() => generateId()),
    content: text("content"),
    password: text("password"),
    configs: text("configs"),
  },
  (table) => {
    return {
      publicIdIdx: uniqueIndex("public_id_idx").on(table.publicId),
    };
  },
);
