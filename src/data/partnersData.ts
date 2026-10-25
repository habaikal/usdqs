import type { PartnerInfo } from '../types';

export const GLOBAL_PARTNERS: PartnerInfo[] = [
  { name: 'Binance Global', category: 'Exchange', tier: 'Tier-1', badge: 'Prime Market Maker' },
  { name: 'Coinbase Prime', category: 'Custodian', tier: 'Tier-1', badge: 'Regulated Custody' },
  { name: 'OKX Liquidity', category: 'Exchange', tier: 'Tier-1', badge: 'Deep Orderbook' },
  { name: 'Kraken Institutional', category: 'Exchange', tier: 'Tier-1', badge: 'Direct Wire Gateway' },
  { name: 'Bybit Institutional', category: 'Exchange', tier: 'Tier-1', badge: 'Cross-Margin Hub' },
  { name: 'Wintermute', category: 'Liquidity', tier: 'Market Maker', badge: 'Global Algorithmic MM' },
  { name: 'Jump Crypto', category: 'Liquidity', tier: 'Market Maker', badge: 'Arbitrage Liquidity' },
  { name: 'Uniswap v3 Pools', category: 'DeFi', tier: 'DEX Protocol', badge: 'Deep Automated MM' },
  { name: 'Curve Finance', category: 'DeFi', tier: 'DEX Protocol', badge: 'Low-Slippage Peg Pool' },
  { name: 'Bitfinex Terminal', category: 'Exchange', tier: 'Tier-1', badge: 'Pioneer Spot Market' },
  { name: 'BitGo Trust', category: 'Custodian', tier: 'Qualified Custody', badge: 'Multi-Sig Vault' },
  { name: 'Fireblocks Engine', category: 'Custodian', tier: 'Infrastructure', badge: 'MPC Treasury API' }
];
