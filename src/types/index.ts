export interface ChainInfo {
  id: string;
  name: string;
  symbol: string;
  color: string;
  speed: string;
  avgFee: string;
  contractAddress: string;
  status: 'active' | 'upgrading';
  tvl: string;
}

export interface ReserveAsset {
  category: string;
  name: string;
  percentage: number;
  amountUSD: number;
  description: string;
  color: string;
}

export interface TransparencyMetric {
  initialCap: number;            // 초기 발행 상한 (24,000,000 USDQS)
  currentCap: number;            // 거버넌스를 거쳐 확장된 현재 상한
  totalSupply: number;          // 현재 발행 및 유통량
  totalReserves: number;        // 담보 준비금 총액
  reserveRatio: number;         // 담보율 (예: 102.4%)
  netExcessReserves: number;    // 초과 담보 준비금
  lastAttestationDate: string;  // 최신 공인회계사 감사 일자
  auditor: string;              // 외부 감사인 정보 (홍콩 인가 회계법인)
  custodianBank: string;        // 홍콩 인가 수탁은행 (Bankruptcy-remote 신탁)
  twentyFourHourVolume: number; // 24시간 실거래 볼륨
  redemptionSLA: string;        // 상환 기한 SLA (영업일 기준 T+1 목표, 최대 T+2)
  regulatoryStatus: string;     // 홍콩 HKMA Stablecoins Ordinance 준수 상태
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'reserves' | 'technology' | 'compliance' | 'pqc';
}

export interface PartnerInfo {
  name: string;
  category: 'Exchange' | 'Custodian' | 'Liquidity' | 'DeFi';
  tier: string;
  badge: string;
}

// ----------------------------------------------------
// PQC (Post-Quantum Cryptography) 아키텍처 타입 정의
// ----------------------------------------------------
export interface PqcAlgorithmInfo {
  layer: 'Wallet Signature' | 'Key Exchange' | 'API/Network TLS' | 'Key Management';
  algorithm: string;
  nistStandard: string;
  fipsStatus: string;
  purpose: string;
  agilityMethod: string;
}

export interface SimulatedPqcKeypair {
  classicAddress: string;           // 0x... EVM secp256k1 호환 주소
  pqcAlgorithm: 'ML-DSA-65 (Dilithium3)' | 'ML-DSA-87 (Dilithium5)' | 'FN-DSA (Falcon-512)';
  pqcPublicKey: string;             // Dilithium 격자 기반 공개키 (Hex)
  erc4337SmartWalletAddress: string;// 계정 추상화 하이브리드 지갑 주소
  kyberKEMKey: string;              // ML-KEM-768 키 교환 식별자
  createdAt: string;
}

// ----------------------------------------------------
// 관리자 콘솔 & 다중서명(Multi-Sig 3-of-5) 거버넌스 타입
// ----------------------------------------------------
export interface MultisigApprover {
  role: 'CISO' | 'MLRO' | 'Treasury_Lead' | 'Board_Director_1' | 'Board_Director_2';
  name: string;
  address: string;
  signed: boolean;
  signedAt?: string;
}

export interface MultisigProposal {
  id: string;
  type: 'mint' | 'burn' | 'cap_expansion' | 'circuit_breaker' | 'freeze_address';
  title: string;
  description: string;
  targetAmount?: number;
  newCap?: number;
  targetAddress?: string;
  targetChain?: string;
  proposer: string;
  createdAt: string;
  timelockHours: number;            // 타임락 (24~48시간 지연)
  timelockExpiresAt: string;
  status: 'voting' | 'timelock_pending' | 'ready_for_execution' | 'executed' | 'rejected';
  approvers: MultisigApprover[];
  requiredSignatures: number;       // 3-of-5
  executionTxHash?: string;
}

// ----------------------------------------------------
// 크로스체인 브릿지 & 서킷 브레이커(Circuit Breaker)
// ----------------------------------------------------
export interface BridgeSecurityStatus {
  bridgeName: string;
  mechanism: 'Burn-and-Mint' | 'Lock-and-Mint';
  isPaused: boolean;                // 긴급 셧다운 여부
  dailyRateLimitUSD: number;        // 24시간 자금 상한
  currentDayOutflowUSD: number;     // 금일 누적 유출액
  circuitBreakerThresholdPct: number;// 이상 거래 감지 트리거 퍼센트 (80%)
  lastAnomalyCheck: string;
  activeRelayers: number;
}

// ----------------------------------------------------
// 제재 주소 및 규제 컴플라이언스(OFAC/UN/EU)
// ----------------------------------------------------
export interface SanctionedEntity {
  id: string;
  address: string;
  alias: string;
  category: 'OFAC SDN' | 'EU Sanctions' | 'UN Sanctions' | 'Suspicious MLRO Flag';
  dateAdded: string;
  isFrozen: boolean;
  frozenAmountUSDQS: number;
  forceBurnExecuted: boolean;
  notes: string;
}

// ----------------------------------------------------
// 규제 기관(HKMA) 대응 최소 7년 보관 Audit Log
// ----------------------------------------------------
export interface AuditLogItem {
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

// ----------------------------------------------------
// 백서(Whitepaper) 구조 타입
// ----------------------------------------------------
export interface WhitepaperSection {
  id: string;
  chapterNumber: string;
  title: string;
  subtitle: string;
  summary: string;
  content: string[];
}

// ----------------------------------------------------
// 풀스택 유저 인증(Auth) 및 디지털 달러 계좌 원장(Account) 타입
// ----------------------------------------------------
export interface User {
  id?: string;
  username: string;
  role: 'user' | 'institutional' | 'admin';
  kycTier?: number;
  pqcPublicKey?: string;
}

export interface Credentials {
  username: string;
  password: string;
}

export interface WalletTransaction {
  id: string;
  type: 'purchase' | 'sell' | 'transfer_sent' | 'transfer_received' | 'mint' | 'burn';
  amount: number;
  from: string;
  to: string;
  timestamp: string;
  pqcSignatureHex?: string;
  note?: string;
}

export interface Account {
  username: string;
  balance: number;       // USDQS 보유 잔액
  balanceUsd: number;    // 법정화폐 USD 예치 잔액
  transactions: WalletTransaction[];
  frozen: boolean;       // 킬스위치 동결 여부
  frozenAt?: string | null;
}


