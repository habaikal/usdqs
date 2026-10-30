/**
 * 실시간 프로토콜 지표 카운터 (LiveMetrics)
 * - IntersectionObserver를 활용해 화면 진입 시 부드러운 카운트업(Count-up) 애니메이션 실행
 * - 다국어(ko / en / zh-HK) 및 동적 발행 상한(currentCap)과 실시간 연동
 */
import React, { useState, useEffect, useRef } from 'react';
import { Activity, DollarSign, TrendingUp, Clock, Globe2, ShieldCheck } from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';
import { TRANSPARENCY_METRICS } from '../../data/reservesData';

interface LiveMetricsProps {
  currentCap?: number;
}

export const LiveMetrics: React.FC<LiveMetricsProps> = ({
  currentCap = TRANSPARENCY_METRICS.currentCap,
}) => {
  const { language } = useTranslation();
  const [hasAnimated, setHasAnimated] = useState(false);
  const [displayReserves, setDisplayReserves] = useState(0);
  const [displayVolume, setDisplayVolume] = useState(0);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  useEffect(() => {
    if (!hasAnimated) return;

    const duration = 1800;
    const startTime = performance.now();
    const targetReserves = TRANSPARENCY_METRICS.totalReserves;
    const targetVolume = TRANSPARENCY_METRICS.twentyFourHourVolume;

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      setDisplayReserves(Math.floor(targetReserves * ease));
      setDisplayVolume(Math.floor(targetVolume * ease));

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [hasAnimated]);

  const isKo = language === 'ko';
  const isZh = language === 'zh-HK';

  return (
    <section
      ref={sectionRef}
      id="why-usdqs"
      className="py-16 lg:py-20 border-b border-emerald-950/50 bg-[#060a15] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-400">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span>REAL-TIME AUDITED PROTOCOL METRICS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-['Plus_Jakarta_Sans']">
            {isKo
              ? '숫자로 증명하는 기관급 신뢰와 정산 규모'
              : isZh
              ? '以數據證明的機構級信任與結算規模'
              : 'Institutional Trust & Scale Proven by Live Telemetry'}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            {isKo
              ? '홍콩 HKMA 규제 프레임워크와 NIST FIPS 203/204 양자내성 암호화를 결합하여 모든 준비금과 발행 상한을 실시간 온체인 오라클로 투명하게 공개합니다.'
              : isZh
              ? '結合香港金管局(HKMA)監管框架與 NIST FIPS 203/204 後量子加密，透過鏈上預言機即時公開所有儲備與發行上限。'
              : 'Combining the HKMA regulatory framework with NIST FIPS 203/204 post-quantum cryptography, every dollar of reserve and issuance cap is verifiable on-chain.'}
          </p>
        </div>

        {/* 4 Core Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Stat 1: Total Verified Reserves */}
          <div className="glass-panel p-6 rounded-2xl border border-emerald-500/30 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-500/20 transition-all" />
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs font-mono uppercase tracking-wider">
                {isKo ? '검증된 총 신탁 준비금' : isZh ? '經核實總信託儲備' : 'Verified Trust Reserves'}
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-1 text-white font-mono font-extrabold text-2xl sm:text-3xl mb-2">
              <span className="text-emerald-400">$</span>
              <span>{(displayReserves / 1e6).toFixed(2)}M</span>
              <span className="text-xs font-normal text-slate-400">
                / {(currentCap / 1e6).toFixed(0)}M Cap
              </span>
            </div>
            <p className="text-xs text-emerald-400 flex items-center gap-1.5 font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>102.4% {isKo ? '초과 담보 (HK 신탁)' : isZh ? '超額抵押 (香港信託)' : 'Over-collateralized'}</span>
            </p>
          </div>

          {/* Stat 2: 24h Settlement Volume */}
          <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-28 h-28 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-cyan-500/20 transition-all" />
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs font-mono uppercase tracking-wider">
                {isKo ? '24시간 온체인 정산 볼륨' : isZh ? '24小時鏈上結算量' : '24h Settlement Volume'}
              </span>
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-1 text-white font-mono font-extrabold text-2xl sm:text-3xl mb-2">
              <span className="text-cyan-400">$</span>
              <span>{(displayVolume / 1e6).toFixed(2)}M</span>
              <span className="text-xs font-normal text-slate-400">USD</span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              {isKo ? '슬리피지 0.00% • 1:1 페깅 유지' : isZh ? '零滑點 0.00% • 1:1 錨定' : '0.00% Slippage • 1:1 Peg'}
            </p>
          </div>

          {/* Stat 3: Finality & Fee */}
          <div className="glass-panel p-6 rounded-2xl border border-teal-500/30 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-28 h-28 bg-teal-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-teal-500/20 transition-all" />
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs font-mono uppercase tracking-wider">
                {isKo ? '평균 PQC 검증 및 정산 속도' : isZh ? '平均 PQC 驗證與結算速度' : 'Avg PQC Settlement Speed'}
              </span>
              <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-400">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-1 text-white font-mono font-extrabold text-2xl sm:text-3xl mb-2">
              <span className="text-teal-400">&lt;</span>
              <span>0.8</span>
              <span className="text-sm font-medium text-slate-400 font-sans">
                {isKo ? '초 (Sec)' : isZh ? '秒 (Sec)' : 'sec'}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              {isKo ? 'ERC-4337 Paymaster 가스비 최적화' : isZh ? 'ERC-4337 Paymaster 燃料費優化' : 'ERC-4337 Paymaster Gas Sponsored'}
            </p>
          </div>

          {/* Stat 4: Global Multi-Chain & SLA */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-28 h-28 bg-blue-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-blue-500/20 transition-all" />
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs font-mono uppercase tracking-wider">
                {isKo ? '상환 SLA 및 멀티체인' : isZh ? '贖回 SLA 與多鏈網絡' : 'Redemption SLA & Networks'}
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                <Globe2 className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 text-white font-mono font-extrabold text-2xl sm:text-3xl mb-2">
              <span className="text-emerald-400">T+1</span>
              <span className="text-sm font-medium text-slate-300 font-sans">
                / 16 Chains
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              {isKo ? '홍콩 은행 영업일 기준 확정 상환' : isZh ? '按香港銀行營業日保證贖回' : 'Guaranteed HK Banking SLA'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

