import type { FaqItem } from '../types';

export const FAQ_DATA_EN: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'general',
    question: 'What is USDQS and how does it maintain its 1:1 USD peg?',
    answer: 'USDQS is an institutional quantum-grade multi-chain digital dollar engineered for sovereign-tier stability, rapid global settlement, and zero counterparty insolvency risk. Every single 1 USDQS in circulation is permanently pegged 1:1 to the US Dollar and backed by more than 102% in ultra-liquid reserves, primarily comprised of short-term U.S. Treasury bills held with regulated custodial banks.'
  },
  {
    id: 'faq-2',
    category: 'reserves',
    question: 'How often are USDQS reserves verified and published?',
    answer: 'USDQS operates with continuous Proof of Reserves (PoR) published in real time on-chain via decentralized cryptographic oracle networks. Additionally, independent top-tier audit firms (BDO Global) conduct comprehensive quarterly attestations with unannounced snapshot inspections, verifying that total collateral strictly exceeds 100% of the active token supply.'
  },
  {
    id: 'faq-3',
    category: 'technology',
    question: 'Which blockchains and transport protocols support USDQS?',
    answer: 'USDQS is natively issued across more than 16 major blockchain protocols, including Ethereum (ERC-20), Solana (SPL), Arbitrum, Base, Polygon, Avalanche, TRON, and TON. Each implementation adheres to standardized smart contract specifications featuring audited security boundaries, reentrancy guards, and high-speed cross-chain liquidity conduits.'
  },
  {
    id: 'faq-4',
    category: 'general',
    question: 'What additional asset classes exist within the USDQS family?',
    answer: 'Beyond the primary USDQS (Digital Dollar), the protocol foundation oversees QSEUR (Euro-pegged liquid reserve unit) and QSXAU (Physically allocated London Good Delivery gold bullion digital token, where 1 QSXAU corresponds to exactly one fine troy ounce of 99.99% pure gold in Swiss vault custody).'
  },
  {
    id: 'faq-5',
    category: 'compliance',
    question: 'Who is eligible to mint, redeem, and transact with USDQS?',
    answer: 'Any individual, merchant, or institution can hold and transfer USDQS globally 24/7 without restrictions through self-custodial Web3 wallets. Direct primary minting and wire-redemption directly with the USDQS Reserve Treasury is available for verified institutional entities and market makers undergoing standardized institutional KYC/AML compliance checks.'
  },
  {
    id: 'faq-6',
    category: 'reserves',
    question: 'What is the "Net Excess Reserve Buffer" and why does it matter?',
    answer: 'Unlike fractional or algorithmic stablecoins, USDQS maintains an overcollateralization cushion (currently exceeding $3.08 Billion in net excess reserves). This buffer is funded from accumulated yield on U.S. Treasuries, ensuring that even under extreme market stress, black swan events, or interest rate fluctuations, the 1:1 backing remains bulletproof.'
  }
];

export const FAQ_DATA_KO: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'general',
    question: 'USDQS란 무엇이며 어떻게 1:1 USD 페깅을 유지하나요?',
    answer: 'USDQS는 주권 화폐급 안정성, 초고속 글로벌 결제, 거래상대방 파산 위험 제로를 위해 설계된 기관급 멀티체인 디지털 달러입니다. 유통되는 모든 1 USDQS는 1 미국 달러와 영구적으로 1:1 페깅되며, 규제받는 수탁 은행에 예치된 미국 단기 국채 중심의 102% 이상 초고유동성 자산으로 완전 담보됩니다.'
  },
  {
    id: 'faq-2',
    category: 'reserves',
    question: 'USDQS 담보 준비금은 얼마나 자주 검증되고 공개되나요?',
    answer: 'USDQS는 탈중앙화 암호학적 오라클 네트워크(PoR)를 통해 온체인 상에 실시간으로 준비금을 공개합니다. 또한 글로벌 독립 회계감사 법인(BDO Global)이 사전 불시 점검을 동반한 분기별 정밀 실사를 수행하여 총 담보액이 유통 토큰 공급량을 엄격히 초과함을 지속적으로 검증합니다.'
  },
  {
    id: 'faq-3',
    category: 'technology',
    question: 'USDQS를 지원하는 블록체인 및 전송 프로토콜은 무엇인가요?',
    answer: 'USDQS는 이더리움(ERC-20), 솔라나(SPL), 아비트럼, 베이스, 폴리곤, 아발란체, 트론, 톤(TON) 등 16개 이상의 주요 블록체인에 네이티브로 발행됩니다. 각 구현체는 보안 감사 검증, 재진입 공격 방지, 고속 크로스체인 브릿지 규격을 완벽하게 준수합니다.'
  },
  {
    id: 'faq-4',
    category: 'general',
    question: 'USDQS 생태계에는 달러 외에 어떤 추가 자산군이 있나요?',
    answer: '기본 기축 달러인 USDQS 외에도, 유로화 연동 디지털 통화인 QSEUR, 그리고 스위스 볼트에 보관된 99.99% 순금 1트로이온스 실물 금괴와 1:1 매칭되는 금 본위 토큰 QSXAU를 프로토콜 재단에서 함께 감독 및 발행합니다.'
  },
  {
    id: 'faq-5',
    category: 'compliance',
    question: '누가 USDQS를 발행, 상환 및 결제에 사용할 수 있나요?',
    answer: '모든 개인, 상점, 기관은 논커스터디얼(개인 소유) Web3 지갑을 통해 연중무휴 24시간 제한 없이 전 세계로 USDQS를 전송하고 보관할 수 있습니다. 재단 금고와의 직접적인 대규모 1차 민팅 및 은행 전신환 상환은 표준 기관 KYC/AML 실사를 통과한 적격 기관 및 마켓메이커에게 제공됩니다.'
  },
  {
    id: 'faq-6',
    category: 'reserves',
    question: '"순 초과 준비금 버퍼"란 무엇이며 왜 중요한가요?',
    answer: '부분 지급준비율이나 알고리즘 스테이블코인과 달리, USDQS는 현재 30.8억 달러(약 4조 원)를 초과하는 순 초과 담보 완충액을 유지합니다. 이는 미국 국채 이자 수익으로 적립되며, 극단적인 금융 위기나 블랙스완 사태에서도 1:1 페깅의 완전성을 철통같이 방어합니다.'
  }
];

// Default export for backward compatibility
export const FAQ_DATA = FAQ_DATA_EN;
