import { useState } from 'react';
import { TickerBar } from './components/common/TickerBar';
import { Navbar } from './components/common/Navbar';
import { HeroSection } from './components/hero/HeroSection';
import { PartnerMarquee } from './components/partners/PartnerMarquee';
import { TransparencyDashboard } from './components/reserves/TransparencyDashboard';
import { MintSwapCalculator } from './components/simulator/MintSwapCalculator';
import { SolutionsGrid } from './components/solutions/SolutionsGrid';
import { SupportedChains } from './components/chains/SupportedChains';
import { FaqAccordion } from './components/faq/FaqAccordion';
import { Footer } from './components/common/Footer';
import { ConnectWalletModal } from './components/modals/ConnectWalletModal';
import { AttestationReportModal } from './components/modals/AttestationReportModal';
import { X, Play, Shield, Zap, Layers } from 'lucide-react';

export function App() {
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [attestationModalOpen, setAttestationModalOpen] = useState(false);
  const [howItWorksModalOpen, setHowItWorksModalOpen] = useState(false);

  const scrollToSection = (id: string) => {
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectSolution = (title: string) => {
    alert(`[${title}] Institutional onboarding package requested. Connecting with our liquidity integration engineers.`);
  };

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
      
      {/* 1. Real-Time Telemetry Ticker Bar */}
      <TickerBar />

      {/* 2. Global Navigation */}
      <Navbar
        onOpenWallet={() => setWalletModalOpen(true)}
        onOpenAttestation={() => setAttestationModalOpen(true)}
        onScrollToSection={scrollToSection}
      />

      {/* 3. Hero Section with Dynamic Typing & 3D Quantum Orbit */}
      <main className="flex-1">
        <HeroSection
          onOpenWallet={() => setWalletModalOpen(true)}
          onOpenAttestation={() => setAttestationModalOpen(true)}
          onOpenHowItWorks={() => setHowItWorksModalOpen(true)}
        />

        {/* 4. Global Partners & Liquidity Venues Marquee */}
        <PartnerMarquee />

        {/* 5. Real-Time Proof of Reserves & Solvency Dashboard */}
        <TransparencyDashboard
          onOpenAttestation={() => setAttestationModalOpen(true)}
        />

        {/* 6. Interactive 1:1 Mint & Redemption Sandbox */}
        <MintSwapCalculator />

        {/* 7. Institutional, Merchant & Individual Solutions */}
        <SolutionsGrid onSelectSolution={handleSelectSolution} />

        {/* 8. 16+ Multi-Chain Supported Networks Hub */}
        <SupportedChains />

        {/* 9. Searchable FAQ Accordion */}
        <FaqAccordion />
      </main>

      {/* 10. Comprehensive Footer & MiCA Compliance Notice */}
      <Footer
        onScrollToSection={scrollToSection}
        onOpenAttestation={() => setAttestationModalOpen(true)}
      />

      {/* Modal 1: Connect Wallet */}
      <ConnectWalletModal
        isOpen={walletModalOpen}
        onClose={() => setWalletModalOpen(false)}
      />

      {/* Modal 2: Independent Auditor Attestation Report */}
      <AttestationReportModal
        isOpen={attestationModalOpen}
        onClose={() => setAttestationModalOpen(false)}
      />

      {/* Modal 3: Learn How USDQS Works (Explainer) */}
      {howItWorksModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-xl bg-[#090e1c] border border-emerald-500/40 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Play className="w-4 h-4 fill-emerald-400" />
                </div>
                <h3 className="text-base font-bold text-white">
                  How USDQS Protocol Works
                </h3>
              </div>
              <button
                onClick={() => setHowItWorksModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-5 space-y-4 text-xs text-slate-300 leading-relaxed font-sans">
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <span className="text-emerald-400 font-bold block text-sm flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-emerald-400" /> Step 1: 100% Fiat & T-Bill Deposit
                </span>
                <p>
                  Institutional users deposit USD directly into federally regulated custodial accounts. These funds are immediately placed into short-term U.S. Treasury bills and overnight repurchase agreements.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <span className="text-cyan-400 font-bold block text-sm flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-cyan-400" /> Step 2: On-Chain Minting & Dispatch
                </span>
                <p>
                  The automated multi-sig treasury smart contract validates the deposit receipt and mints an identical quantity of USDQS tokens on the depositor’s selected blockchain (Solana, Ethereum, Arbitrum, etc.).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <span className="text-teal-400 font-bold block text-sm flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-teal-400" /> Step 3: Zero-Friction Global Redemption
                </span>
                <p>
                  Any verified holder can submit USDQS for 1:1 burn and receive standard bank wire transfers within 24 hours, guaranteed by the 102.4% overcollateralized reserve cushion.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setHowItWorksModalOpen(false)}
                className="px-5 py-2.5 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:brightness-110 text-xs cursor-pointer"
              >
                Got It, Explore Platform
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
