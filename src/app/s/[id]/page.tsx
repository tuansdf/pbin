import { LinkDetail } from "@/components/link-detail";
import { NotFound } from "@/components/not-found";
import { vaultRepository } from "@/databases/repositories/vault.repository";
import Link from "next/link";

export default async function DetailPage({ params }: { params: { id: string } }) {
  const item = await vaultRepository.getTopByPublicId(params.id);

  return (
    <main className="container">
      <Link href="/s/add" style={{ display: "inline-block", marginBottom: "1rem" }}>
        New link
      </Link>
      {!!item ? <LinkDetail item={item} /> : <NotFound />}
    </main>
  );
}
