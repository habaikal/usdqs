import React, { useState } from 'react';
import { ArrowDownUp, Zap, Check, Sparkles, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { SUPPORTED_CHAINS } from '../../data/chainsData';
import { useTranslation } from '../../context/LanguageContext';

export const MintSwapCalculator: React.FC = () => {
  const { t } = useTranslation();
  const [direction, setDirection] = useState<'usd-to-usdqs' | 'usdqs-to-usd'>('usd-to-usdqs');
  const [amount, setAmount] = useState<string>('5000');
  const [selectedChainId, setSelectedChainId] = useState<string>('solana');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const selectedChain = SUPPORTED_CHAINS.find(c => c.id === selectedChainId) || SUPPORTED_CHAINS[0];
  const numAmount = parseFloat(amount) || 0;

  const handleSwapDirection = () => {
    setDirection(prev => prev === 'usd-to-usdqs' ? 'usdqs-to-usd' : 'usd-to-usdqs');
  };

  const handleSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    if (numAmount <= 0) return;

    setIsProcessing(true);
    setSuccessMessage(null);

    setTimeout(() => {
      setIsProcessing(false);
      const msg = direction === 'usd-to-usdqs'
        ? t.simulator.successMint
            .replace('{amount}', numAmount.toLocaleString())
            .replace('{chain}', selectedChain.name)
        : t.simulator.successRedeem
            .replace('{amount}', numAmount.toLocaleString());

      setSuccessMessage(msg);

      // Trigger celebratory particle confetti
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#10B981', '#06B6D4', '#38BDF8']
        });
      } catch (err) {
        // Fallback gracefully
      }
    }, 900);
  };

  return (
    <section id="how-it-works" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5" />
            <span>{t.simulator.badge}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-['Plus_Jakarta_Sans']">
            {t.simulator.title}
          </h2>
          
          <p className="text-sm sm:text-base text-slate-300">
            {t.simulator.description}
          </p>
        </div>

        {/* Simulator Card */}
        <div className="max-w-xl mx-auto glass-panel rounded-2xl p-6 sm:p-8 shadow-2xl border border-emerald-500/30 relative">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-5 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm font-bold text-white font-mono uppercase tracking-wide">
                {t.simulator.primaryConduit}
              </span>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
              {t.simulator.zeroFee}
            </span>
          </div>

          <form onSubmit={handleSimulate} className="mt-6 space-y-4">
            
            {/* Input Box */}
            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 focus-within:border-emerald-500/60 transition-all">
              <div className="flex justify-between items-center text-xs text-slate-400 mb-1.5 font-mono">
                <span>{t.simulator.youSend}:</span>
                <span>{t.simulator.balance}: $100,000.00</span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="1"
                  step="any"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-transparent text-2xl sm:text-3xl font-bold font-mono text-white focus:outline-none placeholder-slate-600"
                  placeholder="0.00"
                />
                <div className="px-3.5 py-1.5 bg-slate-800/90 rounded-lg border border-slate-700 text-sm font-extrabold text-white flex items-center gap-1.5 whitespace-nowrap">
                  {direction === 'usd-to-usdqs' ? 'USD (Fiat Wire)' : 'USDQS (Token)'}
                </div>
              </div>
            </div>

            {/* Invert Button */}
            <div className="flex justify-center -my-2 relative z-10">
              <button
                type="button"
                onClick={handleSwapDirection}
                className="w-10 h-10 rounded-full bg-slate-900 border border-emerald-500/40 hover:border-emerald-400 hover:scale-110 text-emerald-400 flex items-center justify-center transition-all shadow-lg cursor-pointer"
                title="Swap Direction"
              >
                <ArrowDownUp className="w-4 h-4" />
              </button>
            </div>

            {/* Output Box */}
            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 focus-within:border-cyan-500/60 transition-all">
              <div className="flex justify-between items-center text-xs text-slate-400 mb-1.5 font-mono">
                <span>{t.simulator.youReceive}:</span>
                <span className="text-emerald-400">{t.simulator.pegRatio}</span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  readOnly
                  value={numAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  className="w-full bg-transparent text-2xl sm:text-3xl font-bold font-mono text-emerald-400 focus:outline-none"
                />
                <div className="px-3.5 py-1.5 bg-emerald-950/70 border border-emerald-500/40 rounded-lg text-sm font-extrabold text-emerald-300 flex items-center gap-1.5 whitespace-nowrap">
                  {direction === 'usd-to-usdqs' ? 'USDQS' : 'USD (Bank Wire)'}
                </div>
              </div>
            </div>

            {/* Target Blockchain Selector */}
            <div className="pt-2">
              <label className="block text-xs font-mono text-slate-400 mb-2">
                {t.simulator.destinationChain}:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {SUPPORTED_CHAINS.slice(0, 4).map((chain) => (
                  <button
                    key={chain.id}
                    type="button"
                    onClick={() => setSelectedChainId(chain.id)}
                    className={`py-2 px-3 rounded-lg border text-xs font-bold font-mono flex items-center justify-between transition-all cursor-pointer ${
                      selectedChainId === chain.id
                        ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300 shadow-sm'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>{chain.name}</span>
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: chain.color }} />
                  </button>
                ))}
              </div>
            </div>

            {/* Chain Speed and Fee Estimation */}
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80 text-xs font-mono space-y-1.5 text-slate-400">
              <div className="flex justify-between">
                <span>{t.simulator.speed}:</span>
                <span className="text-white font-bold">{selectedChain.speed}</span>
              </div>
              <div className="flex justify-between">
                <span>{t.simulator.avgFee}:</span>
                <span className="text-emerald-400 font-bold">{selectedChain.avgFee}</span>
              </div>
              <div className="flex justify-between">
                <span>{t.simulator.spread}:</span>
                <span className="text-cyan-400 font-bold">{t.simulator.noSlippage}</span>
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isProcessing || numAmount <= 0}
              className="w-full py-4 rounded-xl font-extrabold text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 hover:brightness-110 shadow-xl shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 font-['Plus_Jakarta_Sans']"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                  <span>{t.simulator.simulating}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>
                    {direction === 'usd-to-usdqs' ? t.simulator.mintAction : t.simulator.redeemAction}
                  </span>
                </>
              )}
            </button>

            {/* Success Toast Banner */}
            {successMessage && (
              <div className="p-3.5 bg-emerald-950/80 border border-emerald-500/50 rounded-xl flex items-center gap-2.5 text-xs text-emerald-300 font-mono animate-fadeIn">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

          </form>

        </div>

      </div>
    </section>
  );
};
