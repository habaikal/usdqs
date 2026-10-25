import React from 'react';
import { GLOBAL_PARTNERS } from '../../data/partnersData';
import { Award } from 'lucide-react';

export const PartnerMarquee: React.FC = () => {
  // Duplicate for seamless infinite loop
  const marqueeItems = [...GLOBAL_PARTNERS, ...GLOBAL_PARTNERS];

  return (
    <section className="py-16 bg-[#03060d] border-y border-slate-900 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
        <span className="text-xs font-mono uppercase tracking-widest text-slate-500 flex items-center justify-center gap-2">
          <Award className="w-4 h-4 text-emerald-400" />
          Global Liquidity Infrastructure & Integration Partners
        </span>
      </div>

      <div className="relative w-full overflow-hidden mask-radial">
        {/* Gradient Fade Edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#03060d] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#03060d] to-transparent z-10 pointer-events-none" />

        {/* Scrolling Rail */}
        <div className="animate-marquee flex gap-6 items-center">
          {marqueeItems.map((partner, idx) => (
            <div
              key={`${partner.name}-${idx}`}
              className="px-5 py-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition-all flex items-center gap-3 shrink-0 shadow-sm"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center font-bold text-xs text-emerald-400 font-mono">
                {partner.name.slice(0, 2).toUpperCase()}
              </div>
              
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-slate-200">
                  {partner.name}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {partner.badge}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
