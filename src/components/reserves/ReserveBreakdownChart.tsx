import React from 'react';
import { RESERVE_BREAKDOWN } from '../../data/reservesData';
import { useTranslation } from '../../context/LanguageContext';

export const ReserveBreakdownChart: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full space-y-6">
      
      {/* Visual Multi-Segment Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-mono text-slate-400">
          <span>{t.reserves.allocationTitle}</span>
          <span className="text-emerald-400 font-bold">{t.reserves.breakdownLabel}</span>
        </div>
        
        <div className="w-full h-5 rounded-lg overflow-hidden flex bg-slate-900 border border-slate-700/60 p-0.5 shadow-inner">
          {RESERVE_BREAKDOWN.map((asset) => (
            <div
              key={asset.category}
              style={{
                width: `${asset.percentage}%`,
                backgroundColor: asset.color
              }}
              className="h-full first:rounded-l-md last:rounded-r-md transition-all duration-500 hover:brightness-125 relative group cursor-pointer"
            >
              <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-slate-900 border border-slate-700 rounded text-[10px] text-white whitespace-nowrap pointer-events-none z-30 shadow-md">
                {asset.category}: {asset.percentage}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Asset Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {RESERVE_BREAKDOWN.map((asset) => (
          <div
            key={asset.category}
            className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-emerald-500/30 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: asset.color }}
                  />
                  <span className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider">
                    {asset.category}
                  </span>
                </div>
                <span className="text-sm font-extrabold text-white font-mono">
                  {asset.percentage}%
                </span>
              </div>

              <h4 className="text-sm font-semibold text-slate-200 mb-1.5">
                {asset.name}
              </h4>
              
              <p className="text-xs text-slate-400 leading-relaxed">
                {asset.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between font-mono">
              <span className="text-[11px] text-slate-500">{t.reserves.totalCollateral}</span>
              <span className="text-xs font-bold text-emerald-400">
                ${(asset.amountUSD / 1e9).toFixed(2)} Billion
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
