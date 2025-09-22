
import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAccount } from '../contexts/AccountContext';
import { useAuth } from '../contexts/AuthContext';

interface ExchangeSectionProps {
    exchangeInputRef: React.RefObject<HTMLInputElement>;
}

export const ExchangeSection: React.FC<ExchangeSectionProps> = ({ exchangeInputRef }) => {
    const { t } = useLanguage();
    const { myAccount, buyUsdqs, sellUsdqs } = useAccount();
    const { currentUser } = useAuth();
    
    const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
    const [amount, setAmount] = useState('');
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    const handleBuy = async () => {
        if (!currentUser) {
            showMessage(t('message.not_logged_in'), 'error');
            return;
        }
        
        const usdAmount = parseFloat(amount);
        if (isNaN(usdAmount) || usdAmount <= 0) {
            showMessage(t('message.purchase.error'), 'error');
            return;
        }

        try {
            await buyUsdqs(usdAmount);
            showMessage(t('message.purchase.success', { amount: usdAmount }), 'success');
            setAmount('');
        } catch (error) {
            showMessage((error as Error).message, 'error');
        }
    };

    const handleSell = async () => {
        if (!currentUser) {
            showMessage(t('message.not_logged_in'), 'error');
            return;
        }
        
        const usdqsAmount = parseFloat(amount);
        if (isNaN(usdqsAmount) || usdqsAmount <= 0) {
            showMessage(t('message.sell.error'), 'error');
            return;
        }

        if (!myAccount || myAccount.balance < usdqsAmount) {
            showMessage(t('message.sell.insufficient'), 'error');
            return;
        }

        try {
            await sellUsdqs(usdqsAmount);
            showMessage(t('message.sell.success', { amount: usdqsAmount }), 'success');
            setAmount('');
        } catch (error) {
             const errorKey = (error as Error).message;
             if (errorKey === 'insufficient_balance') {
                showMessage(t('message.sell.insufficient'), 'error');
             } else {
                showMessage((error as Error).message, 'error');
             }
        }
    };

    const showMessage = (text: string, type: 'success' | 'error') => {
        setMessage({ text, type });
        setTimeout(() => setMessage(null), 5000);
    };

    const resetForm = () => {
        setAmount('');
        setMessage(null);
    }

    const TabButton: React.FC<{tab: 'buy' | 'sell', label: string}> = ({ tab, label }) => (
        <button
            onClick={() => { setActiveTab(tab); resetForm(); }}
            className={`w-1/2 pb-3 text-lg font-semibold transition-colors duration-300 focus:outline-none ${activeTab === tab ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-500 hover:text-gray-300'}`}
        >
            {label}
        </button>
    );

    return (
        <section id="buy" className="mt-24">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
                <span className="gradient-text">USDQS</span> <span className="text-white">{t('section.exchange_usdqs')}</span>
            </h2>
            <div className="card p-8 rounded-2xl max-w-lg mx-auto">
                <div className="flex mb-6 border-b border-gray-700">
                    <TabButton tab="buy" label={t('tab.buy')} />
                    <TabButton tab="sell" label={t('tab.sell')} />
                </div>
                
                {activeTab === 'buy' ? (
                    <div className="flex flex-col space-y-4">
                        <label htmlFor="usd-amount" className="text-gray-400">{t('label.usd_amount')}</label>
                        <input
                            ref={exchangeInputRef}
                            type="number" id="usd-amount" placeholder="100"
                            className="bg-gray-800 text-white border border-gray-700 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors"
                            min="1" step="1" value={amount} onChange={(e) => setAmount(e.target.value)}
                        />
                        <div className="text-center text-gray-400 text-lg">
                            <span className="text-2xl font-bold gradient-text">{amount || '0'}</span> USDQS
                        </div>
                        <button onClick={handleBuy} className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-8 rounded-full transition-colors">
                            <span>{t('button.buy')}</span>
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col space-y-4">
                        <label htmlFor="usdqs-amount" className="text-gray-400">{t('label.usdqs_amount')}</label>
                         <input
                            type="number" id="usdqs-amount" placeholder="100"
                            className="bg-gray-800 text-white border border-gray-700 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors"
                            min="1" step="1" value={amount} onChange={(e) => setAmount(e.target.value)}
                        />
                        <div className="text-center text-gray-400 text-lg">
                            ≈ <span className="text-2xl font-bold text-green-400">{amount || '0'}</span> USD
                        </div>
                        <button onClick={handleSell} className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full transition-colors">
                            <span>{t('button.sell')}</span>
                        </button>
                    </div>
                )}

                {message && (
                    <div className={`mt-6 p-4 rounded-md text-sm text-center ${message.type === 'success' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                        {message.text}
                    </div>
                )}
            </div>
        </section>
    );
};
