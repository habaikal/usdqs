import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { Menu, X, ArrowUpRight, Wallet, Shield, Globe } from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';
import { useWeb3 } from '../../context/Web3Context';

interface NavbarProps {
  onOpenWallet: () => void;
  onOpenAttestation: () => void;
  onScrollToSection: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenWallet,
  onOpenAttestation,
  onScrollToSection
}) => {
  const { t, language, toggleLanguage } = useTranslation();
  const { account } = useWeb3();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: t.nav.whyUsdqs, id: 'why-usdqs' },
    { label: t.nav.howItWorks, id: 'how-it-works' },
    { label: t.nav.reserves, id: 'reserves', highlight: true },
    { label: t.nav.chains, id: 'chains' },
    { label: t.nav.solutions, id: 'solutions' },
    { label: t.nav.faq, id: 'faq' }
  ];

  const handleNavClick = (id: string) => {
    onScrollToSection(id);
    setMobileMenuOpen(false);
  };

  // Format account address: 0x1234...5678
  const shortAddress = account
    ? `${account.slice(0, 6)}...${account.slice(-4)}`
    : null;

  return (
    <header className={`sticky top-0 z-40 w-full transition-all duration-300 ${
      isScrolled 
        ? 'bg-[#050811]/90 backdrop-blur-md border-b border-emerald-900/30 shadow-2xl shadow-emerald-950/20' 
        : 'bg-[#050811]/60 backdrop-blur-sm border-b border-slate-800/40'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <a 
          href="#top" 
          onClick={(e) => { e.preventDefault(); handleNavClick('top'); }}
          className="focus:outline-none"
        >
          <Logo size="md" />
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-7">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`text-sm font-medium transition-colors cursor-pointer ${
                link.highlight 
                  ? 'text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold' 
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {link.label}
              {link.highlight && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              )}
            </button>
          ))}
        </nav>

        {/* Desktop Action Buttons & Language Switcher */}
        <div className="hidden md:flex items-center gap-3">
          
          {/* Language Switcher Button */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold text-slate-300 bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 hover:text-white transition-all cursor-pointer"
            title="Switch Language (한국어 / English)"
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>{language === 'en' ? 'KO 🇰🇷' : 'EN 🇺🇸'}</span>
          </button>

          {/* Transparency Trigger Button */}
          <button
            onClick={onOpenAttestation}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 hover:bg-emerald-900/40 hover:border-emerald-600 transition-all cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t.nav.attestation}</span>
          </button>

          {/* Connect Wallet / Real Account Badge */}
          {shortAddress ? (
            <button
              onClick={onOpenWallet}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-500/50 hover:bg-emerald-900/60 transition-all shadow-md cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>{shortAddress}</span>
            </button>
          ) : (
            <button
              onClick={onOpenWallet}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-slate-900 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 hover:brightness-110 shadow-lg shadow-emerald-500/20 transition-all transform hover:-translate-y-0.5 cursor-pointer font-['Plus_Jakarta_Sans']"
            >
              <Wallet className="w-3.5 h-3.5 text-slate-950" />
              <span>{t.nav.connectWallet}</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-950" />
            </button>
          )}

        </div>

        {/* Mobile Hamburger & Lang Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleLanguage}
            className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono font-bold text-slate-300"
          >
            {language === 'en' ? 'KO' : 'EN'}
          </button>
          
          <button
            onClick={onOpenWallet}
            className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
            aria-label="Connect Wallet"
          >
            <Wallet className="w-4 h-4" />
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#070b17] border-b border-emerald-900/40 px-4 pt-3 pb-6 space-y-3 animate-fadeIn">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className="flex items-center justify-between py-2.5 px-3 rounded-lg text-sm font-medium text-slate-200 hover:bg-emerald-950/40 hover:text-emerald-400 text-left transition-colors"
              >
                <span>{link.label}</span>
                {link.highlight && (
                  <span className="text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">
                    {t.nav.live}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex flex-col gap-2.5">
            <button
              onClick={() => { onOpenAttestation(); setMobileMenuOpen(false); }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold text-emerald-400 bg-emerald-950/50 border border-emerald-800/50"
            >
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>{t.nav.attestation}</span>
            </button>
            <button
              onClick={() => { onOpenWallet(); setMobileMenuOpen(false); }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-cyan-400"
            >
              <Wallet className="w-4 h-4" />
              <span>{shortAddress ? `${shortAddress} (${t.nav.connected})` : t.nav.connectWallet}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
