import type { MultisigProposal, BridgeSecurityStatus, SanctionedEntity, AuditLogItem } from '../types';

/**
 * 다중서명(3-of-5) 거버넌스 제안 큐
 * - 초기 상한 24M USDQS를 시작으로, 시장 수요와 이사회 승인에 따라 상한을 동적으로 확장(Cap Expansion)하는 제안 포함
 */
export const INITIAL_PROPOSALS: MultisigProposal[] = [
  {
    id: 'PROP-2026-001',
    type: 'cap_expansion',
    title: '제1차 유통 상한 확장 (24,000,000 -> 50,000,000 USDQS)',
    description: '기관 투자자 유치 및 홍콩 현지 결제 파트너십 확장에 따라 초기 상한 2,400만 달러에서 5,000만 달러로 발행 한도를 증액합니다. 신탁 예치금 100% 매칭 검증 완료.',
    newCap: 50000000,
    proposer: 'Treasury Operations Lead (0x7F2...b841)',
    createdAt: '2026-10-26 09:30 UTC',
    timelockHours: 48,
    timelockExpiresAt: '2026-10-28 09:30 UTC',
    status: 'timelock_pending',
    requiredSignatures: 3,
    approvers: [
      { role: 'CISO', name: 'Dr. Marcus Vance', address: '0x1A2...4B11', signed: true, signedAt: '2026-10-26 10:15 UTC' },
      { role: 'MLRO', name: 'Eileen Chan (HKMA Certified)', address: '0x3C4...8D22', signed: true, signedAt: '2026-10-26 11:40 UTC' },
      { role: 'Treasury_Lead', name: 'David Reynolds', address: '0x5E6...9F33', signed: true, signedAt: '2026-10-26 12:05 UTC' },
      { role: 'Board_Director_1', name: 'Sarah Lin', address: '0x7A8...0E44', signed: false },
      { role: 'Board_Director_2', name: 'Michael Wu', address: '0x9B0...1F55', signed: false }
    ],
    executionTxHash: '0x94f1c...8172a'
  },
  {
    id: 'PROP-2026-002',
    type: 'mint',
    title: '기관 예치금 수납에 따른 정기 민팅 (3,000,000 USDQS)',
    description: 'Standard Chartered HK 신탁 계좌로 입금된 법정화폐 3백만 달러 예치 영수증 확인에 따른 ERC-20 토큰 발행 승인.',
    targetAmount: 3000000,
    targetAddress: '0x8834...c991 (Institutional Liquidity Pool)',
    targetChain: 'Ethereum Mainnet',
    proposer: 'Institutional Settlement Desk (0x8A1...e421)',
    createdAt: '2026-10-27 02:15 UTC',
    timelockHours: 24,
    timelockExpiresAt: '2026-10-28 02:15 UTC',
    status: 'voting',
    requiredSignatures: 3,
    approvers: [
      { role: 'CISO', name: 'Dr. Marcus Vance', address: '0x1A2...4B11', signed: true, signedAt: '2026-10-27 03:00 UTC' },
      { role: 'MLRO', name: 'Eileen Chan (HKMA Certified)', address: '0x3C4...8D22', signed: true, signedAt: '2026-10-27 04:20 UTC' },
      { role: 'Treasury_Lead', name: 'David Reynolds', address: '0x5E6...9F33', signed: false },
      { role: 'Board_Director_1', name: 'Sarah Lin', address: '0x7A8...0E44', signed: false },
      { role: 'Board_Director_2', name: 'Michael Wu', address: '0x9B0...1F55', signed: false }
    ]
  },
  {
    id: 'PROP-2026-003',
    type: 'burn',
    title: '글로벌 OTC 기관 상환 요청에 따른 소각 (1,500,000 USDQS)',
    description: 'T+1 상환 SLA에 따라 USDQS 1,500,000개를 회수하여 온체인 소각하고, 신탁 계좌에서 미 달러화 전신환 송금(Wire Transfer) 집행.',
    targetAmount: 1500000,
    targetAddress: '0x5412...331b (Treasury Burn Vault)',
    targetChain: 'Ethereum Mainnet',
    proposer: 'Settlement Engine Auto-Queue',
    createdAt: '2026-10-27 06:00 UTC',
    timelockHours: 24,
    timelockExpiresAt: '2026-10-28 06:00 UTC',
    status: 'voting',
    requiredSignatures: 3,
    approvers: [
      { role: 'CISO', name: 'Dr. Marcus Vance', address: '0x1A2...4B11', signed: false },
      { role: 'MLRO', name: 'Eileen Chan (HKMA Certified)', address: '0x3C4...8D22', signed: true, signedAt: '2026-10-27 06:30 UTC' },
      { role: 'Treasury_Lead', name: 'David Reynolds', address: '0x5E6...9F33', signed: false },
      { role: 'Board_Director_1', name: 'Sarah Lin', address: '0x7A8...0E44', signed: false },
      { role: 'Board_Director_2', name: 'Michael Wu', address: '0x9B0...1F55', signed: false }
    ]
  }
];

/**
 * 크로스체인 브릿지 및 이상거래 서킷 브레이커(Circuit Breaker) 상태
 */
export const INITIAL_BRIDGE_STATUS: BridgeSecurityStatus = {
  bridgeName: 'USDQS Quantum-Shield Bridge (Ethereum <-> Solana/L2)',
  mechanism: 'Burn-and-Mint',
  isPaused: false,
  dailyRateLimitUSD: 5000000,        // 일일 자금 유출 상한 (500만 달러)
  currentDayOutflowUSD: 1420000,     // 현재 유출액 (28.4% 점유)
  circuitBreakerThresholdPct: 80,    // 80% 도달 시 이상 징후 자동 알림 및 100% 시 즉시 정지
  lastAnomalyCheck: '2026-10-27 13:00 UTC (No Anomalies Detected)',
  activeRelayers: 7
};

/**
 * 규제 컴플라이언스(OFAC/UN/EU) 제재 주소 및 동결/강제 소각 목록
 */
export const INITIAL_SANCTIONED_ENTITIES: SanctionedEntity[] = [
  {
    id: 'SANC-001',
    address: '0x8576acc5c05d6ce0b48b3b3a7a9fa2',
    alias: 'Lazarus Group Associated Exploit Wallet',
    category: 'OFAC SDN',
    dateAdded: '2026-09-12',
    isFrozen: true,
    frozenAmountUSDQS: 145000,
    forceBurnExecuted: true,
    notes: '홍콩 금융관리국(HKMA) 긴급 행정명령에 따라 온체인 강제 소각(Forced Burn) 완료'
  },
  {
    id: 'SANC-002',
    address: '0xd88e03d3f1a1e271fa749ef2043f76',
    alias: 'High-Risk Darknet Mixer Routing Node',
    category: 'Suspicious MLRO Flag',
    dateAdded: '2026-10-18',
    isFrozen: true,
    frozenAmountUSDQS: 62000,
    forceBurnExecuted: false,
    notes: 'Chainalysis 고위험 점수(Risk Score 98/100) 감지에 따른 개별 주소 임시 동결'
  },
  {
    id: 'SANC-003',
    address: '0x3f5ce5fbfe3e9af3971dd833d26ba9',
    alias: 'Sanctioned Entity Secondary Transactor',
    category: 'EU Sanctions',
    dateAdded: '2026-10-22',
    isFrozen: false,
    frozenAmountUSDQS: 0,
    forceBurnExecuted: false,
    notes: 'EU 가상자산 제재 목록 연동에 따른 집중 모니터링 주소 (Screening Pending)'
  }
];

/**
 * 규제기관(HKMA) 제출용 7년 보관 감사 로그(Audit Log)
 */
export const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'LOG-20261027-0104',
    timestamp: '2026-10-27 06:30:12 UTC',
    actor: 'Eileen Chan (MLRO)',
    role: 'MLRO',
    action: 'MULTISIG_SIGNATURE_SUBMITTED',
    details: 'Signed Burn proposal PROP-2026-003 (1,500,000 USDQS) following FATF Travel Rule clearance',
    ipAddress: '203.145.92.11 (Hong Kong, Central)',
    pqcSignatureHex: '0x9f4a21...Dilithium3-Valid',
    severity: 'info'
  },
  {
    id: 'LOG-20261026-1845',
    timestamp: '2026-10-26 12:05:48 UTC',
    actor: 'David Reynolds',
    role: 'Treasury_Lead',
    action: 'CAP_EXPANSION_SUBMITTED',
    details: 'Initiated 48-Hour Timelock for Cap Expansion to 50M USDQS (Proposal PROP-2026-001)',
    ipAddress: '198.51.100.45 (New York, Financial District)',
    pqcSignatureHex: '0x4c2b88...Dilithium3-Valid',
    severity: 'critical'
  },
  {
    id: 'LOG-20261025-0912',
    timestamp: '2026-10-25 09:12:00 UTC',
    actor: 'Automated PoR Oracle Service',
    role: 'System',
    action: 'PROOF_OF_RESERVES_ATTESTED',
    details: 'Verified $19,200,000 USD reserve balance against 18,750,000 USDQS on-chain liabilities (Ratio 102.4%)',
    ipAddress: '10.0.4.12 (AWS ap-east-1 VPC)',
    pqcSignatureHex: '0x7e112a...Oracle-Sealed',
    severity: 'info'
  },
  {
    id: 'LOG-20261024-1422',
    timestamp: '2026-10-24 14:22:31 UTC',
    actor: 'Dr. Marcus Vance (CISO)',
    role: 'CISO',
    action: 'CIRCUIT_BREAKER_DRILL',
    details: 'Conducted bi-weekly Bridge Circuit Breaker threshold test. Simulation latency: 42ms',
    ipAddress: '185.12.34.89 (London, Canary Wharf)',
    pqcSignatureHex: '0x3a90df...Falcon512-Valid',
    severity: 'warning'
  }
];
