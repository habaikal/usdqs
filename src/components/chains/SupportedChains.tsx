import React, { useState } from 'react';
import { SUPPORTED_CHAINS } from '../../data/chainsData';
import { Layers, Copy, Check, Zap, Clock } from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';

export const SupportedChains: React.FC = () => {
  const { t } = useTranslation();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section id="chains" className="py-24 relative bg-[#040712] border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
              <Layers className="w-3.5 h-3.5" />
              <span>{t.chains.badge}</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-['Plus_Jakarta_Sans']">
              {t.chains.title}
            </h2>

            <p className="text-sm text-slate-300">
              {t.chains.description}
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="bg-slate-900/90 border border-emerald-500/30 rounded-xl p-3 px-5 flex items-center gap-6 font-mono text-xs">
            <div>
              <span className="text-slate-400 block text-[10px]">{t.chains.activeNetworks}</span>
              <span className="text-white font-bold text-base">16 Protocols</span>
            </div>
            <div className="w-px h-8 bg-slate-800" />
            <div>
              <span className="text-slate-400 block text-[10px]">{t.chains.avgSettlement}</span>
              <span className="text-emerald-400 font-bold text-base">&lt; 800 ms</span>
            </div>
          </div>
        </div>

        {/* Chain Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SUPPORTED_CHAINS.map((chain) => (
            <div
              key={chain.id}
              className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-emerald-500/40 transition-all hover:bg-slate-900/80 group flex flex-col justify-between"
            >
              <div>
                {/* Chain Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-xs font-mono shadow-md"
                      style={{ backgroundColor: `${chain.color}25`, border: `1.5px solid ${chain.color}` }}
                    >
                      {chain.symbol}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                        {chain.name}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-mono">
                        TVL: {chain.tvl}
                      </span>
                    </div>
                  </div>

                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Active Transport" />
                </div>

                {/* Speed & Gas */}
                <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 text-[11px] font-mono mb-4">
                  <div>
                    <span className="text-slate-500 block text-[9px] flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5 text-slate-400" /> {t.chains.finality}
                    </span>
                    <span className="text-slate-200 font-semibold">{chain.speed}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px] flex items-center gap-1">
                      <Zap className="w-2.5 h-2.5 text-amber-400" /> {t.chains.avgFee}
                    </span>
                    <span className="text-emerald-400 font-semibold">{chain.avgFee}</span>
                  </div>
                </div>
              </div>

              {/* Copy Contract Box */}
              <div className="pt-2">
                <div className="flex items-center justify-between bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800 text-[11px] font-mono">
                  <span className="text-slate-400 truncate max-w-[130px]">
                    {chain.contractAddress}
                  </span>
                  
                  <button
                    onClick={() => handleCopy(chain.id, chain.contractAddress)}
                    className="p-1 text-slate-400 hover:text-emerald-400 rounded transition-colors cursor-pointer flex items-center gap-1"
                    title={t.chains.copyContract}
                  >
                    {copiedId === chain.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-[9px] text-emerald-400 font-bold">{t.chains.copied}</span>
                      </>
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
