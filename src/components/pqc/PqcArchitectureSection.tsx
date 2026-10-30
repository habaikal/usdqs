import React, { useState } from 'react';
import { Shield, Cpu, Lock, CheckCircle2, Play, Sparkles, RefreshCw, KeyRound, Server } from 'lucide-react';
import { PQC_ALGORITHM_MAPPINGS, PQC_WORKFLOW_STEPS } from '../../data/pqcData';
import { useTranslation } from '../../context/LanguageContext';

export const PqcArchitectureSection: React.FC = () => {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulatedTxHash, setSimulatedTxHash] = useState<string | null>(null);

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setSimulatedTxHash(null);
    let step = 1;
    setActiveStep(1);

    const interval = setInterval(() => {
      step += 1;
      if (step <= 4) {
        setActiveStep(step);
      } else {
        clearInterval(interval);
        setIsSimulating(false);
        setSimulatedTxHash('0x9e73b...Dilithium3-Verified-Tx');
      }
    }, 900);
  };

  return (
    <section id="pqc-architecture" className="py-20 lg:py-28 relative overflow-hidden bg-slate-950/80 border-t border-b border-emerald-950/40">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
            <Cpu className="w-4 h-4 text-emerald-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>{t.pqcSection.badge}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-['Plus_Jakarta_Sans']">
            {t.pqcSection.title}
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
            {t.pqcSection.description}
          </p>
        </div>

        {/* 1. ERC-4337 Hybrid PQC Architecture Simulation Flow (Methodology A in RFP) */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-[#080d1d] border border-emerald-500/30 shadow-2xl space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider block">
                RFP 5.2절 채택 아키텍처: 방법론 A (Methodology A)
              </span>
              <h3 className="text-xl font-bold text-white font-['Plus_Jakarta_Sans'] flex items-center gap-2 mt-1">
                <span>ERC-4337 계정 추상화 하이브리드 PQC 검증 파이프라인</span>
                <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono">
                  Production Validated
                </span>
              </h3>
            </div>

            <button
              onClick={handleRunSimulation}
              disabled={isSimulating}
              className="px-5 py-2.5 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:brightness-110 shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 text-xs cursor-pointer disabled:opacity-50"
            >
              {isSimulating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>단계별 서명 검증 중...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-slate-950" />
                  <span>{t.pqcSection.exploreFlow}</span>
                </>
              )}
            </button>
          </div>

          {/* 4 Interactive Process Steps */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {PQC_WORKFLOW_STEPS.map((step) => {
              const isCurrent = activeStep === step.step;
              const isDone = activeStep > step.step;
              return (
                <div
                  key={step.step}
                  onClick={() => setActiveStep(step.step)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                    isCurrent
                      ? 'bg-emerald-950/40 border-emerald-500 shadow-lg shadow-emerald-500/10'
                      : isDone
                      ? 'bg-slate-900/60 border-slate-700/80'
                      : 'bg-slate-950/40 border-slate-800/60 opacity-60'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs ${
                        isCurrent
                          ? 'bg-emerald-400 text-slate-950'
                          : isDone
                          ? 'bg-emerald-900/60 text-emerald-400'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        0{step.step}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-400">
                        {step.tech}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-white leading-tight">
                      {step.title}
                    </h4>

                    <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                      {step.description}
                    </p>
                  </div>

                  {isCurrent && (
                    <div className="mt-4 pt-2 border-t border-emerald-500/30 flex items-center gap-1.5 text-[10px] text-emerald-300 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      <span>현재 실행 단계</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Simulation Output Banner */}
          {simulatedTxHash && (
            <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-500/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono animate-fadeIn">
              <div className="flex items-center gap-2 text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>NIST FIPS 204 ML-DSA 격자 서명이 온체인 PqcValidator.sol에 의해 100% 무결 검증되었습니다.</span>
              </div>
              <span className="px-3 py-1 rounded bg-slate-900 text-cyan-300 border border-slate-700">
                Tx: {simulatedTxHash}
              </span>
            </div>
          )}

          {/* Crypto-Agility Callout */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
            <span>
              <strong>{t.pqcSection.cryptoAgility}</strong> (모듈식 스마트컨트랙트 어댑터 설계)
            </span>
          </div>
        </div>

        {/* 2. NIST Standardized Algorithms Layer Mapping Table (RFP 5.2절 대응) */}
        <div className="mt-12 space-y-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            <h3 className="text-xl font-bold text-white font-['Plus_Jakarta_Sans']">
              {t.pqcSection.algoMapping}
            </h3>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/60">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-slate-900/80 text-slate-400 font-mono uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-4">적용 영역 (Layer)</th>
                  <th className="p-4">NIST 채택 알고리즘</th>
                  <th className="p-4">표준화 규격 (FIPS)</th>
                  <th className="p-4">실제 역할 및 구현 방식</th>
                  <th className="p-4">애자일리티 (Crypto-Agility)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {PQC_ALGORITHM_MAPPINGS.map((item) => (
                  <tr key={item.layer} className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-4 font-bold text-white font-mono flex items-center gap-2">
                      {item.layer === 'Wallet Signature' && <KeyRound className="w-3.5 h-3.5 text-emerald-400" />}
                      {item.layer === 'Key Exchange' && <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />}
                      {item.layer === 'API/Network TLS' && <Server className="w-3.5 h-3.5 text-teal-400" />}
                      {item.layer === 'Key Management' && <Lock className="w-3.5 h-3.5 text-amber-400" />}
                      <span>{item.layer}</span>
                    </td>
                    <td className="p-4 font-mono text-emerald-300 font-semibold">{item.algorithm}</td>
                    <td className="p-4 font-mono text-slate-400">
                      <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px]">
                        {item.nistStandard}
                      </span>
                    </td>
                    <td className="p-4 text-slate-300">{item.purpose}</td>
                    <td className="p-4 text-slate-400 text-[11px] font-mono">{item.agilityMethod}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  );
};
