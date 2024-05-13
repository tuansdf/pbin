import { NewNote } from "@/app/new-note";

export default async function Home() {
  return (
    <main className="container">
      <NewNote />
    </main>
  );
}
