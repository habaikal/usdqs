/**
 * 클라이언트 사이드 암호화 및 오프라인 원장 스토리지 유틸리티
 * - Web Crypto API 기반 PBKDF2-SHA256 (150,000 iterations) 비밀번호 해싱
 * - 5회 연속 로그인 실패 시 30초 계정 잠금(Lockout) 방어 로직
 * - 최초 실행 시 기본 테스트 계정(demo / Demo1234!, admin / Admin1234!) 자동 시딩
 */
import type { WalletTransaction } from '../types';

export interface StoredUser {
  id: string;
  username: string;
  salt: string;
  passwordHash: string;
  role: 'user' | 'institutional' | 'admin';
  kycTier?: number;
  pqcPublicKey?: string;
  createdAt: string;
}

export interface StoredAccount {
  id: string;
  userId: string;
  username: string;
  balanceUsdqs: number;
  balanceUsd: number;
  isFrozen: boolean;
  frozenAt: string | null;
}

const PBKDF2_ITERATIONS = 150_000;
const HASH_BYTE_LENGTH = 32;

const USERS_STORAGE_KEY = 'usdqs-fullstack-users';
const ACCOUNTS_STORAGE_KEY = 'usdqs-fullstack-accounts';
const TRANSACTIONS_STORAGE_KEY = 'usdqs-fullstack-transactions';
const LOCKOUT_STORAGE_KEY = 'usdqs-fullstack-lockout';

const toHex = (buffer: ArrayBuffer): string =>
  Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

export const generateSalt = (): string => {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return toHex(bytes.buffer);
};

const hexToBytes = (hex: string): Uint8Array<ArrayBuffer> => {
  const buffer = new ArrayBuffer(hex.length / 2);
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
  }
  return bytes;
};

export const hashPasswordWithSalt = async (password: string, salt: string): Promise<string> => {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: hexToBytes(salt),
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    keyMaterial,
    HASH_BYTE_LENGTH * 8
  );

  return toHex(derivedBits);
};

export const timingSafeEqual = (a: string, b: string): boolean => {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
};

export const verifyPasswordPbkdf2 = async (
  password: string,
  salt: string,
  expectedHash: string
): Promise<boolean> => {
  const computed = await hashPasswordWithSalt(password, salt);
  return timingSafeEqual(computed, expectedHash);
};

// ----------------------------------------------------
// 로컬 스토리지 CRUD 및 초기 시드 보장
// ----------------------------------------------------
export const ensureDefaultSeedUsers = async (): Promise<void> => {
  try {
    const existing = getUsers();
    if (existing.length > 0) return;

    const demoSalt = generateSalt();
    const demoHash = await hashPasswordWithSalt('Demo1234!', demoSalt);
    const adminSalt = generateSalt();
    const adminHash = await hashPasswordWithSalt('Admin1234!', adminSalt);

    const seedUsers: StoredUser[] = [
      {
        id: 'usr_demo_001',
        username: 'demo',
        salt: demoSalt,
        passwordHash: demoHash,
        role: 'user',
        kycTier: 2,
        pqcPublicKey: '0x8f2a...f9024a1b827e43d92c7104b95f (Dilithium3)',
        createdAt: '2026-10-01T09:00:00Z',
      },
      {
        id: 'usr_admin_001',
        username: 'admin',
        salt: adminSalt,
        passwordHash: adminHash,
        role: 'admin',
        kycTier: 3,
        pqcPublicKey: '0x4c91...a881e72b0931c450d99e102f (Dilithium5)',
        createdAt: '2026-09-15T00:00:00Z',
      },
    ];
    saveUsers(seedUsers);

    const seedAccounts: StoredAccount[] = [
      {
        id: 'acc_demo_001',
        userId: 'usr_demo_001',
        username: 'demo',
        balanceUsdqs: 2500,
        balanceUsd: 25000,
        isFrozen: false,
        frozenAt: null,
      },
      {
        id: 'acc_admin_001',
        userId: 'usr_admin_001',
        username: 'admin',
        balanceUsdqs: 150000,
        balanceUsd: 500000,
        isFrozen: false,
        frozenAt: null,
      },
    ];
    saveAccounts(seedAccounts);
  } catch (err) {
    console.warn('Seed initialization skipped:', err);
  }
};

export const getUsers = (): StoredUser[] => {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveUsers = (users: StoredUser[]): void => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

export const getAccounts = (): StoredAccount[] => {
  try {
    const raw = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveAccounts = (accounts: StoredAccount[]): void => {
  localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
};

export const getTransactions = (): WalletTransaction[] => {
  try {
    const raw = localStorage.getItem(TRANSACTIONS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveTransactions = (txs: WalletTransaction[]): void => {
  localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(txs));
};

// ----------------------------------------------------
// 5회 실패 시 30초 계정 잠금(Lockout) 헬퍼
// ----------------------------------------------------
interface LockoutEntry {
  attempts: number;
  lockedUntil: number | null;
}

const getLockoutData = (): Record<string, LockoutEntry> => {
  try {
    const raw = localStorage.getItem(LOCKOUT_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

export const recordLoginFailure = (username: string): number => {
  const data = getLockoutData();
  const lower = username.toLowerCase();
  const entry = data[lower] || { attempts: 0, lockedUntil: null };

  entry.attempts += 1;
  if (entry.attempts >= 5) {
    entry.lockedUntil = Date.now() + 30 * 1000;
  }
  data[lower] = entry;
  localStorage.setItem(LOCKOUT_STORAGE_KEY, JSON.stringify(data));
  return entry.attempts;
};

export const resetLoginFailure = (username: string): void => {
  const data = getLockoutData();
  const lower = username.toLowerCase();
  if (data[lower]) {
    delete data[lower];
    localStorage.setItem(LOCKOUT_STORAGE_KEY, JSON.stringify(data));
  }
};

export const isAccountLocked = (username: string): boolean => {
  const data = getLockoutData();
  const entry = data[username.toLowerCase()];
  if (!entry || !entry.lockedUntil) return false;
  return entry.lockedUntil > Date.now();
};

export const getRemainingLockoutSeconds = (username: string): number => {
  const data = getLockoutData();
  const entry = data[username.toLowerCase()];
  if (!entry || !entry.lockedUntil) return 0;
  const remaining = Math.ceil((entry.lockedUntil - Date.now()) / 1000);
  return remaining > 0 ? remaining : 0;
};
