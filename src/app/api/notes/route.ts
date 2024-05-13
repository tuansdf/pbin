import { db } from "@/databases/db";
import { NoteTable } from "@/databases/note.entity";

export const POST = async (request: Request) => {
  const body = await request.json();
  const content = body.content || "";
  const result = await db.insert(NoteTable).values({ content }).returning();
  return Response.json({ slug: result?.[0]?.slug });
};
