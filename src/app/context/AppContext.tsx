import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import type { Note } from "../types";
import {
  hasVault,
  getMetadata,
  setMetadata,
  getEncryptedVault,
  saveEncryptedVault,
} from "../storage/db";
import {
  generateSalt,
  deriveKeyFromPassword,
  createKeyCheck,
  verifyPassword,
  encryptData,
  decryptData,
} from "../storage/crypto";

export interface AppContextType {
  isStorageReady: boolean;
  encryptionKey: CryptoKey | null;
  initializeVault: (password: string) => Promise<void>;
  unlockVault: (password: string) => Promise<boolean>;
  lockVault: () => void;
  persistVault: (nextNotes?: Note[], nextCategories?: string[]) => Promise<void>;
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
  autoLockDisplay: string;
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
  // Vault lifecycle and persistence states
  const [isStorageReady, setIsStorageReady] = useState(false);
  const [encryptionKey, setEncryptionKey] = useState<CryptoKey | null>(null);

  // Authentication and lock states
  const [hasPassword, setHasPassword] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [masterPassword, setMasterPassword] = useState("");

  // Vault data (initialized to empty arrays - no mock notes in persistent flow)
  const [notes, setNotesState] = useState<Note[]>([]);
  const [customCategories, setCustomCategoriesState] = useState<string[]>([]);

  // Refs to allow synchronized persistence without stale closures or re-render cycles
  const notesRef = useRef<Note[]>(notes);
  notesRef.current = notes;

  const customCategoriesRef = useRef<string[]>(customCategories);
  customCategoriesRef.current = customCategories;

  const encryptionKeyRef = useRef<CryptoKey | null>(encryptionKey);
  encryptionKeyRef.current = encryptionKey;

  // Queue to serialize asynchronous encrypted writes and prevent race conditions
  const saveQueueRef = useRef<Promise<void>>(Promise.resolve());

  // Preferences
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem("darkMode");
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  const [autoLockTimer, setAutoLockTimer] = useState(0);
  const [autoLockDuration, setAutoLockDurationState] = useState(0);

  const autoLockDisplay = autoLockDuration === 0 ? "" : `${autoLockTimer}s`;
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);

  /**
   * Persists the given notes and custom categories to IndexedDB as an encrypted payload.
   * Operations are serialized through saveQueueRef to prevent async write race conditions.
   */
  const persistVault = useCallback(
    (
      nextNotes: Note[] = notesRef.current,
      nextCategories: string[] = customCategoriesRef.current
    ): Promise<void> => {
      const task = saveQueueRef.current.then(async () => {
        const key = encryptionKeyRef.current;
        if (!key) return;

        const payload = {
          notes: nextNotes,
          customCategories: nextCategories,
        };

        const json = JSON.stringify(payload);
        const encrypted = await encryptData(key, json);
        await saveEncryptedVault(encrypted);
      });

      saveQueueRef.current = task.catch((err) => {
        console.error("Vault persistence error in queue:", err);
      });

      return task;
    },
    []
  );

  /**
   * Wrapped setNotes that immediately updates React state and automatically
   * persists changes to IndexedDB when unlocked.
   */
  const setNotes = useCallback(
    (action: Note[] | ((prev: Note[]) => Note[])) => {
      const nextNotes = typeof action === "function" ? action(notesRef.current) : action;
      notesRef.current = nextNotes;
      setNotesState(nextNotes);

      if (encryptionKeyRef.current) {
        persistVault(nextNotes, customCategoriesRef.current).catch((err) => {
          console.error("Failed to auto-persist notes change:", err);
        });
      }
    },
    [persistVault]
  );

  /**
   * Wrapped setCustomCategories that immediately updates React state and automatically
   * persists changes to IndexedDB when unlocked.
   */
  const setCustomCategories = useCallback(
    (action: string[] | ((prev: string[]) => string[])) => {
      const nextCategories = typeof action === "function" ? action(customCategoriesRef.current) : action;
      customCategoriesRef.current = nextCategories;
      setCustomCategoriesState(nextCategories);

      if (encryptionKeyRef.current) {
        persistVault(notesRef.current, nextCategories).catch((err) => {
          console.error("Failed to auto-persist custom categories change:", err);
        });
      }
    },
    [persistVault]
  );

  /**
   * Updates auto-lock duration in state and persists to IndexedDB metadata.
   */
  const setAutoLockDuration = useCallback((duration: number) => {
    setAutoLockDurationState(duration);
    setMetadata("auto_lock_duration", duration).catch((err) => {
      console.error("Failed to persist auto_lock_duration metadata:", err);
    });
  }, []);

  /**
   * Initializes a brand-new vault with a master password.
   */
  const initializeVault = useCallback(async (password: string): Promise<void> => {
    try {
      const salt = generateSalt();
      const key = await deriveKeyFromPassword(password, salt);
      const keycheck = await createKeyCheck(key);

      await setMetadata("vault_salt", salt);
      await setMetadata("vault_check", keycheck);
      await setMetadata("vault_version", 1);

      const initialPayload = {
        notes: [],
        customCategories: [],
      };
      const encrypted = await encryptData(key, JSON.stringify(initialPayload));
      await saveEncryptedVault(encrypted);

      setEncryptionKey(key);
      encryptionKeyRef.current = key;
      setNotesState([]);
      notesRef.current = [];
      setCustomCategoriesState([]);
      customCategoriesRef.current = [];
      setHasPassword(true);
      setIsUnlocked(true);
    } catch (error) {
      console.error("Failed to initialize new vault:", error);
      throw error;
    }
  }, []);

  /**
   * Unlocks an existing vault using the master password.
   */
  const unlockVault = useCallback(async (password: string): Promise<boolean> => {
    try {
      const salt = await getMetadata<Uint8Array>("vault_salt");
      const keycheck = await getMetadata<{ iv: Uint8Array; ciphertext: Uint8Array }>("vault_check");

      if (!salt || !keycheck) {
        console.warn("Cannot unlock vault: salt or keycheck metadata missing.");
        return false;
      }

      const candidateKey = await deriveKeyFromPassword(password, salt);
      const isValid = await verifyPassword(candidateKey, keycheck);

      if (!isValid) {
        return false;
      }

      const encryptedRecord = await getEncryptedVault();
      if (encryptedRecord) {
        const decryptedJson = await decryptData(
          candidateKey,
          encryptedRecord.iv,
          encryptedRecord.ciphertext
        );
        const parsed = JSON.parse(decryptedJson) as {
          notes?: Note[];
          customCategories?: string[];
        };

        const loadedNotes: Note[] = Array.isArray(parsed.notes)
          ? parsed.notes.map((n) => ({
              ...n,
              createdAt: n.createdAt ? new Date(n.createdAt) : new Date(),
            }))
          : [];

        const loadedCategories: string[] = Array.isArray(parsed.customCategories)
          ? parsed.customCategories
          : [];

        setNotesState(loadedNotes);
        notesRef.current = loadedNotes;
        setCustomCategoriesState(loadedCategories);
        customCategoriesRef.current = loadedCategories;
      } else {
        setNotesState([]);
        notesRef.current = [];
        setCustomCategoriesState([]);
        customCategoriesRef.current = [];
      }

      setEncryptionKey(candidateKey);
      encryptionKeyRef.current = candidateKey;
      setIsUnlocked(true);
      return true;
    } catch (error) {
      console.error("Error during vault unlock:", error);
      return false;
    }
  }, []);

  /**
   * Locks the vault and clears sensitive data and keys from in-memory React state.
   */
  const lockVault = useCallback(() => {
    setIsUnlocked(false);
    setEncryptionKey(null);
    encryptionKeyRef.current = null;
    setNotesState([]);
    notesRef.current = [];
    setCustomCategoriesState([]);
    customCategoriesRef.current = [];
  }, []);

  // Storage initialization on mount
  useEffect(() => {
    let isMounted = true;

    async function initStorage() {
      try {
        const vaultExists = await hasVault();
        if (!isMounted) return;

        setHasPassword(vaultExists);

        const savedDuration = await getMetadata<number>("auto_lock_duration");
        if (!isMounted) return;

        if (typeof savedDuration === "number") {
          setAutoLockDurationState(savedDuration);
        }
      } catch (error) {
        console.error("Failed to initialize vault storage:", error);
      } finally {
        if (isMounted) {
          setIsStorageReady(true);
        }
      }
    }

    initStorage();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <AppContext.Provider
      value={{
        isStorageReady,
        encryptionKey,
        initializeVault,
        unlockVault,
        lockVault,
        persistVault,
        hasPassword,
        setHasPassword,
        isUnlocked,
        setIsUnlocked,
        masterPassword,
        setMasterPassword,
        notes,
        setNotes,
        customCategories,
        setCustomCategories,
        darkMode,
        setDarkMode,
        autoLockTimer,
        setAutoLockTimer,
        autoLockDuration,
        setAutoLockDuration,
        autoLockDisplay,
        showExportDialog,
        setShowExportDialog,
        showImportDialog,
        setShowImportDialog,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
