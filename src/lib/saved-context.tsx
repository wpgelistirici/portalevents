"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

/* ============================================
   TYPES
   ============================================ */
export type SavedItemType = "post" | "event" | "venue" | "artist";

export interface SavedItem {
  id: string;
  type: SavedItemType;
  savedAt: number; // timestamp
}

interface SavedContextType {
  savedItems: SavedItem[];
  isSaved: (id: string, type: SavedItemType) => boolean;
  toggleSave: (id: string, type: SavedItemType) => boolean; // returns new saved state
  getSavedByType: (type: SavedItemType) => SavedItem[];
  totalSaved: number;
  // Toast state
  toast: { message: string; type: "save" | "unsave" } | null;
  clearToast: () => void;
}

const SavedContext = createContext<SavedContextType | undefined>(undefined);

const STORAGE_KEY = "pulse_saved_items";

/* ============================================
   PROVIDER
   ============================================ */
export function SavedProvider({ children }: { children: ReactNode }) {
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "save" | "unsave" } | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSavedItems(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
    setIsLoaded(true);
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedItems));
  }, [savedItems, isLoaded]);

  // Auto-clear toast
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(timer);
  }, [toast]);

  const isSaved = useCallback(
    (id: string, type: SavedItemType) => {
      return savedItems.some((item) => item.id === id && item.type === type);
    },
    [savedItems],
  );

  const toggleSave = useCallback(
    (id: string, type: SavedItemType): boolean => {
      const exists = savedItems.some((item) => item.id === id && item.type === type);

      if (exists) {
        setSavedItems((prev) => prev.filter((item) => !(item.id === id && item.type === type)));
        setToast({ message: "removedFromSaved", type: "unsave" });
        return false;
      } else {
        setSavedItems((prev) => [...prev, { id, type, savedAt: Date.now() }]);
        setToast({ message: "addedToSaved", type: "save" });
        return true;
      }
    },
    [savedItems],
  );

  const getSavedByType = useCallback(
    (type: SavedItemType) => {
      return savedItems.filter((item) => item.type === type).sort((a, b) => b.savedAt - a.savedAt);
    },
    [savedItems],
  );

  const clearToast = useCallback(() => setToast(null), []);

  return (
    <SavedContext.Provider
      value={{
        savedItems,
        isSaved,
        toggleSave,
        getSavedByType,
        totalSaved: savedItems.length,
        toast,
        clearToast,
      }}
    >
      {children}
    </SavedContext.Provider>
  );
}

/* ============================================
   HOOK
   ============================================ */
export function useSaved() {
  const ctx = useContext(SavedContext);
  if (!ctx) {
    throw new Error("useSaved must be used within a SavedProvider");
  }
  return ctx;
}
