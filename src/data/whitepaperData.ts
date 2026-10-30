import type { WhitepaperSection } from '../types';

/**
 * USDQS 공식 백서 v1.0 (Whitepaper Full Text)
 * 첨부된 원본 백서의 모든 장절 내용을 온전히 수록하여 인터랙티브 열람을 지원합니다.
 */
export const WHITEPAPER_SECTIONS: WhitepaperSection[] = [
  {
    id: 'disclaimer',
    chapterNumber: '고지사항',
    title: '고지사항 (Disclaimer)',
    subtitle: '법적 고지 및 규제 라이선스 안내',
    summary: '본 백서는 정보 제공 목적의 문서이며, 투자 권유 또는 증권의 판매 문서가 아닙니다. 홍콩 Stablecoins Ordinance 라이선스 취득 이전에는 실제 발행·유통이 이루어지지 않습니다.',
    content: [
      '본 백서는 USDQS(USD Quantum Stable) 플랫폼의 목적, 구조, 기술 방향성을 설명하기 위한 정보 제공 목적의 문서이며, 투자 권유, 증권의 청약 또는 판매를 위한 문서가 아닙니다.',
      '본 문서에 기재된 발행 규모, 일정, 기능은 개발 진행 상황 및 규제기관 심사 결과에 따라 변경될 수 있습니다. 본 백서는 검증되지 않은 재무 추정치, 확정되지 않은 파트너십, 실현 가능성이 검증되지 않은 기술을 사실로 단정하여 서술하지 않습니다.',
      'USDQS는 홍콩 Stablecoins Ordinance를 포함한 관련 법규에 따른 라이선스 취득을 목표로 하고 있으며, 라이선스 취득 이전에는 실제 발행·유통이 이루어지지 않습니다.'
    ]
  },
  {
    id: 'chapter-1',
    chapterNumber: '제1장',
    title: '1. 개요 및 핵심 가치 (Executive Summary)',
    subtitle: 'USD 1:1 담보 및 양자내성 차세대 디지털 달러 인프라',
    summary: '홍콩 금융관리국(HKMA) 규제 체계 하에서 발행되는 양자내성(PQC) 기반 규제 준수형 스테이블코인의 핵심 비전.',
    content: [
      'USDQS(USD Quantum Stable)는 USD에 1:1로 완전 담보되는 스테이블코인입니다. 이더리움 메인넷(ERC-20) 위에서 발행되며, 양자내성암호(Post-Quantum Cryptography, PQC)를 지갑 보안의 핵심 기술로 채택하여 향후 양자컴퓨터의 암호 해독 위협에 선제적으로 대응하는 것을 목표로 합니다.',
      'USDQS는 홍콩금융관리국(HKMA)의 Stablecoins Ordinance(2025년 8월 시행)에 따른 발행자 라이선스 취득을 전제로 설계되었으며, 기관·기업·개인 사용자를 모두 고려한 규제 준수형 스테이블코인 플랫폼을 지향합니다.',
      '■ 4대 핵심 가치 (Core Values):',
      '1. 완전 담보 (Full Backing): 발행된 모든 USDQS는 현금 및 현금성 자산(미국 단기국채 등)으로 100% 이상 담보되며, 매월 독립 회계법인의 검증을 거칩니다.',
      '2. 규제 준수 (Compliance by Design): HKMA 라이선스 체계, KYC/AML, FATF Travel Rule을 처음부터 시스템에 내장합니다.',
      '3. 양자내성 보안 (Post-Quantum Security): NIST 표준 PQC 알고리즘을 지갑 서명·키교환에 적용해 미래의 암호 해독 위협에 대비합니다.',
      '4. 투명성 (Transparency): 발행량·준비금·거래는 온체인에서 실시간 공개되며, 독립 감사 보고서가 정기적으로 게시됩니다.'
    ]
  },
  {
    id: 'chapter-2',
    chapterNumber: '제2장',
    title: '2. 토큰 개요 (Token Specifications)',
    subtitle: '발행 상한(초기 24M USDQS, 계속 확장 구조) 및 표준 규격',
    summary: 'ERC-20 표준, 초기 상한 24M USDQS를 시작으로 거버넌스 승인을 통해 계속 늘려가는 탄력적 발행 구조.',
    content: [
      '• 토큰명: USD Quantum Stable',
      '• 심볼: USDQS',
      '• 토큰 표준: ERC-20 (기준 체인: Ethereum Mainnet, 18 decimals). 확장 체인은 브릿지 아키텍처에 따라 지원.',
      '• 초기 발행 상한: 24,000,000 USDQS (※ 초기 2,400만 달러 상한은 런칭 기준선이며, 시장 수요와 이사회/컴플라이언스 다중서명 거버넌스 승인 및 신탁 예치금 확인을 거쳐 지속적으로 상한을 늘려가는 유연하고 안전한 구조로 설계됩니다).',
      '• 페깅 목표: 1 USDQS = 1.00 USD (엄격한 1:1 가치 유지).',
      '• 담보 자산: 100% 이상 USD 등가 자산 (현금 + 만기 3개월 이내 미국 단기국채 + 익일물 역레포 등).',
      '• 규제 관할: 홍콩 (HKMA Stablecoins Ordinance 기준 라이선스 대상).'
    ]
  },
  {
    id: 'chapter-3',
    chapterNumber: '제3장',
    title: '3. 안정성 및 준비금 메커니즘 (Stability & Reserves)',
    subtitle: '홍콩 신탁 분리 보관, T+1 상환 SLA 및 가격 안정화',
    summary: '파산절연 신탁 분리 보관, 영업일 기준 T+1 상환 보장 및 뱅크런 방지 대량 상환 정책.',
    content: [
      '3.1 발행과 소각 (Mint & Burn):',
      '• 발행 (Mint): 사용자가 지정 신탁 계좌에 USD를 예치하면, 확인 절차를 거쳐 동일 수량의 USDQS가 온체인에서 발행됩니다.',
      '• 소각 (Burn): 사용자가 USDQS 상환을 요청하면 해당 수량이 소각되고 USD가 지급됩니다. 처리기한은 영업일 기준 T+1 이내(목표), 최대 T+2를 초과하지 않습니다.',
      '• 모든 발행·소각 내역은 온체인 이벤트로 투명하게 기록됩니다.',
      '3.2 준비금 구성 및 보관:',
      '• 준비자산: 현금 및 현금성 자산, 만기 3개월 이내 미국 단기국채(T-Bills), 익일물 역레포 등 고유동성 자산으로 한정됩니다.',
      '• 보관 구조: 홍콩 소재 인가 은행(AI) 또는 신탁 계좌에 발행사 고유재산과 분리하여 보관하는 파산절연(bankruptcy-remote) 구조를 확립합니다.',
      '• 감사: 독립 회계법인의 월간 준비금 검증(attestation)을 진행하며, 온체인 Proof-of-Reserve로 발행량 대비 준비금 비율을 상시 공개합니다.',
      '3.3 가격 안정화 및 대량 상환 정책:',
      'USDQS는 담보 자산이 부족하면 신규 발행이 불가능하도록 스마트컨트랙트 수준에서 강제되며, 상환 시점의 1:1 소각을 통해 시장 가격이 1 USD 근처로 수렴하도록 설계되어 있습니다. 대량 상환이 몰리는 상황에 대비한 처리 우선순위 및 임시 제한 정책을 사전에 정의하고 공시합니다.'
    ]
  },
  {
    id: 'chapter-4',
    chapterNumber: '제4장',
    title: '4. 보안 아키텍처 — 양자내성암호(PQC)',
    subtitle: 'NIST FIPS 203/204 표준 채택 및 Crypto-Agility 설계',
    summary: 'secp256k1의 양자 해독 위험을 선제 방어하는 ML-DSA 서명, ML-KEM 키교환 및 ERC-4337 하이브리드 연동 체계.',
    content: [
      '현재 이더리움을 포함한 대다수 블록체인의 서명 체계(secp256k1/ECDSA)는 향후 충분한 성능의 양자컴퓨터(Shor 알고리즘)가 등장할 경우 이론적으로 해독될 수 있습니다. USDQS는 이 장기적 위협에 대비해 NIST가 2024년 8월 표준화한 양자내성 암호 알고리즘을 도입합니다.',
      '■ 계층별 적용 알고리즘 (NIST FIPS 표준):',
      '• 지갑 서명: ML-DSA (CRYSTALS-Dilithium) 계열 — NIST FIPS 204 기준 (ERC-4337 계정 추상화 기반 하이브리드 구조로 이더리움과 연동)',
      '• 키 교환: ML-KEM (CRYSTALS-Kyber) — NIST FIPS 203 기준 (API 및 내부 통신 구간에 우선 적용)',
      '• 키 관리: HSM 또는 MPC (다자간 계산) 기반 3-of-5 임계값 서명 (다중서명 정족수 및 지리적 키 분산 정책 적용)',
      '■ 암호 애자일리티 (Crypto-Agility) 원칙:',
      'PQC 알고리즘 표준은 계속 발전하고 있으므로, USDQS는 서명·키교환 알고리즘을 하드코딩하지 않고 교체 가능하도록 설계합니다. 본 백서는 "양자컴퓨터로 연산을 수행한다"는 의미가 아니라 "양자컴퓨터의 공격에도 안전한 수학적 격자(Lattice) 암호 알고리즘을 사용한다"는 의미로 PQC를 실용 적용합니다.'
    ]
  },
  {
    id: 'chapter-5',
    chapterNumber: '제5장',
    title: '5. 스마트컨트랙트 구조 (Smart Contract Architecture)',
    subtitle: 'ERC-20, Treasury, Admin Control, Bridge 및 타임락 거버넌스',
    summary: '24~48시간 타임락, 다중서명 RBAC, 비상 제재/동결 컨트랙트 및 프록시 업그레이드 체계.',
    content: [
      '5.1 핵심 컨트랙트 구성:',
      '• USDQS Token Contract (ERC-20): Mint/Burn, 발행 상한 및 거버넌스 기반 상한 조정, Pausable.',
      '• Treasury Contract: 준비금 연동 및 온체인 Proof-of-Reserve(PoR) 오라클 연동.',
      '• Admin Control Contract: 개별 주소 Freeze, 온체인 Blacklist 집행, 규제 대응 강제 소각(Forced Burn), 다중서명 기반 역할 접근 제어(RBAC).',
      '• Cross-Chain Bridge Contract: 검증된 브릿지 프로토콜 활용 또는 자체 구현, Burn-and-Mint 방식 및 자금 상한(Rate Limit)·이상거래 자동정지(Circuit Breaker) 내장.',
      '5.2 보안 설계 원칙:',
      '• 타임락 (Timelock): 관리자 권한 변경은 최소 24~48시간 지연 후 실행되어, 키 탈취 시에도 발주사와 규제당국이 대응할 시간을 확보합니다.',
      '• 업그레이드 거버넌스: 프록시(UUPS/Transparent) 패턴 기반 업그레이드 가능 구조이며, 업그레이드 자체도 타임락 적용 대상입니다.',
      '• 독립 감사: Mainnet 배포 전 2개 이상 독립 감사기관(Trail of Bits, OpenZeppelin, CertiK 등)의 순차 감사를 받으며, 브릿지 컨트랙트는 일반 감사와 별도로 전담 감사를 추가로 받습니다.',
      '• 상시 버그바운티: Mainnet 런칭과 동시에 상시 버그바운티 프로그램(Immunefi 등)을 운영합니다.'
    ]
  },
  {
    id: 'chapter-6',
    chapterNumber: '제6장',
    title: '6. 규제 준수 및 컴플라이언스 (Regulatory Framework)',
    subtitle: '홍콩 HKMA 제도 준수, KYC/AML, FATF Travel Rule 및 7년 감사 로그',
    summary: '2025년 8월 시행된 홍콩 법제 완벽 충족, 글로벌 제재 스크리닝 및 법정 감사 로그 체계.',
    content: [
      '6.1 규제 프레임워크 (홍콩 HKMA):',
      'USDQS는 2025년 8월 시행된 홍콩 Stablecoins Ordinance에 따른 발행자 라이선스 취득을 전제로 설계되었습니다. 발행사는 준비금 관리, 상환 보장, 지배구조, 자본 요건 등 HKMA가 요구하는 기준을 충족해야 하며, 정기 보고 및 감사 로그 제공 체계를 갖춥니다.',
      '6.2 KYC/AML 및 여행 규칙 (Travel Rule):',
      '• 업계 표준 KYC/AML 솔루션(Sumsub, Onfido 등)을 통한 신원 확인 및 실사',
      '• OFAC·UN·EU 등 제재 리스트 실시간 스크리닝 (Chainalysis, Elliptic 등 온체인 분석 연동)',
      '• FATF Travel Rule에 따른 기관 간 송금 시 발신·수신자 정보 안전 교환',
      '• 이상거래 자동 탐지 및 관리자 긴급 정지 (개별 주소 단위 및 전역 단위)',
      '• 감사 로그(Audit Log) 최소 7년 보관 (관할권별 법정 보관기간 중 최장 기준 적용)',
      '6.3 향후 관할권 확장:',
      'USDQS는 향후 미국(주별 MTL), 싱가포르(MAS), EU(MiCA) 등 추가 관할권으로의 확장을 고려하고 있으며, 아키텍처는 이러한 확장을 저해하지 않도록 설계됩니다.'
    ]
  },
  {
    id: 'chapter-7',
    chapterNumber: '제7장',
    title: '7. 거버넌스 (Governance & Controls)',
    subtitle: '초기 3-of-5 다중서명 RBAC에서 중장기 커뮤니티 DAO로의 진화',
    summary: 'MLRO, CISO, 재무이사회의 분립된 권한과 타임락 기반의 보수적 의사결정 구조.',
    content: [
      '• 초기 단계 거버넌스: 발행사가 다중서명(3-of-5) 및 타임락 기반 RBAC를 통해 운영하며, 컴플라이언스 책임자(MLRO) 및 보안 책임자(CISO)의 승인 권한이 시스템에 반영됩니다.',
      '• 중장기 거버넌스: 커뮤니티 참여 확대를 검토하되, 규제 준수와 준비금 안정성이 항상 우선합니다.',
      '• 주요 정책 변경: 발행 상한 조정(24M -> 지속 확대), 신규 체인 지원, 수수료 정책 변경 등은 모두 다중서명 승인과 최소 24~48시간 타임락 지연 실행을 거칩니다.'
    ]
  },
  {
    id: 'chapter-8',
    chapterNumber: '제8장',
    title: '8. 리스크 매트릭스 및 대응 방안 (Risk & Mitigation)',
    subtitle: '기술, 규제, 시장, 운영, 암호 기술 리스크 분석',
    summary: '스마트컨트랙트 취약점, 규제 승인 지연, 유동성 압박 및 PQC 알고리즘 취약성에 대한 철저한 방어선.',
    content: [
      '• 기술 리스크: 스마트컨트랙트 취약점 및 브릿지 해킹 → 대응: 독립 감사 2개 기관 + 브릿지 전담 감사, 상시 버그바운티, 서킷 브레이커, Timelock/RBAC 적용.',
      '• 규제 리스크: 라이선스 심사 지연 또는 조건부 승인 → 대응: 사전 협의 및 서류 준비, HKMA 전문 법무 자문 트랙 병행.',
      '• 시장 리스크: 기존 1세대 스테이블코인 대비 초기 유동성 확보 → 대응: 거래소 상장 기술 지원, 전문 유동성 공급자(LP) 연동 및 인센티브 설계.',
      '• 운영 리스크: 커스터디 기관 리스크, 대량 상환 시 유동성 압박 → 대응: 홍콩 인가 신탁 분리 보관, 대량 상환 대응 우선순위 정책 사전 정의.',
      '• 암호 기술 리스크: PQC 표준 개정, 장기적 알고리즘 취약점 발견 → 대응: 암호 애자일리티(Crypto-Agility) 모듈형 아키텍처를 통한 무중단 알고리즘 교체 지원.'
    ]
  },
  {
    id: 'chapter-9',
    chapterNumber: '제9장',
    title: '9. 프로젝트 로드맵 (Roadmap & Milestones)',
    subtitle: '상세설계, 규제 심사 병행부터 메인넷 런칭 및 하이퍼케어까지',
    summary: 'Phase 1 아키텍처 확정 ~ Phase 6 HKMA 심사 대응 ~ Phase 7 메인넷 런칭.',
    content: [
      '• Phase 1 (초기 1~2개월): 상세설계 및 HKMA 라이선스 신청 착수 (법무 트랙 병행, PQC/브릿지 방법론 확정).',
      '• Phase 2 (2~3개월): 스마트컨트랙트, 백엔드, 프런트엔드 구현 및 Testnet 배포 (PQC 하이브리드 검증).',
      '• Phase 3~5 (3~4개월): 1·2차 독립 보안감사 및 조치, 최소 8주 공개 테스트넷 운영, 버그바운티 가동.',
      '• Phase 6 (6~10개월, Phase 1부터 병행): HKMA 라이선스 심사 대응 및 규제 질문 라운드 완결.',
      '• Phase 7 (심사 완료 후): Ethereum Mainnet 배포 및 정식 서비스 개시, 3개월 하이퍼케어 운영 안정화.'
    ]
  },
  {
    id: 'chapter-10',
    chapterNumber: '제10장',
    title: '10. 결론 (Conclusion)',
    subtitle: '완전 담보, 규제 준수, 양자내성 보안의 새로운 표준',
    summary: '차세대 글로벌 금융 인프라를 위한 가장 신뢰할 수 있는 디지털 달러.',
    content: [
      'USDQS는 완전 담보(Full Backing), 규제 준수(Compliance by Design), 양자내성 보안(Post-Quantum Security)이라는 세 가지 흔들리지 않는 원칙 위에서 설계된 USD 스테이블코인입니다.',
      '실현되지 않은 가공의 기술이나 검증되지 않은 자산 규모를 근거로 삼지 않고, 검증 가능한 100% 준비금과 투명한 월간 감사, NIST 공식 표준 양자내성 암호 기술, 그리고 홍콩 금융관리국(HKMA)의 강력한 규제 준수 체계를 통해 디지털 경제의 가장 안전한 기축 통화이자 결제 레일로 거듭날 것입니다.'
    ]
  }
];
