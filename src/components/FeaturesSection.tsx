
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { UsdBackingIcon, GlobalPaymentIcon, QuantumSecurityIcon, ReliabilityIcon, RegulatoryIcon, StabilityIcon, ScalabilityIcon } from './icons';

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="card p-6 rounded-2xl text-center transform hover:-translate-y-2 transition-transform duration-300">
        <div className="icon-container mx-auto mb-4">{icon}</div>
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <p className="text-gray-400 mt-2">{description}</p>
    </div>
);

export const FeaturesSection: React.FC = () => {
    const { t } = useLanguage();
    
    const features = [
        { key: 'usd_backing', icon: <UsdBackingIcon /> },
        { key: 'global_payment', icon: <GlobalPaymentIcon /> },
        { key: 'quantum_security', icon: <QuantumSecurityIcon /> },
        { key: 'reliability', icon: <ReliabilityIcon /> },
        { key: 'regulatory', icon: <RegulatoryIcon /> },
        { key: 'stability', icon: <StabilityIcon /> },
        { key: 'scalability', icon: <ScalabilityIcon /> },
    ];

    return (
        <section id="features" className="mt-24">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
                <span className="gradient-text">USDQS</span><span className="text-white">{t('section.features')}</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {features.map(feature => (
                    <FeatureCard 
                        key={feature.key}
                        icon={feature.icon}
                        title={t(`feature.${feature.key}.title`)}
                        description={t(`feature.${feature.key}.description`)}
                    />
                ))}
            </div>
        </section>
    );
};
