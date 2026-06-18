"use client";

import { useEffect, useState } from "react";

type PersistApi = {
  hasHydrated: () => boolean;
  onFinishHydration: (callback: () => void) => () => void;
};

export function usePersistHydrated(persist: PersistApi): boolean {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (persist.hasHydrated()) {
      setHydrated(true);
      return;
    }

    return persist.onFinishHydration(() => setHydrated(true));
  }, [persist]);

  return hydrated;
}
