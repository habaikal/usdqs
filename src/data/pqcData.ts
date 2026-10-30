import type { PqcAlgorithmInfo } from '../types';

/**
 * NIST FIPS 표준 기반 PQC 알고리즘 계층별 매핑 데이터 (RFP 5.2절 기준)
 */
export const PQC_ALGORITHM_MAPPINGS: PqcAlgorithmInfo[] = [
  {
    layer: 'Wallet Signature',
    algorithm: 'ML-DSA-65 (CRYSTALS-Dilithium) / FN-DSA (Falcon)',
    nistStandard: 'NIST FIPS 204 (Module-Lattice-Based Digital Signature Standard)',
    fipsStatus: 'Standardized (Aug 2024)',
    purpose: 'ERC-4337 계정 추상화 지갑의 오프체인 트랜잭션 1차 양자내성 서명 생성',
    agilityMethod: '서명 알고리즘 모듈형 컨트랙트 어댑터 (향후 FIPS 205 SPHINCS+ 등 교체 가능)'
  },
  {
    layer: 'Key Exchange',
    algorithm: 'ML-KEM-768 / 1024 (CRYSTALS-Kyber)',
    nistStandard: 'NIST FIPS 203 (Module-Lattice-Based Key-Encapsulation Mechanism)',
    fipsStatus: 'Standardized (Aug 2024)',
    purpose: '기관 간 API 및 내부 통신 구간 세션 키 교환(KEM) 도출',
    agilityMethod: 'KEM 알고리즘 플러그인 인터페이스 및 하이브리드 ECDH 병행 지원'
  },
  {
    layer: 'API/Network TLS',
    algorithm: 'PQC Hybrid TLS 1.3 (X25519 + ML-KEM-768)',
    nistStandard: 'IETF Draft / NIST SP 800-227 PQC Migration Guidelines',
    fipsStatus: 'Production Ready',
    purpose: '클라이언트-서버, 노드 간 통신 도청 및 수확 후 해독(Harvest Now, Decrypt Later) 공격 방어',
    agilityMethod: '클라이언트 암호 제품군 협상(Cipher Suite Negotiation)을 통한 무중단 롤링 전환'
  },
  {
    layer: 'Key Management',
    algorithm: 'Threshold MPC + HSM (3-of-5 분산 임계값 서명)',
    nistStandard: 'FIPS 140-3 Level 3 / NIST SP 800-57',
    fipsStatus: 'Enterprise Standard',
    purpose: '발행/소각/자금상한 변경 시 지리적으로 분산된 키 샤드 다중서명 집행 (4-eyes 원칙)',
    agilityMethod: 'MPC 샤드 리쉐어링(Re-sharing) 프로토콜을 통해 마스터키 변경 없이 알고리즘 갱신'
  }
];

/**
 * ERC-4337 하이브리드 PQC 워크플로우 단계 설명
 */
export const PQC_WORKFLOW_STEPS = [
  {
    step: 1,
    title: '오프체인 PQC 서명 생성 (Off-chain ML-DSA)',
    description: '사용자의 클라이언트 장치에서 격자 기반 양자내성 서명(Dilithium)을 생성하여 UserOperation에 캡슐화합니다.',
    tech: 'ML-DSA-65 / Falcon-512'
  },
  {
    step: 2,
    title: 'ERC-4337 번들러 릴레이 (Bundler Relay)',
    description: 'PQC 서명이 포함된 UserOp이 표준 ERC-4337 번들러 풀로 전달되어 가스비 대납 및 사전 검증을 거칩니다.',
    tech: 'Paymaster & Bundler'
  },
  {
    step: 3,
    title: '온체인 PQC 검증 컨트랙트 (PqcValidator.sol)',
    description: 'EVM 상의 전용 검증 컨트랙트가 Dilithium 서명의 유효성을 검증하고, 표준 실행 권한을 스마트 지갑에 인가합니다.',
    tech: 'Account Abstraction'
  },
  {
    step: 4,
    title: '원자적 정산 및 이벤트 로그 (Atomic Execution)',
    description: '검증 완료 후 USDQS 토큰 스마트컨트랙트에서 실제 이체/민팅/상환이 온체인 블록에 영구 기록됩니다.',
    tech: 'Ethereum Mainnet'
  }
];
