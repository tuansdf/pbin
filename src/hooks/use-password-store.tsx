import { useLocalStorage } from "@/hooks/use-local-storage";

export const usePasswordStore = () => {
  return useLocalStorage<Set<string> | null | undefined>({
    defaultValue: new Set(),
    key: "pbin-pass",
    serialize: (value) => JSON.stringify(Array.from(value || [])),
    deserialize: (value) => new Set(JSON.parse(value || "[]")),
  });
};
