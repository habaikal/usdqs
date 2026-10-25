import type { ChainInfo } from '../types';

export const SUPPORTED_CHAINS: ChainInfo[] = [
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    color: '#627EEA',
    speed: '~12 sec',
    avgFee: '$1.20',
    contractAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    status: 'active',
    tvl: '$54.2B'
  },
  {
    id: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    color: '#14F195',
    speed: '< 400 ms',
    avgFee: '< $0.001',
    contractAddress: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
    status: 'active',
    tvl: '$32.8B'
  },
  {
    id: 'arbitrum',
    name: 'Arbitrum One',
    symbol: 'ARB',
    color: '#28A0F0',
    speed: '< 250 ms',
    avgFee: '$0.02',
    contractAddress: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
    status: 'active',
    tvl: '$18.4B'
  },
  {
    id: 'base',
    name: 'Base',
    symbol: 'BASE',
    color: '#0052FF',
    speed: '< 1 sec',
    avgFee: '$0.01',
    contractAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    status: 'active',
    tvl: '$12.1B'
  },
  {
    id: 'polygon',
    name: 'Polygon PoS',
    symbol: 'POL',
    color: '#8247E5',
    speed: '~2 sec',
    avgFee: '$0.015',
    contractAddress: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
    status: 'active',
    tvl: '$9.6B'
  },
  {
    id: 'avalanche',
    name: 'Avalanche C-Chain',
    symbol: 'AVAX',
    color: '#E84142',
    speed: '~1 sec',
    avgFee: '$0.04',
    contractAddress: '0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7',
    status: 'active',
    tvl: '$7.8B'
  },
  {
    id: 'ton',
    name: 'TON Network',
    symbol: 'TON',
    color: '#0098EA',
    speed: '< 3 sec',
    avgFee: '$0.02',
    contractAddress: 'EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs',
    status: 'active',
    tvl: '$6.5B'
  },
  {
    id: 'optimism',
    name: 'Optimism (OP Mainnet)',
    symbol: 'OP',
    color: '#FF0420',
    speed: '< 1 sec',
    avgFee: '$0.03',
    contractAddress: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
    status: 'active',
    tvl: '$5.2B'
  },
  {
    id: 'tron',
    name: 'TRON TRC-20',
    symbol: 'TRX',
    color: '#FF0013',
    speed: '~3 sec',
    avgFee: '$1.00',
    contractAddress: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
    status: 'active',
    tvl: '$24.6B'
  },
  {
    id: 'sui',
    name: 'Sui Network',
    symbol: 'SUI',
    color: '#4DA2FF',
    speed: '< 300 ms',
    avgFee: '< $0.005',
    contractAddress: '0xc060000bc4d4...918a',
    status: 'active',
    tvl: '$3.8B'
  },
  {
    id: 'aptos',
    name: 'Aptos',
    symbol: 'APT',
    color: '#2ED8A7',
    speed: '< 400 ms',
    avgFee: '< $0.003',
    contractAddress: '0x1::coin::CoinStore<0xf22...::usdqs::USDQS>',
    status: 'active',
    tvl: '$2.9B'
  },
  {
    id: 'bsc',
    name: 'BNB Smart Chain',
    symbol: 'BNB',
    color: '#F0B90B',
    speed: '~3 sec',
    avgFee: '$0.08',
    contractAddress: '0x55d398326f99059fF775485246999027B3197955',
    status: 'active',
    tvl: '$8.2B'
  }
];
