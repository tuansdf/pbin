import { generateId } from "@/shared/utils/crypto";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const VaultTable = sqliteTable("vault", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  publicId: text("public_id", { mode: "text", length: 128 })
    .unique()
    .$defaultFn(() => generateId()),
  content: text("content", { mode: "text", length: 20000 }),
  masterPassword: text("master_password", { mode: "text", length: 128 }),
  configs: text("configs", { mode: "text", length: 512 }),
  expiresAt: integer("expires_at", { mode: "number" }),
});
