import { NotFound } from "@/client/components/not-found";
import { NoteDetail } from "@/client/features/notes/note-detail";
import { vaultService } from "@/server/features/vault/vault.service";

export default async function DetailPage({ params }: { params: { id: string } }) {
  const item = await vaultService.getTopByPublicId(params.id);

  return <>{!!item ? <NoteDetail item={item} /> : <NotFound />}</>;
}
