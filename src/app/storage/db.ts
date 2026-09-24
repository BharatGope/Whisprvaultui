/**
 * Native IndexedDB wrapper for WhisprVault persistent offline storage.
 *
 * Database Name: "whisprvault_db"
 * Version: 1
 *
 * Object Stores:
 * 1. "metadata" (keyPath: "key")
 *    - Stores vault configuration and cryptographic parameters (salt, keycheck sentinel, autoLockDuration).
 * 2. "vault_data" (keyPath: "id")
 *    - Stores encrypted vault payloads only. Plaintext notes are never stored here.
 */

export const DB_NAME = "whisprvault_db";
export const DB_VERSION = 1;
export const METADATA_STORE = "metadata";
export const VAULT_DATA_STORE = "vault_data";
export const VAULT_RECORD_ID = "encrypted_payload";

export interface MetadataRecord<T = unknown> {
  key: string;
  value: T;
}

export interface EncryptedVaultRecord {
  id: typeof VAULT_RECORD_ID;
  iv: Uint8Array;
  ciphertext: Uint8Array;
  updatedAt: string;
}

let dbInstance: IDBDatabase | null = null;
let dbPromise: Promise<IDBDatabase> | null = null;

/**
 * Opens or retrieves the singleton IndexedDB database connection.
 * Handles database creation and schema migrations.
 */
function getDB(): Promise<IDBDatabase> {
  if (dbInstance) {
    return Promise.resolve(dbInstance);
  }

  if (dbPromise) {
    return dbPromise;
  }

  dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB is not supported in this environment."));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;

      // Metadata store for cryptographic parameters and non-sensitive settings
      if (!db.objectStoreNames.contains(METADATA_STORE)) {
        db.createObjectStore(METADATA_STORE, { keyPath: "key" });
      }

      // Vault data store for encrypted notes and category bundles
      if (!db.objectStoreNames.contains(VAULT_DATA_STORE)) {
        db.createObjectStore(VAULT_DATA_STORE, { keyPath: "id" });
      }
    };

    request.onsuccess = () => {
      dbInstance = request.result;
      dbPromise = null;

      dbInstance.onclose = () => {
        dbInstance = null;
      };

      dbInstance.onversionchange = () => {
        if (dbInstance) {
          dbInstance.close();
          dbInstance = null;
        }
      };

      resolve(dbInstance);
    };

    request.onerror = () => {
      dbPromise = null;
      reject(request.error ?? new Error("Failed to open IndexedDB"));
    };
  });

  return dbPromise;
}

/**
 * Retrieves a metadata value by key.
 *
 * @param key - The metadata identifier.
 * @returns The stored value, or null if the key is not present.
 */
export async function getMetadata<T = unknown>(key: string): Promise<T | null> {
  const db = await getDB();
  return new Promise<T | null>((resolve, reject) => {
    const tx = db.transaction(METADATA_STORE, "readonly");
    const store = tx.objectStore(METADATA_STORE);
    const request = store.get(key);

    request.onsuccess = () => {
      const record = request.result as MetadataRecord<T> | undefined;
      resolve(record !== undefined ? record.value : null);
    };

    request.onerror = () => {
      reject(request.error ?? new Error(`Failed to get metadata for key: ${key}`));
    };
  });
}

/**
 * Stores or updates a metadata entry.
 *
 * @param key - The metadata identifier.
 * @param value - The value to store.
 */
export async function setMetadata(key: string, value: unknown): Promise<void> {
  const db = await getDB();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(METADATA_STORE, "readwrite");
    const store = tx.objectStore(METADATA_STORE);
    const request = store.put({ key, value });

    request.onsuccess = () => resolve();
    request.onerror = () => {
      reject(request.error ?? new Error(`Failed to set metadata for key: ${key}`));
    };
  });
}

/**
 * Deletes a metadata entry by key.
 *
 * @param key - The metadata identifier.
 */
export async function deleteMetadata(key: string): Promise<void> {
  const db = await getDB();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(METADATA_STORE, "readwrite");
    const store = tx.objectStore(METADATA_STORE);
    const request = store.delete(key);

    request.onsuccess = () => resolve();
    request.onerror = () => {
      reject(request.error ?? new Error(`Failed to delete metadata for key: ${key}`));
    };
  });
}

/**
 * Checks whether an initialized vault exists in persistent storage.
 * Evaluates both the presence of vault_check metadata and the encrypted vault payload.
 *
 * @returns True if a vault exists, false otherwise.
 */
export async function hasVault(): Promise<boolean> {
  const check = await getMetadata("vault_check");
  if (check !== null && check !== undefined) {
    return true;
  }
  const vault = await getEncryptedVault();
  return vault !== null;
}

/**
 * Retrieves the encrypted vault record from storage.
 *
 * @returns The encrypted vault record, or null if no vault data is stored.
 */
export async function getEncryptedVault(): Promise<EncryptedVaultRecord | null> {
  const db = await getDB();
  return new Promise<EncryptedVaultRecord | null>((resolve, reject) => {
    const tx = db.transaction(VAULT_DATA_STORE, "readonly");
    const store = tx.objectStore(VAULT_DATA_STORE);
    const request = store.get(VAULT_RECORD_ID);

    request.onsuccess = () => {
      const result = request.result as EncryptedVaultRecord | undefined;
      resolve(result ?? null);
    };

    request.onerror = () => {
      reject(request.error ?? new Error("Failed to get encrypted vault data"));
    };
  });
}

/**
 * Persists an encrypted vault payload to IndexedDB.
 * Does NOT accept or store plaintext notes.
 *
 * @param data - The IV and ciphertext to store, with optional ISO timestamp.
 */
export async function saveEncryptedVault(data: {
  iv: Uint8Array;
  ciphertext: Uint8Array;
  updatedAt?: string;
}): Promise<void> {
  const db = await getDB();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(VAULT_DATA_STORE, "readwrite");
    const store = tx.objectStore(VAULT_DATA_STORE);
    const record: EncryptedVaultRecord = {
      id: VAULT_RECORD_ID,
      iv: data.iv,
      ciphertext: data.ciphertext,
      updatedAt: data.updatedAt ?? new Date().toISOString(),
    };
    const request = store.put(record);

    request.onsuccess = () => resolve();
    request.onerror = () => {
      reject(request.error ?? new Error("Failed to save encrypted vault data"));
    };
  });
}

/**
 * Closes the active database connection, resetting internal handles.
 * Useful during testing or app teardown.
 */
export function closeDB(): void {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
    dbPromise = null;
  }
}
