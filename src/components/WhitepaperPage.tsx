import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const SectionCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="card p-8 rounded-2xl mb-8 text-left w-full">
        <h2 className="text-3xl font-bold text-white mb-4">{title}</h2>
        <div className="text-gray-300 space-y-4">{children}</div>
    </div>
);

const FeaturePoint: React.FC<{ title: string; content: string }> = ({ title, content }) => (
    <div>
        <h3 className="text-xl font-semibold text-cyan-400 mb-2">{title}</h3>
        <p>{content}</p>
    </div>
);


export const WhitepaperPage: React.FC = () => {
    const { t } = useLanguage();
    return (
        <section id="whitepaper" className="py-16">
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight gradient-text mb-12 text-center">{t('whitepaper.title')}</h1>
            
            <SectionCard title={t('whitepaper.abstract.title')}>
                <p>{t('whitepaper.abstract.content')}</p>
            </SectionCard>
            
            <SectionCard title={t('whitepaper.introduction.title')}>
                 <p>{t('whitepaper.introduction.content')}</p>
            </SectionCard>
            
            <SectionCard title={t('whitepaper.solution.title')}>
                 <p>{t('whitepaper.solution.content')}</p>
            </SectionCard>

            <SectionCard title={t('whitepaper.features.title')}>
                <FeaturePoint title={t('whitepaper.feature1.title')} content={t('whitepaper.feature1.content')} />
                <FeaturePoint title={t('whitepaper.feature2.title')} content={t('whitepaper.feature2.content')} />
                <FeaturePoint title={t('whitepaper.feature3.title')} content={t('whitepaper.feature3.content')} />
            </SectionCard>

            <SectionCard title={t('whitepaper.tokenomics.title')}>
                <p>{t('whitepaper.tokenomics.content')}</p>
            </SectionCard>

            <SectionCard title={t('whitepaper.architecture.title')}>
                <p>{t('whitepaper.architecture.content')}</p>
            </SectionCard>

            <SectionCard title={t('whitepaper.conclusion.title')}>
                <p>{t('whitepaper.conclusion.content')}</p>
            </SectionCard>
            
             <div className="text-center mt-12">
                <a href="#" className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-8 rounded-full transition-transform transform hover:scale-105 glow">
                    {t('button.go_home')}
                </a>
            </div>
        </section>
    );
};