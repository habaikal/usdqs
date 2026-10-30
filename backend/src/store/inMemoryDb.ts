/**
 * USDQS 풀스택 백엔드 인메모리 데이터베이스 및 암호화 시드 스토어
 * - PBKDF2-SHA256 (150,000 iterations) 서버 사이드 해싱 지원
 * - 5회 실패 시 30초 락아웃(Lockout) 방어 상태 관리
 * - 초기 시드: demo (Demo1234!), admin (Admin1234!), institutional (Inst1234!)
 */
import crypto from 'crypto';

export const PBKDF2_ITERATIONS = Number(process.env.PBKDF2_ITERATIONS || 150000);
export const MAX_LOGIN_ATTEMPTS = Number(process.env.MAX_LOGIN_ATTEMPTS || 5);
export const LOCKOUT_DURATION_MS = Number(process.env.LOCKOUT_DURATION_SECONDS || 30) * 1000;

export interface DbUser {
  id: string;
  username: string;
  passwordHash: string;
  salt: string;
  role: 'user' | 'institutional' | 'admin';
  kycTier: 1 | 2 | 3;
  pqcPublicKey: string;
  erc4337SmartWallet: string;
  failedLoginAttempts: number;
  lockedUntil: number | null;
  mfaEnabled: boolean;
  createdAt: string;
}

export interface DbAccount {
  id: string;
  userId: string;
  username: string;
  balanceUsdqs: number;
  balanceUsd: number;
  isFrozen: boolean;
  frozenAt: string | null;
}

export interface DbTransaction {
  id: string;
  userId: string;
  type: 'purchase' | 'sell' | 'transfer_sent' | 'transfer_received' | 'mint' | 'burn';
  amount: number;
  from: string;
  to: string;
  pqcSignatureHex: string;
  timestamp: string;
  note: string;
}

export interface DbAuditLog {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  details: string;
  ipAddress: string;
  pqcSignatureHex: string;
  severity: 'info' | 'warning' | 'critical';
}

export function hashPasswordServer(password: string, salt: string): string {
  return crypto
    .pbkdf2Sync(password, Buffer.from(salt, 'hex'), PBKDF2_ITERATIONS, 32, 'sha256')
    .toString('hex');
}

export function verifyPasswordServer(password: string, salt: string, expectedHash: string): boolean {
  const computed = hashPasswordServer(password, salt);
  const a = Buffer.from(computed, 'hex');
  const b = Buffer.from(expectedHash, 'hex');
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

const demoSalt = crypto.randomBytes(16).toString('hex');
const adminSalt = crypto.randomBytes(16).toString('hex');
const instSalt = crypto.randomBytes(16).toString('hex');

export const db = {
  users: [
    {
      id: 'usr_demo_001',
      username: 'demo',
      salt: demoSalt,
      passwordHash: hashPasswordServer('Demo1234!', demoSalt),
      role: 'user' as const,
      kycTier: 2 as const,
      pqcPublicKey: '0x8f2a...f9024a1b827e43d92c7104b95f (Dilithium3)',
      erc4337SmartWallet: '0x9924...b451',
      failedLoginAttempts: 0,
      lockedUntil: null,
      mfaEnabled: false,
      createdAt: '2026-10-01T09:00:00Z',
    },
    {
      id: 'usr_admin_001',
      username: 'admin',
      salt: adminSalt,
      passwordHash: hashPasswordServer('Admin1234!', adminSalt),
      role: 'admin' as const,
      kycTier: 3 as const,
      pqcPublicKey: '0x4c91...a881e72b0931c450d99e102f (Dilithium5)',
      erc4337SmartWallet: '0x7710...c912',
      failedLoginAttempts: 0,
      lockedUntil: null,
      mfaEnabled: true,
      createdAt: '2026-09-15T00:00:00Z',
    },
    {
      id: 'usr_inst_001',
      username: 'apex_hk',
      salt: instSalt,
      passwordHash: hashPasswordServer('Inst1234!', instSalt),
      role: 'institutional' as const,
      kycTier: 3 as const,
      pqcPublicKey: '0x71e4...d1904b823c991a04f812b33e (Dilithium3)',
      erc4337SmartWallet: '0x5521...e884',
      failedLoginAttempts: 0,
      lockedUntil: null,
      mfaEnabled: true,
      createdAt: '2026-09-20T00:00:00Z',
    },
  ] as DbUser[],

  accounts: [
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
    {
      id: 'acc_inst_001',
      userId: 'usr_inst_001',
      username: 'apex_hk',
      balanceUsdqs: 1200000,
      balanceUsd: 5000000,
      isFrozen: false,
      frozenAt: null,
    },
  ] as DbAccount[],

  transactions: [
    {
      id: 'tx_init_001',
      userId: 'usr_demo_001',
      type: 'purchase',
      amount: 2500,
      from: 'USD Reserve Vault (HK Trust)',
      to: 'demo',
      pqcSignatureHex: '0x8f2a...Dilithium3-Verified',
      timestamp: '2026-10-29T14:20:00Z',
      note: '1:1 USD to USDQS Initial Mint',
    },
  ] as DbTransaction[],

  reserves: {
    initialCap: 24000000,
    currentCap: 24000000,
    totalSupply: 24000000,
    totalReserves: 24576000,
    reserveRatio: 102.4,
    netExcessReserves: 576000,
    lastAttestationDate: '2026-10-25',
    auditor: 'Deloitte Touche Tohmatsu (HK)',
    custodianBank: 'Standard Chartered Bank (HK) / Bank of China (HK) Segregated Trust',
    twentyFourHourVolume: 84290000,
    redemptionSLA: 'T+1 Business Day (Max T+2)',
    regulatoryStatus: 'HKMA Stablecoins Ordinance Compliant',
  },

  bridgeStatus: {
    bridgeName: 'USDQS Quantum-Safe Cross-Chain Conduit (CCTP-Q)',
    mechanism: 'Burn-and-Mint',
    isPaused: false,
    dailyRateLimitUSD: 5000000,
    currentDayOutflowUSD: 1420000,
    circuitBreakerThresholdPct: 80,
    lastAnomalyCheck: '2026-10-30 12:00 UTC (Normal)',
    activeRelayers: 12,
  },

  auditLogs: [
    {
      id: 'LOG-992841',
      timestamp: '2026-10-30 11:45:12 UTC',
      actor: 'CISO Signer',
      role: 'CISO',
      action: 'PQC_VALIDATOR_ROTATION_CHECK',
      details: 'Verified NIST FIPS 204 ML-DSA-65 ERC-4337 EntryPoint adapter integrity',
      ipAddress: '203.145.92.11 (Hong Kong Office)',
      pqcSignatureHex: '0x81f2...Dilithium3-Valid',
      severity: 'info',
    },
  ] as DbAuditLog[],
};

