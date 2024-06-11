import { VaultTable } from "@/server/databases/entities/vault.entity";

export type Note = typeof VaultTable.$inferSelect;
