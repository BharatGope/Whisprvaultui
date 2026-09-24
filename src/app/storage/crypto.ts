/**
 * Cryptographic helpers for WhisprVault utilizing the native Web Crypto API.
 *
 * Security Architecture Decisions:
 * 1. Zero Plaintext Persistence: Master passwords are never written to disk, IndexedDB, or localStorage.
 * 2. Unextractable Keys: Derived CryptoKeys have `extractable: false` so raw key bytes cannot be exfiltrated.
 * 3. Sentinel Verification: Password correctness is validated by attempting AES-GCM authenticated
 *    decryption of a known sentinel string rather than storing password hashes.
 * 4. OWASP Recommended Parameters: PBKDF2 with HMAC-SHA-256 at 600,000 iterations for key derivation.
 * 5. Unique IVs: A cryptographically random 12-byte initialization vector (IV) is generated for every encryption.
 */

export const KEY_VALIDATION_SENTINEL = "WHISPRVAULT_KEY_VALIDATION";
export const PBKDF2_ITERATIONS = 600000;
export const AES_KEY_LENGTH = 256;
export const GCM_IV_LENGTH = 12; // 96-bit IV is optimal for AES-GCM
export const DEFAULT_SALT_LENGTH = 16;

/**
 * Generates a cryptographically secure random salt using Web Crypto.
 *
 * @param length - The byte length of the salt (defaults to 16 bytes).
 * @returns A Uint8Array containing random bytes.
 */
export function generateSalt(length = DEFAULT_SALT_LENGTH): Uint8Array {
  const salt = new Uint8Array(length);
  crypto.getRandomValues(salt);
  return salt;
}

/**
 * Derives an unextractable AES-GCM 256-bit encryption key from a master password and salt.
 *
 * Security decisions:
 * - Uses PBKDF2 with HMAC-SHA-256 and 600,000 iterations (OWASP recommendation).
 * - `extractable: false` guarantees that derived key material cannot be exported or leaked via JavaScript.
 *
 * @param password - Plaintext master password.
 * @param salt - Cryptographically random salt buffer.
 * @returns A Promise resolving to an unextractable CryptoKey.
 */
export async function deriveKeyFromPassword(
  password: string,
  salt: Uint8Array
): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);

  // Import raw password as a PBKDF2 base key (unextractable)
  const baseKey = await crypto.subtle.importKey(
    "raw",
    passwordBuffer,
    "PBKDF2",
    false,
    ["deriveKey"]
  );

  // Derive the 256-bit AES-GCM key
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: PBKDF2_ITERATIONS,
      hash: "SHA-256",
    },
    baseKey,
    {
      name: "AES-GCM",
      length: AES_KEY_LENGTH,
    },
    false, // extractable: false prevents raw key extraction
    ["encrypt", "decrypt"]
  );
}

/**
 * Encrypts a plaintext UTF-8 string using AES-GCM with a fresh random 12-byte IV.
 *
 * Security decisions:
 * - AES-GCM provides authenticated encryption: ciphertext includes a 128-bit authentication tag.
 * - Generates a fresh 12-byte IV via crypto.getRandomValues for every call to prevent IV reuse.
 *
 * @param key - AES-GCM CryptoKey.
 * @param plainText - The UTF-8 string to encrypt.
 * @returns Object containing the 12-byte IV and encrypted ciphertext (including auth tag).
 */
export async function encryptData(
  key: CryptoKey,
  plainText: string
): Promise<{ iv: Uint8Array; ciphertext: Uint8Array }> {
  const iv = new Uint8Array(GCM_IV_LENGTH);
  crypto.getRandomValues(iv);

  const encoder = new TextEncoder();
  const plainTextBuffer = encoder.encode(plainText);

  const encryptedBuffer = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv,
    },
    key,
    plainTextBuffer
  );

  return {
    iv,
    ciphertext: new Uint8Array(encryptedBuffer),
  };
}

/**
 * Decrypts AES-GCM ciphertext back into a plaintext UTF-8 string.
 *
 * Security decisions:
 * - AES-GCM verifies the integrity authentication tag before returning any plaintext.
 * - Throws a DOMException ("OperationError") if the ciphertext or authentication tag is tampered with or incorrect key is used.
 *
 * @param key - AES-GCM CryptoKey.
 * @param iv - The 12-byte IV used during encryption.
 * @param ciphertext - The ciphertext buffer (including authentication tag).
 * @returns The decrypted UTF-8 plaintext string.
 */
export async function decryptData(
  key: CryptoKey,
  iv: Uint8Array,
  ciphertext: Uint8Array
): Promise<string> {
  const decryptedBuffer = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv,
    },
    key,
    ciphertext
  );

  const decoder = new TextDecoder();
  return decoder.decode(decryptedBuffer);
}

/**
 * Verifies if a candidate key is correct by attempting to decrypt the keycheck sentinel.
 *
 * Security decisions:
 * - Instead of storing a password hash, a known constant sentinel ("WHISPRVAULT_KEY_VALIDATION")
 *   is encrypted with the vault key.
 * - An incorrect password will produce an invalid key, causing AES-GCM tag verification to fail.
 * - Returns `false` for authentication/decryption failures rather than throwing.
 * - Re-throws unexpected runtime/programming errors (e.g. invalid arguments).
 *
 * @param key - Candidate CryptoKey derived from user input.
 * @param keycheck - Stored sentinel record containing IV and ciphertext.
 * @returns True if the key successfully decrypts the sentinel; false otherwise.
 */
export async function verifyPassword(
  key: CryptoKey,
  keycheck: { iv: Uint8Array; ciphertext: Uint8Array }
): Promise<boolean> {
  try {
    const decrypted = await decryptData(key, keycheck.iv, keycheck.ciphertext);
    return decrypted === KEY_VALIDATION_SENTINEL;
  } catch (error) {
    // OperationError is thrown by Web Crypto when AES-GCM authentication fails
    if (error instanceof DOMException && error.name === "OperationError") {
      return false;
    }
    if (error instanceof Error && error.name === "OperationError") {
      return false;
    }
    // Re-throw unexpected programming or runtime errors
    throw error;
  }
}

/**
 * Generates an encrypted keycheck record for a given master key using the validation sentinel.
 *
 * @param key - The master CryptoKey.
 * @returns Object containing IV and ciphertext verifying the key.
 */
export async function createKeyCheck(
  key: CryptoKey
): Promise<{ iv: Uint8Array; ciphertext: Uint8Array }> {
  return encryptData(key, KEY_VALIDATION_SENTINEL);
}
