import { NotFound } from "@/client/components/not-found";
import { NoteDetail } from "@/client/features/notes/note-detail";
import { vaultService } from "@/server/features/vault/vault.service";

export default async function DetailPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: Record<string, string>;
}) {
  const item = await vaultService.getTopByPublicId(params.id, Object.keys(searchParams || {})[0]);

  return <>{!!item ? <NoteDetail item={item} /> : <NotFound />}</>;
}
