import { NoteHistory } from "@/client/features/notes/note-history";
import { Title } from "@mantine/core";

export const metadata = {
  title: "Note history",
};

export default function Page() {
  return (
    <>
      <Title mb="md">Note history</Title>

      <NoteHistory />
    </>
  );
}
