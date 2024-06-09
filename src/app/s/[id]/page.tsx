import { LinkDetail } from "@/components/link-detail";
import { NotFound } from "@/components/not-found";
import { vaultRepository } from "@/databases/repositories/vault.repository";
import { Button } from "@mantine/core";
import Link from "next/link";

export default async function DetailPage({ params }: { params: { id: string } }) {
  const item = await vaultRepository.getTopByPublicId(params.id);

  return (
    <>
      <Button component={Link} href="/n/add" mb="1rem">
        New link
      </Button>
      {!!item ? <LinkDetail item={item} /> : <NotFound />}
    </>
  );
}
