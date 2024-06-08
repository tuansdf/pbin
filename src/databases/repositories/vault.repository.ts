import { db } from "@/databases/db";
import { VaultTable } from "@/databases/entities/vault.entity";
import { eq } from "drizzle-orm";

class VaultRepository {
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
