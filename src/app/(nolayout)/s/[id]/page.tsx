import { NotFound } from "@/client/components/not-found";
import { LinkDetail } from "@/client/features/links/link-detail";
import { vaultService } from "@/server/features/vault/vault.service";

export default async function DetailPage({ params }: { params: { id: string } }) {
  const item = await vaultService.getTopByPublicId(params.id);

  return <>{!!item ? <LinkDetail item={item} /> : <NotFound />}</>;
}
