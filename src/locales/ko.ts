import type { TranslationKeys } from './index';

export const ko: TranslationKeys = {
  ticker: {
    peg: '페깅',
    pegValue: '1 USDQS = $1.0001 USD',
    totalSupply: '총 유통 공급량',
    reservesBacking: '준비금 담보율',
    overcollateralized: '초과 담보 완료',
    settlement24h: '24시간 온체인 결제량',
    activeChains: '지원 블록체인',
    multiChains: '16+ 멀티체인'
  },
  nav: {
    whyUsdqs: 'USDQS 특징',
    howItWorks: '작동 원리',
    reserves: '실시간 준비금 증명',
    chains: '지원 블록체인',
    solutions: '기관용 솔루션',
    faq: '자주 묻는 질문',
    attestation: '독립 감사 증명서',
    connectWallet: '지갑 연결',
    connected: '연결됨',
    live: '실시간'
  },
  hero: {
    badge: '차세대 주권급 멀티체인 결제 레이어',
    title: 'USDQS 토큰',
    phrases: [
      '기관급 글로벌 멀티체인 유동성.',
      '마찰 없는 즉각적인 주권 화폐 결제망.',
      '실시간 102.4% 담보 준비금 증명(PoR).',
      '네오-USDT 차세대 디지털 달러 프로토콜.'
    ],
    description: 'USDQS는 기관급 유동성, 서브세컨드(초단위 이하) 크로스체인 결제, 타협 없는 규제 투명성을 위해 설계된 차세대 디지털 달러입니다. 미국 단기 국채 100% 실물 담보와 102.4% 초과 담보 비율을 자랑합니다.',
    getUsdqs: 'USDQS 발행 및 받기',
    learnHow: '작동 원리 영상 안내',
    circulatingSupply: '유통 공급량',
    collateralizedRatio: '담보 비율',
    nativeChains: '지원 메인넷',
    activeAttestation: '실시간 준비금 증명(PoR) 가동 중'
  },
  reserves: {
    badge: '암호학적 실시간 준비금 증명',
    title: '100% 담보. 완전한 유동성. 중단 없는 투명성.',
    description: '유통되는 모든 1 USDQS 토큰은 미국 달러와 1:1로 페깅되며, 안전한 실물 국채 및 현금 준비금으로 완전 담보됩니다. 어떠한 시장 급변기에도 유동성을 완벽하게 보장하는 초과 준비금 버퍼를 유지합니다.',
    verifiedReserves: '검증된 총 준비금 자산',
    auditedBy: '글로벌 Tier-1 독립 회계감사 법인의 실시간 감사 검증',
    circulatingSupply: '유통 중인 USDQS 총 부채',
    sumActive: '16개 이상 활성 전송 프로토콜 상의 총 발행 토큰 합계',
    excessBuffer: '순 초과 준비금 버퍼 (완충액)',
    coverageRatio: '담보 커버리지: 102.4% (지급능력 무결점 증명)',
    tabCurrent: '현재 준비금 자산 포트폴리오',
    tabHistory: '분기별 독립 회계감사 보고서 이력',
    inspectReport: 'BDO 공식 회계감사 전문 확인',
    allocationTitle: '준비금 자산 배분 비중',
    breakdownLabel: '100.0% 실물 담보 내역',
    totalCollateral: '총 담보 가치'
  },
  simulator: {
    badge: '프로토콜 인터랙티브 샌드박스',
    title: 'USDQS 작동 원리: 즉각적인 1:1 발행 체험',
    description: '수수료 없는 무마찰 1차 발행 엔진을 직접 체험해 보세요. 표준 피아트(USD)를 입금하면 슬리피지 없이 원하는 블록체인에서 1:1 담보 USDQS를 즉시 수령합니다.',
    primaryConduit: '공식 1차 발행 파이프라인',
    zeroFee: '0.00% 발행 수수료',
    youSend: '입금할 자산',
    balance: '잔액',
    youReceive: '수령할 자산 (1:1 정확한 수량 보증)',
    pegRatio: '페깅 비율 1.0000',
    destinationChain: '수령할 블록체인 네트워크 선택',
    speed: '네트워크 트랜잭션 확정 속도',
    avgFee: '예상 네트워크 가스비',
    spread: '프로토콜 발행 스프레드',
    noSlippage: '0.00% (슬리피지 없음)',
    simulating: '암호학적 예치 증명 처리 중...',
    mintAction: '1:1 민팅 시뮬레이션 실행',
    redeemAction: '1:1 현금 상환 시뮬레이션 실행',
    successMint: '{chain} 네트워크에서 {amount} USDQS 1:1 발행 시뮬레이션 성공!',
    successRedeem: '{amount} USD 은행 계좌 송금 상환 시뮬레이션 성공!'
  },
  solutions: {
    badge: '범용 글로벌 금융 아키텍처',
    title: '탈중앙화 금융 프론티어의 핵심 동력',
    description: '개인의 국경 없는 소액 송금부터 수십억 달러 규모의 기관 간 청산 결제까지, USDQS는 분산 경제 전반에 무마찰 유동성을 제공합니다.',
    exploreBlueprint: '기관용 기술 설계서 열람'
  },
  chains: {
    badge: '멀티체인 주권 결제 인프라',
    title: '지원 블록체인 및 검증된 스마트 컨트랙트',
    description: 'USDQS는 고성능 레이어 1 메인넷과 초저수수료 L2 롤업에 네이티브로 배포됩니다. 프로토콜을 선택하여 스마트 컨트랙트 주소를 복사하거나 직접 연동하세요.',
    activeNetworks: '활성 네트워크',
    avgSettlement: '평균 결제 속도',
    finality: '확정 속도',
    avgFee: '평균 수수료',
    copyContract: '스마트 컨트랙트 주소 복사',
    copied: '복사 완료!'
  },
  faq: {
    badge: '지식 베이스 & 프로토콜 규격',
    title: '자주 묻는 질문 (FAQ)',
    description: 'USDQS의 메커니즘, 실시간 준비금 증명, 스마트 컨트랙트 보안, 기관 민팅 표준에 대해 알아보세요.',
    searchPlaceholder: '프로토콜 규격, 준비금, 페깅 유지 원리 검색...',
    allTopics: '전체 주제',
    noMatching: '"{query}"에 대한 검색 결과가 없습니다.'
  },
  footer: {
    tagline: 'USDQS는 최고의 주권급 디지털 달러 프로토콜입니다. 즉각적인 멀티체인 결제, 마찰 없는 기관 유동성, 100% 검증된 투명성을 위해 설계되었습니다.',
    overcollateralized: '102.4% 초과 담보',
    multiChains: '16+ 멀티체인',
    protocolGroup: 'USDQS 프로토콜',
    assetsGroup: '자산 스위트',
    solutionsGroup: '엔터프라이즈 솔루션',
    governanceGroup: '거버넌스 및 준법',
    regulatoryTitle: '글로벌 규제 및 준법 고지문',
    regulatoryText: 'USDQS 토큰은 1:1로 고정된 미국 달러 가치의 디지털 표현물로서 엄격한 다중 관할권 규제 준수 프레임워크 하에 발행됩니다. USDQS 준비금은 미국 정부의 단기 국채와 연방 감독을 받는 수탁 은행의 예치금으로 안전하게 보관됩니다.',
    copyright: '© 2026 USDQS Protocol Foundation. All rights reserved. Original Neo-USDT Architecture.',
    disclaimer: 'Tether Operations Limited와의 지적 재산권 또는 상표권 제휴 관계가 없습니다.'
  },
  walletModal: {
    title: 'Web3 지갑 연결',
    connectedTitle: '지갑 연결 성공',
    subtitle: '기관용 USDQS 멀티체인 게이트웨이',
    installMetaMask: '메타마스크 미감지 - 설치하러 가기',
    connectTo: '연결된 지갑',
    address: '지갑 주소',
    balanceUSDQS: '보유 USDQS 잔액',
    usdValuation: 'USD 평가액',
    nativeBalance: '네이티브 가스비 잔액',
    proceedMint: '민팅 진행하기',
    disconnect: '지갑 연결 해제',
    addToken: '메타마스크에 USDQS 토큰 자동 추가',
    tokenAdded: 'USDQS 토큰이 메타마스크에 등록되었습니다!',
    terms: '연결 시 USDQS 프로토콜 이용약관에 동의하게 됩니다. 논커스터디얼(비수탁형) 종단간 암호화 적용.'
  }
};
