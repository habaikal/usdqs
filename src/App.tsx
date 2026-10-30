import { useState } from 'react';
import { TickerBar } from './components/common/TickerBar';
import { Navbar } from './components/common/Navbar';
import { HeroSection } from './components/hero/HeroSection';
import { PartnerMarquee } from './components/partners/PartnerMarquee';
import { LiveMetrics } from './components/metrics/LiveMetrics';
import { ValueProps } from './components/valueprops/ValueProps';
import { UseCases } from './components/usecases/UseCases';
import { TransparencyDashboard } from './components/reserves/TransparencyDashboard';
import { PqcArchitectureSection } from './components/pqc/PqcArchitectureSection';
import { MintSwapCalculator } from './components/simulator/MintSwapCalculator';
import { BridgeSimulator } from './components/simulator/BridgeSimulator';
import { SolutionsGrid } from './components/solutions/SolutionsGrid';
import { SupportedChains } from './components/chains/SupportedChains';
import { FaqAccordion } from './components/faq/FaqAccordion';
import { Footer } from './components/common/Footer';
import { ConnectWalletModal } from './components/modals/ConnectWalletModal';
import { AttestationReportModal } from './components/modals/AttestationReportModal';
import { WhitepaperReaderModal } from './components/whitepaper/WhitepaperReaderModal';
import { AdminConsoleModal } from './components/admin/AdminConsoleModal';
import { UserPortalModal } from './components/portal/UserPortalModal';
import { AiIntelligenceModal } from './components/modals/AiIntelligenceModal';
import { TRANSPARENCY_METRICS } from './data/reservesData';
import { X, Play, Shield, Zap, Layers } from 'lucide-react';

export function App() {
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [attestationModalOpen, setAttestationModalOpen] = useState(false);
  const [howItWorksModalOpen, setHowItWorksModalOpen] = useState(false);
  const [whitepaperModalOpen, setWhitepaperModalOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [userPortalModalOpen, setUserPortalModalOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);

  // 동적 발행 상한 상태: 초기 24,000,000 USDQS에서 시작하여 관리자 콘솔의 다중서명 승인 시 지속 확장 가능
  const [currentCap, setCurrentCap] = useState<number>(TRANSPARENCY_METRICS.currentCap);
  // 관리자 콘솔의 크로스체인 브릿지 서킷 브레이커 상태 (BridgeSimulator와 실시간 연동)
  const [isBridgePaused, setIsBridgePaused] = useState<boolean>(false);

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

  const handleSelectSolution = (_title: string) => {
    setUserPortalModalOpen(true);
  };

  const handleUpdateCap = (newCap: number) => {
    setCurrentCap(newCap);
  };

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
      
      {/* 1. Real-Time Telemetry Ticker Bar (Initial 24M & Dynamic Expandable Cap) */}
      <TickerBar currentCap={currentCap} />

      {/* 2. Global Navigation (Whitepaper, Admin Console, Institutional Portal, AI Assistant, 3-Lang Cyclic Switcher) */}
      <Navbar
        onOpenWallet={() => setWalletModalOpen(true)}
        onOpenAttestation={() => setAttestationModalOpen(true)}
        onOpenWhitepaper={() => setWhitepaperModalOpen(true)}
        onOpenAdminConsole={() => setAdminModalOpen(true)}
        onOpenUserPortal={() => setUserPortalModalOpen(true)}
        onOpenAiModal={() => setAiModalOpen(true)}
        onScrollToSection={scrollToSection}
      />

      {/* 3. Hero Section with Dynamic Typing & 3D Quantum Orbit */}
      <main className="flex-1">
        <HeroSection
          onOpenWallet={() => setWalletModalOpen(true)}
          onOpenAttestation={() => setAttestationModalOpen(true)}
          onOpenHowItWorks={() => setHowItWorksModalOpen(true)}
          onOpenUserPortal={() => setUserPortalModalOpen(true)}
          currentCap={currentCap}
        />

        {/* 4. Global Partners & Liquidity Venues Marquee */}
        <PartnerMarquee />

        {/* 5. Real-Time Count-Up Protocol Metrics (neo-usdc integration) */}
        <LiveMetrics currentCap={currentCap} />

        {/* 6. Six Core Competitive Advantages (neo-usdc + neo-usdt integration) */}
        <ValueProps onOpenUserPortal={() => setUserPortalModalOpen(true)} />

        {/* 7. Real-Time Proof of Reserves & Solvency Dashboard (HKMA Segregated Trust & 24M Cap) */}
        <TransparencyDashboard
          onOpenAttestation={() => setAttestationModalOpen(true)}
          currentCap={currentCap}
        />

        {/* 8. Post-Quantum Cryptography (PQC) Architecture & ERC-4337 Hybrid Pipeline (RFP 5.2절 대응) */}
        <PqcArchitectureSection />

        {/* 9. Interactive 5 Use-Case Tabs & SWIFT vs USDQS Remittance Calculator (neo-usdc integration) */}
        <UseCases onOpenUserPortal={() => setUserPortalModalOpen(true)} />

        {/* 10. Interactive 1:1 Mint & Redemption Sandbox */}
        <MintSwapCalculator />

        {/* 11. CCTP-Q Native Cross-Chain Bridge Simulator (Synced with Admin Circuit Breaker) */}
        <BridgeSimulator
          isBridgePaused={isBridgePaused}
          onOpenAdminConsole={() => setAdminModalOpen(true)}
        />

        {/* 12. Institutional, Merchant & Individual Solutions */}
        <SolutionsGrid onSelectSolution={handleSelectSolution} />

        {/* 13. Supported Multi-Chain Networks Hub (Ethereum Mainnet + Solana Bridge) */}
        <SupportedChains />

        {/* 14. Searchable FAQ Accordion */}
        <FaqAccordion />
      </main>

      {/* 11. Comprehensive Footer & HKMA Compliance Notice */}
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

      {/* Modal 3: Official Whitepaper v1.0 Reader & PDF Export */}
      <WhitepaperReaderModal
        isOpen={whitepaperModalOpen}
        onClose={() => setWhitepaperModalOpen(false)}
      />

      {/* Modal 4: Operator & Compliance Console (3-of-5 Multi-Sig, Cap Expansion, Bridge Circuit Breaker, Sanctions) */}
      <AdminConsoleModal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
        onUpdateCap={handleUpdateCap}
        isBridgePaused={isBridgePaused}
        onToggleBridgePause={(paused) => setIsBridgePaused(paused)}
      />

      {/* Modal 5: Institutional & User Portal (Full User Wallet, PQC Keypair, KYC Onboarding, T+1 Redemption Tracker) */}
      <UserPortalModal
        isOpen={userPortalModalOpen}
        onClose={() => setUserPortalModalOpen(false)}
      />

      {/* Modal 6: USDQS AI Protocol Intelligence Assistant */}
      <AiIntelligenceModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
      />

      {/* Modal 6: Learn How USDQS Works (Explainer) */}
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
                  <Shield className="w-4 h-4 text-emerald-400" /> Step 1: 100% Fiat & T-Bill Deposit (HK Trust)
                </span>
                <p>
                  Institutional users deposit USD directly into Hong Kong authorized, bankruptcy-remote custodial trust accounts. Funds are 100% allocated to short-term U.S. Treasury bills (&lt;90d) and overnight reverse repo.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <span className="text-cyan-400 font-bold block text-sm flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-cyan-400" /> Step 2: On-Chain Minting & PQC Key Authorization
                </span>
                <p>
                  The automated multi-sig treasury smart contract validates the deposit attestation and mints 1:1 backed USDQS on Ethereum Mainnet or Solana with NIST FIPS 204 PQC signature validation.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <span className="text-teal-400 font-bold block text-sm flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-teal-400" /> Step 3: T+1 Guaranteed Institutional Redemption
                </span>
                <p>
                  Any verified holder can submit USDQS for 1:1 burn and receive standard bank wire transfers within T+1 business days (max T+2), backed by the 102.4% overcollateralized reserve cushion.
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
