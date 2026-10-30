import React, { useState } from 'react';
import { X, BookOpen, Download, ChevronRight, FileText, CheckCircle2, Shield, Search } from 'lucide-react';
import { WHITEPAPER_SECTIONS } from '../../data/whitepaperData';
import { useTranslation } from '../../context/LanguageContext';

interface WhitepaperReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WhitepaperReaderModal: React.FC<WhitepaperReaderModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [activeSectionId, setActiveSectionId] = useState<string>('chapter-1');
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!isOpen) return null;

  const currentSection = WHITEPAPER_SECTIONS.find((s) => s.id === activeSectionId) || WHITEPAPER_SECTIONS[1];

  const filteredSections = WHITEPAPER_SECTIONS.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.content.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleDownload = () => {
    // 백서 텍스트 기반 브라우저 인쇄/다운로드 생성
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('팝업 차단이 감지되었습니다. 팝업을 허용해주세요.');
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>USDQS Official Whitepaper v1.0</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; padding: 40px; color: #111; }
          h1 { color: #0f172a; border-bottom: 2px solid #10b981; padding-bottom: 8px; }
          h2 { color: #047857; margin-top: 30px; }
          h3 { color: #334155; }
          .summary { background: #f0fdf4; border-left: 4px solid #10b981; padding: 12px; margin: 15px 0; font-style: italic; }
          .footer { margin-top: 50px; font-size: 12px; color: #64748b; border-top: 1px solid #cbd5e1; padding-top: 10px; }
        </style>
      </head>
      <body>
        <h1>USDQS (USD Quantum Stable) Whitepaper v1.0</h1>
        <p><strong>발행사:</strong> USDQS Protocol Foundation | <strong>관할권:</strong> 홍콩 (HKMA Stablecoins Ordinance)</p>
        <hr/>
        ${WHITEPAPER_SECTIONS.map(
          (s) => `
          <h2>${s.title}</h2>
          <h3>${s.subtitle}</h3>
          <div class="summary">${s.summary}</div>
          ${s.content.map((p) => `<p>${p}</p>`).join('')}
        `
        ).join('')}
        <div class="footer">
          <p>© 2026 USDQS Protocol Foundation. All rights reserved. Hong Kong & Global Production Build.</p>
        </div>
      </body>
      </html>
    `;
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn font-sans">
      <div className="relative w-full max-w-6xl h-[90vh] bg-[#070b16] border border-emerald-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Modal Top Bar */}
        <div className="px-6 py-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white font-['Plus_Jakarta_Sans']">
                  {t.whitepaperModal.title}
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  HKMA Compliant v1.0
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                {t.whitepaperModal.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownload}
              className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-950 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:brightness-110 shadow-md transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t.whitepaperModal.downloadPdf}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Content: Split Pane */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Left Column: Chapters Navigation & Search */}
          <div className="w-72 sm:w-80 border-r border-slate-800/80 bg-slate-950/60 flex flex-col shrink-0">
            {/* Search Box */}
            <div className="p-3 border-b border-slate-800/80">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="백서 내용 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
                />
              </div>
            </div>

            {/* Chapters List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {filteredSections.map((sec) => {
                const isActive = sec.id === currentSection.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => setActiveSectionId(sec.id)}
                    className={`w-full text-left p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-between group ${
                      isActive
                        ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <FileText className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                      <div className="truncate">
                        <span className="text-[11px] font-bold block truncate">
                          {sec.title}
                        </span>
                        <span className="text-[10px] text-slate-500 block truncate">
                          {sec.subtitle}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 shrink-0 transition-transform ${isActive ? 'text-emerald-400 translate-x-0.5' : 'text-slate-600'}`} />
                  </button>
                );
              })}
            </div>

            {/* Mobile Download button footer */}
            <div className="p-3 sm:hidden border-t border-slate-800">
              <button
                onClick={handleDownload}
                className="w-full py-2 rounded-lg text-xs font-semibold text-slate-950 bg-emerald-400 flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{t.whitepaperModal.downloadPdf}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Detailed Reader View */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-6 bg-gradient-to-b from-[#070b16] to-[#040710]">
            
            {/* Chapter Header */}
            <div className="pb-6 border-b border-slate-800/80 space-y-2">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
                <Shield className="w-3.5 h-3.5" />
                <span>{currentSection.chapterNumber}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-['Plus_Jakarta_Sans']">
                {currentSection.title}
              </h2>
              <p className="text-sm text-cyan-300 font-mono">
                {currentSection.subtitle}
              </p>
            </div>

            {/* Chapter Executive Summary Box */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 leading-relaxed font-sans">
              <div className="flex items-center gap-2 text-emerald-400 font-bold mb-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>핵심 요약 (Executive Takeaway)</span>
              </div>
              <p className="text-slate-300">
                {currentSection.summary}
              </p>
            </div>

            {/* Chapter Body Text */}
            <div className="space-y-4 text-sm text-slate-300 leading-relaxed font-sans">
              {currentSection.content.map((paragraph, idx) => {
                const isHeading = paragraph.startsWith('■') || paragraph.startsWith('3.') || paragraph.startsWith('5.') || paragraph.startsWith('6.');
                return (
                  <p
                    key={idx}
                    className={
                      isHeading
                        ? 'text-base font-bold text-white pt-2 text-emerald-300'
                        : 'text-slate-300'
                    }
                  >
                    {paragraph}
                  </p>
                );
              })}
            </div>

            {/* Bottom Citation & Regulatory Stamp */}
            <div className="pt-8 mt-12 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-500 font-mono gap-3">
              <span>HKMA Stablecoins Ordinance Regulated • NIST PQC Architecture</span>
              <span className="text-emerald-400 font-semibold">USDQS Official Production Specification</span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
