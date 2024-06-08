import { NotFound } from "@/components/not-found";
import { NoteDetail } from "@/components/note-detail";
import { vaultRepository } from "@/databases/repositories/vault.repository";
import Link from "next/link";

export default async function DetailPage({ params }: { params: { id: string } }) {
  const item = await vaultRepository.getTopByPublicId(params.id);

  return (
    <main className="container">
      <Link href="/n/add" style={{ display: "inline-block", marginBottom: "1rem" }}>
        New paste
      </Link>
      {!!item ? <NoteDetail item={item} /> : <NotFound />}
    </main>
  );
}
