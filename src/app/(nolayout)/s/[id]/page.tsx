import { LinkDetail } from "@/client/features/links/link-detail";
import { NotFound } from "@/client/components/not-found";
import { vaultRepository } from "@/server/databases/repositories/vault.repository";

export default async function DetailPage({ params }: { params: { id: string } }) {
  const item = await vaultRepository.getTopByPublicId(params.id);

  return <>{!!item ? <LinkDetail item={item} /> : <NotFound />}</>;
}
