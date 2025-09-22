import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const ContentCard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="card p-8 rounded-2xl mb-8 text-left">
        {children}
    </div>
);

const RoadmapCard: React.FC<{ title: string, description: string }> = ({ title, description }) => (
     <div className="card p-6 rounded-2xl transform hover:-translate-y-2 transition-transform duration-300">
        <h4 className="text-2xl font-bold gradient-text mb-3">{title}</h4>
        <p className="text-gray-300">{description}</p>
    </div>
);

export const DaoGovernancePage: React.FC = () => {
    const { t } = useLanguage();
    return (
        <section id="governance" className="py-16">
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight gradient-text mb-12 text-center">{t('governance.title')}</h1>
            
            <ContentCard>
                <h2 className="text-3xl font-bold text-white mb-4">{t('governance.summary.title')}</h2>
                <p className="text-gray-300 mb-4">{t('governance.summary.p1')}</p>
                <p className="text-gray-300 mb-4">{t('governance.summary.p2')}</p>
                <p className="text-gray-300">{t('governance.summary.p3')}</p>
            </ContentCard>

            <ContentCard>
                <h2 className="text-3xl font-bold text-white mb-6">{t('governance.roadmap.title')}</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    <RoadmapCard title={t('governance.roadmap.phase1.title')} description={t('governance.roadmap.phase1.description')} />
                    <RoadmapCard title={t('governance.roadmap.phase2.title')} description={t('governance.roadmap.phase2.description')} />
                    <RoadmapCard title={t('governance.roadmap.phase3.title')} description={t('governance.roadmap.phase3.description')} />
                </div>
            </ContentCard>

            <ContentCard>
                <h2 className="text-3xl font-bold text-white mb-4">{t('governance.conclusion.title')}</h2>
                <p className="text-gray-300">{t('governance.conclusion.p1')}</p>
            </ContentCard>
            
             <div className="text-center mt-12">
                <a href="#" className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-8 rounded-full transition-transform transform hover:scale-105 glow">
                    {t('button.go_home')}
                </a>
            </div>
        </section>
    );
};