// worker/crypto.js — Salted password hashing & verification using standard Web Crypto API
// Compatible with Cloudflare Workers and modern Node.js

/**
 * Convert byte array to hexadecimal string
 */
export function bytesToHex(bytes) {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Convert hexadecimal string to Uint8Array
 */
export function hexToBytes(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

/**
 * Generates a cryptographically secure random salt in hex format (16 bytes = 32 hex chars)
 */
export function generateSalt(length = 16) {
  const salt = new Uint8Array(length);
  crypto.getRandomValues(salt);
  return bytesToHex(salt);
}

/**
 * Hashes a password using PBKDF2-HMAC-SHA256 with 100,000 iterations and salt.
 * @param {string} password - The plain-text password
 * @param {string|null} [saltHex] - Optional existing salt in hex (generates new one if omitted)
 * @returns {Promise<{ hash: string, salt: string }>}
 */
export async function hashPassword(password, saltHex = null) {
  const salt = saltHex ? hexToBytes(saltHex) : crypto.getRandomValues(new Uint8Array(16));
  const enc = new TextEncoder();

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    256 // 256 bits = 32 bytes
  );

  return {
    hash: bytesToHex(new Uint8Array(derivedBits)),
    salt: bytesToHex(salt),
  };
}

/**
 * Verifies a plain-text password against a stored salt and hash using timing-safe comparison.
 * @param {string} password - The input password
 * @param {string} salt - The stored hex salt
 * @param {string} storedHash - The stored hex hash
 * @returns {Promise<boolean>}
 */
export async function verifyPassword(password, salt, storedHash) {
  if (!password || !salt || !storedHash) return false;
  const { hash: computedHash } = await hashPassword(password, salt);
  return timingSafeEqual(computedHash, storedHash);
}

/**
 * Constant-time comparison between two strings to prevent timing attacks.
 */
function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}
