import { LinkDetail } from "@/components/link-detail";
import { NotFound } from "@/components/not-found";
import { vaultRepository } from "@/databases/repositories/vault.repository";

export default async function DetailPage({ params }: { params: { id: string } }) {
  const item = await vaultRepository.getTopByPublicId(params.id);

  return <>{!!item ? <LinkDetail item={item} /> : <NotFound />}</>;
}
