import React, { useState, useEffect } from 'react';
import { ShieldCheck, Activity, Layers, Building2, Zap } from 'lucide-react';
import { TRANSPARENCY_METRICS } from '../../data/reservesData';
import { useTranslation } from '../../context/LanguageContext';

interface TickerBarProps {
  currentCap?: number;
}

export const TickerBar: React.FC<TickerBarProps> = ({ currentCap = TRANSPARENCY_METRICS.currentCap }) => {
  const { t } = useTranslation();
  const [pulse, setPulse] = useState(false);
  const [volume, setVolume] = useState(TRANSPARENCY_METRICS.twentyFourHourVolume);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 800);
      setVolume((prev) => prev + (Math.random() > 0.4 ? 1240 : -850));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-[#03060d] border-b border-emerald-950/40 text-xs text-slate-300 py-1.5 px-4 font-mono select-none overflow-x-auto">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 whitespace-nowrap min-w-max">
        
        {/* Peg Status */}
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 ${pulse ? 'scale-150' : ''}`} />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-slate-400">{t.ticker.peg}:</span>
          <span className="font-semibold text-white">{t.ticker.pegValue}</span>
          <span className="text-emerald-400 text-[11px] font-bold">(0.00% Net Zero Slippage)</span>
        </div>

        {/* Initial Cap & Expandable Info (User Request & RFP 2.0 Spec) */}
        <div className="flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-400">{t.ticker.totalSupply}:</span>
          <span className="text-slate-200 font-semibold font-mono">
            {(TRANSPARENCY_METRICS.totalSupply / 1e6).toFixed(2)}M / {(currentCap / 1e6).toFixed(1)}M USDQS
          </span>
          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/50 px-1.5 py-0.2 rounded border border-cyan-800/40">
            Expandable
          </span>
        </div>

        {/* Collateral Ratio */}
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-slate-400">{t.ticker.reservesBacking}:</span>
          <span className="text-emerald-400 font-bold bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40">
            {TRANSPARENCY_METRICS.reserveRatio}% ({t.ticker.overcollateralized})
          </span>
        </div>

        {/* HKMA Regulatory Framework */}
        <div className="flex items-center gap-1.5">
          <Building2 className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-slate-400">Jurisdiction:</span>
          <span className="text-slate-200 font-semibold">
            {t.ticker.hkmaStatus}
          </span>
        </div>

        {/* 24h Volume */}
        <div className="flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-teal-400" />
          <span className="text-slate-400">{t.ticker.settlement24h}:</span>
          <span className="text-slate-200 font-semibold">
            ${(volume / 1e6).toFixed(2)}M
          </span>
        </div>

        {/* Standard Chain */}
        <div className="hidden lg:flex items-center gap-1.5 text-slate-400">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>{t.ticker.activeChains}: <strong className="text-slate-200">{t.ticker.multiChains}</strong></span>
        </div>

      </div>
    </div>
  );
};
