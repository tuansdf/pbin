import { NotFound } from "@/client/components/not-found";
import { LinkDetail } from "@/client/features/links/link-detail";
import { vaultService } from "@/server/features/vault/vault.service";
import { Box } from "@mantine/core";
import classes from "./styles.module.scss";

export default async function DetailPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: Record<string, string>;
}) {
  const item = await vaultService.getTopByPublicId(params.id, Object.keys(searchParams || {})[0]);

  return (
    <>
      {!!item ? (
        <Box className={classes["container"]}>
          <LinkDetail item={item} />
        </Box>
      ) : (
        <NotFound />
      )}
    </>
  );
}
