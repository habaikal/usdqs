
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const VisionCard: React.FC<{ phase: string; title: string; description: string }> = ({ phase, title, description }) => (
    <div className="card p-8 rounded-2xl transform hover:-translate-y-2 transition-transform duration-300">
        <div className="text-4xl font-bold gradient-text mb-4">{phase}</div>
        <h3 className="text-2xl font-semibold text-white">{title}</h3>
        <p className="text-gray-400 mt-2">{description}</p>
    </div>
);

export const VisionSection: React.FC = () => {
    const { t } = useLanguage();

    const phases = [
        { key: 'phase1', title: 'subtitle', description: 'description' },
        { key: 'phase2', title: 'subtitle', description: 'description' },
        { key: 'phase3', title: 'subtitle', description: 'description' },
    ];

    return (
        <section id="vision" className="mt-24 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-12">
                <span className="gradient-text">USDQS</span> <span className="text-white">{t('section.vision')}</span>
            </h2>
            <div className="flex flex-col md:flex-row gap-8">
                {phases.map(phase => (
                    <div key={phase.key} className="flex-1">
                        <VisionCard 
                            phase={t(`vision.${phase.key}.title`)}
                            title={t(`vision.${phase.key}.${phase.title}`)}
                            description={t(`vision.${phase.key}.${phase.description}`)}
                        />
                    </div>
                ))}
            </div>
        </section>
    );
};
