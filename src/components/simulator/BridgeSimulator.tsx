/**
 * CCTP-Q 멀티체인 브릿지 시뮬레이터 (BridgeSimulator)
 * - neo-usdc의 네이티브 Burn & Mint 브릿지 시뮬레이터와 neo-usdt의 관리자 서킷 브레이커(Circuit Breaker)를 실시간 연동
 * - 관리자가 브릿지 일시 정지(Emergency Pause) 발동 시 즉시 전송이 차단되고 경고 배너가 표시됨
 */
import React, { useState } from 'react';
import {
  ArrowRightLeft,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  Cpu,
  AlertOctagon,
  ShieldCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SUPPORTED_CHAINS } from '../../data/chainsData';
import { useTranslation } from '../../context/LanguageContext';

interface BridgeSimulatorProps {
  isBridgePaused?: boolean;
  onOpenAdminConsole?: () => void;
}

interface BridgeExecutionResult {
  txHash: string;
  source: string;
  target: string;
  amount: string;
  protocol: string;
  latency: string;
  savedGas: string;
}

export const BridgeSimulator: React.FC<BridgeSimulatorProps> = ({
  isBridgePaused = false,
  onOpenAdminConsole,
}) => {
  const { language } = useTranslation();
  const isKo = language === 'ko';
  const isZh = language === 'zh-HK';

  const [sourceChain, setSourceChain] = useState<string>('ethereum');
  const [targetChain, setTargetChain] = useState<string>('solana');
  const [amount, setAmount] = useState<string>('2500');
  const [isBridging, setIsBridging] = useState(false);
  const [bridgeResult, setBridgeResult] = useState<BridgeExecutionResult | null>(null);
  const [bridgeError, setBridgeError] = useState<string | null>(null);

  const src = SUPPORTED_CHAINS.find((c) => c.id === sourceChain) || SUPPORTED_CHAINS[0];
  const tgt = SUPPORTED_CHAINS.find((c) => c.id === targetChain) || SUPPORTED_CHAINS[1];

  const handleSwapChains = () => {
    const temp = sourceChain;
    setSourceChain(targetChain);
    setTargetChain(temp);
    setBridgeResult(null);
    setBridgeError(null);
  };

  const handleStartBridge = async (e: React.FormEvent) => {
    e.preventDefault();
    setBridgeError(null);
    setBridgeResult(null);

    if (isBridgePaused) {
      setBridgeError(
        isKo
          ? '⚠️ 현재 관리자 콘솔에서 브릿지 긴급 서킷 브레이커(Circuit Breaker)가 발동되어 모든 크로스체인 이동이 차단되었습니다.'
          : isZh
          ? '⚠️ 管理員控制台已觸發跨鏈橋緊急熔斷機制 (Circuit Breaker)，所有跨鏈轉移暫時凍結。'
          : '⚠️ Emergency Circuit Breaker is currently engaged in Admin Console. All cross-chain transfers are paused.'
      );
      return;
    }

    if (sourceChain === targetChain) {
      setBridgeError(
        isKo
          ? '출발 체인과 도착 체인은 서로 달라야 합니다.'
          : isZh
          ? '源鏈與目標鏈不能相同。'
          : 'Source and destination networks must be different.'
      );
      return;
    }

    setIsBridging(true);

    // 백엔드 /api/sim/bridge 호출 시도 (오프라인 시 로컬 시뮬레이션 폴백)
    try {
      const res = await fetch('/api/sim/bridge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceChain: src.name,
          targetChain: tgt.name,
          amount: Number(amount),
        }),
        signal: AbortSignal.timeout(1000),
      });
      if (res.status === 423) {
        setIsBridging(false);
        setBridgeError('관리자 서킷 브레이커 발동으로 인해 브릿지가 일시 정지되었습니다.');
        return;
      }
    } catch {
      // 오프라인 시 로컬 시뮬레이션 계속 진행
    }

    setTimeout(() => {
      setIsBridging(false);
      setBridgeResult({
        txHash: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
        source: src.name,
        target: tgt.name,
        amount: Number(amount).toLocaleString(),
        protocol: 'CCTP-Q Native Burn & Mint (FIPS 203 ML-KEM)',
        latency: tgt.speed,
        savedGas: '$42.50 USD',
      });

      try {
        confetti({
          particleCount: 60,
          spread: 55,
          origin: { y: 0.75 },
          colors: ['#06B6D4', '#10B981'],
        });
      } catch {
        // Ignore confetti errors
      }
    }, 900);
  };

  return (
    <section id="bridge" className="py-20 border-t border-slate-800/80 bg-[#060a15] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-400">
            <Cpu className="w-3.5 h-3.5" />
            <span>NATIVE CROSS-CHAIN TRANSFER PROTOCOL (CCTP-Q)</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-['Plus_Jakarta_Sans']">
            {isKo
              ? '초저지연 멀티체인 네이티브 브릿지 (CCTP-Q)'
              : isZh
              ? '超低延遲多鏈原生跨鏈橋 (CCTP-Q)'
              : 'Ultra-Low Latency Native Cross-Chain Bridge (CCTP-Q)'}
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {isKo
              ? '래핑(Wrapped) 토큰 없이 출발 체인에서 즉시 소각(Burn)되고 도착 체인에서 네이티브로 직접 발행(Mint)됩니다. NIST FIPS 203(Kyber768) 릴레이어 암호화와 실시간 서킷 브레이커로 보호됩니다.'
              : isZh
              ? '無需封裝代幣，於源鏈即時銷毀並於目標鏈原生鑄造。受 NIST FIPS 203 (Kyber768) 中繼加密與即時熔斷機制保護。'
              : 'Zero wrapped token risk. USDQS is natively burned on the source network and minted 1:1 on the target chain, guarded by NIST FIPS 203 (Kyber768) relayers and real-time circuit breakers.'}
          </p>
        </div>

        {/* Bridge Card */}
        <div className="max-w-xl mx-auto glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/30 shadow-2xl relative">
          {/* Circuit Breaker Status Bar */}
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-800 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  isBridgePaused ? 'bg-rose-500 animate-ping' : 'bg-emerald-400 animate-pulse'
                }`}
              />
              <span className="font-bold text-white">
                {isBridgePaused ? 'CIRCUIT BREAKER: PAUSED' : 'CCTP-Q CONDUIT: ACTIVE'}
              </span>
            </div>
            {onOpenAdminConsole && (
              <button
                type="button"
                onClick={onOpenAdminConsole}
                className="text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{isKo ? '서킷 브레이커 관리' : isZh ? '熔斷管理' : 'Manage Circuit Breaker'}</span>
              </button>
            )}
          </div>

          {isBridgePaused && (
            <div className="mb-5 p-4 rounded-xl bg-rose-950/60 border border-rose-500/60 text-rose-200 text-xs flex items-start gap-2.5 font-sans">
              <AlertOctagon className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-rose-300">
                  {isKo ? '긴급 서킷 브레이커 작동 중 (Global Pause)' : 'Emergency Global Pause Active'}
                </span>
                <span>
                  {isKo
                    ? '관리자 콘솔에서 브릿지 서킷 브레이커가 발동되어 크로스체인 전송이 일시 동결되었습니다. 관리자 콘솔에서 해제 후 다시 시도해 주세요.'
                    : 'Cross-chain operations are currently frozen by the operator circuit breaker.'}
                </span>
              </div>
            </div>
          )}

          <form onSubmit={handleStartBridge} className="space-y-4">
            {/* Source Chain */}
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-2">
                {isKo ? '출발 블록체인 (Source Network - Burn)' : isZh ? '源區塊鏈 (銷毀)' : 'Source Network (Native Burn)'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {SUPPORTED_CHAINS.slice(0, 4).map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setSourceChain(c.id);
                      setBridgeResult(null);
                      setBridgeError(null);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2 cursor-pointer ${
                      sourceChain === c.id
                        ? 'bg-cyan-950/70 border-cyan-400 text-white shadow-md'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                    <span className="text-xs font-bold font-mono truncate">{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex items-center justify-center my-1">
              <button
                type="button"
                onClick={handleSwapChains}
                className="p-2.5 bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 hover:border-cyan-400 rounded-full text-cyan-400 transition shadow-lg cursor-pointer"
                title="Swap Networks"
              >
                <ArrowRightLeft className="w-4 h-4" />
              </button>
            </div>

            {/* Target Chain */}
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-2">
                {isKo ? '도착 블록체인 (Target Network - Mint)' : isZh ? '目標區塊鏈 (原生鑄造)' : 'Target Network (Native Mint)'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {SUPPORTED_CHAINS.slice(0, 4).map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setTargetChain(c.id);
                      setBridgeResult(null);
                      setBridgeError(null);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2 cursor-pointer ${
                      targetChain === c.id
                        ? 'bg-emerald-950/70 border-emerald-400 text-white shadow-md'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                    <span className="text-xs font-bold font-mono truncate">{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5">
                {isKo ? '전송할 USDQS 수량' : isZh ? '跨鏈轉移 USDQS 數量' : 'Amount to Bridge'}
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="5000000"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    setBridgeResult(null);
                  }}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-xl py-3 px-4 text-white font-mono font-bold text-base outline-none transition"
                  placeholder="2500"
                  required
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono font-bold text-xs text-emerald-400">
                  USDQS
                </span>
              </div>
            </div>

            {/* Route Telemetry */}
            <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 text-xs font-mono space-y-1.5 text-slate-400">
              <div className="flex justify-between">
                <span>{isKo ? '브릿지 메커니즘:' : 'Mechanism:'}</span>
                <span className="text-cyan-300 font-bold">CCTP-Q 100% Native Burn &amp; Mint</span>
              </div>
              <div className="flex justify-between">
                <span>{isKo ? 'PQC 릴레이어 보안:' : 'Relayer Security:'}</span>
                <span className="text-emerald-400 font-bold">NIST FIPS 203 (Kyber768)</span>
              </div>
              <div className="flex justify-between">
                <span>{isKo ? '예상 완결 소요:' : 'Est. Finality:'}</span>
                <span className="text-white font-bold">{tgt.speed} (0.00% Slippage)</span>
              </div>
            </div>

            {bridgeError && (
              <div className="p-3.5 rounded-xl bg-rose-950/70 border border-rose-500/50 text-rose-300 text-xs font-mono">
                {bridgeError}
              </div>
            )}

            <button
              type="submit"
              disabled={isBridging}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 hover:brightness-110 text-slate-950 font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 font-['Plus_Jakarta_Sans']"
            >
              {isBridging ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                  <span>{isKo ? 'PQC 릴레이어 서명 및 브릿지 실행 중...' : 'Executing CCTP-Q Bridge...'}</span>
                </>
              ) : (
                <>
                  <span>
                    {src.name} → {tgt.name} {isKo ? '네이티브 브릿지 실행' : isZh ? '執行原生跨鏈' : 'Execute Native Bridge'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {bridgeResult && (
            <div className="mt-5 p-4 bg-emerald-950/40 border border-emerald-500/50 rounded-2xl text-xs space-y-2 animate-fadeIn">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {isKo
                    ? '크로스체인 네이티브 Burn & Mint 체결 성공!'
                    : isZh
                    ? '跨鏈原生銷毀與鑄造執行成功！'
                    : 'Cross-Chain Native Burn & Mint Completed!'}
                </span>
              </div>
              <p className="text-slate-300">
                <strong className="text-white font-mono">{bridgeResult.amount} USDQS</strong> burned on{' '}
                <span className="text-cyan-300 font-bold">{bridgeResult.source}</span> and natively minted on{' '}
                <span className="text-emerald-300 font-bold">{bridgeResult.target}</span>.
              </p>
              <div className="pt-2 border-t border-emerald-500/20 font-mono text-[11px] text-slate-400 flex justify-between">
                <span>Tx: {bridgeResult.txHash}</span>
                <span className="text-emerald-400 font-bold">Finalized ({bridgeResult.latency})</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

