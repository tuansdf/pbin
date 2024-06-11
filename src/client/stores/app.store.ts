import { create } from "zustand";
import { persist, StorageValue } from "zustand/middleware";

type AppState = {
  passwords: Set<string | undefined | null> | undefined | null;
  noteUrls: Set<string | undefined | null> | undefined | null;
  shortUrls: Set<string | undefined | null> | undefined | null;
  addPassword: (a: string) => void;
  addNoteUrl: (a: string) => void;
  addShortUrl: (a: string) => void;
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      passwords: new Set(),
      noteUrls: new Set(),
      shortUrls: new Set(),
      addPassword: (text) => set((state) => ({ passwords: new Set(state.passwords).add(text) })),
      addNoteUrl: (text) => set((state) => ({ noteUrls: new Set(state.noteUrls).add(text) })),
      addShortUrl: (text) => set((state) => ({ shortUrls: new Set(state.shortUrls).add(text) })),
    }),
    {
      name: "store",
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          const { state } = JSON.parse(str);
          return {
            state: {
              passwords: new Set(state.passwords),
              noteUrls: new Set(state.noteUrls),
              shortUrls: new Set(state.shortUrls),
            },
          } as any;
        },
        setItem: (name, newValue: StorageValue<AppState>) => {
          const str = JSON.stringify({
            state: {
              passwords: Array.from(newValue.state.passwords || []),
              noteUrls: Array.from(newValue.state.noteUrls || []),
              shortUrls: Array.from(newValue.state.shortUrls || []),
            },
          });
          localStorage.setItem(name, str);
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    },
  ),
);
