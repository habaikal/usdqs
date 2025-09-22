
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { name: '1D', price: 1.0001 },
    { name: '7D', price: 1.0002 },
    { name: '1M', price: 1.0000 },
    { name: '3M', price: 0.9999 },
    { name: '6M', price: 1.0003 },
    { name: '1Y', price: 1.0001 },
    { name: 'All', price: 1.0000 },
];

export const ChartSection: React.FC = () => {
    const { t } = useLanguage();

    return (
        <section id="chart" className="mt-24">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
                <span className="gradient-text">USDQS</span> <span className="text-white">{t('section.price_trend')}</span>
            </h2>
            <div className="card p-4 sm:p-8 rounded-2xl h-96">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                        <XAxis dataKey="name" stroke="white" />
                        <YAxis stroke="white" domain={['auto', 'auto']} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#161b22', border: '1px solid #2f363d' }}
                            labelStyle={{ color: 'white' }}
                        />
                        <Line type="monotone" dataKey="price" stroke="#00c6ff" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </section>
    );
};
