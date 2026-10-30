import type { ReserveAsset, TransparencyMetric } from '../types';

/**
 * USDQS 안정성 지표 및 준비금 요약 데이터
 * - 초기 발행 상한: 24,000,000 USDQS (RFP & 백서 제2장 / 사용자 요청 기준)
 * - 상한 관리: 거버넌스 승인(다중서명 3-of-5)을 거쳐 단계적으로 확장(Expandable) 가능
 * - 수탁 구조: 홍콩 소재 인가 은행(AI) 파산절연(Bankruptcy-remote) 신탁 계좌
 * - 상환 SLA: 영업일 기준 T+1 이내(목표), 최대 T+2
 */
export const TRANSPARENCY_METRICS: TransparencyMetric = {
  initialCap: 24000000,                  // 초기 발행 상한 (24M USDQS)
  currentCap: 24000000,                  // 확장 가능한 현재 유효 상한
  totalSupply: 18750000,                 // 현재 온체인 유통량 (1,875만 USDQS)
  totalReserves: 19200000,               // 홍콩 신탁 총 담보 준비금 ($1,920만 USD)
  reserveRatio: 102.4,                   // 실시간 담보 비율 (102.4% 초과 담보 상태)
  netExcessReserves: 450000,             // 초과 담보 완충 자본 ($45만 USD)
  lastAttestationDate: 'October 24, 2026 (Continuous On-Chain Attestation)',
  auditor: 'PwC Hong Kong / BDO Global & Chainlink PoR Oracle',
  custodianBank: 'Standard Chartered (HK) / Bank of China (HK) - Bankruptcy-Remote Trust',
  twentyFourHourVolume: 6420500,         // 24시간 거래 볼륨 ($642만 USD)
  redemptionSLA: 'T+1 Business Day (Target SLA, Maximum T+2)',
  regulatoryStatus: 'HKMA Stablecoins Ordinance (Aug 1, 2025 Framework Compliant)'
};

/**
 * 준비자산 포트폴리오 구성 (백서 제3.2절 & RFP 7.1절 기준)
 * - 만기 3개월 이내 미국 단기국채(T-Bills), 익일물 역레포, 현금 분리보관으로 한정
 */
export const RESERVE_BREAKDOWN: ReserveAsset[] = [
  {
    category: 'Treasury Bills',
    name: 'U.S. Treasury Bills (< 90 Days Maturity)',
    percentage: 82.5,
    amountUSD: 15840000,
    description: 'Directly held short-term U.S. government obligations with highest sovereign guarantee and instant secondary liquidity.',
    color: '#10B981'
  },
  {
    category: 'Reverse Repurchase',
    name: 'Overnight Reverse Repo Agreements (ON RRP)',
    percentage: 11.5,
    amountUSD: 2208000,
    description: 'Fully collateralized overnight transactions with top-tier primary dealers and Federal Reserve counterparties.',
    color: '#06B6D4'
  },
  {
    category: 'Cash & Deposits',
    name: 'Cash in HKMA-Licensed Bank Segregated Trust',
    percentage: 6.0,
    amountUSD: 1152000,
    description: 'Unencumbered cash balances held in bankruptcy-remote trust accounts at Hong Kong Authorized Institutions.',
    color: '#3B82F6'
  }
];

export const HISTORICAL_ATTESTATIONS = [
  {
    period: 'October 2026 (Monthly)',
    attestationDate: 'Oct 24, 2026',
    excessReserves: '$450,000 USD',
    auditorReport: 'Clean Unqualified Attestation (HKMA Format)',
    reportId: 'HKMA-USDQS-ATT-202610'
  },
  {
    period: 'September 2026 (Monthly)',
    attestationDate: 'Sep 30, 2026',
    excessReserves: '$420,000 USD',
    auditorReport: 'Clean Unqualified Attestation (HKMA Format)',
    reportId: 'HKMA-USDQS-ATT-202609'
  },
  {
    period: 'August 2026 (Inception)',
    attestationDate: 'Aug 31, 2026',
    excessReserves: '$380,000 USD',
    auditorReport: 'Initial Capital & Reserve Verification',
    reportId: 'HKMA-USDQS-ATT-202608'
  }
];

