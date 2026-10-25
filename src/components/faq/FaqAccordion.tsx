import React, { useState } from 'react';
import { FAQ_DATA_EN, FAQ_DATA_KO } from '../../data/faqData';
import { ChevronDown, HelpCircle, Search } from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';

export const FaqAccordion: React.FC = () => {
  const { t, language } = useTranslation();
  const [openId, setOpenId] = useState<string>('faq-1');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const faqList = language === 'ko' ? FAQ_DATA_KO : FAQ_DATA_EN;

  const toggleAccordion = (id: string) => {
    setOpenId(prev => prev === id ? '' : id);
  };

  const filteredFaqs = faqList.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = language === 'ko' ? [
    { id: 'all', label: '전체 주제' },
    { id: 'general', label: '일반 개요' },
    { id: 'reserves', label: '준비금 및 담보' },
    { id: 'technology', label: '스마트 컨트랙트' },
    { id: 'compliance', label: '규제 및 상환' }
  ] : [
    { id: 'all', label: 'All Topics' },
    { id: 'general', label: 'General' },
    { id: 'reserves', label: 'Proof of Reserves' },
    { id: 'technology', label: 'Smart Contracts' },
    { id: 'compliance', label: 'Regulatory & Mint' }
  ];

  return (
    <section id="faq" className="py-24 relative bg-[#050914]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{t.faq.badge}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-['Plus_Jakarta_Sans']">
            {t.faq.title}
          </h2>

          <p className="text-sm text-slate-300">
            {t.faq.description}
          </p>
        </div>

        {/* Search & Category Filter */}
        <div className="space-y-4 mb-8">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t.faq.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
            />
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="rounded-xl border border-slate-800/80 bg-slate-900/50 hover:border-emerald-500/30 transition-all overflow-hidden"
              >
                <button
                  onClick={() => toggleAccordion(faq.id)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                >
                  <span className="text-sm sm:text-base font-bold text-slate-100 font-['Plus_Jakarta_Sans']">
                    {faq.question}
                  </span>
                  <div className={`p-1.5 rounded-lg bg-slate-800/60 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-emerald-400' : ''}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/40">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}

          {filteredFaqs.length === 0 && (
            <div className="text-center py-10 text-slate-500 text-xs font-mono">
              {t.faq.noMatching.replace('{query}', searchTerm)}
            </div>
          )}
        </div>

      </div>
    </section>
  );
};
