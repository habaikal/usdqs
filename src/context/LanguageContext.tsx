import React, { createContext, useContext, useState, useEffect } from 'react';
import { en, ko, zhHK, type SupportedLanguage, type TranslationKeys } from '../locales';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: TranslationKeys;
  toggleLanguage: () => void;
}

const translations: Record<SupportedLanguage, TranslationKeys> = {
  en,
  ko,
  'zh-HK': zhHK,
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>('en');

  useEffect(() => {
    const saved = localStorage.getItem('usdqs_language') as SupportedLanguage;
    if (saved && (saved === 'en' || saved === 'ko' || saved === 'zh-HK')) {
      setLanguageState(saved);
    } else {
      // 브라우저 언어 자동 감지
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith('ko')) {
        setLanguageState('ko');
      } else if (browserLang.startsWith('zh')) {
        setLanguageState('zh-HK');
      }
    }
  }, []);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    localStorage.setItem('usdqs_language', lang);
  };

  const toggleLanguage = () => {
    // EN -> zh-HK (홍콩) -> KO -> EN 순환
    if (language === 'en') {
      setLanguage('zh-HK');
    } else if (language === 'zh-HK') {
      setLanguage('ko');
    } else {
      setLanguage('en');
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t: translations[language],
        toggleLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
