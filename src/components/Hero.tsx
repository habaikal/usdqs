import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface HeroProps {
    onStartClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartClick }) => {
    const { t } = useLanguage();
    
    const heroDescription = t('hero.description').split('\n').map((line, index) => (
        <React.Fragment key={index}>
            {line}
            <br />
        </React.Fragment>
    ));

    return (
        <section id="hero" className="text-center py-16">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
                <span className="gradient-text">USDQS</span>
                <br className="mb-16 sm:mb-32" />
                <span className="text-2xl sm:text-4xl font-bold text-white">{t('hero.subtitle')}</span>
            </h1>
            <p className="mt-4 text-lg text-yellow-400 max-w-3xl mx-auto">
                <i>Where Stability Meets Innovation with Quantum Finance</i>
                <br /><br />
                 <span className="text-gray-300">{heroDescription}</span>
            </p>
            <div className="mt-8 flex justify-center items-center">
                <button 
                    onClick={onStartClick}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-8 rounded-full transition-transform transform hover:scale-105 glow"
                >
                    <span className="text-white">{t('button.start_usdqs')}</span>
                </button>
            </div>
        </section>
    );
};