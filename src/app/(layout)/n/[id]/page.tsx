import { NotFound } from "@/components/not-found";
import { NoteDetail } from "@/components/notes/note-detail";
import { vaultRepository } from "@/databases/repositories/vault.repository";
import { Button } from "@mantine/core";
import Link from "next/link";

export default async function DetailPage({ params }: { params: { id: string } }) {
  const item = await vaultRepository.getTopByPublicId(params.id);

  return (
    <>
      <Button component={Link} href="/n-add" mb="md">
        New paste
      </Button>
      {!!item ? <NoteDetail item={item} /> : <NotFound />}
    </>
  );
}
