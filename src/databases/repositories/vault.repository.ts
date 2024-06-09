import { db } from "@/databases/db";
import { VaultTable } from "@/databases/entities/vault.entity";
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

  public getTopByPublicId = async (publicId: string): Promise<{ content: string | null }> => {
    const result = await db
      .select({
        content: VaultTable.content,
      })
      .from(VaultTable)
      .where(eq(VaultTable.publicId, publicId))
      .limit(1);
    return result?.[0];
  };

  public create = async ({
    content,
    publicId,
  }: {
    content: string;
    publicId?: string;
  }): Promise<{ publicId: string | null }> => {
    const result = await db
      .insert(VaultTable)
      .values({ content, publicId })
      .returning({ publicId: VaultTable.publicId });
    return result?.[0];
  };
}

export const vaultRepository = new VaultRepository();
