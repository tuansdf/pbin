import { NoteTable } from "@/databases/note.entity";

export type Note = typeof NoteTable.$inferSelect;
