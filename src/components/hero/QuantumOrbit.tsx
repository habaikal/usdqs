import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

export const QuantumOrbit: React.FC = () => {
  const [activeNode, setActiveNode] = useState<string | null>(null);

  // Outer orbit: 8 multi-chain network nodes
  const outerNodes = [
    { name: 'Ethereum', symbol: 'ETH', color: '#627EEA', angle: 0 },
    { name: 'Solana', symbol: 'SOL', color: '#14F195', angle: 45 },
    { name: 'Arbitrum', symbol: 'ARB', color: '#28A0F0', angle: 90 },
    { name: 'Base', symbol: 'BASE', color: '#0052FF', angle: 135 },
    { name: 'Polygon', symbol: 'POL', color: '#8247E5', angle: 180 },
    { name: 'Avalanche', symbol: 'AVAX', color: '#E84142', angle: 225 },
    { name: 'TON', symbol: 'TON', color: '#0098EA', angle: 270 },
    { name: 'TRON', symbol: 'TRX', color: '#FF0013', angle: 315 },
  ];

  // Inner orbit: USDQS asset suite (USDQS, QSEUR, QSXAU)
  const innerNodes = [
    { name: 'USDQS Dollar', label: 'USD', color: '#10B981', angle: 0 },
    { name: 'QSEUR Euro', label: 'EUR', color: '#06B6D4', angle: 120 },
    { name: 'QSXAU Gold', label: 'GOLD', color: '#F59E0B', angle: 240 },
  ];

  return (
    <div className="relative w-full max-w-[540px] aspect-square mx-auto flex items-center justify-center select-none overflow-visible">
      
      {/* Background Ambient Quantum Radial Glow */}
      <div className="absolute inset-0 bg-radial from-emerald-500/15 via-cyan-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Decorative Outer Compass Rings */}
      <div className="absolute w-[96%] h-[96%] rounded-full border border-emerald-500/10 pointer-events-none animate-pulse-glow" />
      <div className="absolute w-[84%] h-[84%] rounded-full border border-dashed border-teal-500/20 pointer-events-none" />

      {/* ---------------- OUTER ORBIT (Chains) ---------------- */}
      <div className="absolute w-[76%] h-[76%] rounded-full border border-emerald-500/25 animate-orbit-ring-slow flex items-center justify-center">
        {outerNodes.map((node) => {
          const rad = (node.angle * Math.PI) / 180;
          // Radius percentage relative to outer ring container
          const x = 50 + 50 * Math.cos(rad);
          const y = 50 + 50 * Math.sin(rad);

          return (
            <div
              key={node.name}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
              style={{ left: `${x}%`, top: `${y}%` }}
              onMouseEnter={() => setActiveNode(node.name)}
              onMouseLeave={() => setActiveNode(null)}
            >
              {/* Counter-rotation to keep icons upright */}
              <div className="animate-counter-spin">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-125 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.8)]"
                  style={{
                    backgroundColor: '#0a101f',
                    border: `1.5px solid ${node.color}`
                  }}
                >
                  <span className="text-[10px] font-extrabold font-mono text-white">
                    {node.symbol}
                  </span>
                </div>
              </div>

              {/* Tooltip */}
              {activeNode === node.name && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 bg-slate-900 border border-emerald-500/40 rounded shadow-xl text-[11px] font-bold text-white whitespace-nowrap z-50 pointer-events-none">
                  {node.name} Network
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ---------------- INNER ORBIT (Asset Suite) ---------------- */}
      <div className="absolute w-[50%] h-[50%] rounded-full border border-cyan-500/30 animate-orbit-ring-mid flex items-center justify-center">
        {innerNodes.map((node) => {
          const rad = (node.angle * Math.PI) / 180;
          const x = 50 + 50 * Math.cos(rad);
          const y = 50 + 50 * Math.sin(rad);

          return (
            <div
              key={node.name}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
              style={{ left: `${x}%`, top: `${y}%` }}
              onMouseEnter={() => setActiveNode(node.name)}
              onMouseLeave={() => setActiveNode(null)}
            >
              <div className="animate-counter-spin">
                <div 
                  className="w-11 h-11 rounded-xl flex flex-col items-center justify-center shadow-xl transition-transform duration-300 group-hover:scale-120"
                  style={{
                    backgroundColor: '#070d1c',
                    border: `2px solid ${node.color}`,
                    boxShadow: `0 0 14px ${node.color}40`
                  }}
                >
                  <span className="text-[10px] font-black" style={{ color: node.color }}>
                    {node.label}
                  </span>
                  <span className="text-[8px] text-slate-400 font-mono">QS</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ---------------- CENTRAL USDQS QUANTUM CORE ---------------- */}
      <div className="relative z-10 w-28 h-28 rounded-2xl bg-gradient-to-br from-[#0c1a2e] to-[#040813] border-2 border-emerald-400/80 shadow-[0_0_35px_rgba(16,185,129,0.4)] flex flex-col items-center justify-center p-3 animate-float group cursor-pointer">
        
        {/* Pulsing Core Ring */}
        <div className="absolute inset-0 rounded-2xl border border-cyan-400/40 animate-ping opacity-25 pointer-events-none" />

        {/* Custom Central Shield SVG */}
        <div className="relative w-12 h-12 flex items-center justify-center">
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full drop-shadow-[0_0_8px_#10B981]">
            <polygon 
              points="32,6 56,18 56,46 32,58 8,46 8,18" 
              fill="#061224" 
              stroke="#10B981" 
              strokeWidth="3" 
            />
            <path 
              d="M26 23C26 20.8 28.5 19 32 19C35.5 19 38 20.8 38 23C38 25.5 35 26.5 32 27C28.5 27.5 25.5 28.8 25.5 32C25.5 35 28.2 37 32 37C35.8 37 38.5 35 38.5 32" 
              stroke="#FFFFFF" 
              strokeWidth="3.4" 
              strokeLinecap="round" 
            />
            <line x1="32" y1="16" x2="32" y2="40" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="44" cy="44" r="3.5" fill="#10B981" />
          </svg>
        </div>

        <span className="mt-1 text-[11px] font-black tracking-widest text-emerald-300 font-mono">
          USDQS
        </span>
        <span className="text-[9px] text-cyan-400/80 font-bold tracking-tight">
          $1.0001
        </span>
      </div>

      {/* Floating telemetry badge */}
      <div className="absolute -bottom-4 bg-slate-900/90 backdrop-blur-md border border-emerald-500/40 px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-2 z-20">
        <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" style={{ animationDuration: '6s' }} />
        <span className="text-xs font-semibold text-slate-200">
          Continuous Proof-of-Reserves Active
        </span>
      </div>

    </div>
  );
};
