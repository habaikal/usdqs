
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const DashboardCard: React.FC<{ title: string; value: string; description: string; valueColor: string }> = ({ title, value, description, valueColor }) => (
    <div className="card p-6 rounded-2xl flex flex-col justify-between transform hover:-translate-y-2 transition-transform duration-300">
        <div>
            <div className="text-lg text-gray-400 mb-2">{title}</div>
            <div className={`text-4xl font-bold ${valueColor}`}>{value}</div>
        </div>
        <div className="mt-4 text-sm text-gray-500">{description}</div>
    </div>
);

export const DashboardSection: React.FC = () => {
    const { t } = useLanguage();
    
    const dashboardItems = [
        { key: 'total_supply', value: '$2.4B USDQS', color: 'gradient-text', desc: 'initial_scale' },
        { key: 'trading_volume', value: '$85M USDQS', color: 'text-green-400', desc: 'market_liquidity' },
        { key: 'asset_backing', value: '100%', color: 'text-purple-400', desc: 'transparent_custody' },
        { key: 'integrated_platforms', value: '50+', color: 'text-yellow-400', desc: 'partnership_ecosystem' },
    ];

    return (
        <section id="dashboard" className="mt-24">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-white">{t('section.dashboard')}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {dashboardItems.map(item => (
                    <DashboardCard 
                        key={item.key}
                        title={t(`dashboard.${item.key}`)}
                        value={item.value}
                        description={t(`dashboard.${item.desc}`)}
                        valueColor={item.color}
                    />
                ))}
            </div>
        </section>
    );
};
