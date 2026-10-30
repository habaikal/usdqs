import React, { useState, useEffect } from 'react';
import { QuantumOrbit } from './QuantumOrbit';
import { ArrowRight, Play, ShieldCheck, Cpu } from 'lucide-react';
import { TRANSPARENCY_METRICS } from '../../data/reservesData';
import { useTranslation } from '../../context/LanguageContext';

interface HeroSectionProps {
  onOpenWallet: () => void;
  onOpenAttestation: () => void;
  onOpenHowItWorks: () => void;
  onOpenUserPortal?: () => void;
  currentCap?: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenWallet,
  onOpenAttestation,
  onOpenHowItWorks,
  onOpenUserPortal,
  currentCap = TRANSPARENCY_METRICS.currentCap
}) => {
  const { t } = useTranslation();

  const phrases = t.hero.phrases;
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (currentPhraseIndex >= phrases.length) {
      setCurrentPhraseIndex(0);
      setDisplayText('');
    }
  }, [phrases, currentPhraseIndex]);

  useEffect(() => {
    const targetPhrase = phrases[currentPhraseIndex] || phrases[0];
    const typingSpeed = isDeleting ? 30 : 65;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < targetPhrase.length) {
          setDisplayText(targetPhrase.slice(0, displayText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2400);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(targetPhrase.slice(0, displayText.length - 1));
        } else {
          setIsDeleting(false);
          setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentPhraseIndex, phrases]);

  return (
    <section id="top" className="relative pt-12 pb-20 lg:pt-20 lg:pb-32 overflow-hidden">
      {/* Background Ambient Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-emerald-600/10 via-cyan-600/10 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline, Typing Animation, CTAs */}
          <div className="lg:col-span-7 flex flex-col space-y-7 text-center lg:text-left">
            
            {/* Superbadge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-semibold w-fit mx-auto lg:mx-0 shadow-lg shadow-emerald-950/50">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{t.hero.badge}</span>
              <span className="text-slate-500">|</span>
              <span className="text-cyan-300 font-mono">1 USDQS = $1.0000 USD</span>
            </div>

            {/* Main Title & Dynamic Typing */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight font-['Plus_Jakarta_Sans']">
                {t.hero.title}
                <span className="block text-2xl sm:text-3xl lg:text-4xl font-semibold mt-2 min-h-[48px] text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 font-mono">
                  {displayText}
                  <span className="inline-block w-2.5 h-7 ml-1 bg-emerald-400 align-middle animate-pulse" />
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed mx-auto lg:mx-0 font-sans">
                {t.hero.description}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onOpenUserPortal || onOpenWallet}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 hover:brightness-110 shadow-xl shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer font-['Plus_Jakarta_Sans']"
              >
                <Cpu className="w-4 h-4 text-slate-950" />
                <span>{t.hero.getUsdqs}</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>

              <button
                onClick={onOpenHowItWorks}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-slate-200 bg-slate-900/80 border border-slate-700/60 hover:bg-slate-800 hover:border-emerald-500/50 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <Play className="w-2.5 h-2.5 text-emerald-400 fill-emerald-400 ml-0.5" />
                </div>
                <span>{t.hero.learnHow}</span>
              </button>
            </div>

            {/* Key Trust Signals (Spec & Dynamic Expandable Cap) */}
            <div className="pt-4 border-t border-slate-800/80 grid grid-cols-3 gap-4 max-w-xl mx-auto lg:mx-0 font-mono">
              <div className="flex flex-col">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl sm:text-3xl font-extrabold text-white">
                    {(TRANSPARENCY_METRICS.totalSupply / 1e6).toFixed(1)}M
                  </span>
                  <span className="text-xs text-slate-400">/ {(currentCap / 1e6).toFixed(0)}M</span>
                </div>
                <span className="text-[11px] text-slate-400 mt-0.5 font-sans">
                  {t.hero.circulatingSupply}
                </span>
                <span className="text-[10px] text-cyan-400 font-mono">
                  (초기 상한 • 확장형 구조)
                </span>
              </div>

              <button 
                onClick={onOpenAttestation}
                className="flex flex-col text-left hover:opacity-80 transition-opacity cursor-pointer group"
                title="View Attestation Statement"
              >
                <div className="flex items-center gap-1">
                  <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
                    {TRANSPARENCY_METRICS.reserveRatio}%
                  </span>
                  <ShieldCheck className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                </div>
                <span className="text-[11px] text-slate-400 mt-0.5 group-hover:text-emerald-300 font-sans">
                  {t.hero.collateralizedRatio} →
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">
                  (HK 신탁 파산절연 보관)
                </span>
              </button>

              <div className="flex flex-col">
                <span className="text-2xl sm:text-3xl font-extrabold text-cyan-400">
                  ERC-20
                </span>
                <span className="text-[11px] text-slate-400 mt-0.5 font-sans">
                  {t.hero.nativeChains}
                </span>
                <span className="text-[10px] text-teal-400 font-mono">
                  + PQC FIPS 204
                </span>
              </div>
            </div>

          </div>

          {/* Right Column: 3D Interactive Quantum Orbit */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <QuantumOrbit />
          </div>

        </div>
      </div>
    </section>
  );
};
