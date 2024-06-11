import { NotFound } from "@/client/components/not-found";
import { NoteDetail } from "@/client/features/notes/note-detail";
import { vaultRepository } from "@/server/databases/repositories/vault.repository";

export default async function DetailPage({ params }: { params: { id: string } }) {
  const item = await vaultRepository.getTopByPublicId(params.id);

  return <>{!!item ? <NoteDetail item={item} /> : <NotFound />}</>;
}
