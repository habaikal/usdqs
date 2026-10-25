import React from 'react';
import { Logo } from './Logo';
import { Shield, Globe } from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';

interface FooterProps {
  onScrollToSection: (id: string) => void;
  onOpenAttestation: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onScrollToSection, onOpenAttestation }) => {
  const { t, language } = useTranslation();
  const isKo = language === 'ko';

  return (
    <footer className="bg-[#02050b] border-t border-slate-900 text-slate-400 text-xs">
      
      {/* Upper Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-6">
          
          {/* Brand Info (Span 2 cols on desktop) */}
          <div className="col-span-2 space-y-4">
            <Logo size="md" />
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              {t.footer.tagline}
            </p>
            
            <div className="pt-2 flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 font-mono text-[10px]">
                <Shield className="w-3 h-3 text-emerald-400" />
                {t.footer.overcollateralized}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-cyan-400 font-mono text-[10px]">
                <Globe className="w-3 h-3 text-cyan-400" />
                {t.footer.multiChains}
              </span>
            </div>
          </div>

          {/* Group 1: Protocol */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              {t.footer.protocolGroup}
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onScrollToSection('why-usdqs')} className="hover:text-emerald-400 transition-colors">
                  {isKo ? 'USDQS 개요' : 'Why USDQS?'}
                </button>
              </li>
              <li>
                <button onClick={() => onScrollToSection('how-it-works')} className="hover:text-emerald-400 transition-colors">
                  {isKo ? '작동 메커니즘' : 'How It Works'}
                </button>
              </li>
              <li>
                <button onClick={onOpenAttestation} className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                  <span>{isKo ? '준비금 증명' : 'Proof of Reserves'}</span>
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1 rounded">Live</span>
                </button>
              </li>
              <li>
                <button onClick={() => onScrollToSection('chains')} className="hover:text-emerald-400 transition-colors">
                  {isKo ? '지원 메인넷 허브' : 'Supported Blockchains'}
                </button>
              </li>
              <li>
                <a href="#top" className="hover:text-emerald-400 transition-colors">
                  {isKo ? '보안 실사 보고서' : 'Security Attestation'}
                </a>
              </li>
            </ul>
          </div>

          {/* Group 2: Asset Suite */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              {t.footer.assetsGroup}
            </h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-1.5 text-white font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>USDQS ({isKo ? '달러' : 'Dollar'})</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span>QSEUR ({isKo ? '유로' : 'Euro'})</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>QSXAU ({isKo ? '실물 금' : 'Gold Bullion'})</span>
              </li>
              <li>
                <a href="#top" className="hover:text-emerald-400 transition-colors">
                  {isKo ? '멀티 자산 볼트' : 'Multi-Asset Vault'}
                </a>
              </li>
            </ul>
          </div>

          {/* Group 3: Solutions */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              {t.footer.solutionsGroup}
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onScrollToSection('solutions')} className="hover:text-emerald-400 transition-colors">
                  {isKo ? '개인 및 트레이더' : 'For Individuals'}
                </button>
              </li>
              <li>
                <button onClick={() => onScrollToSection('solutions')} className="hover:text-emerald-400 transition-colors">
                  {isKo ? '가맹점 및 전자상거래' : 'For Merchants'}
                </button>
              </li>
              <li>
                <button onClick={() => onScrollToSection('solutions')} className="hover:text-emerald-400 transition-colors">
                  {isKo ? '기관 및 거래소' : 'For Exchanges'}
                </button>
              </li>
              <li>
                <a href="#top" className="hover:text-emerald-400 transition-colors">
                  {isKo ? '기관용 장외(OTC) 데스크' : 'Institutional OTC'}
                </a>
              </li>
            </ul>
          </div>

          {/* Group 4: Developers & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              {t.footer.governanceGroup}
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onScrollToSection('faq')} className="hover:text-emerald-400 transition-colors">
                  {isKo ? '자주 묻는 질문' : 'Comprehensive FAQ'}
                </button>
              </li>
              <li>
                <a href="#top" className="hover:text-emerald-400 transition-colors">
                  {isKo ? '스마트 컨트랙트 감사' : 'Smart Contract Audits'}
                </a>
              </li>
              <li>
                <a href="#top" className="hover:text-emerald-400 transition-colors">
                  {isKo ? 'MiCA 규제 준수 보고서' : 'MiCA Compliance Statement'}
                </a>
              </li>
              <li>
                <a href="#top" className="hover:text-emerald-400 transition-colors">
                  {isKo ? '서비스 이용약관' : 'Terms of Service'}
                </a>
              </li>
              <li>
                <a href="#top" className="hover:text-emerald-400 transition-colors">
                  {isKo ? '개인정보 보호정책' : 'Privacy Policy'}
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Regulatory & MiCA Compliance Notice */}
      <div className="border-t border-slate-900 bg-[#010307] py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-3 text-[11px] text-slate-500 leading-relaxed">
          <p>
            <strong>{t.footer.regulatoryTitle}:</strong> {t.footer.regulatoryText}
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-slate-900 font-mono text-[11px]">
            <span>
              {t.footer.copyright}
            </span>
            <span className="text-slate-600">
              {t.footer.disclaimer}
            </span>
          </div>
        </div>
      </div>

    </footer>
  );
};
