import type { ReserveAsset, TransparencyMetric } from '../types';

export const TRANSPARENCY_METRICS: TransparencyMetric = {
  totalSupply: 128450210000,
  totalReserves: 131533015040,
  reserveRatio: 102.4,
  netExcessReserves: 3082805040,
  lastAttestationDate: 'October 24, 2026 (Real-Time Attested)',
  auditor: 'BDO Global & Armanino LLP (Continuous Proof of Reserve)',
  twentyFourHourVolume: 48250910200
};

export const RESERVE_BREAKDOWN: ReserveAsset[] = [
  {
    category: 'Treasury Bills',
    name: 'U.S. Treasury Bills (< 90 Days Maturity)',
    percentage: 84.2,
    amountUSD: 110750800000,
    description: 'Directly held short-term U.S. government obligations with sovereign guarantee and deepest global secondary market liquidity.',
    color: '#10B981'
  },
  {
    category: 'Reverse Repurchase',
    name: 'Overnight Reverse Repo Agreements',
    percentage: 10.3,
    amountUSD: 13547900000,
    description: 'Fully collateralized overnight transactions with top-tier primary dealers and Federal Reserve counterparties.',
    color: '#06B6D4'
  },
  {
    category: 'Cash & Deposits',
    name: 'Direct Cash & Insured Bank Deposits',
    percentage: 5.5,
    amountUSD: 7234315040,
    description: 'Unencumbered cash balances deposited across federally regulated Tier-1 commercial custodial banks.',
    color: '#3B82F6'
  }
];

export const HISTORICAL_ATTESTATIONS = [
  {
    period: 'Q3 2026',
    attestationDate: 'Oct 15, 2026',
    excessReserves: '$3.08 Billion',
    auditorReport: 'Clean Unqualified Opinion (BDO)',
    reportId: 'ATT-2026-Q3-0941'
  },
  {
    period: 'Q2 2026',
    attestationDate: 'Jul 18, 2026',
    excessReserves: '$2.85 Billion',
    auditorReport: 'Clean Unqualified Opinion (BDO)',
    reportId: 'ATT-2026-Q2-0812'
  },
  {
    period: 'Q1 2026',
    attestationDate: 'Apr 20, 2026',
    excessReserves: '$2.52 Billion',
    auditorReport: 'Clean Unqualified Opinion (BDO)',
    reportId: 'ATT-2026-Q1-0630'
  }
];
