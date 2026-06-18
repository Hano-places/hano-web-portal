import { createJSONStorage, type StateStorage } from "zustand/middleware";

function createSafeStateStorage(): StateStorage {
  return {
    getItem: (name) => {
      const value = localStorage.getItem(name);
      if (!value?.trim()) return null;
      try {
        JSON.parse(value);
        return value;
      } catch {
        localStorage.removeItem(name);
        return null;
      }
    },
    setItem: (name, value) => localStorage.setItem(name, value),
    removeItem: (name) => localStorage.removeItem(name),
  };
}

export function createSafePersistStorage() {
  return createJSONStorage(() => createSafeStateStorage());
}
