"use client";
import { useEffect, useState } from "react";
import type { LearnerState } from "@/types";

/** Browser-local persistence (localStorage, versioned key). No account,
 *  no server, no Supabase in v1. */
export const STORAGE_KEY = "ai-anime-tutor-v1";

export function loadState(): LearnerState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as LearnerState) : null;
  } catch {
    return null;
  }
}

export function saveState(state: LearnerState | null): void {
  if (typeof window === "undefined") return;
  try {
    if (state) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // storage unavailable — keep working in memory
  }
}

export function useLearnerState(): [LearnerState | null, (s: LearnerState | null) => void, boolean] {
  const [state, setState] = useState<LearnerState | null>(null);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setState(loadState());
    setHydrated(true);
  }, []);
  const update = (next: LearnerState | null) => {
    setState(next);
    saveState(next);
  };
  return [state, update, hydrated];
}
