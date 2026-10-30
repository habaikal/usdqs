import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ className = '', showText = true, size = 'md' }) => {
  const pixelSizes = {
    sm: 28,
    md: 36,
    lg: 48
  };

  const s = pixelSizes[size];

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Quantum Shield Geometric Hexagon Icon */}
      <div className="relative flex items-center justify-center" style={{ width: s, height: s }}>
        <svg 
          viewBox="0 0 64 64" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_0_12px_rgba(16,185,129,0.5)] transition-transform duration-300 hover:scale-105"
        >
          <defs>
            <linearGradient id="logoShieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#10B981" />
              <stop offset="50%" stop-color="#06B6D4" />
              <stop offset="100%" stop-color="#3B82F6" />
            </linearGradient>
            <linearGradient id="logoGlowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#34D399" stop-opacity="0.8" />
              <stop offset="100%" stop-color="#06B6D4" stop-opacity="0.1" />
            </linearGradient>
          </defs>

          {/* Hexagonal Shield Background */}
          <polygon 
            points="32,6 56,18 56,46 32,58 8,46 8,18" 
            fill="#091426" 
            stroke="url(#logoShieldGrad)" 
            strokeWidth="3.2" 
            strokeLinejoin="round" 
          />

          {/* Inner Quantum Circuit Matrix */}
          <polygon 
            points="32,15 47,23 47,41 32,49 17,41 17,23" 
            fill="url(#logoGlowGrad)" 
            stroke="#10B981" 
            strokeWidth="1.2" 
            strokeDasharray="3 2" 
            opacity="0.6" 
          />

          {/* Bold Core Capital 'Q' and Liquid Dollar Symbol */}
          <path 
            d="M26 23C26 20.8 28.5 19 32 19C35.5 19 38 20.8 38 23C38 25.5 35 26.5 32 27C28.5 27.5 25.5 28.8 25.5 32C25.5 35 28.2 37 32 37C35.8 37 38.5 35 38.5 32" 
            stroke="#FFFFFF" 
            strokeWidth="3.4" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          <line x1="32" y1="16" x2="32" y2="40" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />

          {/* Dynamic Quantum Satellite Node */}
          <circle cx="45" cy="45" r="4" fill="#10B981" stroke="#FFFFFF" strokeWidth="1.8" />
        </svg>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold tracking-tight text-white font-['Plus_Jakarta_Sans'] text-xl">
              USD<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">QS</span>
            </span>
            <span className="px-1.5 py-0.5 text-[9px] font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded tracking-wider uppercase font-mono">
              QUANTUM STABLE
            </span>
          </div>
          <span className="text-[10px] tracking-wider text-slate-400 uppercase font-mono mt-0.5">
            Quantum Settlement
          </span>
        </div>
      )}
    </div>
  );
};
