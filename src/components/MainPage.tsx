import React, { useRef } from 'react';
import { Hero } from './Hero';
import { DashboardSection } from './DashboardSection';
import { ExchangeSection } from './ExchangeSection';
import { ChartSection } from './ChartSection';
import { FeaturesSection } from './FeaturesSection';
import { VisionSection } from './VisionSection';

export const MainPage: React.FC = () => {
    const exchangeInputRef = useRef<HTMLInputElement>(null);

    const handleStartClick = () => {
        const buySection = document.getElementById('buy');
        if (buySection) {
            buySection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => exchangeInputRef.current?.focus(), 500);
        }
    };
    
    return (
        <>
            <Hero onStartClick={handleStartClick} />
            <DashboardSection />
            <ExchangeSection exchangeInputRef={exchangeInputRef} />
            <ChartSection />
            <FeaturesSection />
            <VisionSection />
        </>
    );
};