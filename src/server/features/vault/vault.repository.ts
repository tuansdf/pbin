import { db } from "@/server/databases/db";
import { VaultTable } from "@/server/entities/vault.entity";
import { VaultCreate } from "@/server/features/vault/vault.type";
import { count, eq } from "drizzle-orm";

class VaultRepository {
  public countByPublicId = async (publicId: string) => {
    const result = await db.select({ value: count() }).from(VaultTable).where(eq(VaultTable.publicId, publicId));
    return result?.[0]?.value || 0;
  };

  public existsByPublicId = async (publicId: string) => {
    const result = await this.countByPublicId(publicId);
    return result > 0;
  };

  public getTopByPublicId = async (publicId: string) => {
    const result = await db
      .select({
        content: VaultTable.content,
      })
      .from(VaultTable)
      .where(eq(VaultTable.publicId, publicId))
      .limit(1);
    return result?.[0];
  };

  public deleteById = async (id: number) => {
    await db.delete(VaultTable).where(eq(VaultTable.id, id));
  };

  public getTopByPublicIdInternal = async (publicId: string) => {
    const result = await db.select().from(VaultTable).where(eq(VaultTable.publicId, publicId)).limit(1);
    return result?.[0];
  };

  public create = async (data: VaultCreate): Promise<{ publicId: string | null }> => {
    const result = await db.insert(VaultTable).values(data).returning({ publicId: VaultTable.publicId });
    return result?.[0];
  };
}

export const vaultRepository = new VaultRepository();
