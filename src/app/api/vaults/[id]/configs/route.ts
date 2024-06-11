import { vaultRepository } from "@/server/databases/repositories/vault.repository";

export const GET = async (request: Request, { params }: { params: { id: string } }) => {
  try {
    const id = params.id;
    if (!id) {
      throw new Error();
    }
    const vault = await vaultRepository.getTopByPublicId(id);
    console.log({ vault });
    if (!vault) {
      throw new Error();
    }
    return Response.json({ passwordConfig: vault.passwordConfig });
  } catch (e) {
    return Response.json({ message: "Something Went Wrong" }, { status: 500 });
  }
};
