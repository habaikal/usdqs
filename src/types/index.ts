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
  totalSupply: number;
  totalReserves: number;
  reserveRatio: number;
  netExcessReserves: number;
  lastAttestationDate: string;
  auditor: string;
  twentyFourHourVolume: number;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'reserves' | 'technology' | 'compliance';
}

export interface PartnerInfo {
  name: string;
  category: 'Exchange' | 'Custodian' | 'Liquidity' | 'DeFi';
  tier: string;
  badge: string;
}
