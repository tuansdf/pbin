import { NoteAdd } from "@/components/note-add";

export const metadata = {
  title: "Create a note",
};

export default async function Page() {
  return <NoteAdd />;
}
