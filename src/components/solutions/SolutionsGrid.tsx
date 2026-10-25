import React from 'react';
import { User, Store, Landmark, ArrowUpRight, Globe } from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';

interface SolutionsGridProps {
  onSelectSolution: (title: string) => void;
}

export const SolutionsGrid: React.FC<SolutionsGridProps> = ({ onSelectSolution }) => {
  const { t, language } = useTranslation();

  const isKo = language === 'ko';

  const solutions = [
    {
      id: 'individuals',
      title: isKo ? '개인 및 트레이더를 위한 USDQS' : 'USDQS for Individuals',
      tagline: isKo ? '국경 없는 디지털 자산 & 즉각적인 글로벌 송금' : 'Borderless Wealth & Instant Global Remittance',
      description: isKo 
        ? '수수료 거의 없이 수초 내에 전 세계 어디로든 가치를 전송하세요. 100% 실물 달러 담보를 통해 지역 통화 가치 하락으로부터 자산을 안전하게 보호합니다.'
        : 'Transfer value anywhere on Earth within seconds at virtually zero fee. Protect your purchasing power against local currency devaluation with direct sovereign-dollar backing.',
      icon: User,
      color: '#10B981',
      badge: isKo ? '슬리피지 0%' : 'Zero Slippage',
      features: isKo ? [
        '은행 휴무일 없는 24시간 실시간 글로벌 P2P 송금',
        '비수탁형(Non-custodial) Web3 모바일 지갑 즉시 연동',
        '디파이 예치 및 탈중앙 유동성 풀 즉시 참여'
      ] : [
        'Sub-second P2P global payments without banking holidays',
        'Direct compatibility with non-custodial Web3 mobile wallets',
        'Frictionless entry to decentralized yield and staking pools'
      ]
    },
    {
      id: 'merchants',
      title: isKo ? '가맹점 및 결제사를 위한 USDQS' : 'USDQS for Merchants',
      tagline: isKo ? '카드 수수료 0%의 글로벌 범용 결제 게이트웨이' : 'Universal Payment Gateway with 0% Interchange Drag',
      description: isKo
        ? '신용카드 차지백(환불 사기) 위험, 정산 보류금, 2~3%의 높은 결제 수수료 없이 100개국 이상의 고객으로부터 디지털 달러 결제를 즉시 수취하세요.'
        : 'Accept digital dollar payments from over 100+ countries without credit card chargeback risk, rolling reserves, or high 3% payment processor transaction cuts.',
      icon: Store,
      color: '#06B6D4',
      badge: isKo ? '가맹점 API' : 'Merchant API',
      features: isKo ? [
        '즉시 연동 멀티체인 체크아웃 SDK (Shopify, WooCommerce, 커스텀 API)',
        'L2 네트워크 기반 즉각적인 결제 완결성 (차지백 리스크 제로)',
        '현지 통화 자동 환전 또는 이자 수익 금고 자동 이체'
      ] : [
        'Instant multi-chain checkout SDK (Shopify, WooCommerce, Custom API)',
        'Zero chargeback risk with instant finality on L2s',
        'Real-time automated treasury sweep into local currency or yield'
      ]
    },
    {
      id: 'exchanges',
      title: isKo ? '기관 및 거래소를 위한 USDQS' : 'USDQS for Institutions & Exchanges',
      tagline: isKo ? '가장 깊은 글로벌 오더북 기축 유동성 기반' : 'Deepest Global Orderbook Liquidity Base',
      description: isKo
        ? '전 세계 현물, 무기한 선물, 장외(OTC) 거래를 위한 신뢰받는 기축 통화입니다. 수억 달러 규모의 기관 블록 딜을 연중무휴 실시간으로 정산하세요.'
        : 'The preferred base quoting currency for spot, perpetual futures, and OTC desks worldwide. Settle multi-million dollar institutional block transfers round the clock.',
      icon: Landmark,
      color: '#3B82F6',
      badge: isKo ? '프라임 유동성' : 'Prime Liquidity',
      features: isKo ? [
        '기관 전용 장외(OTC) 1차 대량 민팅/상환 포털',
        '암호학적 실시간 준비금 증명(PoR) 텔레메트리 피드',
        '멀티시그 기관 수탁 솔루션 연동 (Fireblocks, BitGo)'
      ] : [
        'Dedicated institutional OTC mint/redeem wire portal',
        'Continuous Proof of Reserves cryptographic telemetry feed',
        'High-throughput multi-sig custody integration (Fireblocks, BitGo)'
      ]
    }
  ];

  return (
    <section id="solutions" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <Globe className="w-3.5 h-3.5" />
            <span>{t.solutions.badge}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-['Plus_Jakarta_Sans']">
            {t.solutions.title}
          </h2>

          <p className="text-base text-slate-300">
            {t.solutions.description}
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {solutions.map((item) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.id}
                className="glass-panel glass-panel-hover rounded-2xl p-7 flex flex-col justify-between relative group overflow-hidden"
              >
                {/* Top Corner Glow */}
                <div 
                  className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl opacity-20 pointer-events-none group-hover:opacity-40 transition-opacity"
                  style={{ backgroundColor: item.color }}
                />

                <div>
                  {/* Icon & Badge Header */}
                  <div className="flex items-center justify-between mb-5">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg border border-white/10"
                      style={{ backgroundColor: '#070f20' }}
                    >
                      <IconComponent className="w-6 h-6" style={{ color: item.color }} />
                    </div>
                    <span 
                      className="text-[11px] font-bold font-mono px-2.5 py-1 rounded-full border"
                      style={{ 
                        color: item.color, 
                        borderColor: `${item.color}40`,
                        backgroundColor: `${item.color}15`
                      }}
                    >
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 font-['Plus_Jakarta_Sans']">
                    {item.title}
                  </h3>

                  <p className="text-xs font-semibold font-mono text-emerald-400 mb-3">
                    {item.tagline}
                  </p>

                  <p className="text-xs text-slate-300 leading-relaxed mb-6">
                    {item.description}
                  </p>

                  {/* Bullet Highlights */}
                  <div className="space-y-2.5 pt-4 border-t border-slate-800/80">
                    {item.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Link */}
                <div className="pt-6 mt-6 border-t border-slate-800/60">
                  <button
                    onClick={() => onSelectSolution(item.title)}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-slate-900 border border-slate-700/80 hover:border-emerald-400/60 hover:bg-slate-800 transition-all flex items-center justify-between cursor-pointer group/btn"
                  >
                    <span>{t.solutions.exploreBlueprint}</span>
                    <ArrowUpRight className="w-4 h-4 text-emerald-400 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
