import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Language } from '../constants/translations';

interface HeaderProps {
    onAuthClick: () => void;
    onWalletClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onAuthClick, onWalletClick }) => {
    const { language, setLanguage, t } = useLanguage();
    const { currentUser, logout } = useAuth();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setLanguage(e.target.value as Language);
    };

    const handleMobileLinkClick = () => {
        setMobileMenuOpen(false);
    };
    
    const MobileNavLink: React.FC<{href: string, labelKey: string}> = ({ href, labelKey }) => (
        <a href={href} onClick={handleMobileLinkClick} className="block text-white text-lg font-medium hover:text-cyan-400 transition-colors py-2 px-4 rounded-md hover:bg-gray-700">
            {t(labelKey)}
        </a>
    );

    return (
        <header className={`w-full max-w-7xl mx-auto rounded-full py-3 px-6 fixed top-4 z-50 transition-all duration-300 ${isScrolled ? 'header-bg' : ''}`}>
            <nav className="flex justify-between items-center">
                <a href="#" className="flex items-center space-x-2" onClick={() => setMobileMenuOpen(false)}>
                    <img src="https://picsum.photos/32/32" alt="USDQS Logo" className="w-8 h-8 rounded-full" />
                    <span className="text-xl sm:text-2xl font-bold gradient-text">USDQS</span>
                </a>
                
                {/* Desktop Menu */}
                <div className="hidden sm:flex items-center space-x-2 sm:space-x-4">
                    <a href="#dashboard" className="text-white text-sm font-medium hover:text-cyan-400 transition-colors">{t('menu.dashboard')}</a>
                    <a href="#buy" className="text-white text-sm font-medium hover:text-cyan-400 transition-colors">{t('menu.buy')}</a>
                    <a href="#chart" className="text-white text-sm font-medium hover:text-cyan-400 transition-colors">{t('menu.chart')}</a>
                    <a href="#/whitepaper" className="hidden md:block text-white text-sm font-medium hover:text-cyan-400 transition-colors">{t('menu.whitepaper')}</a>
                    <a href="#/governance" className="hidden lg:block text-white text-sm font-medium hover:text-cyan-400 transition-colors">{t('menu.governance')}</a>
                </div>

                <div className="flex items-center space-x-2">
                    <select id="language-switcher" value={language} onChange={handleLanguageChange} className="bg-gray-700 text-white rounded-full py-1 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500">
                        <option value="ko">한국어</option>
                        <option value="en">English</option>
                    </select>
                    {currentUser ? (
                         <>
                            <button onClick={onWalletClick} className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-full transition-colors hidden sm:block">
                                <span className="gradient-text">{t('menu.wallet')}</span>
                            </button>
                            <button onClick={logout} className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-full transition-colors">
                                {t('button.logout')}
                            </button>
                        </>
                    ) : (
                         <button onClick={onAuthClick} className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded-full transition-colors">
                            <span>{t('button.login_signup')}</span>
                        </button>
                    )}
                    {/* Mobile Menu Button */}
                    <div className="sm:hidden">
                        <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} className="text-white focus:outline-none">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </nav>
            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                 <div className="sm:hidden mt-4 header-bg rounded-xl p-4">
                    <nav className="flex flex-col space-y-1">
                        <MobileNavLink href="#dashboard" labelKey="menu.dashboard" />
                        <MobileNavLink href="#buy" labelKey="menu.buy" />
                        <MobileNavLink href="#chart" labelKey="menu.chart" />
                        <MobileNavLink href="#/whitepaper" labelKey="menu.whitepaper" />
                        <MobileNavLink href="#/governance" labelKey="menu.governance" />
                        {currentUser && (
                            <button onClick={() => { onWalletClick(); handleMobileLinkClick(); }} className="text-left w-full text-white text-lg font-medium hover:text-cyan-400 transition-colors py-2 px-4 rounded-md hover:bg-gray-700">
                                <span className="gradient-text">{t('menu.wallet')}</span>
                            </button>
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
};
