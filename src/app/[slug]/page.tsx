import { Note } from "@/app/[slug]/note";
import { db } from "@/databases/db";
import { NoteTable } from "@/databases/note.entity";
import { eq } from "drizzle-orm";
import Link from "next/link";

const getNote = async (slug: string) => {
  const result = await db
    .select({
      content: NoteTable.content,
    })
    .from(NoteTable)
    .where(eq(NoteTable.slug, slug))
    .limit(1);
  return result?.[0];
};

export default async function NoteDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const note = await getNote(params.slug);

  return (
    <main className="container">
      <Link href="/" style={{ display: "inline-block", marginBottom: "1rem" }}>
        New paste
      </Link>
      {!!note ? <Note note={note} /> : <div>Not found</div>}
    </main>
  );
}
