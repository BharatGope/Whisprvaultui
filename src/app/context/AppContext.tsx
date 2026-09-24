import { createContext, useContext, useState, type ReactNode } from "react";
import type { Note } from "../types";

interface AppContextType {
  hasPassword: boolean;
  setHasPassword: (v: boolean) => void;
  isUnlocked: boolean;
  setIsUnlocked: (v: boolean) => void;
  masterPassword: string;
  setMasterPassword: (v: string) => void;
  notes: Note[];
  setNotes: (notes: Note[] | ((prev: Note[]) => Note[])) => void;
  customCategories: string[];
  setCustomCategories: (cats: string[] | ((prev: string[]) => string[])) => void;
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
  autoLockTimer: number;
  setAutoLockTimer: (v: number) => void;
  autoLockDuration: number;
  setAutoLockDuration: (v: number) => void;
  showExportDialog: boolean;
  setShowExportDialog: (v: boolean) => void;
  showImportDialog: boolean;
  setShowImportDialog: (v: boolean) => void;
}

const AppContext = createContext<AppContextType>(null!);

export function useAppContext() {
  return useContext(AppContext);
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [hasPassword, setHasPassword] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [masterPassword, setMasterPassword] = useState("");
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [notes, setNotes] = useState<Note[]>([
    {
      id: "1",
      title: "Meeting Notes",
      content: "Discussed Q4 planning and budget allocations for next year.",
      category: "Work",
      createdAt: new Date("2024-11-20"),
    },
    {
      id: "2",
      title: "Shopping List",
      content: "Milk, Eggs, Bread, Coffee, Vegetables",
      category: "Personal",
      createdAt: new Date("2024-11-21"),
    },
    {
      id: "3",
      title: "Bank Password",
      content: "Account: ****1234\nPassword: Secure#Pass123",
      category: "Password",
      createdAt: new Date("2024-11-19"),
    },
  ]);
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem("darkMode");
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });
  const [autoLockTimer, setAutoLockTimer] = useState(60);
  const [autoLockDuration, setAutoLockDuration] = useState(60);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);

  return (
    <AppContext.Provider
      value={{
        hasPassword, setHasPassword,
        isUnlocked, setIsUnlocked,
        masterPassword, setMasterPassword,
        notes, setNotes,
        customCategories, setCustomCategories,
        darkMode, setDarkMode,
        autoLockTimer, setAutoLockTimer,
        autoLockDuration, setAutoLockDuration,
        showExportDialog, setShowExportDialog,
        showImportDialog, setShowImportDialog,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
